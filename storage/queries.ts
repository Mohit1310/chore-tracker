import { type SQLiteDatabase } from 'expo-sqlite';

export interface ChoreType {
  id: number;
  name: string;
  unit: string;
  default_quantity: number;
  price_per_unit: number;
}

export interface DailyEntry {
  id: number;
  chore_type_id: number;
  date: string;
  quantity: number;
}

export interface MonthlyBill {
  total_quantity: number;
  total_bill: number;
}

// 1. Create a new chore type
export async function insertChoreType(
  db: SQLiteDatabase,
  name: string,
  unit: string,
  defaultQuantity: number,
  pricePerUnit: number
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO chore_types (name, unit, default_quantity, price_per_unit)
     VALUES (?, ?, ?, ?)`,
    [name, unit, defaultQuantity, pricePerUnit]
  );
  return result.lastInsertRowId;
}

// 2. List all chore types
export async function listChoreTypes(db: SQLiteDatabase): Promise<ChoreType[]> {
  return await db.getAllAsync<ChoreType>(
    `SELECT * FROM chore_types ORDER BY created_at DESC`
  );
}

// 3. Get override entries for a given chore in a given month (YYYY-MM)
export async function getMonthEntries(
  db: SQLiteDatabase,
  choreTypeId: number,
  yearMonth: string
): Promise<DailyEntry[]> {
  const startDate = `${yearMonth}-01`;
  // SQLite date math: first day of next month
  const endDate = `date('${startDate}', 'start of month', '+1 month')`;

  return await db.getAllAsync<DailyEntry>(
    `SELECT * FROM daily_entries
     WHERE chore_type_id = ? AND date >= ? AND date < ${endDate}
     ORDER BY date ASC`,
    [choreTypeId, startDate]
  );
}

// 4. Upsert a daily entry (insert or update override for a specific date)
export async function upsertDailyEntry(
  db: SQLiteDatabase,
  choreTypeId: number,
  date: string,
  quantity: number
): Promise<void> {
  await db.runAsync(
    `INSERT INTO daily_entries (chore_type_id, date, quantity, updated_at)
     VALUES (?, ?, ?, datetime('now'))
     ON CONFLICT(chore_type_id, date)
     DO UPDATE SET quantity = excluded.quantity, updated_at = excluded.updated_at`,
    [choreTypeId, date, quantity]
  );
}

// 5. Monthly bill calculation
//    Bill = (daysInMonth - overrideCount) × defaultQty × price + SUM(overrides.qty) × price
export async function getMonthlyBill(
  db: SQLiteDatabase,
  choreTypeId: number,
  yearMonth: string
): Promise<MonthlyBill> {
  const startDate = `${yearMonth}-01`;

  const result = await db.getFirstAsync<MonthlyBill>(
    `SELECT
       (
         ((
           CAST(strftime('%d', date(?, 'start of month', '+1 month', '-1 day')) AS INTEGER)
           -
           COALESCE(override_count, 0)
         ) * c.default_quantity)
         +
         COALESCE(override_total, 0)
       ) AS total_quantity,
       (
         ((
           CAST(strftime('%d', date(?, 'start of month', '+1 month', '-1 day')) AS INTEGER)
           -
           COALESCE(override_count, 0)
         ) * c.default_quantity)
         +
         COALESCE(override_total, 0)
       ) * c.price_per_unit AS total_bill
     FROM chore_types c
     LEFT JOIN (
       SELECT
         chore_type_id,
         COUNT(*) AS override_count,
         SUM(quantity) AS override_total
       FROM daily_entries
       WHERE date >= ? AND date < date(?, 'start of month', '+1 month')
       GROUP BY chore_type_id
     ) e ON e.chore_type_id = c.id
     WHERE c.id = ?`,
    [startDate, startDate, startDate, startDate, choreTypeId]
  );

  return result ?? { total_quantity: 0, total_bill: 0 };
}

import { type SQLiteDatabase } from 'expo-sqlite';

export async function initializeDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS chore_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      unit TEXT NOT NULL DEFAULT 'liter',
      default_quantity REAL NOT NULL DEFAULT 1.0,
      price_per_unit REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS daily_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chore_type_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      quantity REAL NOT NULL,
      is_custom INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (chore_type_id) REFERENCES chore_types(id) ON DELETE CASCADE,
      UNIQUE(chore_type_id, date)
    );

    CREATE INDEX IF NOT EXISTS idx_daily_entries_date ON daily_entries(date);
    CREATE INDEX IF NOT EXISTS idx_daily_entries_chore_type ON daily_entries(chore_type_id);
  `);
}

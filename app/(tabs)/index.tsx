import React, { useCallback, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { View, Text } from '../../components/design-system';
import { TodayChoreCard } from '../../components/TodayChoreCard';
import {
  listChoreTypesWithTodayEntry,
  upsertDailyEntry,
  type ChoreTypeWithTodayEntry,
} from '../../storage/queries';

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

function getStep(quantity: number): number {
  if (quantity <= 1) return 0.5;
  return 1;
}

export default function TodayScreen() {
  const db = useSQLiteContext();
  const [chores, setChores] = useState<ChoreTypeWithTodayEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadChores = useCallback(async () => {
    setLoading(true);
    const data = await listChoreTypesWithTodayEntry(db, getTodayDate());
    setChores(data);
    setLoading(false);
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadChores();
    }, [loadChores])
  );

  const handleIncrement = useCallback(
    async (id: number, currentQuantity: number) => {
      const step = getStep(currentQuantity);
      const newQuantity = currentQuantity + step;
      await upsertDailyEntry(db, id, getTodayDate(), newQuantity);
      setChores((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, today_quantity: newQuantity, has_override: true }
            : c
        )
      );
    },
    [db]
  );

  const handleDecrement = useCallback(
    async (id: number, currentQuantity: number) => {
      const step = getStep(currentQuantity);
      const newQuantity = Math.max(0, currentQuantity - step);
      await upsertDailyEntry(db, id, getTodayDate(), newQuantity);
      setChores((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, today_quantity: newQuantity, has_override: true }
            : c
        )
      );
    },
    [db]
  );

  const totalEarnings = chores.reduce(
    (sum, c) => sum + c.today_quantity * c.price_per_unit,
    0
  );

  const renderItem = useCallback(
    ({ item }: { item: ChoreTypeWithTodayEntry }) => (
      <TodayChoreCard
        chore={item}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
      />
    ),
    [handleIncrement, handleDecrement]
  );

  const keyExtractor = useCallback(
    (item: ChoreTypeWithTodayEntry) => item.id.toString(),
    []
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-2 pb-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Today</Text>
            <Text className="text-sm text-gray-400 mt-0.5">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-xs text-gray-400 uppercase tracking-wider">
              Earnings
            </Text>
            <Text className="text-xl font-bold text-gray-900">
              ₹{totalEarnings.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <FlashList
        data={chores}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        ListEmptyComponent={
          loading ? null : (
            <View className="items-center justify-center py-20">
              <View className="w-16 h-16 rounded-2xl bg-gray-100 items-center justify-center mb-4">
                <Text className="text-2xl">📝</Text>
              </View>
              <Text className="text-base text-gray-400 text-center">
                No chores set up yet.{'\n'}Go to the Chores tab to add some.
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}

import React, { useCallback } from 'react';
import { View, Text, Pressable } from './design-system';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ChoreTypeWithTodayEntry } from '../storage/queries';

interface TodayChoreCardProps {
  chore: ChoreTypeWithTodayEntry;
  onIncrement: (id: number, currentQuantity: number) => void;
  onDecrement: (id: number, currentQuantity: number) => void;
}

export function TodayChoreCard({
  chore,
  onIncrement,
  onDecrement,
}: TodayChoreCardProps) {
  const todayValue = chore.today_quantity * chore.price_per_unit;

  const handleIncrement = useCallback(() => {
    onIncrement(chore.id, chore.today_quantity);
  }, [chore.id, chore.today_quantity, onIncrement]);

  const handleDecrement = useCallback(() => {
    if (chore.today_quantity <= 0) return;
    onDecrement(chore.id, chore.today_quantity);
  }, [chore.id, chore.today_quantity, onDecrement]);

  const isModified = Boolean(chore.has_override);

  return (
    <View
      className="bg-white rounded-2xl p-5 mb-3"
      style={
        Platform.OS === 'android'
          ? { elevation: 2 }
          : {
              shadowColor: '#000',
              shadowOpacity: 0.06,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 3 },
            }
      }
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center mr-3">
            <Ionicons
              name="checkmark-done-circle-outline"
              size={22}
              color={isModified ? '#10B981' : '#9CA3AF'}
            />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
              {chore.name}
            </Text>
            <Text className="text-xs text-gray-400 mt-0.5">
              Default {chore.default_quantity} {chore.unit}/day
            </Text>
          </View>
        </View>
        <View className="bg-gray-100 rounded-lg px-2.5 py-1">
          <Text className="text-xs font-semibold text-gray-500 uppercase">
            {chore.unit}
          </Text>
        </View>
      </View>

      {/* Stepper */}
      <View className="flex-row items-center justify-center gap-5">
        <Pressable
          onPress={handleDecrement}
          disabled={chore.today_quantity <= 0}
          className={`w-12 h-12 rounded-full items-center justify-center ${
            chore.today_quantity <= 0 ? 'bg-gray-100' : 'bg-gray-100 active:bg-gray-200'
          }`}
        >
          <Ionicons
            name="remove"
            size={22}
            color={chore.today_quantity <= 0 ? '#D1D5DB' : '#374151'}
          />
        </Pressable>

        <View className="items-center min-w-[80px]">
          <Text className="text-3xl font-bold text-gray-900">
            {chore.today_quantity % 1 === 0
              ? chore.today_quantity.toString()
              : chore.today_quantity.toFixed(1)}
          </Text>
        </View>

        <Pressable
          onPress={handleIncrement}
          className="w-12 h-12 rounded-full bg-gray-900 items-center justify-center active:bg-gray-800"
        >
          <Ionicons name="add" size={22} color="#fff" />
        </Pressable>
      </View>

      {/* Footer */}
      <View className="flex-row items-center justify-center mt-4 pt-3 border-t border-gray-100">
        <Text className="text-sm text-gray-400 mr-1">Today&apos;s value</Text>
        <Text className="text-sm font-bold text-gray-900">
          ₹{todayValue.toFixed(2)}
        </Text>
        {isModified && (
          <View className="ml-2 bg-emerald-50 rounded-full px-2 py-0.5">
            <Text className="text-[10px] font-semibold text-emerald-600">
              MODIFIED
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

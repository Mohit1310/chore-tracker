import React, { memo } from 'react';
import { Platform } from 'react-native';
import { View, Text, Pressable } from './design-system';
import type { ChoreType } from '../storage/queries';

interface ChoreTypeItemProps {
  chore: ChoreType;
  onPress: (id: number) => void;
}

export const ChoreTypeItem = memo(function ChoreTypeItem({
  chore,
  onPress,
}: ChoreTypeItemProps) {
  const handlePress = () => onPress(chore.id);

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white rounded-2xl p-4 mb-3 border border-gray-100"
      style={
        Platform.OS === 'android'
          ? { elevation: 1 }
          : {
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 3,
              shadowOffset: { width: 0, height: 1 },
            }
      }
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900">
            {chore.name}
          </Text>
          <Text className="text-sm text-gray-500 mt-0.5">
            Default: {chore.default_quantity} {chore.unit}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-sm font-medium text-gray-700">
            ${chore.price_per_unit.toFixed(2)}
          </Text>
          <Text className="text-xs text-gray-400">per {chore.unit}</Text>
        </View>
      </View>
    </Pressable>
  );
});

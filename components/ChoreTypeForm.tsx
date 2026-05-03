import React, { useState, useCallback } from 'react';
import { View, Text, Pressable } from './design-system';
import { TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface ChoreTypeFormProps {
  onSubmit: (data: {
    name: string;
    unit: string;
    defaultQuantity: number;
    pricePerUnit: number;
  }) => void;
  onCancel: () => void;
  onDelete?: () => void;
  initialValues?: {
    name: string;
    unit: string;
    defaultQuantity: number;
    pricePerUnit: number;
  };
  submitLabel?: string;
}

export function ChoreTypeForm({
  onSubmit,
  onCancel,
  onDelete,
  initialValues,
  submitLabel = 'Save',
}: ChoreTypeFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [unit, setUnit] = useState(initialValues?.unit ?? 'liter');
  const [defaultQuantity, setDefaultQuantity] = useState(
    initialValues?.defaultQuantity?.toString() ?? '1'
  );
  const [pricePerUnit, setPricePerUnit] = useState(
    initialValues?.pricePerUnit?.toString() ?? '0'
  );

  const handleSubmit = useCallback(() => {
    const qty = parseFloat(defaultQuantity);
    const price = parseFloat(pricePerUnit);

    if (!name.trim() || isNaN(qty) || isNaN(price)) return;

    onSubmit({
      name: name.trim(),
      unit: unit.trim() || 'liter',
      defaultQuantity: qty,
      pricePerUnit: price,
    });
  }, [name, unit, defaultQuantity, pricePerUnit, onSubmit]);

  return (
    <View className="flex-1 px-6 pt-4 gap-5">
      {/* Name Field */}
      <View>
        <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">
          Chore Name
        </Text>
        <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-4 py-3.5">
          <Ionicons name="pricetag-outline" size={18} color="#6B7280" />
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Milk Delivery"
            className="flex-1 text-base text-gray-900 ml-3"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Unit Field */}
      <View>
        <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">
          Unit of Measurement
        </Text>
        <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-4 py-3.5">
          <MaterialCommunityIcons name="scale-balance" size={18} color="#6B7280" />
          <TextInput
            value={unit}
            onChangeText={setUnit}
            placeholder="e.g. liter, piece, kg"
            className="flex-1 text-base text-gray-900 ml-3"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Quantity & Price Row */}
      <View className="flex-row gap-4">
        <View className="flex-1">
          <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">
            Default Qty
          </Text>
          <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-4 py-3.5">
            <Ionicons name="layers-outline" size={18} color="#6B7280" />
            <TextInput
              value={defaultQuantity}
              onChangeText={setDefaultQuantity}
              keyboardType="decimal-pad"
              className="flex-1 text-base text-gray-900 ml-3"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View className="flex-1">
          <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">
            Price / Unit
          </Text>
          <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-4 py-3.5">
            <Ionicons name="cash-outline" size={18} color="#6B7280" />
            <TextInput
              value={pricePerUnit}
              onChangeText={setPricePerUnit}
              keyboardType="decimal-pad"
              className="flex-1 text-base text-gray-900 ml-3"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
      </View>

      {/* Summary Preview */}
      <View className="mt-2 bg-gray-900 rounded-2xl p-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-gray-400">Estimated value</Text>
          <Text className="text-lg font-bold text-white">
            ₹{(parseFloat(defaultQuantity || '0') * parseFloat(pricePerUnit || '0')).toFixed(2)}
          </Text>
        </View>
        <Text className="text-xs text-gray-500 mt-1">
          {parseFloat(defaultQuantity || '0')} {unit || 'liter'} × ₹{parseFloat(pricePerUnit || '0')}
        </Text>
      </View>

      {/* Actions */}
      <View className="flex-row gap-3 mt-2">
        <Pressable
          onPress={onCancel}
          className="flex-1 bg-gray-100 rounded-2xl py-4 items-center active:bg-gray-200"
        >
          <Text className="text-base font-semibold text-gray-700">Cancel</Text>
        </Pressable>
        <Pressable
          onPress={handleSubmit}
          className="flex-1 bg-gray-900 rounded-2xl py-4 items-center active:bg-gray-800"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 3 },
          }}
        >
          <Text className="text-base font-semibold text-white">{submitLabel}</Text>
        </Pressable>
      </View>

      {onDelete && (
        <Pressable
          onPress={onDelete}
          className="mt-3 py-3 items-center active:opacity-70"
        >
          <Text className="text-sm font-semibold text-red-500">Delete Chore</Text>
        </Pressable>
      )}
    </View>
  );
}

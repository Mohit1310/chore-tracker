import React, { useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text } from '../../components/design-system';
import { ChoreTypeForm } from '../../components/ChoreTypeForm';
import { insertChoreType } from '../../storage/queries';

export default function NewChoreScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSubmit = useCallback(
    async (data: {
      name: string;
      unit: string;
      defaultQuantity: number;
      pricePerUnit: number;
    }) => {
      await insertChoreType(
        db,
        data.name,
        data.unit,
        data.defaultQuantity,
        data.pricePerUnit
      );
      router.back();
    },
    [db, router]
  );

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 20 : 0}
    >
      <View className="flex-1 bg-white">
        {/* Drag Handle */}
        <View className="items-center pt-3 pb-1">
          <View className="w-10 h-1.5 bg-gray-300 rounded-full" />
        </View>

        {/* Header */}
        <View className="px-6 pt-4 pb-2">
          <Text className="text-2xl font-bold text-gray-900">New Chore</Text>
          <Text className="text-sm text-gray-500 mt-1">
            Add a chore type you want to track and get paid for.
          </Text>
        </View>

        <ChoreTypeForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="Create Chore"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

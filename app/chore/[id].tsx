import React, { useCallback, useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text } from '../../components/design-system';
import { ChoreTypeForm } from '../../components/ChoreTypeForm';
import {
  updateChoreType,
  deleteChoreType,
  type ChoreType,
} from '../../storage/queries';

export default function EditChoreScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [chore, setChore] = useState<ChoreType | null>(null);
  const [loading, setLoading] = useState(true);

  const choreId = parseInt(id, 10);

  useEffect(() => {
    async function loadChore() {
      const rows = await db.getAllAsync<ChoreType>(
        'SELECT * FROM chore_types WHERE id = ?',
        [choreId]
      );
      setChore(rows[0] ?? null);
      setLoading(false);
    }
    loadChore();
  }, [db, choreId]);

  const handleSubmit = useCallback(
    async (data: {
      name: string;
      unit: string;
      defaultQuantity: number;
      pricePerUnit: number;
    }) => {
      await updateChoreType(
        db,
        choreId,
        data.name,
        data.unit,
        data.defaultQuantity,
        data.pricePerUnit
      );
      router.back();
    },
    [db, choreId, router]
  );

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Chore?',
      'This will remove the chore and all its daily history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteChoreType(db, choreId);
            router.back();
          },
        },
      ]
    );
  }, [db, choreId, router]);

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-400">Loading...</Text>
      </View>
    );
  }

  if (!chore) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-400">Chore not found</Text>
      </View>
    );
  }

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
          <Text className="text-2xl font-bold text-gray-900">Edit Chore</Text>
          <Text className="text-sm text-gray-500 mt-1">
            Update the details of this chore type.
          </Text>
        </View>

        <ChoreTypeForm
          initialValues={{
            name: chore.name,
            unit: chore.unit,
            defaultQuantity: chore.default_quantity,
            pricePerUnit: chore.price_per_unit,
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onDelete={handleDelete}
          submitLabel="Save Changes"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

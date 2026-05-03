import React, { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useRouter, useFocusEffect } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { View, Text, Pressable } from '../../components/design-system';
import { ChoreTypeItem } from '../../components/ChoreTypeItem';
import { listChoreTypes, type ChoreType } from '../../storage/queries';

export default function ManageScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const [chores, setChores] = useState<ChoreType[]>([]);
  const [loading, setLoading] = useState(true);

  const loadChores = useCallback(async () => {
    setLoading(true);
    const data = await listChoreTypes(db);
    setChores(data);
    setLoading(false);
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadChores();
    }, [loadChores])
  );

  const handleAddNew = useCallback(() => {
    router.push('/chore/new');
  }, [router]);

  const handleChorePress = useCallback(
    (id: number) => {
      // Will be implemented in edit step
      console.log('Pressed chore:', id);
    },
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: ChoreType }) => (
      <ChoreTypeItem chore={item} onPress={handleChorePress} />
    ),
    [handleChorePress]
  );

  const keyExtractor = useCallback((item: ChoreType) => item.id.toString(), []);

  return (
    <View className="flex-1 bg-gray-50">
      <FlashList
        data={chores}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={80}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          loading ? null : (
            <View className="items-center justify-center py-20">
              <Text className="text-base text-gray-400 text-center">
                No chores yet.{'\n'}Tap the button below to add one.
              </Text>
            </View>
          )
        }
      />

      <View className="absolute bottom-6 left-0 right-0 items-center">
        <Pressable
          onPress={handleAddNew}
          className="bg-gray-900 rounded-full px-8 py-4"
          style={
            Platform.OS === 'android'
              ? { elevation: 4 }
              : {
                  shadowColor: '#000',
                  shadowOpacity: 0.15,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 4 },
                }
          }
        >
          <Text className="text-base font-semibold text-white">+ Add New Chore</Text>
        </Pressable>
      </View>
    </View>
  );
}

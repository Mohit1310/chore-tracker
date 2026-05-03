import React from 'react';
import { Stack } from 'expo-router';
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';
import { initializeDatabase } from '../storage/schema';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SQLiteProvider
          databaseName="chores.db"
          onInit={async (db: SQLiteDatabase) => {
            await initializeDatabase(db);
          }}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="chore/new"
              options={{
                presentation: 'formSheet',
                headerShown: false,
                sheetGrabberVisible: true,
              }}
            />
          </Stack>
          <StatusBar style="auto" />
        </SQLiteProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

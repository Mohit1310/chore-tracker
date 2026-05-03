import React from 'react';
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import { initializeDatabase } from 'storage/schema';

export default function App() {
  return (
    <SQLiteProvider
      databaseName="chores.db"
      onInit={async (db: SQLiteDatabase) => {
        await initializeDatabase(db);
      }}
    >
      <SafeAreaProvider>
        <ScreenContent title="Home" path="App.tsx" />
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </SQLiteProvider>
  );
}

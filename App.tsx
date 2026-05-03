import React from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    // SQLiteProvider gives useSQLiteContext() to any child that needs it
    <SQLiteProvider databaseName="chores.db">
      <SafeAreaProvider>
      <ScreenContent title="Home" path="App.tsx"></ScreenContent>
      <StatusBar style="auto" />
    </SafeAreaProvider>
    </SQLiteProvider>
  );
}

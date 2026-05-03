import React from 'react';
import { ScrollView as RNScrollView, type ScrollViewProps } from 'react-native';

export function ScrollView(props: ScrollViewProps) {
  return <RNScrollView contentInsetAdjustmentBehavior="automatic" {...props} />;
}

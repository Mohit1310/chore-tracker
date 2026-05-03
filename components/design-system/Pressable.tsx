import React from 'react';
import { Pressable as RNPressable, type PressableProps } from 'react-native';

export function Pressable(props: PressableProps) {
  return <RNPressable {...props} />;
}

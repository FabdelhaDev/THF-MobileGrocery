import React, { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTutorial } from '../context/TutorialContext';
import { useUi } from '../context/UiContext';

export default function SettingsScreen() {
  const { restart, skip, state } = useTutorial();
  const { setCurrentScreen } = useUi();
  const isFocused = useIsFocused();

  // mark tab for overlay placement
  useEffect(() => {
    if (isFocused) setCurrentScreen('Settings');
  }, [isFocused, setCurrentScreen]);

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 16 }}>Settings</Text>

      <View style={{ padding: 12, borderWidth: 1, borderRadius: 8 }}>
        <Text style={{ fontWeight: '600', marginBottom: 6 }}>Tutorial</Text>
        <Pressable onPress={restart} style={{ paddingVertical: 10 }}>
          <Text>Restart Tutorial</Text>
        </Pressable>
        {state.isActive ? (
          <Pressable onPress={skip} style={{ paddingVertical: 10 }}>
            <Text>Skip Tutorial</Text>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

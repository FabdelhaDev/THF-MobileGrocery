import React, { useEffect } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUi } from '../context/UiContext';

export default function FoldersTab() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { setCurrentScreen } = useUi();

  // mark tab for overlay placement (kept simple to avoid hook-order issues)
  useEffect(() => {
    if (isFocused) setCurrentScreen('Folders');
  }, [isFocused, setCurrentScreen]);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>Folders</Text>
      <TouchableOpacity
        style={{ padding: 10, marginTop: 20, backgroundColor: '#ccc', borderRadius: 8 }}
        onPress={() => navigation.navigate('FolderScreen')}
      >
        <Text>Go to Folder</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

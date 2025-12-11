import { KeyboardAvoidingView, FlatList, Pressable, Text, View, Modal, TextInput, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFolders } from '../context/FoldersContext';
import { useState } from 'react';
import { useTutorial } from '../context/TutorialContext';

export default function FoldersScreen() {
  const navigation = useNavigation();
  const { folders, addFolder, removeFolder } = useFolders();
  const { state: tutorial } = useTutorial();

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const create = () => {
    if (!name.trim()) return;
    const id = addFolder({ name: name.trim(), description: desc.trim() });
    setModalOpen(false); setName(''); setDesc('');
    if (tutorial.isActive) navigation.navigate('ListScreen', { folderId: id });
  };

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate('ListScreen', { folderId: item.id })}
      onLongPress={() => removeFolder(item.id)}
      style={{ padding: 16, borderWidth: 1, borderRadius: 12, marginBottom: 12 }}
    >
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
      {item.description ? <Text style={{ opacity: 0.7 }}>{item.description}</Text> : null}
      <Text style={{ marginTop: 6, fontSize: 12, opacity: 0.6 }}>{item.lists.length} lists</Text>
    </Pressable>
  );

  const showHint = tutorial.isActive && tutorial.currentStep === 'createFolder';

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      {showHint ? (
        <View style={{ padding: 8, borderWidth: 1, borderRadius: 8, marginBottom: 8 }}>
          <Text style={{ fontWeight: '600' }}>Tutorial</Text>
          <Text>Create your first folder. Tap the + button.</Text>
        </View>
      ) : null}

      <FlatList
        data={folders}
        keyExtractor={(f) => f.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ opacity: 0.6 }}>No folders yet. Tap + to create one.</Text>}
      />

      <Pressable
        onPress={() => setModalOpen(true)}
        style={{ position: 'absolute', right: 20, bottom: 30, height: 56, width: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', borderWidth: 1, backgroundColor: 'white' }}
      >
        <Text style={{ fontSize: 28, marginTop: -2 }}>＋</Text>
      </Pressable>

      <Modal visible={modalOpen} animationType="slide" transparent>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }} keyboardShouldPersistTaps="handled">
            <View style={{ backgroundColor: 'white', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Create New Folder</Text>
              <Text style={{ fontSize: 14, marginBottom: 4 }}>Folder Name</Text>
              <TextInput placeholder="Enter folder name" value={name} onChangeText={setName} style={{ borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 12 }} />
              <Text style={{ fontSize: 14, marginBottom: 4 }}>Folder Description</Text>
              <TextInput placeholder="Enter description" value={desc} onChangeText={setDesc} multiline style={{ borderWidth: 1, borderRadius: 8, padding: 10, minHeight: 80 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
                <Pressable onPress={() => setModalOpen(false)} style={{ padding: 10, marginRight: 10 }}><Text>Cancel</Text></Pressable>
                <Pressable onPress={create} style={{ padding: 10, opacity: name.trim() ? 1 : 0.4 }}><Text style={{ fontWeight: '700' }}>Create</Text></Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
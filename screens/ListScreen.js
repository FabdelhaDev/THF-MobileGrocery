import { KeyboardAvoidingView, FlatList, Pressable, Text, View, Modal, TextInput, Platform, ScrollView  } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFolders } from '../context/FoldersContext';
import { useState } from 'react';
import { useTutorial } from '../context/TutorialContext';

export default function ListScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { folderId } = route.params;

  const { folders, createListInFolder, removeList } = useFolders();
  const { state: tutorial } = useTutorial();

  const folder = folders.find(f => f.id === folderId);

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  if (!folder) return <Text>Folder not found</Text>;

  const create = () => {
    if (!name.trim()) return;
    const listId = createListInFolder(folderId, { name: name.trim(), description: desc.trim() });
    setModalOpen(false); setName(''); setDesc('');
    navigation.navigate('ItemScreen', { folderId, listId });
  };

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate('ItemScreen', { folderId, listId: item.id })}
      onLongPress={() => removeList(folderId, item.id)}
      style={{ padding: 14, borderWidth: 1, borderRadius: 12, marginBottom: 10 }}
    >
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{item?.name ?? 'Unnamed List'}</Text>
      {!!item?.description && <Text style={{ opacity: 0.7 }}>{item.description}</Text>}
      <Text style={{ marginTop: 6, fontSize: 12, opacity: 0.6 }}>{item?.items?.length ?? 0} items</Text>
    </Pressable>
  );

  const showHint = tutorial.isActive && (tutorial.currentStep === 'createList' || tutorial.currentStep === 'addThreeItems');

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      {showHint ? (
        <View style={{ padding: 8, borderWidth: 1, borderRadius: 8, marginBottom: 8 }}>
          <Text style={{ fontWeight: '600' }}>Tutorial</Text>
          <Text>{tutorial.currentStep === 'createList' ? 'Create a list inside this folder.' : 'Add three items on the next screen.'}</Text>
        </View>
      ) : null}

      <FlatList
        data={folder.lists}
        keyExtractor={l => l.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ opacity: 0.6 }}>No lists yet. Tap + to create one.</Text>}
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
              <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Create New List</Text>
              <Text style={{ fontSize: 14, marginBottom: 4 }}>List Name</Text>
              <TextInput placeholder="Enter list name" value={name} onChangeText={setName} style={{ borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 12 }} />
              <Text style={{ fontSize: 14, marginBottom: 4 }}>List Description</Text>
              <TextInput placeholder="Enter description" value={desc} onChangeText={setDesc} multiline style={{ borderWidth: 1, borderRadius: 8, padding: 10, minHeight: 60 }} />
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
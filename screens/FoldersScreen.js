import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  FlatList,
  Pressable,
  Text,
  View,
  Modal,
  TextInput,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFolders } from '../context/FoldersContext';
import { useTutorial } from '../context/TutorialContext';

export default function FoldersScreen() {
  const navigation = useNavigation();
  const { folders, addFolder, removeFolder } = useFolders();
  const { state: tutorial } = useTutorial();

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState(null);

  const showHint = tutorial.isActive && tutorial.currentStep === 'createFolder';

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission required to access your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  const create = () => {
    if (!name.trim()) return;
    const id = addFolder({
      name: name.trim(),
      description: desc.trim(),
      image: image ?? null,
    });
    // reset
    setModalOpen(false);
    setName('');
    setDesc('');
    setImage(null);

    if (tutorial.isActive) navigation.navigate('ListScreen', { folderId: id });
  };

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate('ListScreen', { folderId: item.id })}
      onLongPress={() => removeFolder(item.id)}
      style={{
        padding: 12,
        borderWidth: 1,
        borderColor: '#E6E6E6',
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={{ width: 48, height: 48, borderRadius: 10, marginRight: 12 }}
        />
      ) : (
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            marginRight: 12,
            borderWidth: 1,
            borderColor: '#EFEFEF',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FAFAFA',
          }}
        >
          <Text style={{ fontSize: 18, color: '#999' }}>
            {item.name ? item.name[0]?.toUpperCase() : 'F'}
          </Text>
        </View>
      )}

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
        {item.description ? (
          <Text style={{ opacity: 0.65, marginTop: 4 }}>{item.description}</Text>
        ) : null}
        <Text style={{ marginTop: 6, fontSize: 12, opacity: 0.6 }}>
          {item.lists.length} lists
        </Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: '#F7F7F8' }}>
      {showHint ? (
        <View
          style={{
            padding: 8,
            borderWidth: 1,
            borderColor: '#E6E6E6',
            borderRadius: 8,
            marginBottom: 8,
            backgroundColor: 'white',
          }}
        >
          <Text style={{ fontWeight: '600' }}>Tutorial</Text>
          <Text>Create your first folder. Tap the + button.</Text>
        </View>
      ) : null}

      <FlatList
        contentContainerStyle={{ paddingBottom: 120 }}
        data={folders}
        keyExtractor={(f) => f.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ opacity: 0.6 }}>No folders yet. Tap + to create one.</Text>
        }
      />

      {/* Floating Add Button */}
      <Pressable
        onPress={() => setModalOpen(true)}
        style={{
          position: 'absolute',
          right: 20,
          bottom: 30,
          height: 56,
          width: 56,
          borderRadius: 28,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 0.5,
          borderColor: '#E6E6E6',
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        <Text style={{ fontSize: 28, lineHeight: 28 }}>＋</Text>
      </Pressable>

      <Modal visible={modalOpen} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={{
                backgroundColor: 'white',
                padding: 16,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                {/* circular image picker button */}
                <Pressable
                  onPress={pickImage}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    borderWidth: 1,
                    borderColor: '#E6E6E6',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                    backgroundColor: '#FFF',
                  }}
                >
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      style={{ width: 56, height: 56, borderRadius: 28 }}
                    />
                  ) : (
                    <Text style={{ fontSize: 28, color: '#888' }}>＋</Text>
                  )}
                </Pressable>

                <Text style={{ fontSize: 18, fontWeight: '700' }}>Create New Folder</Text>
              </View>

              <Text style={{ fontSize: 14, marginBottom: 4 }}>Folder Name</Text>
              <TextInput
                placeholder="Enter folder name"
                value={name}
                onChangeText={setName}
                style={{
                  borderWidth: 1,
                  borderColor: '#EAEAEA',
                  borderRadius: 8,
                  padding: 10,
                  marginBottom: 12,
                  backgroundColor: '#FAFAFA',
                }}
              />

              <Text style={{ fontSize: 14, marginBottom: 4 }}>Folder Description</Text>
              <TextInput
                placeholder="Enter description"
                value={desc}
                onChangeText={setDesc}
                multiline
                style={{
                  borderWidth: 1,
                  borderColor: '#EAEAEA',
                  borderRadius: 8,
                  padding: 10,
                  minHeight: 80,
                  backgroundColor: '#FAFAFA',
                }}
              />

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
                <Pressable
                  onPress={() => {
                    setModalOpen(false);
                    setName('');
                    setDesc('');
                    setImage(null);
                  }}
                  style={{ padding: 10, marginRight: 10 }}
                >
                  <Text>Cancel</Text>
                </Pressable>

                <Pressable onPress={create} style={{ padding: 10, opacity: name.trim() ? 1 : 0.4 }}>
                  <Text style={{ fontWeight: '700' }}>Create</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Pressable, Text, View, Modal, TextInput, Platform, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFolders } from '../context/FoldersContext';
import { useTutorial } from '../context/TutorialContext';

export default function ItemScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { folderId, listId } = route.params;

  const { folders, addItemToList, removeItem, updateItem } = useFolders();
  const { state: tutorial } = useTutorial();

  const folder = folders.find((f) => f.id === folderId);
  const list = folder?.lists.find((l) => l.id === listId);

  const [modalOpen, setModalOpen] = useState(false);
  const [shoppingMode, setShoppingMode] = useState(false);

  const [image, setImage] = useState(null);

  // Fields
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [aisle, setAisle] = useState('');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');

  if (!folder) return <Text>Folder not found</Text>;
  if (!list) return <Text>List not found</Text>;

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

  // ---- Item creation ----
  const create = () => {
    if (!name.trim()) return;
    addItemToList(folderId, listId, {
      name: name.trim(),
      description: desc.trim(),
      aisle: aisle.trim(),
      price: parseFloat(price) || 0,
      amount: amount.trim(),
      checked: false,
      image: image ?? null,
    });
    setModalOpen(false);
    setName('');
    setDesc('');
    setAisle('');
    setPrice('');
    setAmount('');
    setImage(null);
  };

  // ---- Shopping mode item sorting ----
  const sortedItems = useMemo(() => {
    const unchecked = list.items.filter((i) => !i.checked);
    const checked = list.items.filter((i) => i.checked);
    return [...unchecked, ...checked];
  }, [list.items]);

  // ---- Toggle item check in shopping mode ----
  const toggleItemChecked = (item) => {
    updateItem(folderId, listId, item.id, { checked: !item.checked });

    // optional: auto-exit when everything is checked
    // if (sortedItems.every(i => i.checked)) setShoppingMode(false);
  };

  // ---- Card UI ----
  const renderItemCard = (item) => {
    const greyed = item.checked && shoppingMode;

    return (
      <Pressable
        key={item.id}
        onLongPress={
          shoppingMode
            ? null // cannot delete in shopping mode
            : () => removeItem(folderId, listId, item.id)
        }
        onPress={shoppingMode ? () => toggleItemChecked(item) : null}
        style={{
          padding: 12,
          borderWidth: 1,
          borderColor: '#E6E6E6',
          borderRadius: 12,
          marginBottom: 10,
          opacity: greyed ? 0.45 : 1,
          backgroundColor: greyed ? '#F3F3F3' : 'white',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {item.image ? (
          <Image source={{ uri: item.image }} style={{ width: 48, height: 48, borderRadius: 10, marginRight: 12 }} />
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
              backgroundColor: '#FBFBFB',
            }}
          >
            <Text style={{ fontSize: 18, color: '#999' }}>{item.name ? item.name[0]?.toUpperCase() : 'I'}</Text>
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>{item?.name ?? 'Unnamed Item'}</Text>
          {!!item?.description && <Text style={{ opacity: 0.7 }}>{item.description}</Text>}
          <Text style={{ fontSize: 12, opacity: 0.6 }}>
            Aisle: {item?.aisle ?? '-'} | Amount: {item?.amount ?? '-'} | Price: ${item?.price ?? 0}
          </Text>
          {shoppingMode && (
            <Text style={{ marginTop: 4, fontSize: 12 }}>{item.checked ? '✓ Checked' : 'Tap to check'}</Text>
          )}
        </View>
      </Pressable>
    );
  };

  const tutorialIsAdding = tutorial.isActive && tutorial.currentStep === 'addThreeItems';

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: '#F7F7F8' }}>
      {tutorialIsAdding ? (
        <View style={{ padding: 8, borderWidth: 1, borderColor: '#E6E6E6', borderRadius: 8, marginBottom: 8, backgroundColor: 'white' }}>
          <Text style={{ fontWeight: '600' }}>Tutorial</Text>
          <Text>{`Add three items. Progress: ${tutorial.progress.itemsAddedCount || 0}/3.`}</Text>
        </View>
      ) : null}

      {/* Shopping Mode Button */}
      <Pressable
        onPress={() => setShoppingMode(!shoppingMode)}
        style={{
          padding: 14,
          marginBottom: 10,
          borderRadius: 10,
          backgroundColor: shoppingMode ? '#FFEEEE' : '#EEFFEF',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#E6E6E6',
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '700' }}>{shoppingMode ? 'End Shopping' : 'Start Shopping'}</Text>
      </Pressable>

      {/* Scroll area */}
      <View style={{ flex: 1, alignItems: 'center' }}>
        <View style={{ width: '92%', maxWidth: 520, flex: 1, borderWidth: 0, borderRadius: 12, padding: 12 }}>
          <ScrollView>{sortedItems.map(renderItemCard)}</ScrollView>
        </View>
      </View>

      {/* Add button (hidden in shopping mode) */}
      {!shoppingMode && (
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
      )}

      {/* Item modal */}
      <Modal visible={modalOpen} animationType="slide" transparent>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.2)' }}>
            <View style={{ backgroundColor: 'white', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
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
                  {image ? <Image source={{ uri: image }} style={{ width: 56, height: 56, borderRadius: 28 }} /> : <Text style={{ fontSize: 28, color: '#888' }}>＋</Text>}
                </Pressable>

                <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Create New Item</Text>
              </View>

              <Text style={{ fontSize: 14, marginBottom: 4 }}>Item Name</Text>
              <TextInput
                placeholder="Enter item name"
                value={name}
                onChangeText={setName}
                style={{ borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 8, padding: 10, marginBottom: 12, backgroundColor: '#FAFAFA' }}
              />

              <Text style={{ fontSize: 14, marginBottom: 4 }}>Item Description</Text>
              <TextInput
                placeholder="Enter description"
                value={desc}
                onChangeText={setDesc}
                multiline
                style={{ borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 8, padding: 10, minHeight: 60, marginBottom: 12, backgroundColor: '#FAFAFA' }}
              />

              <Text style={{ fontSize: 14, marginBottom: 4 }}>Aisle</Text>
              <TextInput placeholder="Enter aisle" value={aisle} onChangeText={setAisle} style={{ borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 8, padding: 10, marginBottom: 12, backgroundColor: '#FAFAFA' }} />

              <Text style={{ fontSize: 14, marginBottom: 4 }}>Amount / Quantity</Text>
              <TextInput placeholder="Enter amount" value={amount} onChangeText={setAmount} style={{ borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 8, padding: 10, marginBottom: 12, backgroundColor: '#FAFAFA' }} />

              <Text style={{ fontSize: 14, marginBottom: 4 }}>Price</Text>
              <TextInput placeholder="Enter price" value={price} onChangeText={setPrice} keyboardType="numeric" style={{ borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 8, padding: 10, marginBottom: 12, backgroundColor: '#FAFAFA' }} />

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
                <Pressable onPress={() => { setModalOpen(false); setName(''); setDesc(''); setAisle(''); setPrice(''); setAmount(''); setImage(null); }} style={{ padding: 10, marginRight: 10 }}>
                  <Text>Cancel</Text>
                </Pressable>

                <Pressable onPress={create} style={{ padding: 10, opacity: name.trim() ? 1 : 0.4 }}>
                  <Text style={{ fontWeight: '700' }}>Create</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

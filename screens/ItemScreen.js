import { KeyboardAvoidingView, Pressable, Text, View, Modal, TextInput, Platform, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFolders } from '../context/FoldersContext';
import { useState } from 'react';
import { useTutorial } from '../context/TutorialContext';

export default function ItemScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { folderId, listId } = route.params;

  const { folders, addItemToList, removeItem } = useFolders();
  const { state: tutorial } = useTutorial();

  const folder = folders.find(f => f.id === folderId);
  const list = folder?.lists.find(l => l.id === listId);

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [aisle, setAisle] = useState('');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');

  if (!folder) return <Text>Folder not found</Text>;
  if (!list) return <Text>List not found</Text>;

  const create = () => {
    if (!name.trim()) return;
    addItemToList(folderId, listId, {
      name: name.trim(),
      description: desc.trim(),
      aisle: aisle.trim(),
      price: parseFloat(price) || 0,
      amount: amount.trim(),
    });
    setModalOpen(false); setName(''); setDesc(''); setAisle(''); setPrice(''); setAmount('');
  };

  const renderItemCard = (item) => (
    <Pressable key={item.id} onLongPress={() => removeItem(folderId, listId, item.id)} style={{ padding: 14, borderWidth: 1, borderRadius: 12, marginBottom: 10 }}>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{item?.name ?? 'Unnamed Item'}</Text>
      {!!item?.description && <Text style={{ opacity: 0.7 }}>{item.description}</Text>}
      <Text style={{ fontSize: 12, opacity: 0.6 }}>
        Aisle: {item?.aisle ?? '-'} | Amount: {item?.amount ?? '-'} | Price: ${item?.price ?? 0}
      </Text>
    </Pressable>
  );

  const tutorialIsAdding = tutorial.isActive && tutorial.currentStep === 'addThreeItems';

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      {tutorialIsAdding ? (
        <View style={{ padding: 8, borderWidth: 1, borderRadius: 8, marginBottom: 8 }}>
          <Text style={{ fontWeight: '600' }}>Tutorial</Text>
          <Text>{`Add three items. Progress: ${tutorial.progress.itemsAddedCount || 0}/3.`}</Text>
        </View>
      ) : null}

      {/* Always-centered scrolling box */}
      <View style={{ flex: 1, alignItems: 'center' }}>
        <View style={{ width: '92%', maxWidth: 520, flex: 1, borderWidth: 1, borderRadius: 12, padding: 12 }}>
          <ScrollView>{list.items.map(renderItemCard)}</ScrollView>
        </View>
      </View>

      <Pressable
        onPress={() => setModalOpen(true)}
        style={{ position: 'absolute', right: 20, bottom: 30, height: 56, width: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', borderWidth: 1, backgroundColor: 'white' }}
      >
        <Text style={{ fontSize: 28, marginTop: -2 }}>＋</Text>
      </Pressable>

      <Modal visible={modalOpen} animationType="slide" transparent>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.2)' }}>
            <View style={{ backgroundColor: 'white', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Create New Item</Text>
              <Text style={{ fontSize: 14, marginBottom: 4 }}>Item Name</Text>
              <TextInput placeholder="Enter item name" value={name} onChangeText={setName} style={{ borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 12 }} />
              <Text style={{ fontSize: 14, marginBottom: 4 }}>Item Description</Text>
              <TextInput placeholder="Enter description" value={desc} onChangeText={setDesc} multiline style={{ borderWidth: 1, borderRadius: 8, padding: 10, minHeight: 60, marginBottom: 12 }} />
              <Text style={{ fontSize: 14, marginBottom: 4 }}>Aisle</Text>
              <TextInput placeholder="Enter aisle" value={aisle} onChangeText={setAisle} style={{ borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 12 }} />
              <Text style={{ fontSize: 14, marginBottom: 4 }}>Amount / Quantity</Text>
              <TextInput placeholder="Enter amount" value={amount} onChangeText={setAmount} style={{ borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 12 }} />
              <Text style={{ fontSize: 14, marginBottom: 4 }}>Price</Text>
              <TextInput placeholder="Enter price" value={price} onChangeText={setPrice} keyboardType="numeric" style={{ borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 12 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
                <Pressable onPress={() => setModalOpen(false)} style={{ padding: 10, marginRight: 10 }}><Text>Cancel</Text></Pressable>
                <Pressable onPress={create} style={{ padding: 10, opacity: name.trim() ? 1 : 0.4 }}><Text style={{ fontWeight: '700' }}>Create</Text></Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
import React, { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRecipes } from '../context/RecipesContext';

export default function RecipesTab() {
  const navigation = useNavigation();
  const { recipes, createRecipe, removeRecipe } = useRecipes();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const canCreate = useMemo(() => name.trim().length > 0, [name]);

  const create = () => {
    if (!canCreate) return;
    const id = createRecipe({ name: name.trim(), description: desc.trim() });
    setOpen(false);
    setName('');
    setDesc('');
    // Helps jump into the editor immediatelly without delay.
    navigation.navigate('RecipeDetail', { recipeId: id });
  };

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
      onLongPress={() => removeRecipe(item.id)} // quick remove for now
      style={{ padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 10 }}
    >
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
      {!!item.description && <Text style={{ marginTop: 4, opacity: 0.7 }}>{item.description}</Text>}
      <Text style={{ marginTop: 6, fontSize: 12, opacity: 0.6 }}>{item.items.length} items</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={recipes}
        keyExtractor={(r) => r.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ opacity: 0.6 }}>No recipes yet. Tap + to create one.</Text>}
      />

      {/* Minimal FAB */}
      <Pressable
        onPress={() => setOpen(true)}
        style={{
          position: 'absolute',
          right: 20,
          bottom: 30,
          height: 56,
          width: 56,
          borderRadius: 28,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          backgroundColor: 'white',
        }}
      >
        <Text style={{ fontSize: 28, marginTop: -2 }}>＋</Text>
      </Pressable>

      {/* Recipes Model for now */}
      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: 'white', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>New Recipe</Text>
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={{ borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 8 }}
            />
            <TextInput
              placeholder="Description"
              value={desc}
              onChangeText={setDesc}
              multiline
              style={{ borderWidth: 1, borderRadius: 8, padding: 10, minHeight: 80 }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
              <Pressable onPress={() => setOpen(false)} style={{ padding: 10, marginRight: 10 }}>
                <Text>Cancel</Text>
              </Pressable>
              <Pressable onPress={create} disabled={!canCreate} style={{ padding: 10, opacity: canCreate ? 1 : 0.4 }}>
                <Text style={{ fontWeight: '700' }}>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useItems } from '../context/ItemsContext';
import { useRecipes } from '../context/RecipesContext';

export default function RecipeDetailScreen() {
  const route = useRoute();
  const { recipeId } = route.params ?? {}; // if someone navigates here weirdly, it will hopefully prevent crashing

  // global items (shared catalog) + ability to push new items into it
  const { items: catalog, addItem: addGlobalItem } = useItems();

  
  const { recipes, updateRecipeMeta, addItemsToRecipe, removeItemFromRecipe } = useRecipes();

  // memo so we don’t recompute on every keystroke; depends on recipes/recipeId
  const recipe = useMemo(() => recipes.find((r) => r.id === recipeId), [recipes, recipeId]);



  const [name, setName] = useState(recipe?.name ?? '');
  const [desc, setDesc] = useState(recipe?.description ?? '');

  if (!recipe) {
    // guard for bad routes or deleted recipe if that so happens
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Recipe not found.</Text>
      </SafeAreaView>
    );
  }

  const saveMeta = () => {
    // explicit save so typing doesn’t constantly write to global state
    updateRecipeMeta(recipe.id, { name: name.trim(), description: desc.trim() });
    Alert.alert('Saved', 'Recipe details updated.');
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      {/* ——— Top: Recipe name/description editor ——— */}
      <Text style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Name</Text>
      <TextInput value={name} onChangeText={setName} style={{ borderWidth: 1, borderRadius: 8, padding: 10 }} />

      <Text style={{ fontSize: 12, opacity: 0.6, marginVertical: 8 }}>Description</Text>
      <TextInput
        value={desc}
        onChangeText={setDesc}
        multiline
        style={{ borderWidth: 1, borderRadius: 8, padding: 10, minHeight: 90 }}
      />

      {/* keep Save simple + explicit so users know when it persisted */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, marginBottom: 16 }}>
        <Pressable onPress={saveMeta} style={{ padding: 10 }}>
          <Text style={{ fontWeight: '700' }}>Save</Text>
        </Pressable>
      </View>

      {/* Items section */}
      <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>Items</Text>

      <FlatList
        data={recipe.items}               // items already attached to this recipe
        keyExtractor={(i) => i.name}      // names are unique enough for this local-only MVP
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderRadius: 10,
              borderWidth: 1,
              marginBottom: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text>{item.name}</Text>
            {/* simple remove for now; if we add quantities later, this stays the same */}
            <Pressable onPress={() => removeItemFromRecipe(recipe.id, item.name)} style={{ padding: 6 }}>
              <Text>Remove</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<Text style={{ opacity: 0.6 }}>No items yet.</Text>}
      />

      {/* actions below: add from global list, add new, or go back */}
      <AddButtons
        catalog={catalog}
        onAddFromCatalog={(names) =>
          addItemsToRecipe(
            recipe.id,
            names.map((n) => ({ name: n })) // stick to shape { name } until we add more fields
          )
        }
        onAddNew={(name) => {
          addGlobalItem(name); // push into shared list so it appears elsewhere too
          addItemsToRecipe(recipe.id, [{ name }]); // also attach to this recipe immediately
        }}
      />
    </SafeAreaView>
  );
}

function AddButtons({ catalog, onAddFromCatalog, onAddNew }) {
  const navigation = useNavigation();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [selected, setSelected] = useState({});

  const toggle = (id) => setSelected((s) => ({ ...s, [id]: !s[id] }));

  const confirmCatalog = () => {
    const names = catalog.filter((i) => selected[i.id]).map((i) => i.name);
    if (names.length) onAddFromCatalog(names);
    setPickerOpen(false);
    setSelected({});
  };

  const confirmNew = () => {
    const name = newName.trim();
    if (name) onAddNew(name);
    setAddOpen(false);
    setNewName('');
  };

  return (
    <View style={{ marginTop: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pressable onPress={() => setPickerOpen(true)} style={{ padding: 12, borderWidth: 1, borderRadius: 8 }}>
          <Text>Add from items list</Text>
        </Pressable>
        <View style={{ width: 12 }} />
        <Pressable onPress={() => setAddOpen(true)} style={{ padding: 12, borderWidth: 1, borderRadius: 8 }}>
          <Text>Add new item</Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ paddingVertical: 12, paddingHorizontal: 14, borderWidth: 1, borderRadius: 8 }}
        >
          <Text>Back</Text>
        </Pressable>
      </View>

      <Modal visible={pickerOpen} animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <SafeAreaView style={{ flex: 1, padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Pick items</Text>
          <FlatList
            data={catalog}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => toggle(item.id)}
                style={{
                  padding: 12,
                  borderWidth: 1,
                  borderRadius: 8,
                  marginBottom: 8,
                  backgroundColor: selected[item.id] ? 'rgba(0,0,0,0.05)' : 'transparent',
                }}
              >
                <Text>{item.name}</Text>
              </Pressable>
            )}
            ListEmptyComponent={<Text>No global items yet.</Text>}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
            <Pressable onPress={() => setPickerOpen(false)} style={{ padding: 10, marginRight: 12 }}>
              <Text>Cancel</Text>
            </Pressable>
            <Pressable onPress={confirmCatalog} style={{ padding: 10 }}>
              <Text style={{ fontWeight: '700' }}>Add</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>

      <Modal visible={addOpen} animationType="slide" onRequestClose={() => setAddOpen(false)} transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: 'white', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>New item</Text>
            <TextInput
              placeholder="e.g. Sugar"
              value={newName}
              onChangeText={setNewName}
              style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
              <Pressable onPress={() => setAddOpen(false)} style={{ padding: 10, marginRight: 10 }}>
                <Text>Cancel</Text>
              </Pressable>
              <Pressable onPress={confirmNew} style={{ padding: 10 }}>
                <Text style={{ fontWeight: '700' }}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

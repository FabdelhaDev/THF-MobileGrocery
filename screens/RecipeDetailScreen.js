
import { useMemo, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, SafeAreaView, Text, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useRecipes } from '../context/RecipesContext';
import { useFolders } from '../context/FoldersContext';

export default function RecipeDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { recipeId } = route.params ?? {};

  const { recipes, updateRecipeMeta, addItemsToRecipe, removeItemFromRecipe } =
    useRecipes();

  const { folders, addItemToList } = useFolders();

  const catalog = useMemo(
    () => folders.flatMap(f => f.lists.flatMap(l => l.items)),
    [folders]
  );

  const recipe = useMemo(() => recipes.find(r => r.id === recipeId), [
    recipes,
    recipeId,
  ]);

  const [name, setName] = useState(recipe?.name ?? '');
  const [desc, setDesc] = useState(recipe?.description ?? '');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [selected, setSelected] = useState({});

  if (!recipe) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Recipe not found.</Text>
      </SafeAreaView>
    );
  }

  const saveMeta = () => {
    updateRecipeMeta(recipe.id, { name: name.trim(), description: desc.trim() });
    Alert.alert('Saved', 'Recipe details updated.');
  };

  const toggle = id => setSelected(s => ({ ...s, [id]: !s[id] }));

  const confirmCatalog = () => {
    const itemsToAdd = catalog
      .filter(i => selected[i.id])
      .map(i => ({ name: i.name }));
    if (itemsToAdd.length) addItemsToRecipe(recipe.id, itemsToAdd);
    setPickerOpen(false);
    setSelected({});
  };

  const confirmNew = () => {
    const itemName = newName.trim();
    if (!itemName) return;

    const folder = folders[0];
    const list = folder?.lists[0];
    if (folder && list) addItemToList(folder.id, list.id, { name: itemName });

    addItemsToRecipe(recipe.id, [{ name: itemName }]);
    setAddOpen(false);
    setNewName('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter recipe name"
          style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
        />

        <Text style={{ fontSize: 12, opacity: 0.6, marginVertical: 8 }}>Description</Text>
        <TextInput
          value={desc}
          onChangeText={setDesc}
          placeholder="Enter a short description"
          multiline
          style={{ borderWidth: 1, borderRadius: 8, padding: 10, minHeight: 90 }}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, marginBottom: 16 }}>
          <Pressable onPress={saveMeta} style={{ padding: 10 }}>
            <Text style={{ fontWeight: '700' }}>Save</Text>
          </Pressable>
        </View>

        <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>Items</Text>
        <FlatList
          data={recipe.items}
          keyExtractor={i => i.name}
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
              <Pressable onPress={() => removeItemFromRecipe(recipe.id, item.name)} style={{ padding: 6 }}>
                <Text>Remove</Text>
              </Pressable>
            </View>
          )}
          ListEmptyComponent={<Text style={{ opacity: 0.6 }}>No items yet.</Text>}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <Pressable
            onPress={() => setPickerOpen(true)}
            style={{ padding: 12, borderWidth: 1, borderRadius: 8 }}
          >
            <Text>Add from items list</Text>
          </Pressable>
          <View style={{ width: 12 }} />
          <Pressable
            onPress={() => setAddOpen(true)}
            style={{ padding: 12, borderWidth: 1, borderRadius: 8 }}
          >
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
              keyExtractor={i => i.id}
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
              ListEmptyComponent={<Text>No items available.</Text>}
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

        <Modal visible={addOpen} animationType="slide" transparent>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' }}>
            <View style={{ backgroundColor: 'white', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>New Item</Text>
              <Text style={{ marginBottom: 4, fontWeight: '500' }}>Item Name</Text>
              <TextInput
                placeholder="Enter item name"
                value={newName}
                onChangeText={setNewName}
                style={{ borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 12 }}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Pressable onPress={() => setAddOpen(false)} style={{ padding: 10, marginRight: 10 }}>
                  <Text>Cancel</Text>
                </Pressable>
                <Pressable onPress={confirmNew} style={{ padding: 10, opacity: newName.trim() ? 1 : 0.4 }}>
                  <Text style={{ fontWeight: '700' }}>Add</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

import React, { useMemo, useState, useEffect } from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecipes } from '../context/RecipesContext';
import { useUi } from '../context/UiContext';

export default function RecipesTab() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { recipes = [], createRecipe, removeRecipe } = useRecipes();
  const { setOverlayHidden, setCurrentScreen } = useUi();

  const [createOpen, setCreateOpen] = useState(false);
  const [recipeName, setRecipeName] = useState('');
  const [recipeDesc, setRecipeDesc] = useState('');

  const canCreate = useMemo(() => recipeName.trim().length > 0, [recipeName]);

  // Set active tab name for overlay placement (no nav hooks inside overlay).
  useEffect(() => {
    if (isFocused) setCurrentScreen('Recipes');
  }, [isFocused, setCurrentScreen]);

  // Hide overlay while the create modal is open.
  useEffect(() => {
    setOverlayHidden(createOpen);
    return () => setOverlayHidden(false);
  }, [createOpen, setOverlayHidden]);

  const handleCreate = () => {
    if (!canCreate) return;
    const newId = createRecipe({ name: recipeName.trim(), description: recipeDesc.trim() });
    setCreateOpen(false);
    setRecipeName('');
    setRecipeDesc('');
    navigation.navigate('RecipeDetail', { recipeId: newId });
  };

  const renderRecipeCard = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
      onLongPress={() => removeRecipe(item.id)}
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
        data={Array.isArray(recipes) ? recipes : []}
        keyExtractor={(r) => r.id}
        renderItem={renderRecipeCard}
        ListEmptyComponent={<Text style={{ opacity: 0.6 }}>No recipes yet. Tap + to create one.</Text>}
      />

      <Pressable
        onPress={() => setCreateOpen(true)}
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

      <Modal visible={createOpen} animationType="slide" transparent onRequestClose={() => setCreateOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' }}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={{ backgroundColor: 'white', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>New Recipe</Text>

              <TextInput
                placeholder="Name"
                value={recipeName}
                onChangeText={setRecipeName}
                style={{ borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 8 }}
              />
              <TextInput
                placeholder="Description"
                value={recipeDesc}
                onChangeText={setRecipeDesc}
                multiline
                style={{ borderWidth: 1, borderRadius: 8, padding: 10, minHeight: 80 }}
              />

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
                <Pressable onPress={() => setCreateOpen(false)} style={{ padding: 10, marginRight: 10 }}>
                  <Text>Cancel</Text>
                </Pressable>
                <Pressable onPress={handleCreate} disabled={!canCreate} style={{ padding: 10, opacity: canCreate ? 1 : 0.4 }}>
                  <Text style={{ fontWeight: '700' }}>Create</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

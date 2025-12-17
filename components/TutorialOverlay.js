
import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTutorial } from '../context/TutorialContext';
import { useFolders } from '../context/FoldersContext';
import { useRecipes } from '../context/RecipesContext';
import { useUi } from '../context/UiContext';

export default function TutorialOverlay() {
  const { state, begin, skip, restart } = useTutorial();
  const { folders } = useFolders();
  const { recipes } = useRecipes();
  const { overlayHidden, currentScreen } = useUi();

  const isPrompt =
    !state.hasSeenPrompt ||
    (state.hasSeenPrompt && state.currentStep === 'idle' && !state.isActive);

  const show = (isPrompt || state.isActive) && !overlayHidden;
  if (!show) return null;

  // Enable Skip only; advancement is via actions (report()).
  const message = (() => {
    if (isPrompt)
      return 'Do you want a quick tutorial? We’ll guide: folder → list → 3 list items → recipe → add recipe items.';
    switch (state.currentStep) {
      case 'createFolder': return 'Step 1: Create a folder (tap + on Folders).';
      case 'createList': return 'Step 2: Inside that folder, create a list.';
      case 'addThreeItems': return 'Step 3: Add three items to that list.';
      case 'createRecipe': return 'Step 4: Create a recipe in the Recipes tab.';
      case 'addItemsToRecipe': return 'Final: Add item(s) to your recipe.';
      case 'done': return 'All set! You can restart the tutorial from Settings.';
      default: return '';
    }
  })();

  // Placement that never blocks key UI:
  const containerPos = { position: 'absolute', left: 0, right: undefined };

  if (currentScreen === 'Folders') {
    containerPos.top = 220;
  } else if (currentScreen === 'Recipes' && (isPrompt || state.currentStep === 'createRecipe')) {
    containerPos.top = 64;
  } else if (state.isActive && state.currentStep === 'addItemsToRecipe') {
    containerPos.top = 12;
  } else if (currentScreen === 'Settings') {
    containerPos.bottom = 12;
  } else {
    containerPos.bottom = 12;
  }

  return (
    <View pointerEvents="box-none" style={containerPos}>
      <View
        pointerEvents="auto"
        style={{
          marginLeft: 12,
          marginRight: 12,
          marginTop: containerPos.top ? 12 : 0,
          marginBottom: containerPos.bottom ? 12 : 0,
          maxWidth: '72%',
          backgroundColor: 'white',
          borderWidth: 1,
          borderRadius: 12,
          padding: 12,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Text style={{ fontSize: 14, marginBottom: 8 }}>{message}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          {isPrompt ? (
            <>
              <Pressable onPress={skip} style={{ padding: 10, marginRight: 8 }}>
                <Text>Not now</Text>
              </Pressable>
              <Pressable onPress={begin} style={{ padding: 10 }}>
                <Text style={{ fontWeight: '700' }}>Start</Text>
              </Pressable>
            </>
          ) : state.currentStep === 'done' ? (
            <Pressable onPress={restart} style={{ padding: 10 }}>
              <Text style={{ fontWeight: '700' }}>Restart</Text>
            </Pressable>
          ) : (
            <Pressable onPress={skip} style={{ padding: 10 }}>
              <Text>Skip</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

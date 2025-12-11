import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import TabsNavigator from './navigation/TabsNavigator';
import SignInScreen from './screens/SignInScreen';
import FoldersScreen from './screens/FoldersScreen';
import ListScreen from './screens/ListScreen';
import ItemScreen from './screens/ItemScreen';
import RecipeDetailScreen from './screens/RecipeDetailScreen';

import { FoldersProvider, useFolders } from './context/FoldersContext';
import { RecipesProvider } from './context/RecipesContext';
import { TutorialProvider, useTutorial } from './context/TutorialContext';
import { UiProvider } from './context/UiContext';

const Stack = createStackNavigator();

// Seeds one simple default set when tutorial is completed and the app is empty.
// helps new users understand structure if they skipped the tutorial is what i think
function SeedDefaultsOnce() {
  const { folders, addFolder, createListInFolder, addItemToList } = useFolders();
  const { state } = useTutorial();

  useEffect(() => {
    const tutorialIsDone = state.currentStep === 'done';
    const isEmpty = folders.length === 0;
    if (tutorialIsDone && isEmpty) {
      const folderId = addFolder({ name: 'Household', description: 'Starter folder' });
      const listId = createListInFolder(folderId, { name: 'Groceries', description: 'Basics' });
      addItemToList(folderId, listId, { name: 'Milk' });
      addItemToList(folderId, listId, { name: 'Eggs' });
      addItemToList(folderId, listId, { name: 'Bread' });
    }
  }, [state.currentStep]); // runs when tutorial transitions to "done"

  return null;
}

export default function App() {
  return (
    <UiProvider>
      <TutorialProvider>
        <FoldersProvider>
          <RecipesProvider>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="SignIn" component={SignInScreen} />
                <Stack.Screen name="Tabs" component={TabsNavigator} />
                <Stack.Screen name="FolderScreen" component={FoldersScreen} />
                <Stack.Screen name="ListScreen" component={ListScreen} />
                <Stack.Screen name="ItemScreen" component={ItemScreen} />
                <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
              </Stack.Navigator>
            </NavigationContainer>

            {/* Overlay moved to TabsNavigator so it appears after sign-in */}
            <SeedDefaultsOnce />
          </RecipesProvider>
        </FoldersProvider>
      </TutorialProvider>
    </UiProvider>
  );
}

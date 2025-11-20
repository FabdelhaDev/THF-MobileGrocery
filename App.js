import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabsNavigator from './navigation/TabsNavigator';
import SignInScreen from './screens/SignInScreen';
import FoldersScreen from './screens/FoldersScreen';
import ListScreen from './screens/ListScreen';
import ItemScreen from './screens/ItemScreen';
import RecipeDetailScreen from './screens/RecipeDetailScreen'; // ensure this exists
import { ItemsProvider } from './context/ItemsContext';
import { RecipesProvider } from './context/RecipesContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ItemsProvider>
      <RecipesProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="Tabs" component={TabsNavigator} />
            <Stack.Screen name="FolderScreen" component={FoldersScreen} />
            <Stack.Screen name="ListScreen" component={ListScreen} />
            <Stack.Screen name="ItemScreen" component={ItemScreen} />
            {/* Do NOT put plain text here, comments must be inside braces like this */}
            <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </RecipesProvider>
    </ItemsProvider>
  );
}

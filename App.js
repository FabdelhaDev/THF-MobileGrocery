import { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import TabsNavigator from './navigation/TabsNavigator';
import LoadingOverlay from './components/ui/LoadingOverlay'; 
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import FoldersScreen from './screens/FoldersScreen';
import ListScreen from './screens/ListScreen';
import ItemScreen from './screens/ItemScreen';
import RecipeDetailScreen from './screens/RecipeDetailScreen';
import { Colors } from './constants/styles';
import WelcomeScreen from './screens/WelcomeScreen';
import { FoldersProvider, useFolders } from './context/FoldersContext';
import { RecipesProvider } from './context/RecipesContext';
import { TutorialProvider, useTutorial } from './context/TutorialContext';
import { UiProvider } from './context/UiContext';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthContext, AuthProvider } from './context/AuthContext'; 

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

export function AppStack() {
  const { state: authState, tryLocalLogin } = useContext(AuthContext); 
  const [isTryingLogin, setIsTryingLogin] = useState(true); 

  useEffect(() => {
    async function fetchToken() {
      if (tryLocalLogin) {
          await tryLocalLogin(); 
      }
      setIsTryingLogin(false); 
    }
    fetchToken();
  }, [tryLocalLogin]);
  

  if (isTryingLogin) {
    return <LoadingOverlay message="Loading user session..." />;
  }
  
  // Define a set of common screen options
  const screenOptions = {
    headerShown: false,
    headerStyle: { backgroundColor: Colors.primary500 },
    headerTintColor: 'white',
    contentStyle: { backgroundColor: Colors.primary100 }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        {authState.token == null ? (
          // Show Auth Screens if logged out
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          // Show Main App Screens if logged in
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Tabs" component={TabsNavigator} />
            <Stack.Screen name="FolderScreen" component={FoldersScreen} />
            <Stack.Screen name="ListScreen" component={ListScreen} />
            <Stack.Screen name="ItemScreen" component={ItemScreen} />
            <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UiProvider>
        <TutorialProvider>
          <FoldersProvider>
            <RecipesProvider>
              <PaperProvider>
                {/*AppStack component manages all navigation */}
                <AppStack />
                {/* Seed defaults after tutorial completion */}
                <SeedDefaultsOnce />
              </PaperProvider>
            </RecipesProvider>
          </FoldersProvider>
        </TutorialProvider>
      </UiProvider>
    </AuthProvider>
  );
}

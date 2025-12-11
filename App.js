import { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabsNavigator from './navigation/TabsNavigator';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import FoldersScreen from './screens/FoldersScreen';
import ListScreen from './screens/ListScreen';
import ItemScreen from './screens/ItemScreen';
import RecipeDetailScreen from './screens/RecipeDetailScreen';

import Colors from './constants/styles';
import WelcomeScreen from './screens/WelcomeScreen';

import { FoldersProvider } from './context/FoldersContext';
import { RecipesProvider } from './context/RecipesContext';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthContext, AuthProvider } from './context/AuthContext';


const Stack = createStackNavigator();

function AuthStack() {  // Stack navigator for authentication screens
  return (
    <Stack.Navigator
     screenOptions={{
      headerShown: false,
      headerStyle: { backgroundColor: Colors.primary500 },
      headerTintColor: 'white',
      contentStyle: { backgroundColor: Colors.primary100 }
    }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function MainStack() {  // Stack navigator for main app screens
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 }
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Tabs" component={TabsNavigator} />
      <Stack.Screen name="FolderScreen" component={FoldersScreen} />
      <Stack.Screen name="ListScreen" component={ListScreen} />
      <Stack.Screen name="ItemScreen" component={ItemScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />      
      </Stack.Navigator>
  );
}

function AppNavigator() {
  // This hook connects to your AuthContext.js logic and reads the user token state
  const { userToken } = useContext(AuthContext); 

  return (
    <NavigationContainer>
      {userToken == null ? (
        // If userToken is null/undefined, show the Auth flow
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        // If userToken has a value, show the Main app flow
        <Stack.Screen name="Main" component={MainStack} />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FoldersProvider>
      <RecipesProvider>
        <PaperProvider>
          <AppNavigator />
        </PaperProvider>
      </RecipesProvider>
    </FoldersProvider>
    </AuthProvider>
    
  );
}

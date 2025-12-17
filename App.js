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
import { FoldersProvider } from './context/FoldersContext';
import { RecipesProvider } from './context/RecipesContext';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthContext, AuthProvider } from './context/AuthContext'; 

const Stack = createStackNavigator();

export function AppStack() {
  const { userToken, tryLocalLogin } = useContext(AuthContext); 
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
        {userToken == null ? (
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
      <FoldersProvider>
      <RecipesProvider>
        <PaperProvider>
          {/*AppStack component manages all navigation */}
          <AppStack />
        </PaperProvider>
      </RecipesProvider>
    </FoldersProvider>
    </AuthProvider>
  );
}

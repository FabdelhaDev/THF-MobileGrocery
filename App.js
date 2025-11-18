import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabsNavigator from './navigation/TabsNavigator';
import SignInScreen from './screens/SignInScreen';
import FoldersScreen from './screens/FoldersScreen';
import ListScreen from './screens/ListScreen';
import ItemScreen from './screens/ItemScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="SignIn" component={SignInScreen} />
                <Stack.Screen name="Tabs" component={TabsNavigator} />
                <Stack.Screen name="FolderScreen" component={FoldersScreen} />
                <Stack.Screen name="ListScreen" component={ListScreen} />
                <Stack.Screen name="ItemScreen" component={ItemScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
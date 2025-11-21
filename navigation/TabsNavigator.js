import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SettingsScreen from '../screens/SettingsScreen';
import FoldersTab from '../tabs/FoldersTab';
import RecipesTab from '../tabs/RecipesTab';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();

export default function TabsNavigator() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator>
        <Tab.Screen name="Folders" component={FoldersTab} />
        <Tab.Screen name="Recipes" component={RecipesTab} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

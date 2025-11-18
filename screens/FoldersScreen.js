import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native';


export default function FolderScreen() {
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20 }}>Folder</Text>
            <TouchableOpacity
                style={{ padding: 10, marginTop: 20, backgroundColor: '#ccc', borderRadius: 8 }}
                onPress={() => navigation.navigate('ListScreen')}
            >
                <Text>Go to List</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{ padding: 10, marginTop: 20, backgroundColor: "#ccc", borderRadius: 8 }}
                onPress={() => navigation.goBack()}
            >
                <Text>Back</Text>
            </TouchableOpacity>
        </View>
    );
}
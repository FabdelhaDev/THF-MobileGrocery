import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native';

export default function FoldersTab() {
    const navigation = useNavigation();

    return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20 }}>Folders</Text>
            <TouchableOpacity
                style={{ padding: 10, marginTop: 20, backgroundColor: '#ccc', borderRadius: 8 }}
                onPress={() => navigation.navigate('FolderScreen')}
        >
                <Text>Go to Folder</Text>
            </TouchableOpacity>
        </View>
    );
}
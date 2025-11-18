import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native';

export default function ListScreen() {
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20 }}>List</Text>
            <TouchableOpacity
                style={{ padding: 10, marginTop: 20, backgroundColor: '#ccc', borderRadius: 8 }}
                onPress={() => navigation.navigate('ItemScreen')}
            >
                <Text>Go to Item</Text>
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

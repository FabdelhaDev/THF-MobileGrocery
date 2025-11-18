import { Text, TouchableOpacity, View } from 'react-native';

export default function ItemScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20 }}>Item</Text>
                <TouchableOpacity
                style={{ padding: 10, marginTop: 20, backgroundColor: "#ccc", borderRadius: 8 }}
                onPress={() => navigation.goBack()}
            >
                <Text>Back</Text>
            </TouchableOpacity>
        </View>
        
    );
}
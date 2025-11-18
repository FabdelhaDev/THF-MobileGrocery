import { Text, TouchableOpacity, View } from 'react-native';

export default function SignInScreen({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Sign In</Text>
                <TouchableOpacity
                style={{ padding: 12, backgroundColor: '#ddd', borderRadius: 8 }}
                onPress={() => navigation.navigate('Tabs')}
            >
                <Text>Sign In</Text>
            </TouchableOpacity>
        </View>
    );
}
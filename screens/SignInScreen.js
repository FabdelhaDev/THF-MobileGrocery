import React, { useState } from 'react';
import { Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';

export default function SignInScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    if (!username || !password) {
      Alert.alert('Info', 'Please enter a username and password');
      return;
    }
    navigation.navigate('Tabs');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 20 }}>Sign In</Text>

      <Text style={{ fontSize: 14, color: 'gray', marginBottom: 4 }}>
        Username (not real, any input works)
      </Text>
      <TextInput
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
        style={{
          width: '100%',
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
        }}
      />

      <Text style={{ fontSize: 14, color: 'gray', marginBottom: 4 }}>
        Password (not real, any input works)
      </Text>
      <TextInput
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry 
        style={{
          width: '100%',
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        style={{ padding: 14, backgroundColor: '#ddd', borderRadius: 8, width: '100%', alignItems: 'center' }}
        onPress={handleSignIn}
      >
        <Text style={{ fontWeight: '600' }}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

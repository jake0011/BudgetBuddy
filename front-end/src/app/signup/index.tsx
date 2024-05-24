import { Link } from 'expo-router';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const SignupScreen: React.FC = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleSignup = () => {
        // signup logic here
    };

    return (
        <View className="flex-1 justify-center items-center bg-gray-800">
            <Text className="text-2xl font-bold mb-4 color-slate-500">Sign Up</Text>
            <TextInput
                className="w-64 h-10 border border-gray-300 rounded px-2 mb-2"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                className="w-64 h-10 border border-gray-300 rounded px-2 mb-2"
                placeholder="Password"
                inlineImageLeft='password_icon'
                secureTextEntry
                value={password}
                enablesReturnKeyAutomatically
                onChangeText={setPassword}
            />
            <Link href="/" asChild>
            <TouchableOpacity
                className="w-64 h-10 border border-gray-300 rounded px-2 mb-2"
                onPress={handleSignup}
            >
                <Text className="text-white text-center my-3 justify-center">Sign Up</Text>
            </TouchableOpacity>
            </Link>
        </View>
    );
};

export default SignupScreen;
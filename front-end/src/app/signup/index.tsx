import { Link } from 'expo-router';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const SignupScreen: React.FC = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');




    const handleSignup = () => {
        // signup logic here
    };

{/* Use ReactHookForm to make the form handling better */}

    return (
        <View className="flex-1 justify-center gap-1 items-center bg-gray-800">
            <Text className="text-3xl font-bold mb-4 color-slate-200">BudgetBuddy Sign Up</Text>
            <TextInput
                className="w-64 h-10 border border-gray-300 placeholder:text-white rounded px-2 mb-2"
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                className="w-64 h-10 border border-gray-300 placeholder:text-white rounded px-2 mb-2"
                placeholder="Last one Name"
                value={lastName}
                onChangeText={setLastName}
            />
            <TextInput
                className="w-64 h-10 border border-gray-300 placeholder:text-white rounded px-2 mb-2"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                className="w-64 h-10 border border-gray-300 placeholder:text-white rounded px-2 mb-2"
                placeholder="Password"
                inlineImageLeft='password_icon'
                secureTextEntry
                value={password}
                enablesReturnKeyAutomatically
                onChangeText={setPassword}
            />
             <TextInput
                className="w-64 h-10 border border-gray-300 placeholder:text-white rounded px-2 mb-2"
                placeholder="Re-enter Password"
                inlineImageLeft='password_icon'
                secureTextEntry
                value={password}
                enablesReturnKeyAutomatically
                onChangeText={setPassword}
            />
            <Link href="/" asChild className='justify-center my-4'>
            <TouchableOpacity
                className="w-64 h-14 bg-slate-600 border border-gray-300 rounded-2xl px-2 mb-2"
                onPress={handleSignup}
            >
                <Text className="text-white text-center text-xl py-3 justify-center">Sign Up</Text>
            </TouchableOpacity>
            </Link>
        </View>
    );
};

export default SignupScreen;
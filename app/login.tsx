import { useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
    const [phone, setPhone] = useState('');

    const sendOTP = () => {
        if (!phone) {
        if (Platform.OS === 'web') {
            window.alert('Please enter your phone number');
        } else {
            Alert.alert('Error', 'Please enter your phone number');
        }
        return;
    }
    if (Platform.OS === 'web') {
        window.alert(`OTP sent to ${phone} (mock)`);
    } else {
        Alert.alert('Success', `OTP sent to ${phone} (mock)`);
    }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login Here</Text>
            <TextInput
                style={styles.input}
                placeholder="+1 234 567 8900"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
            />
            <TouchableOpacity style={styles.button} onPress={sendOTP}>
                <Text style={styles.buttonText}>Send OTP</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        maxWidth: 300,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#2563EB',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

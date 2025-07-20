import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth } from '../firebaseConfig'; // Make sure this exports initialized Firebase auth

export default function EmailAuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'User registered!');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'This email is already registered. Please login instead.');
        setIsSigningUp(false); // Switch to login mode automatically if you want
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };
  
  

  const handleLogin = async () => {
    console.log("Login button pressed");
  
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
  
    try {
      console.log("Attempting login with:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login success:", userCredential.user);
      Alert.alert('Success', 'Logged in!');
    } catch (error: any) {
      console.log("Login error:", error.code, error.message);
      Alert.alert('Error', error.message);
    }
  };
  
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSigningUp ? 'Sign Up' : 'Login'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={isSigningUp ? handleSignUp : handleLogin}
      >
        <Text style={styles.buttonText}>{isSigningUp ? 'Sign Up' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setIsSigningUp(!isSigningUp)}
        style={{ marginTop: 16 }}
      >
        <Text style={{ color: '#2563EB' }}>
          {isSigningUp
            ? 'Already have an account? Login'
            : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 20
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20
  },
  input: {
    width: '80%',
    maxWidth: 300,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
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

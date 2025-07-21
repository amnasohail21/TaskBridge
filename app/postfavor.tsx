import { useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../firebaseConfig';

export default function PostFavorScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handlePost = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const user = auth.currentUser;

      await addDoc(collection(db, 'favors'), {
        title,
        description,
        location: {
          lat: 43.6532,
          lng: -79.3832,
        },
        createdAt: new Date(),
        status: 'open',
        postedBy: user?.email || 'unknown',
      });

      Alert.alert('Success', 'Favor posted!');
      setTitle('');
      setDescription('');

      //  Redirect to favor feed
      router.replace('/favor'); 
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not post favor');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Post a Favor</Text>
      <TextInput
        style={styles.input}
        placeholder="Favor title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Favor description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handlePost}>
        <Text style={styles.buttonText}>Submit Favor</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#300330',
    padding: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

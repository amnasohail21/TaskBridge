import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
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
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchLocation() {
      if (Platform.OS === 'web') {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              setLocation({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              });
              console.log('Web location set:', pos.coords);
            },
            (err) => {
              console.warn('Web geolocation error:', err);
              Alert.alert('Location Error', 'Unable to fetch location on web.');
            }
          );
        } else {
          console.warn('Geolocation not supported in this browser');
          Alert.alert('Location Error', 'Geolocation not supported in browser.');
        }
      } else {
        // Native apps
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Permission to access location was denied');
          Alert.alert('Permission Denied', 'Cannot get location permission.');
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          lat: loc.coords.latitude,
          lng: loc.coords.longitude,
        });
        console.log('Native location set:', loc.coords);
      }
    }
    fetchLocation();
  }, []);

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
        location: location || null,
        createdAt: new Date(),
        status: 'open',
        postedBy: user?.email || 'unknown',
      });

      Alert.alert('Success', 'Favor posted!');
      setTitle('');
      setDescription('');
      router.replace('/favor'); // Redirect to favor feed screen
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

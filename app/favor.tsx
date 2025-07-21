import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import {
  collection,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../firebaseConfig';

export default function FavorFeedScreen() {
  const [favors, setFavors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      const fetchFavors = async () => {
        try {
          const favorSnapshot = await getDocs(collection(db, 'favors'));
          const favorList = favorSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFavors(favorList);
        } catch (error) {
          console.error('Error fetching favors:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchFavors();
    }, [])
  );

  const handleAcceptFavor = async (favorId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in to accept a favor.');
        return;
      }

      const favorRef = doc(db, 'favors', favorId);
      await updateDoc(favorRef, {
        status: 'in_progress',
        acceptedBy: user.email,
      });

      Alert.alert('Favor accepted!', 'You have taken up the favor.');

      const favorSnapshot = await getDocs(collection(db, 'favors'));
      const favorList = favorSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavors(favorList);
    } catch (error) {
      console.error('Error accepting favor:', error);
      Alert.alert('Error', 'Could not accept favor.');
    }
  };

  const handleCompleteFavor = async (favorId: string) => {
    try {
      const favorRef = doc(db, 'favors', favorId);
      await updateDoc(favorRef, {
        status: 'completed',
      });
      Alert.alert('Success', 'Favor marked as completed.');

      const favorSnapshot = await getDocs(collection(db, 'favors'));
      const favorList = favorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFavors(favorList);
    } catch (error) {
      console.error('Error completing favor:', error);
      Alert.alert('Error', 'Could not complete favor.');
    }
  };

  const renderFavor = ({ item }: { item: any }) => {
    const user = auth.currentUser;
    const isPoster = user?.email === item.postedBy;

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.details}>{item.description}</Text>

        {item.status === 'completed' ? (
          <Text style={styles.completedText}>✅ Completed</Text>
        ) : item.status === 'in_progress' ? (
          <Text style={styles.inProgress}>
            In Progress by: {item.acceptedBy || 'Someone'}
          </Text>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAcceptFavor(item.id)}
          >
            <Text style={styles.buttonText}>I'll do it</Text>
          </TouchableOpacity>
        )}

        {isPoster && item.status === 'in_progress' && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#059669', marginTop: 8 }]}
            onPress={() => handleCompleteFavor(item.id)}
          >
            <Text style={styles.buttonText}>Mark as Completed</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={favors}
        keyExtractor={item => item.id}
        renderItem={renderFavor}
        contentContainerStyle={{ padding: 16 }}
      />

      <TouchableOpacity
        style={[styles.button, { marginHorizontal: 16, marginTop: 20 }]}
        onPress={() => router.push('/postfavor')}
      >
        <Text style={styles.buttonText}>Post a Favor</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { marginHorizontal: 16, marginTop: 10 }]}
        onPress={() => router.push('/profile')}
      >
        <Text style={styles.buttonText}>Go to Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  details: { fontSize: 14, color: '#4B5563', marginTop: 4 },
  button: {
    marginTop: 5,
    backgroundColor: '#2563EB',
    paddingVertical: 6,
    borderRadius: 4,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  inProgress: {
    marginTop: 8,
    fontStyle: 'italic',
    color: '#F59E0B',
    fontSize: 14,
  },
  completedText: {
    marginTop: 8,
    color: '#10B981',
    fontWeight: '600',
  },
});

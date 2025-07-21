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
  Pressable,
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
          <Pressable
            android_ripple={{ color: '#bbdefb' }}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => handleAcceptFavor(item.id)}
          >
            <Text style={styles.buttonText}>I'll do it</Text>
          </Pressable>
        )}

        {isPoster && item.status === 'in_progress' && (
          <Pressable
            android_ripple={{ color: '#34d399' }}
            style={[styles.button, styles.completeButton]}
            onPress={() => handleCompleteFavor(item.id)}
          >
            <Text style={styles.buttonText}>Mark as Completed</Text>
          </Pressable>
        )}
      </View>
    );
  };

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} color="#2563EB" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={favors}
        keyExtractor={item => item.id}
        renderItem={renderFavor}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footerButtons}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/postfavor')}
        >
          <Text style={styles.primaryButtonText}>Post a Favor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/profile')}
        >
          <Text style={styles.secondaryButtonText}>Go to Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },

  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },

  title: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 6 },
  details: { fontSize: 15, color: '#4B5563', marginBottom: 14 },

  button: {
    backgroundColor: '#3B82F6', // blue-500
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonPressed: {
    backgroundColor: '#2563EB', // darker blue on press
  },
  completeButton: {
    backgroundColor: '#10B981', // green-500
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  inProgress: {
    marginTop: 8,
    fontStyle: 'italic',
    color: '#F59E0B', // amber-500
    fontSize: 14,
  },
  completedText: {
    marginTop: 8,
    color: '#10B981', // green-500
    fontWeight: '600',
    fontSize: 16,
  },

  footerButtons: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  primaryButton: {
    backgroundColor: '#2563EB',
    flex: 1,
    marginRight: 10,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  secondaryButton: {
    backgroundColor: '#E5E7EB',
    flex: 1,
    marginLeft: 10,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 16,
  },
});

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  StatusBar 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import SwipeableSongCard from '../../../components/SwipeableSongCard';

export default function Playlist() {
  const params = useLocalSearchParams() as { playlistObject? : string };
  const playlistData = params.playlistObject ? JSON.parse(params.playlistObject) : null;
  const router = useRouter();
  
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  
  // Mock song data
  const songs = [
    {
      id: '1',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      album: 'A Night at the Opera',
      duration: '5:55',
    },
    {
      id: '2',
      title: 'Hotel California',
      artist: 'Eagles',
      album: 'Hotel California',
      duration: '6:30',
    },
    {
      id: '3',
      title: 'Imagine',
      artist: 'John Lennon',
      album: 'Imagine',
      duration: '3:07',
    },
    {
      id: '4',
      title: 'Stairway to Heaven',
      artist: 'Led Zeppelin',
      album: 'Led Zeppelin IV',
      duration: '8:02',
    },
    {
      id: '5',
      title: 'Sweet Child O\' Mine',
      artist: 'Guns N\' Roses',
      album: 'Appetite for Destruction',
      duration: '5:56',
    },
  ];

  const handleSwipeLeft = () => {
    // Delete song
    console.log('Song deleted:', songs[currentSongIndex]);
    nextSong();
  };

  const handleSwipeRight = () => {
    // Keep song
    console.log('Song kept:', songs[currentSongIndex]);
    nextSong();
  };

  const handleDelete = () => {
    handleSwipeLeft();
  };

  const handleKeep = () => {
    handleSwipeRight();
  };

  const nextSong = () => {
    if (currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else {
      // No more songs
      console.log('No more songs to review');
    }
  };

  const goBack = () => {
    router.back();
  };

  if (currentSongIndex >= songs.length) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <View style={styles.completedContainer}>
          <Text style={styles.completedTitle}>Review Complete!</Text>
          <Text style={styles.completedSubtitle}>
            You've reviewed all songs in {name}
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>← Back to Playlists</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.playlistName}>{name}</Text>
          <Text style={styles.songCounter}>
            {currentSongIndex + 1} of {songs.length}
          </Text>
        </View>
      </View>

      {/* Swipeable Song Card */}
      <SwipeableSongCard
        song={songs[currentSongIndex]}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        onDelete={handleDelete}
        onKeep={handleKeep}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  backButton: {
    marginRight: 16,
  },
  backIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  playlistName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  songCounter: {
    fontSize: 14,
    color: '#b3b3b3',
    marginTop: 2,
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  completedTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  completedSubtitle: {
    fontSize: 16,
    color: '#b3b3b3',
    textAlign: 'center',
    marginBottom: 32,
  },
  backButtonText: {
    fontSize: 16,
    color: '#1DB954',
    fontWeight: '600',
  },
});
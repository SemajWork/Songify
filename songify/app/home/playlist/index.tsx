import React, { useState, useEffect, useRef} from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import SwipeableSongCard from '../../../components/SwipeableSongCard';
import * as SecureStore from 'expo-secure-store';

export default function Playlist() {
  const params = useLocalSearchParams() as { playlistObject? : string };
  const playlistData = params.playlistObject ? JSON.parse(params.playlistObject) : null;
  const router = useRouter();
  
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // song data for playlist
  const [songs,setSongs]= useState<any[]>([]);
  useEffect(()=>{
    const fetchSongs = async () =>{
      try{
        const playlist_id = playlistData.id;
        let allSongs: any[] = [];
        let offset = 0;
        let hasMore = true;
        while (hasMore){
          const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks?limit=100&offset=${offset}`,{
          headers:{
            'Authorization': `Bearer ${await SecureStore.getItemAsync('access_token')}`
            }
          });
          if(!response.ok){
            throw new Error('Failed to fetch playlist');
          }
          const data = await response.json();
          allSongs = [...allSongs, ...data.items];
          hasMore = data.next !== null;
          offset += 100;
        }

        setSongs(allSongs || []);
        setIsLoading(false);
      }catch(error){
        console.error('Error fetching songs',error);
        setIsLoading(false);
      }
    };
    fetchSongs();
  }, [playlistData.id])

  const shakeAnimation = useRef(new Animated.Value(0)).current;
  
  const startShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation,{
        toValue: 0.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation,{
        toValue: -0.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation,{
        toValue: 0.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation,{
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Loop the animation while loading
      if (isLoading) {
        startShake();
      }
    });
  }

  // Start shaking when loading begins
  useEffect(() => {
    if (isLoading) {
      startShake();
    }
  }, [isLoading]);
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
  if(isLoading){
    return(
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingTitle}>Loading Playlist...</Text>
          <Text style={styles.loadingSubtitle}>
            Fetching songs from {playlistData?.name}
          </Text>
          <View style={styles.loadingSpinner}>
           <Animated.Text 
             style={[styles.loadingText,
               {
                 transform: [{ rotate: shakeAnimation.interpolate({
                   inputRange: [-1, 1],
                   outputRange: ['-30deg', '30deg']
                 })}]
               }
             ]}>
             ⏳
           </Animated.Text>
        </View>
        </View>
      </SafeAreaView>
    )
  }
  if (currentSongIndex >= songs.length && isLoading === false) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <View style={styles.completedContainer}>
          <Text style={styles.completedTitle}>Review Complete!</Text>
          <Text style={styles.completedSubtitle}>
            You've reviewed all songs in {playlistData.name}
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
          <Text style={styles.playlistName}>{playlistData.name}</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 16,
    color: '#b3b3b3',
    textAlign: 'center',
    marginBottom: 32,
  },
  loadingSpinner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 24,
  },
});
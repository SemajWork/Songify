import React, { useRef, useEffect} from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  Animated,
  Image 
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import {useAudioPlayer} from 'expo-audio';

interface SwipeableSongCardProps {
  song: {
    track: {
      name: string;
      artists: Array<{ name: string }>;
      album: {
        name: string;
        images: Array<{ url: string }>;
      };
      duration_ms: number;
      preview_url: string;
    };
  };
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.05;


export default function SwipeableSongCard({ 
  song, 
  onSwipeLeft, 
  onSwipeRight
}: SwipeableSongCardProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const songPlay = useAudioPlayer(song.track.preview_url,{updateInterval: 1000, downloadFirst: true});

  useEffect(()=>{
    const toPlay = () => {
      if (song.track.preview_url !== null){
        songPlay.play();
      }
    }
    toPlay();
  }, [songPlay])
  
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === 5) { // END state
      const { translationX } = event.nativeEvent;
      
      if (translationX > SWIPE_THRESHOLD) {
        // Swipe right - Keep
        Animated.timing(translateX, {
          toValue: width,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          onSwipeRight();
          resetPosition();
        });
      } else if (translationX < -SWIPE_THRESHOLD) {
        // Swipe left - Delete
        Animated.timing(translateX, {
          toValue: -width,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          onSwipeLeft();
          resetPosition();
        });
      } else {
        // Return to center
        resetPosition();
      }
    }
  };

  const resetPosition = () => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }),
      
    ]).start();
  };

  const animateDelete = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      
    ]).start(() => {
      onSwipeLeft();
      resetPosition();
    });
  };

  const animateKeep = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      
    ]).start(() => {
      onSwipeRight();
      resetPosition();
    });
  };

  const rotateInterpolate = translateX.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ['-30deg', '0deg', '30deg'],
  });

  const opacityInterpolate = translateX.interpolate({
    inputRange: [-width, -width * 0.5, 0, width * 0.5, width],
    outputRange: [0.5, 0.7, 1, 0.7, 0.5],
  });

  return (
    <View style={styles.container}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.card,
            {
              transform: [
                { translateX },
                { translateY },
                { rotate: rotateInterpolate },
              ],
              opacity: opacityInterpolate,
            },
          ]}
        >
          {/* Full Card Background Image */}
          <View style={styles.cardBackground}>
            {song.track?.album?.images?.[0]?.url ? (
              <Image
                source={{ uri: song.track.album.images[0].url }}
                style={styles.fullCardImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imageText}>♪</Text>
              </View>
            )}
            {/* Dark overlay for text readability */}
            <View style={styles.imageOverlay} />
          </View>

          {/* Song Info - positioned over image */}
          <View style={styles.songInfoOverlay}>
            <Text style={styles.songTitle} numberOfLines={2}>
              {song.track?.name}
            </Text>
            <Text style={styles.songArtist} numberOfLines={1}>
              {song.track?.artists?.[0]?.name}
            </Text>
            <Text style={styles.songAlbum} numberOfLines={1}>
              {song.track?.album?.name}
            </Text>
            
          </View>

        </Animated.View>
      </PanGestureHandler>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.deleteButton} onPress={animateDelete}>
          <Text style={styles.buttonText}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.keepButton} onPress={animateKeep}>
          <Text style={styles.buttonText}>✓</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width * 0.9,
    height: height * 0.6,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  cardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    overflow: 'hidden',
  },
  fullCardImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    fontSize: 80,
    color: '#000',
    fontWeight: 'bold',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  songInfoOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  songArtist: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  songAlbum: {
    fontSize: 16,
    color: '#e0e0e0',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  songDuration: {
    fontSize: 14,
    color: '#ccc',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  swipeIndicators: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  indicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    opacity: 0.8,
  },
  keepIndicator: {
    backgroundColor: '#1DB954',
  },
  deleteIndicator: {
    backgroundColor: '#ff4444',
  },
  indicatorText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.7,
    marginTop: 30,
  },
  deleteButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keepButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

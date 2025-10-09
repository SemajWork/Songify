import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';

interface PlaylistCardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  onPress: () => void;
  isLarge?: boolean;
  type?: 'playlist' | 'album' | 'liked' | 'folder';
}

const { width } = Dimensions.get('window');

export default function PlaylistCard({ 
  title, 
  description, 
  imageUrl, 
  onPress, 
  isLarge = false,
  type = 'playlist'
}: PlaylistCardProps) {
  const cardWidth = isLarge ? width * 0.45 : width * 0.9;
  const cardHeight = isLarge ? 200 : 80;

  const getIconForType = () => {
    switch (type) {
      case 'liked':
        return '♡';
      case 'folder':
        return '📁';
      case 'album':
        return '♪';
      default:
        return '♪';
    }
  };

  const getGradientColors = () => {
    switch (type) {
      case 'liked':
        return ['#8B5CF6', '#1DB954'];
      case 'folder':
        return ['#535353', '#404040'];
      default:
        return ['#1DB954', '#1ed760'];
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { width: cardWidth, height: cardHeight }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.card, { height: cardHeight }]}>
        {/* Playlist Image */}
        <View style={[styles.imageContainer, { height: isLarge ? 140 : 60 }]}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          ) : (
            <View style={[styles.gradientImage, { backgroundColor: getGradientColors()[0] }]}>
              <Text style={styles.playlistIcon}>{getIconForType()}</Text>
            </View>
          )}
        </View>

        {/* Playlist Info */}
        <View style={[styles.infoContainer, { height: isLarge ? 60 : 20 }]}>
          <Text style={[styles.title, { fontSize: isLarge ? 16 : 14 }]} numberOfLines={1}>
            {title}
          </Text>
          {description && (
            <Text style={[styles.description, { fontSize: isLarge ? 12 : 11 }]} numberOfLines={1}>
              {description}
            </Text>
          )}
        </View>

        {/* Play Button Overlay for Large Cards */}
        {isLarge && (
          <View style={styles.playButtonContainer}>
            <View style={styles.playButton}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#181818',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  imageContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradientImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    color: '#b3b3b3',
    fontWeight: '400',
  },
  playButtonContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  playIcon: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 2,
  },
});

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';

interface PlaylistItemProps {
  title: string;
  description: string;
  imageUrl?: string;
  onPress: () => void;
  type?: 'playlist' | 'album' | 'liked' | 'folder';
  showArrow?: boolean;
}

const { width } = Dimensions.get('window');

export default function PlaylistItem({ 
  title, 
  description, 
  imageUrl, 
  onPress,
  type = 'playlist',
  showArrow = false
}: PlaylistItemProps) {
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
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.item}>
        {/* Left Image/Icon */}
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          ) : (
            <View style={[styles.gradientImage, { backgroundColor: getGradientColors()[0] }]}>
              <Text style={styles.icon}>{getIconForType()}</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
        </View>

        {/* Arrow */}
        {showArrow && (
          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>›</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#181818',
    borderRadius: 8,
  },
  imageContainer: {
    width: 60,
    height: 60,
    marginRight: 16,
    borderRadius: 8,
    overflow: 'hidden',
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
  icon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#b3b3b3',
  },
  arrowContainer: {
    marginLeft: 8,
  },
  arrow: {
    fontSize: 20,
    color: '#b3b3b3',
    fontWeight: 'bold',
  },
});

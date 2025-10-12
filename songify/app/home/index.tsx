import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TextInput, Button, Image, TouchableOpacity, Modal} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import PlaylistItem from '../../components/PlaylistItem';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';

export default function Index() {
  const router = useRouter();
  const [name,setName] = useState<string>('Joe')
  const [windowOpen, setWindowOpen] = useState<boolean>(false);
  const {width,height} = Dimensions.get("window");
  const [searchQuery, setSearchQuery] = useState<string>('')
  // Data matching the Spotify playlist menu from your image
  const playlistData = [
    {
      id: '1',
      title: 'Liked Songs',
      description: 'Playlist • 7,343 songs',
      type: 'liked' as const,
      onPress: () => router.push('/home/playlist?name=Liked Songs'),
    },
    {
      id: '2',
      title: 'My Favorite Playlists',
      description: '• 2 playlists',
      type: 'folder' as const,
      showArrow: true,
      onPress: () => router.push('/home/playlist?name=My Favorite Playlists'),
    },
    {
      id: '3',
      title: 'Matt Suda: JAMS',
      description: '• Playlist • Matt Suda',
      type: 'playlist' as const,
      imageUrl: undefined, // You can add actual image URLs here
      onPress: () => router.push('/home/playlist?name=Matt Suda: JAMS'),
    },
    {
      id: '4',
      title: 'Matt Suda: Collection',
      description: '• Playlist • Matt Suda',
      type: 'playlist' as const,
      imageUrl: undefined,
      onPress: () => router.push('/home/playlist?name=Matt Suda: Collection'),
    },
    {
      id: '5',
      title: 'How To Be Human',
      description: 'Album • Chelsea Cutler',
      type: 'album' as const,
      imageUrl: undefined,
      onPress: () => router.push('/home/playlist?name=How To Be Human'),
    },
    {
      id: '6',
      title: 'How it Used to Feel',
      description: 'Album • Phoebe Ryan',
      type: 'album' as const,
      imageUrl: undefined,
      onPress: () => router.push('/home/playlist?name=How it Used to Feel'),
    },
    {
      id: '7',
      title: 'A Letter To My Younger Self',
      description: 'Album • Quinn XCII',
      type: 'album' as const,
      imageUrl: undefined,
      onPress: () => router.push('/home/playlist?name=A Letter To My Younger Self'),
    },
  ];

  // Filter playlists based on search query
  const filteredPlaylistData = playlistData.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const logout = () => { //logs you out by deleting the tokens from the secure store
    SecureStore.deleteItemAsync('access_token');
    SecureStore.deleteItemAsync('refresh_token');
    SecureStore.deleteItemAsync('expires_at');
    router.replace('/');
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.pinnedTop}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {name}</Text>
          <TouchableOpacity onPress={()=>setWindowOpen(!windowOpen)}>
            <Image source={require("../../assets/images/gear-icon-9.png")} style={{width:width*0.07, height: height*0.03}}/>
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.searchInput}
            placeholder="Search playlist"
            placeholderTextColor="#b3b3b3"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      <Modal visible={windowOpen} transparent={true} animationType="fade" onRequestClose={()=>setWindowOpen(false)}>
        <TouchableOpacity 
          activeOpacity={1}
          onPress={()=>setWindowOpen(false)}
          style={{
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={{
              backgroundColor: '#282828',
              borderRadius: 16,
              padding: 20,
              width: 280,
              alignItems: 'center',
            }}>
              <Text style={{color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 20}}>
                Settings
              </Text>
              
              {/* Help Button */}
              <TouchableOpacity 
                onPress={() => {
                  setWindowOpen(false);
                  // Navigate to help or show help
                }}
                style={{
                  backgroundColor: '#1DB954',
                  padding: 14,
                  borderRadius: 24,
                  width: '100%',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Help</Text>
              </TouchableOpacity>
              
              {/* Logout Button */}
              <TouchableOpacity 
                onPress={() => {
                  setWindowOpen(false);
                  logout();
                }}
                style={{
                  backgroundColor: '#ff4444',
                  padding: 14,
                  borderRadius: 24,
                  width: '100%',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Logout</Text>
              </TouchableOpacity>
              
              {/* Cancel Button */}
              <TouchableOpacity 
                onPress={() => setWindowOpen(false)}
                style={{
                  backgroundColor: '#404040',
                  padding: 14,
                  borderRadius: 24,
                  width: '100%',
                  alignItems: 'center',
                }}
              >
                <Text style={{color: '#fff', fontSize: 16}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      
      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.playlistContainer}>
          {filteredPlaylistData.map((item) => (
            <PlaylistItem
              key={item.id}
              title={item.title}
              description={item.description}
              imageUrl={item.imageUrl}
              type={item.type}
              showArrow={item.showArrow}
              onPress={item.onPress}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  playlistContainer: {
    paddingHorizontal: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
  },
  pinnedTop: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#121212',
  },
});
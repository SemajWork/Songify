import { Button } from "@react-navigation/elements";
import { Text, View, TextInput, StyleSheet, Dimensions, TouchableOpacity, Linking, Alert, Platform} from "react-native";
import { Image } from 'expo-image';
import { useRouter } from "expo-router";
import {useState, useEffect} from 'react'
import { useSpotifyAuth, isExpired } from '../components/authService';
import * as SecureStore from 'expo-secure-store';

export default function Index() {
  const [userInput,setUserInput] = useState<string>("")
  const {width,height} = Dimensions.get("window");

  const router = useRouter();
  const { request, response, promptAsync } = useSpotifyAuth();

  // Check if user is already logged in on mount
  useEffect(() => {
    var attempts = 0;
    const checkAuthStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token');
        if (token) {
          const expired = await isExpired();
          if(expired){
            router.replace('/');
          }else{
            router.replace('/home');
          }
        }else{
          attempts++;
          if (attempts < 10){
            setTimeout(checkAuthStatus,500);
          }
        }
      }catch (error) {
        console.error('Error checking auth status:', error);
      }
    };
    checkAuthStatus();
  }, [response]);

  const handleLogin = async () => {
    try {
      await promptAsync();
    } catch (error) {
      Alert.alert('Login Failed', 'Please try again');
    }
  }
  
  const redirect = (link: string) => {
    if (Platform.OS === 'web') {
      // On web, open link directly (window.open works in browser)
      if (typeof window !== 'undefined') {
        window.open(link, '_blank');
      }
    } else {
      // On mobile, show alert confirmation
      Alert.alert(
        `Warning you are about to be redirected to: ${link} `,
        'Are you sure you want to proceed',
        [
          {
            text: 'No',
            style: 'cancel'
          },
          {
            text: 'Yes',
            onPress: () => Linking.openURL(link)
          },
        ],
      );
    }
  };
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor:"white",
        width: '100%'
      }}
    >  
      <View style={{marginTop: 60, flexDirection:"row", alignItems: "center", justifyContent: "center"}}>
        <Image source={require("../assets/images/MusicIcon.png")} style={{width: 60, height: 60, marginRight: 10}} resizeMode="contain"/>
        <Text style={{
          fontWeight:'bold',
          color:"black",
          fontSize: 50
        }}>Songify</Text>
      </View>
      <View style={{marginTop: 40, alignItems: 'center'}}>
        <Text style={{
          fontWeight:'bold',
          color:"black",
          fontSize: 20
        }}>Try Songify Today</Text>
      </View>
      <View style={{marginTop: 16, width: width*0.8, alignItems: 'center', paddingHorizontal: 20}}>
        <Text style={{
          fontWeight:'bold',
          color:"gray",
          fontSize: 20,
          textAlign:'center'
        }}>Edit your playlists with the swipe of a finger</Text>
      </View>
      <View style={{marginTop: 60, alignItems: 'center'}}>
        <TouchableOpacity style={{
          flexDirection:"row",
          alignItems:'center',
          justifyContent:"center",
          width:width*0.8,
          minHeight: 50,
          paddingVertical: 12,
          backgroundColor:'#1DB954',
          borderRadius:24,
        }} onPress={handleLogin} disabled={!request}>
          <Image source={require("../assets/images/Spotify-icon-black-png-large-size.png")} style={{height: 30, width: 30, marginRight: 10}} resizeMode="contain"/>
          <Text style={{fontSize:22,fontWeight:"medium", color: 'black'}}>Continue with Spotify</Text>
        </TouchableOpacity>
      </View>
      
      <View style={{marginTop: 80, alignItems: 'center'}}>
        <Text style={{color:"black", fontSize:15}}>Like what you see? Follow me!</Text>
      </View>
      <View style={{flexDirection: "row", marginTop: 16, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity onPress={() => 
          redirect("https://github.com/SemajWork")} style={{marginRight: 20}}>
          <Image source={require("../assets/images/github.png")} style={{width: 50, height: 50}} resizeMode="contain"/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => redirect("https://www.linkedin.com/in/james-ma-3b7b71345/")}>
          <Image source={require("../assets/images/linkedin.png")} style={{width: 50, height: 50}} resizeMode="contain"/>
        </TouchableOpacity>
      </View>
      
    </View>
  );
}

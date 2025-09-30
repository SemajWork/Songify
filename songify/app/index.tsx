import { Button } from "@react-navigation/elements";
import { Text, View, TextInput, StyleSheet, Dimensions, Image,TouchableOpacity} from "react-native";
import { useRouter } from "expo-router";
import {useState} from 'react'


export default function Index() {
  const [userInput,setUserInput] = useState<string>("")
  const {width,height} = Dimensions.get("window");

  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor:"black"
      }}
    >  
      <View style={{marginTop:height*0.2}}>
        <Text style={{
          fontWeight:'bold',
          color:"white",
          fontSize: 50
        }}>Songify</Text>
      </View>
      <View style={{marginTop:height*0.1}}>
        
        <Text style={{
          fontWeight:'bold',
          color:"white",
          fontSize: 20
        }}>Try Songify Today</Text>
      </View>
      <View style={{marginTop:height*0.01}}>
        <Text style={{
          fontWeight:'bold',
          color:"gray",
          fontSize: 20,
          justifyContent:'center',
          alignContent:"center",
          width:width*0.6,
          textAlign:'center'
        }}>Edit your playlists with the swipe of a finger</Text>
      </View>
      <View style={{marginTop:height*0.15}}>
        <TouchableOpacity style={{
          flexDirection:"row",
          alignItems:'center',
          justifyContent:"center",
          width:width*0.8,
          height: height*0.05,
          backgroundColor:'#1DB954',
          borderRadius:24,
        }} onPress={()=>router.replace('/home')}>
          <Image source={require("../assets/images/Spotify-icon-black-png-large-size.png")} style={{height:height*0.03, width: width*0.07, marginRight: 20}}/>
          <Text style={{fontSize:22,fontWeight:"medium"}}>Continue with Spotify</Text>
        </TouchableOpacity>
      </View>
      
      <View style={{marginTop: height*0.2, }}>
        <Text style={{color:"white", fontSize:15}}>Like what you see? Follow me!</Text>
      </View>
      
    </View>
  );
}

import { Button } from "@react-navigation/elements";
import { Text, View, TextInput, StyleSheet, Dimensions } from "react-native";
import {useState} from 'react'


export default function Index() {
  const [userInput,setUserInput] = useState<string>("")
  const {width,height} = Dimensions.get("window");
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
        }}>Log in to Songify</Text>
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
        <Button onPress={()=>alert(userInput)} style={{
        width: width*0.8,
        height: height*0.05,
        backgroundColor:'#1DB954',
        alignContent:"center",
        justifyContent:"center"
      }} color="black">Continue with Spotify</Button>  
      </View>
      
      <View style={{marginTop: height*0.2, }}>
        <Text style={{color:"white", fontSize:15}}>Like what you see? Follow me!</Text>
      </View>
      
    </View>
  );
}

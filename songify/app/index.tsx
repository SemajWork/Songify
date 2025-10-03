import { Button } from "@react-navigation/elements";
import { Text, View, TextInput, StyleSheet, Dimensions, Image,TouchableOpacity, Linking, Alert} from "react-native";
import { useRouter } from "expo-router";
import {useState} from 'react'


export default function Index() {
  const [userInput,setUserInput] = useState<string>("")
  const {width,height} = Dimensions.get("window");

  const router = useRouter();
  const promptLogin = async () =>{
    
  }
  const redirect = (link: string) => {
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
  };
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor:"white"
      }}
    >  
      <View style={{marginTop:height*0.2,flexDirection:"row", alignItems: "center"}}>
        <Image source={require("../assets/images/MusicIcon.png")} style={{width:width*0.11,height:height*0.05, marginRight:width*0.02}}/>
        <Text style={{
          fontWeight:'bold',
          color:"black",
          fontSize: 50
        }}>Songify</Text>
      </View>
      <View style={{marginTop:height*0.1}}>
        
        <Text style={{
          fontWeight:'bold',
          color:"black",
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
          <Image source={require("../assets/images/Spotify-icon-black-png-large-size.png")} style={{height:height*0.03, width: width*0.07, marginRight: width*0.05}}/>
          <Text style={{fontSize:22,fontWeight:"medium"}}>Continue with Spotify</Text>
        </TouchableOpacity>
      </View>
      
      <View style={{marginTop: height*0.2, }}>
        <Text style={{color:"black", fontSize:15}}>Like what you see? Follow me!</Text>
      </View>
      <View style={{flexDirection: "row", marginTop: 10}}>
        <TouchableOpacity onPress={() => 
          redirect("https://github.com/SemajWork")} style={{marginRight: 20}}>
          <Image source={require("../assets/images/github.png")} style={{width: 50, height: 50}}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => redirect("https://www.linkedin.com/in/james-ma-3b7b71345/")}>
          <Image source={require("../assets/images/linkedin.png")} style={{width: 50, height: 50}}/>
        </TouchableOpacity>
      </View>
      
    </View>
  );
}

import { Text, View, Dimensions } from 'react-native'
import { useRouter } from 'expo-router';
import { useState } from 'react'

export default function Index() {
  const arr = ['song1', 'song2', 'song3', 'song4', 'song5']
  const {width,height} = Dimensions.get("window");
  const route = useRouter();
  const redirect = () => {

  }
  return (
    <View style={{flex:1,alignItems:"center"}}>
      <View style={{flexDirection:"column"}}>
        {arr.map((element, index) => (
          <Text key={index} style={{
            overflowY: "hidden", padding: width*0.05, backgroundColor:"#1DB954",
            borderRadius: 12, borderColor:"#191414", borderWidth: 2,
            marginTop: height*0.01, width:width*0.9, textAlign:"center",
            
          }} onPress={()=>route.push(`/home/playlist?name=${encodeURIComponent(element)}`)}>{element}</Text>
        ))}
      </View>
    </View>
  )
}
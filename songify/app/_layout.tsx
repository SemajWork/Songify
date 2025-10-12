import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {useURL} from 'expo-linking';
import {useEffect} from 'react';
export default function RootLayout() {
  const url = useURL();
  useEffect(()=>{
    
  })
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack> 
        <Stack.Screen name="index" options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen name="home" options={{headerShown:false}}></Stack.Screen>
      </Stack>
    </GestureHandlerRootView>
  );
}

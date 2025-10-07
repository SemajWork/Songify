import { Stack } from "expo-router";


export default function RootLayout() {
  return (
    
      <Stack> 
        <Stack.Screen name="index" options={{headerShown: false,headerStyle:{backgroundColor:"white"}}}></Stack.Screen>
        <Stack.Screen name="home" options={{headerShown:false}}></Stack.Screen> {/* Will be my homepage */}
      </Stack>
    
  );
}

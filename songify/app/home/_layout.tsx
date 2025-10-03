import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <>
      <Stack> 
        <Stack.Screen name="index" options={{title: 'Home',headerStyle:{backgroundColor:"white"}}}></Stack.Screen>
        <Stack.Screen name="playlist" options={{headerShown:false}}></Stack.Screen> {/* Will be my homepage */}
      </Stack>
    </>
);
}

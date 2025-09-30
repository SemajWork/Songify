import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <>
      <Stack> 
        <Stack.Screen name="index" options={{headerShown: false,headerStyle:{backgroundColor:"black"}}}></Stack.Screen>
        <Stack.Screen name="home" options={{headerLeft: () => null}}></Stack.Screen> {/* Will be my homepage */}
      </Stack>
    </>
);
}

import { Stack } from "expo-router";
import { useLocalSearchParams, useRouter } from "expo-router";
import { TouchableOpacity,Text } from "react-native";


export default function RootLayout() {
    const params = useLocalSearchParams() as { name?: string }
    const name = params?.name ?? 'Playlist'
    const router = useRouter()
    function BackButton(){
        return(
            <TouchableOpacity onPress={()=> router.back()}>
                <Text>Back</Text>
            </TouchableOpacity>
        )
    }
    return (
    <>
      <Stack> 
        <Stack.Screen name="index" options={{headerLeft: () => <BackButton/> ,title: name,headerBackButtonDisplayMode: 'default',headerShown: false,headerStyle:{backgroundColor:"white"}}}></Stack.Screen>
      </Stack>
    </>
);
}

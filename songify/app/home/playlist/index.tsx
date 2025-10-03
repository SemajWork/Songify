import React from 'react'
import { Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

export default function Playlist() {
  const params = useLocalSearchParams() as { name?: string }
  const name = params?.name ?? 'Playlist'

  return (
    <View>
      <Text>{name}</Text>
    </View>
  )
}
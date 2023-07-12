import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MainScreen from './src/screens/MainScreen'
import SettingsScreen from './src/screens/SettingsScreen'
import WinnerScreen from './src/screens/WinnerScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Stack = createNativeStackNavigator()

const App = () => {
  useEffect(() => {
    const clearSelectedWinners = async () => {
      await AsyncStorage.removeItem('selectedWinners')
    }

    clearSelectedWinners()
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Home'
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name='Home' component={MainScreen} />
        <Stack.Screen name='Settings' component={SettingsScreen} />
        <Stack.Screen name='Winner' component={WinnerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App

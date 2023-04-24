import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Main from './src/Main'
import Settings from './src/Settings'
import Winner from './src/Winner'

const Stack = createNativeStackNavigator()

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Home'
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name='Home' component={Main} />
        <Stack.Screen name='Settings' component={Settings} />
        <Stack.Screen name='Winner' component={Winner} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App

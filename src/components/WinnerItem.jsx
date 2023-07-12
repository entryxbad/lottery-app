import React from 'react'
import { Text } from 'react-native'

const WinnerItem = ({ item, index }) => (
  // Отображение списка участников
  <Text className='text-white text-4xl pt-12' key={item.phone}>
    {index + 1}) {item.name}: {item.phone}
  </Text>
)

export default WinnerItem

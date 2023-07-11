import React, { useState, useEffect } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'
import RNFS from 'react-native-fs'
import { filePath } from './utils/dataOperations'

const backgroundImage = require('./assets/screens/settings.jpg')

const Settings = ({ navigation }) => {
  const [regAmount, setRegAmount] = useState('')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    async function fetchData() {
      const lengthData = JSON.parse(await RNFS.readFile(filePath))
      setRegAmount(lengthData.length)
    }
    fetchData()
  }, [])

  const handleSave = () => {
    if (amount === '') {
      Alert.alert('Ошибка', 'Необходимо указать количество участников')
    } else if (parseInt(amount) === 0) {
      Alert.alert('Ошибка', 'Количество участников не может равняться 0.')
    } else if (parseInt(amount) < 0) {
      Alert.alert(
        'Ошибка',
        'Количество участников не может быть отрицательным.'
      )
    } else if (regAmount >= parseInt(amount)) {
      navigation.navigate('Winner', { amount: amount })
    } else {
      Alert.alert(
        'Ошибка',
        'Количество победителей не может больше количества участников.'
      )
    }
  }

  // Обработчик изменения количества победителей
  const handleNameInput = (text) => {
    setAmount(text)
  }

  return (
    <ImageBackground
      source={backgroundImage}
      className='flex-1'
      resizeMode='cover'
    >
      <View className='flex-1 items-center justify-center'>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View className='items-center'>
            <Text className='text-white text-5xl mb-12'>
              Введите количество победителей
            </Text>
            <Text className='text-white text-4xl mt-12'>
              Всего участников: {regAmount}
            </Text>
            <TextInput
              className='bg-white rounded-xl m-3 text-center text-3xl w-16'
              value={amount}
              keyboardType='numeric'
              onChangeText={handleNameInput}
            />
            <TouchableOpacity
              className='bg-[#071d4f] rounded-xl p-3 mt-12 w-96 items-center'
              onPress={handleSave}
            >
              <Text className='text-white text-4xl p-1'>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </ImageBackground>
  )
}

export default Settings

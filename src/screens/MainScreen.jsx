import React, { useState, useEffect } from 'react'
import {
  Alert,
  ImageBackground,
  Text,
  TextInput,
  TouchableHighlight,
  Keyboard,
  TouchableWithoutFeedback,
  AppState,
  View
} from 'react-native'

import MaskInput from 'react-native-mask-input'
import SettingsIcon from 'react-native-vector-icons/SimpleLineIcons'
import AwardIcon from 'react-native-vector-icons/FontAwesome5'
import { checkPhoneNumber, checkPersonExists } from '../utils/functions'
import { saveDataToFile, loadDataFromFile } from '../utils/dataOperations'
import {
  handleInputFocus,
  playSound,
  playThanksSound,
  stopSound,
  stopSoundAnotherScreen
} from '../utils/player'

const backgroundImage = require('../assets/screens/main.jpg')

const MainScreen = ({ navigation }) => {
  const [persons, setPersons] = useState([])
  const [name, setName] = useState()
  const [phone, setPhone] = useState()
  const [organization, setOrganization] = useState()
  const [post, setPost] = useState()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const [appState, setAppState] = useState(AppState.currentState)
  const [isForeground, setIsForeground] = useState(true)

  const handleAppStateChange = (nextAppState) => {
    setAppState(nextAppState)
    setIsForeground(nextAppState === 'active')
  }

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange)

    return () => {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [])

  const handlePressOnDisplay = () => {
    Keyboard.dismiss()
    if (!isForeground && isPlaying) {
      stopSound(setIsPlaying)
    }
  }

  useEffect(() => {
    if (isForeground && navigation.isFocused()) {
      setTimeout(() => {
        playSound()
        setIsPlaying(true)
      }, 500)
    } else if (isPlaying) {
      stopSound(setIsPlaying)
    }

    return () => {
      stopSound(setIsPlaying)
    }
  }, [isForeground, navigation.isFocused()])

  const handleChange = (maskedValue, unmaskedValue) => {
    if (unmaskedValue.length > 0 && unmaskedValue[0] === '8') {
      setPhone(
        '+7 ' +
          unmaskedValue.slice(1, 4) +
          ' ' +
          unmaskedValue.slice(4, 7) +
          '-' +
          unmaskedValue.slice(7, 9) +
          '-' +
          unmaskedValue.slice(9, 11)
      )
    } else {
      setPhone(maskedValue)
    }
  }

  const handleSubmit = async () => {
    if (!name || !phone || !organization || !post) {
      Alert.alert('Ошибка', 'Пожалуйста. Заполните все поля.')
      return
    }

    if (!phone || !checkPhoneNumber(phone)) {
      Alert.alert('Ошибка', 'Некорректный номер телефона.')
      return
    }

    setIsFormSubmitted(true)
    stopSound(setIsPlaying, () => {
      playThanksSound()
      setTimeout(() => {
        setIsFormSubmitted(false)
        playSound()
        setIsPlaying(true)
      }, 5000)
    })

    const newPerson = {
      id: persons.length,
      name: name,
      phone: phone,
      organization: organization,
      post: post
    }

    // Проверка наличия пользователя с таким номером телефона
    if (persons.some((person) => person.phone === phone)) {
      Alert.alert(
        'Ошибка',
        'Пользователь с таким номером телефона уже существует.'
      )
      return
    }

    // Добавление нового пользователя в список пользователей
    setPersons((prevPersons) => [...prevPersons, newPerson])

    // Загрузка данных из файла
    const data = await loadDataFromFile()

    // Проверка наличия пользователя с таким номером телефона в файле
    if (await checkPersonExists(data, phone)) {
      return
    }

    // Добавление нового пользователя в файл
    data.push(newPerson)

    await saveDataToFile(data)

    Alert.alert('Спасибо за участие.')
    setName('')
    setPhone('')
    setOrganization('')
    setPost('')
  }

  return (
    <ImageBackground
      source={backgroundImage}
      className='flex-1'
      resizeMode='cover'
    >
      <TouchableWithoutFeedback onPress={handlePressOnDisplay}>
        <View className='flex-1 justify-center items-center bg-backgroundShadow'>
          <TouchableHighlight className='absolute right-10 top-10'>
            <AwardIcon
              onPress={() => {
                stopSoundAnotherScreen()
                navigation.navigate('Winner')
              }}
              name='award'
              color='white'
              size={70}
            />
          </TouchableHighlight>
          <TouchableHighlight className='absolute left-10 top-10'>
            <SettingsIcon
              onPress={() => {
                stopSoundAnotherScreen()
                navigation.navigate('Settings')
              }}
              name='settings'
              color='white'
              size={70}
            />
          </TouchableHighlight>
          <Text className='color-white text-7xl mb-12'>Заполните поля</Text>
          <TextInput
            className='bg-white rounded-xl w-[50%] py-4 text-xl mb-3'
            value={name}
            onChangeText={(newName) => setName(newName)}
            placeholder='Ваше имя'
            onFocus={handleInputFocus}
          ></TextInput>
          <MaskInput
            className='bg-white rounded-xl w-[50%] py-4 text-xl mb-3'
            keyboardType='numeric'
            placeholder='+7 (___) ___-__-__'
            value={phone}
            onChangeText={handleChange}
            onFocus={handleInputFocus}
            mask={[
              '+',
              '7',
              ' ',
              '(',
              /\d/,
              /\d/,
              /\d/,
              ')',
              ' ',
              /\d/,
              /\d/,
              /\d/,
              '-',
              /\d/,
              /\d/,
              '-',
              /\d/,
              /\d/
            ]}
          />
          <TextInput
            className='bg-white rounded-xl w-[50%] py-4 text-xl mb-3'
            value={organization}
            onChangeText={(newOrganization) => setOrganization(newOrganization)}
            placeholder='Название организации'
            onFocus={handleInputFocus}
          ></TextInput>
          <TextInput
            className='bg-white rounded-xl w-[50%] py-4 text-xl mb-3'
            value={post}
            onChangeText={(newPost) => setPost(newPost)}
            placeholder='Ваша должность'
            onFocus={handleInputFocus}
          ></TextInput>
          <TouchableHighlight
            className='bg-[#00e0f5] rounded-xl mt-8 w-[30%] items-center'
            onPress={handleSubmit}
          >
            <Text className='color-white text-4xl p-4'>Записать</Text>
          </TouchableHighlight>
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  )
}

export default MainScreen

import React, { useState, useEffect } from 'react'
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  Keyboard,
  TouchableWithoutFeedback,
  useWindowDimensions,
  AppState,
  View
} from 'react-native'

import MaskInput from 'react-native-mask-input'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import { checkPhoneNumber, checkPersonExists } from './utils/functions'
import { saveDataToFile, loadDataFromFile } from './utils/dataOperations'
import {
  handleInputFocus,
  playSound,
  playThanksSound,
  stopSound,
  stopSoundAnotherScreen
} from './utils/player'

const backgroundImage = require('./assets/screens/main.jpg')

const Main = ({ navigation }) => {
  const { styles } = useStyle()
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
    console.log('first')
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
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <TouchableWithoutFeedback onPress={handlePressOnDisplay}>
        <KeyboardAvoidingView className='flex-1 justify-center items-center'>
          <TouchableHighlight>
            <Icon
              onPress={() => {
                stopSoundAnotherScreen()
                navigation.navigate('Settings')
              }}
              style={styles.settings}
              name='settings'
              size={70}
            ></Icon>
          </TouchableHighlight>
          <Text style={styles.title}>Заполните поля</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(newName) => setName(newName)}
            placeholder='Ваше имя'
            onFocus={handleInputFocus}
          ></TextInput>
          <MaskInput
            style={styles.input}
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
            style={styles.input}
            value={organization}
            onChangeText={(newOrganization) => setOrganization(newOrganization)}
            placeholder='Название организации'
            onFocus={handleInputFocus}
          ></TextInput>
          <TextInput
            style={styles.input}
            value={post}
            onChangeText={(newPost) => setPost(newPost)}
            placeholder='Ваша должность'
            onFocus={handleInputFocus}
          ></TextInput>
          <TouchableHighlight style={styles.btn} onPress={handleSubmit}>
            <Text style={styles.btnText}>Записать</Text>
          </TouchableHighlight>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  )
}

export default Main

const useStyle = () => {
  const { height, width } = useWindowDimensions()

  const styles = StyleSheet.create({
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: width,
      height: height
    },
    title: {
      fontSize: width * 0.05,
      marginBottom: 50,
      color: '#fff'
    },
    input: {
      backgroundColor: '#fff',
      margin: 10,
      borderRadius: 10,
      width: width * 0.5,
      height: height * 0.08,
      fontSize: width * 0.015
    },
    btn: {
      width: width * 0.3,
      backgroundColor: '#00e0f5',
      borderRadius: 10,
      alignItems: 'center',
      padding: 10,
      marginTop: 50
    },
    btnText: {
      fontSize: width * 0.03,
      color: '#fff'
    },
    settings: {
      position: 'absolute',
      color: '#fff',
      left: width * 0.42,
      bottom: height * -0.02,
      fontSize: width * 0.05
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover'
    }
  })
  return { styles }
}

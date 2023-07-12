import { useState, useEffect } from 'react'
import { Alert, Keyboard, AppState } from 'react-native'

import { saveDataToFile, loadDataFromFile } from '../dataOperations'
import { playSound, playThanksSound, stopSound } from '../player'

const useMainScreenLogic = ({ navigation }) => {
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

    if (!phone || phone.length < 18) {
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

    // Добавление нового пользователя в список пользователей
    setPersons((prevPersons) => [...prevPersons, newPerson])

    // Загрузка данных из файла
    const data = await loadDataFromFile()

    // Проверка наличия пользователя с таким номером телефона в файле
    const personExists = data.some((person) => person.phone === phone)
    if (personExists) {
      Alert.alert('Пользователь с таким номером телефона уже существует.')
      return true
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

  return {
    name,
    setName,
    phone,
    organization,
    setOrganization,
    post,
    setPost,
    handlePressOnDisplay,
    handleChange,
    handleSubmit
  }
}

export default useMainScreenLogic

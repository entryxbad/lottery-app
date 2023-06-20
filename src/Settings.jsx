import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  ImageBackground,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'
import RNFS from 'react-native-fs'
import { filePath } from './utils/dataOperations'

const backgroundImage = require('./assets/screens/settings.jpg')

const Settings = ({ navigation }) => {
  const { styles } = useStyle()
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
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.wrapper}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView style={styles.wrapper} behavior='padding'>
            <Text style={styles.title}>Введите количество победителей</Text>
            <Text style={styles.text}>Всего участников: {regAmount}</Text>
            <TextInput
              style={styles.input}
              value={amount}
              keyboardType='numeric'
              onChangeText={handleNameInput}
            />
            <TouchableOpacity style={styles.btn} onPress={handleSave}>
              <Text style={styles.btnText}>Сохранить</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    </ImageBackground>
  )
}

export default Settings

const useStyle = () => {
  const { height, width } = useWindowDimensions()

  const styles = StyleSheet.create({
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: width,
      height: height,
      backgroundColor: 'rgba(0,0,0,0.3)'
    },
    title: {
      fontSize: width * 0.04,
      marginBottom: 50,
      color: '#fff'
    },
    btn: {
      width: width * 0.3,
      backgroundColor: '#071d4f',
      borderRadius: 10,
      alignItems: 'center',
      padding: 10,
      marginTop: 50
    },
    btnText: {
      fontSize: width * 0.03,
      color: '#fff'
    },
    text: {
      fontSize: width * 0.028,
      color: '#fff',
      marginTop: 50
    },
    input: {
      backgroundColor: '#fff',
      margin: 10,
      borderRadius: 10,
      width: width * 0.05,
      height: height * 0.1,
      backgroundColor: '#d9d9db',
      textAlign: 'center',
      fontSize: height * 0.05
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover'
    }
  })
  return { styles }
}

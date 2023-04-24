import React, { useState, useRef } from 'react'
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  ImageBackground
} from 'react-native'
import Confetti from 'react-native-confetti'
import RNFS from 'react-native-fs'
import { filePath } from './utils/dataOperations'

const backgroundImage = require('./assets/screens/winner.jpg')

const Winner = ({ route }) => {
  const { styles } = useStyle()
  const [data, setData] = useState([])
  const [isButtonVisible, setIsButtonVisible] = useState(true)
  const confettiRef = useRef(null)
  const { amount } = route.params

  // Функция получения случайных победителей
  const getRandom = async () => {
    setIsButtonVisible(false)
    const data = JSON.parse(await RNFS.readFile(filePath))

    let result = []

    while (result.length != amount) {
      const random = Math.floor(Math.random() * data.length)
      result.push(data[random])
      result = result.filter((v, i, arr) => arr.indexOf(v) == i)
    }

    if (confettiRef.current) {
      confettiRef.current.startConfetti()
      setTimeout(() => {
        confettiRef.current.stopConfetti()
      }, 10000)
    }

    setData(result)
    return result
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.wrapper}>
        {isButtonVisible && (
          <TouchableOpacity style={styles.btn} onPress={getRandom}>
            <Text style={styles.btnText}>Разыграть</Text>
          </TouchableOpacity>
        )}
        <Confetti ref={confettiRef} />
        {data.length > 0 && (
          <View style={styles.wrapper}>
            <Text style={styles.title}>Поздравляем победителей!</Text>
            {data.map((item, index) => (
              <Text style={styles.text} key={index}>
                {index + 1}) {item.name}: {item.phone}
              </Text>
            ))}
          </View>
        )}
      </View>
    </ImageBackground>
  )
}

export default Winner

const useStyle = () => {
  const { height, width } = useWindowDimensions()

  const styles = StyleSheet.create({
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: width,
      height: height,
      backgroundColor: 'rgba(0,0,0,0.25)'
    },
    title: {
      textAlign: 'center',
      fontSize: width * 0.04,
      marginBottom: 50,
      color: '#fff'
    },
    btn: {
      width: width * 0.3,
      backgroundColor: '#4a2f26',
      borderRadius: 10,
      alignItems: 'center',
      padding: 10,
      marginTop: 10
    },
    btnText: {
      fontSize: width * 0.03,
      color: '#fff'
    },
    text: {
      textAlign: 'left',
      fontSize: width * 0.028,
      color: '#fff',
      marginTop: 50
    },
    input: {
      backgroundColor: '#fff',
      margin: 10,
      borderRadius: 10,
      width: width * 0.5
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover'
    }
  })
  return { styles }
}

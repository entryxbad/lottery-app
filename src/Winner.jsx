import React, { useState, useRef, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  BackHandler
} from 'react-native'
import Confetti from 'react-native-confetti'
import RNFS from 'react-native-fs'
import { filePath } from './utils/dataOperations'

const backgroundImage = require('./assets/screens/winner.jpg')

const Winner = ({ route }) => {
  const { styles } = useStyle()
  const [data, setData] = useState([])
  const [isButtonVisible, setIsButtonVisible] = useState(true)
  const [isConfettiPlaying, setIsConfettiPlaying] = useState(false)
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
      setIsConfettiPlaying(true)
      confettiRef.current.startConfetti()
      setTimeout(() => {
        confettiRef.current.stopConfetti()
        setIsConfettiPlaying(false)
      }, 10000)
    }

    setData(result)
    return result
  }

  const onBackButtonPress = () => {
    if (isConfettiPlaying) {
      return true // не вернётся назад пока проигрывается анимация
    }
    return false // можно выйти по кнопке "назад" после анимации
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackButtonPress)
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', onBackButtonPress)
  }, [isConfettiPlaying])

  const renderItem = ({ item, index }) => (
    <Text style={styles.text} key={item.phone}>
      {data.length - index}) {item.name}: {item.phone}
    </Text>
  )

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
            <FlatList
              data={data}
              keyExtractor={(item) => item.phone.toString()}
              renderItem={renderItem}
              ListFooterComponent={
                <View style={{ height: 20, paddingBottom: 30 }} />
              }
            />
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
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: width,
      height: height,
      backgroundColor: 'rgba(0,0,0,0.3)'
    },
    title: {
      textAlign: 'center',
      fontSize: width * 0.04,
      paddingTop: 20,
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
      paddingTop: 50
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

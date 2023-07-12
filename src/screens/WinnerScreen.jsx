import React, { useState, useRef, useEffect } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  BackHandler
} from 'react-native'
import Confetti from 'react-native-confetti'
import RNFS from 'react-native-fs'
import { filePath } from '../utils/dataOperations'

const backgroundImage = require('../assets/screens/winner.jpg')

const WinnerScreen = ({ route }) => {
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
    <Text className='text-white text-4xl pt-12' key={item.phone}>
      {data.length - index}) {item.name}: {item.phone}
    </Text>
  )

  return (
    <ImageBackground
      source={backgroundImage}
      className='flex-1'
      resizeMode='cover'
    >
      <View className='flex-1 items-center justify-center bg-backgroundShadow'>
        {isButtonVisible && (
          <TouchableOpacity
            className='bg-[#006b7d] rounded-xl w-96 items-center'
            onPress={getRandom}
          >
            <Text className='text-white text-4xl py-5'>Разыграть</Text>
          </TouchableOpacity>
        )}
        <Confetti ref={confettiRef} />
        {data.length > 0 && (
          <View className='flex-1 items-center'>
            <Text className='text-white text-6xl pt-12'>
              Поздравляем победителей!
            </Text>
            <FlatList
              data={data}
              keyExtractor={(item) => item.phone.toString()}
              renderItem={renderItem}
              ListFooterComponent={<View className='h-5 pb-8' />}
            />
          </View>
        )}
      </View>
    </ImageBackground>
  )
}

export default WinnerScreen

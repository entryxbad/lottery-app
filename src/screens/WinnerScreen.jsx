import React, { useEffect } from 'react'
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  BackHandler,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native'
import Confetti from 'react-native-confetti'
import { useRandomWinners } from '../utils/hooks'
import WinnerItem from '../components/WinnerItem'

const backgroundImage = require('../assets/screens/winner.jpg')

const WinnerScreen = () => {
  const {
    amount,
    setAmount,
    getRandomWinners,
    winners,
    isConfettiPlaying,
    confettiRef,
    regAmount
  } = useRandomWinners()

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

  return (
    <ImageBackground
      source={backgroundImage}
      className='flex-1'
      resizeMode='cover'
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View className='flex-1 items-center justify-center bg-backgroundShadow'>
          {winners.length === 0 && (
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
                onChangeText={setAmount}
              />
              <TouchableOpacity
                className='bg-[#071d4f] rounded-xl p-3 mt-12 w-96 items-center'
                onPress={getRandomWinners}
              >
                <Text className='text-white text-4xl p-1'>Разыграть</Text>
              </TouchableOpacity>
            </View>
          )}
          {winners.length > 0 && (
            <View className='flex-1 items-center'>
              <Text className='text-white text-6xl pt-12'>
                Поздравляем победителей!
              </Text>
              <FlatList
                data={winners}
                keyExtractor={(item) => item.phone.toString()}
                renderItem={({ item, index }) => (
                  <WinnerItem item={item} index={index} />
                )}
                ListFooterComponent={<View className='h-5 pb-8' />}
              />
            </View>
          )}
          <Confetti ref={confettiRef} />
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  )
}

export default WinnerScreen

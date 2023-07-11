import React, { useState, useEffect, useRef } from 'react'
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  BackHandler,
  Alert,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'
import Confetti from 'react-native-confetti'
import RNFS from 'react-native-fs'
import { filePath } from './utils/dataOperations'
import AsyncStorage from '@react-native-async-storage/async-storage'

const backgroundImage = require('./assets/screens/winner.jpg')

const Settings = () => {
  const [regAmount, setRegAmount] = useState(0)
  const [amount, setAmount] = useState('')
  const [winners, setWinners] = useState([])
  const [isConfettiPlaying, setIsConfettiPlaying] = useState(false)
  const confettiRef = useRef(null)
  const [selectedWinners, setSelectedWinners] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const data = JSON.parse(await RNFS.readFile(filePath))
      setRegAmount(data.length)
    }
    fetchData()
  }, [])

  const getRandomWinners = async () => {
    if (amount === '') {
      Alert.alert('Ошибка', 'Необходимо указать количество победителей')
      return
    }

    const data = JSON.parse(await RNFS.readFile(filePath))

    if (data.length < parseInt(amount)) {
      Alert.alert(
        'Ошибка',
        'Количество победителей не может быть больше количества участников.'
      )
      return
    }

    const selectedWinnersFromStorage = await AsyncStorage.getItem(
      'selectedWinners'
    )
    const prevSelectedWinners = selectedWinnersFromStorage
      ? JSON.parse(selectedWinnersFromStorage)
      : []
    const remainingData = data.filter(
      (item) =>
        !prevSelectedWinners.some(
          (prevWinner) => prevWinner.phone === item.phone
        )
    )

    const shuffledData = [...remainingData].sort(() => Math.random() - 0.5)
    const selectedWinners = shuffledData.slice(0, parseInt(amount))

    setIsConfettiPlaying(true)
    confettiRef.current.startConfetti()
    setTimeout(() => {
      confettiRef.current.stopConfetti()
      setIsConfettiPlaying(false)
    }, 10000)

    setWinners(selectedWinners)
    setSelectedWinners([...prevSelectedWinners, ...selectedWinners])
    await AsyncStorage.setItem(
      'selectedWinners',
      JSON.stringify([...prevSelectedWinners, ...selectedWinners])
    )
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
      {index + 1}) {item.name}: {item.phone}
    </Text>
  )

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
                renderItem={renderItem}
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

export default Settings

// import React, { useState, useEffect, useRef } from 'react'
// import {
//   Text,
//   TextInput,
//   View,
//   TouchableOpacity,
//   ImageBackground,
//   FlatList,
//   BackHandler
// } from 'react-native'
// import Confetti from 'react-native-confetti'
// import RNFS from 'react-native-fs'
// import { filePath } from './utils/dataOperations'

// const backgroundImage = require('./assets/screens/winner.jpg')

// const Settings = () => {
//   const [regAmount, setRegAmount] = useState(0)
//   const [amount, setAmount] = useState('')
//   const [winners, setWinners] = useState([])
//   const [isConfettiPlaying, setIsConfettiPlaying] = useState(false)
//   const confettiRef = useRef(null)
//   const [selectedWinners, setSelectedWinners] = useState([])

//   useEffect(() => {
//     const fetchData = async () => {
//       const data = JSON.parse(await RNFS.readFile(filePath))
//       setRegAmount(data.length)
//     }
//     fetchData()
//   }, [])

//   const getRandomWinners = async () => {
//     if (amount === '') {
//       Alert.alert('Ошибка', 'Необходимо указать количество победителей')
//       return
//     }

//     const data = JSON.parse(await RNFS.readFile(filePath))

//     if (data.length < parseInt(amount)) {
//       Alert.alert(
//         'Ошибка',
//         'Количество победителей не может быть больше количества участников.'
//       )
//       return
//     }

//     const shuffledData = [...data].sort(() => Math.random() - 0.5)
//     const remainingData = shuffledData.filter(
//       (item) => !selectedWinners.find((winner) => winner.phone === item.phone)
//     )
//     const newWinners = shuffledData.slice(0, parseInt(amount))
//     setSelectedWinners([...selectedWinners, ...newWinners])

//     setIsConfettiPlaying(true)
//     confettiRef.current.startConfetti()
//     setTimeout(() => {
//       confettiRef.current.stopConfetti()
//       setIsConfettiPlaying(false)
//     }, 10000)

//     setWinners(newWinners)
//   }

//   const onBackButtonPress = () => {
//     if (isConfettiPlaying) {
//       return true // не вернётся назад пока проигрывается анимация
//     }
//     return false // можно выйти по кнопке "назад" после анимации
//   }

//   useEffect(() => {
//     BackHandler.addEventListener('hardwareBackPress', onBackButtonPress)
//     return () =>
//       BackHandler.removeEventListener('hardwareBackPress', onBackButtonPress)
//   }, [isConfettiPlaying])

//   const renderItem = ({ item, index }) => (
//     <Text className='text-white text-4xl pt-12' key={item.phone}>
//       {index + 1}) {item.name}: {item.phone}
//     </Text>
//   )

//   return (
//     <ImageBackground
//       source={backgroundImage}
//       className='flex-1'
//       resizeMode='cover'
//     >
//       <View className='flex-1 items-center justify-center bg-backgroundShadow'>
//         {winners.length === 0 && (
//           <View className='items-center'>
//             <Text className='text-white text-5xl mb-12'>
//               Введите количество победителей
//             </Text>
//             <Text className='text-white text-4xl mt-12'>
//               Всего участников: {regAmount}
//             </Text>
//             <TextInput
//               className='bg-white rounded-xl m-3 text-center text-3xl w-16'
//               value={amount}
//               keyboardType='numeric'
//               onChangeText={setAmount}
//             />
//             <TouchableOpacity
//               className='bg-[#071d4f] rounded-xl p-3 mt-12 w-96 items-center'
//               onPress={getRandomWinners}
//             >
//               <Text className='text-white text-4xl p-1'>Разыграть</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//         {winners.length > 0 && (
//           <View className='flex-1 items-center'>
//             <Text className='text-white text-6xl pt-12'>
//               Поздравляем победителей!
//             </Text>
//             <FlatList
//               data={winners}
//               keyExtractor={(item) => item.phone.toString()}
//               renderItem={renderItem}
//               ListFooterComponent={<View className='h-5 pb-8' />}
//             />
//           </View>
//         )}
//         <Confetti ref={confettiRef} />
//       </View>
//     </ImageBackground>
//   )
// }

// export default Settings

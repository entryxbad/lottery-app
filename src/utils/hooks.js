import { useState, useEffect, useRef } from 'react'
import RNFS from 'react-native-fs'
import { filePath } from './dataOperations'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert } from 'react-native'

const useRandomWinners = () => {
  const [regAmount, setRegAmount] = useState(0)
  const [amount, setAmount] = useState('')
  const [winners, setWinners] = useState([])
  const [isConfettiPlaying, setIsConfettiPlaying] = useState(false)
  const [selectedWinners, setSelectedWinners] = useState([])
  const confettiRef = useRef(null)

  // Получение общего количества участников
  useEffect(() => {
    const fetchData = async () => {
      const data = JSON.parse(await RNFS.readFile(filePath))
      setRegAmount(data.length)
    }
    fetchData()
  }, [])

  const getRandomWinners = async () => {
    // Функция getRandomWinners выполняется при нажатии на кнопку "Разыграть".

    if (amount === '') {
      Alert.alert('Ошибка', 'Необходимо указать количество победителей')
      return
    }
    // Сначала проверяется, указано ли количество победителей. Если не указано, выводится сообщение об ошибке.

    const data = JSON.parse(await RNFS.readFile(filePath))

    if (data.length < parseInt(amount)) {
      Alert.alert(
        'Ошибка',
        'Количество победителей не может быть больше количества участников.'
      )
      return
    }
    // Затем читаются данные участников из файла. Если количество победителей превышает общее количество участников, выводится сообщение об ошибке.

    const selectedWinnersFromStorage = await AsyncStorage.getItem(
      'selectedWinners'
    )
    const prevSelectedWinners = selectedWinnersFromStorage
      ? JSON.parse(selectedWinnersFromStorage)
      : []
    // Загружаются предыдущие выбранные победители из хранилища.

    const remainingData = data.filter(
      (item) =>
        !prevSelectedWinners.some(
          (prevWinner) =>
            prevWinner.name === item.name && prevWinner.phone === item.phone
        )
    )
    // Фильтруются данные участников, исключая тех, кто уже выбран в предыдущих розыгрышах.

    if (remainingData.length === 0) {
      Alert.alert('Внимание', 'Участников, не принимавших участия, не осталось')
      return
    }
    // Если остались участники для выбора, они перемешиваются и выбираются указанное количество победителей.

    const shuffledData = [...remainingData].sort(() => Math.random() - 0.5)
    const selectedWinners = shuffledData.slice(0, parseInt(amount))

    setIsConfettiPlaying(true)
    confettiRef.current.startConfetti()
    setTimeout(() => {
      confettiRef.current.stopConfetti()
      setIsConfettiPlaying(false)
    }, 10000)
    // Включается анимация конфетти на заданное время.

    setWinners(selectedWinners)
    setSelectedWinners([...prevSelectedWinners, ...selectedWinners])
    await AsyncStorage.setItem(
      'selectedWinners',
      JSON.stringify([...prevSelectedWinners, ...selectedWinners])
    )
    // Обновляются состояния winners и selectedWinners, сохраняются данные в хранилище.
  }

  return {
    amount,
    setAmount,
    getRandomWinners,
    winners,
    isConfettiPlaying,
    confettiRef,
    regAmount
  }
}

export { useRandomWinners }

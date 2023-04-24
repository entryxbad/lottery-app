import { Alert } from 'react-native'

export const checkPhoneNumber = (phoneNumber) => {
  return phoneNumber.length >= 10
}

export const checkPersonExists = async (data, phone) => {
  const personExists = data.some((person) => person.phone === phone)
  if (personExists) {
    Alert.alert('Пользователь с таким номером телефона уже существует.')
    return true
  }
  return false
}

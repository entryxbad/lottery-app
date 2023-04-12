import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

const RNFS = require('react-native-fs');
const path = RNFS.ExternalDirectoryPath + '/data.txt';

export const DATA_STORAGE_KEY = 'save-data';

export const setData = async (key, value) => {
  try {
    const objValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, objValue);
  } catch (error) {
    console.log('Ошибка сохранения в локальное хранилище');
  }
};

export const getData = async (key) => {
  try {
    const objValue = await AsyncStorage.getItem(key);
    return objValue != null ? JSON.parse(objValue) : null;
  } catch (error) {
    console.log('Ошибка чтения данных');
  }
};

export const saveData = async () => {
  RNFS.writeFile(path, JSON.stringify(await getData(DATA_STORAGE_KEY)), 'utf8')
    .then((success) => {
      console.log('FILE WRITTEN!');
      Alert.alert('Файл записан.');
    })
    .catch((err) => {
      console.log(err.message);
      Alert.alert('Не удалось записать файл.');
    });
};

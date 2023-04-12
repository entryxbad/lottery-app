import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import RNFS from 'react-native-fs';

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
  const data = await getData(DATA_STORAGE_KEY);

  // Проверяем, существует ли файл data.txt
  const existingData = (await RNFS.exists(path))
    ? JSON.parse(await RNFS.readFile(path))
    : [];

  // Оставляем только новые данные, которых еще нет в файле
  const newData = data.filter(
    (item) =>
      !existingData.some((existingItem) => existingItem.phone === item.phone),
  );

  // Если есть новые данные, объединяем их с существующими и записываем в файл
  if (newData.length > 0) {
    const combinedData = [...existingData, ...newData];
    RNFS.writeFile(path, JSON.stringify(combinedData), 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!');
        Alert.alert('Файл записан.');
      })
      .catch((err) => {
        console.log(err.message);
        Alert.alert('Не удалось записать файл.');
      });
  } else {
    Alert.alert('Нет новых данных для записи в файл.');
  }
};

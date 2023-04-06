import AsyncStorage from '@react-native-async-storage/async-storage';

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

import RNFS from 'react-native-fs';
import {exists, readFile, writeFile} from 'react-native-fs';
import {Alert} from 'react-native';

const filePath = RNFS.ExternalDirectoryPath + '/data.txt';

export const checkPhoneNumber = (phoneNumber) => {
  return phoneNumber.length >= 10;
};

export const checkPersonExists = async (data, phone) => {
  const personExists = data.some((person) => person.phone === phone);
  if (personExists) {
    Alert.alert('Пользователь с таким номером телефона уже существует.');
    return true;
  }
  return false;
};

export const loadDataFromFile = async () => {
  const fileExists = await exists(filePath);
  if (fileExists) {
    const contents = await readFile(filePath, 'utf8');
    return JSON.parse(contents);
  }
  return [];
};

export const saveDataToFile = async (data) => {
  await writeFile(filePath, JSON.stringify(data));
};

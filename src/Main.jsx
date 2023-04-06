import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useState} from 'react';
import MaskInput from 'react-native-mask-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DATA_STORAGE_KEY,
  SAVE_DATA_STORAGE_KEY,
  getData,
  setData,
} from './hooks';

const Main = () => {
  const {styles} = useStyle();
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [organization, setOrganization] = useState();
  const [post, setPost] = useState();

  const personData = async () => {
    let newPerson = {
      name: name,
      phone: phone,
      organization: organization,
      post: post,
    };

    newPerson = await setData(SAVE_DATA_STORAGE_KEY, newPerson);
    console.log(`DB: ${newPerson}`);
    console.log('DATA: ', await getData(DATA_STORAGE_KEY));
  };

  const handleChange = (masked, newPhone) => {
    setPhone(masked);
    setPhone(newPhone);
  };

  const handleSubmt = () => {
    personData();

    Alert.alert('Спасибо за участие.');
    setName('');
    setPhone('');
    setOrganization('');
    setPost('');
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Заполните поля</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={(newName) => setName(newName)}
        placeholder="Ваше имя"></TextInput>
      <MaskInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Номер телефона"
        value={phone}
        onChangeText={handleChange}
        mask={[
          '+',
          '7',
          ' ',
          '(',
          /\d/,
          /\d/,
          /\d/,
          ')',
          ' ',
          /\d/,
          /\d/,
          /\d/,
          '-',
          /\d/,
          /\d/,
          '-',
          /\d/,
          /\d/,
        ]}
      />
      <TextInput
        style={styles.input}
        value={organization}
        onChangeText={(newOrganization) => setOrganization(newOrganization)}
        placeholder="Название организации"></TextInput>
      <TextInput
        style={styles.input}
        value={post}
        onChangeText={(newPost) => setPost(newPost)}
        placeholder="Ваша должность"></TextInput>
      <TouchableOpacity style={styles.btn} onPress={handleSubmt}>
        <Text style={styles.btnText}>Записать</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Main;

const useStyle = () => {
  const {height, width} = useWindowDimensions();

  const styles = StyleSheet.create({
    wrapper: {
      display: 'flex',
      backgroundColor: '#4287f5',
      justifyContent: 'center',
      alignItems: 'center',
      width: width,
      height: height,
    },
    title: {
      fontSize: width * 0.04,
      marginBottom: 50,
    },
    input: {
      backgroundColor: '#fff',
      margin: 10,
      borderRadius: 10,
      width: '50%',
    },
    btn: {
      width: '30%',
      backgroundColor: '#3870c9',
      borderRadius: 10,
      alignItems: 'center',
      padding: 10,
      marginTop: 85,
    },
    btnText: {
      fontSize: width * 0.03,
      color: '#fff',
    },
  });
  return {styles};
};

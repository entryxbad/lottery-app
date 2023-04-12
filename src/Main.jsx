import React, {useState} from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import MaskInput from 'react-native-mask-input';
import {DATA_STORAGE_KEY, getData, saveData, setData} from './functions';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

const backgroundImage = require('./assets/screens/main.jpg');

const Main = ({navigation}) => {
  const {styles} = useStyle();
  const [persons, setPersons] = useState([]);
  const [name, setName] = useState();
  const [phone, setPhone] = useState('+7');
  const [organization, setOrganization] = useState();
  const [post, setPost] = useState();

  const handleChange = (masked, newPhone) => {
    setPhone(masked);
    setPhone(newPhone);
  };

  const handleSubmit = async () => {
    const newPerson = {
      name: name,
      phone: phone,
      organization: organization,
      post: post,
    };

    if (!name || !phone || !organization || !post) {
      Alert.alert('Пожалуйста. Заполните все поля.');
      return;
    }

    setPersons((prevPersons) => [...prevPersons, newPerson]);
    await setData(DATA_STORAGE_KEY, [...persons, newPerson]);

    const qwerty = await getData(DATA_STORAGE_KEY);
    console.log('AsyncStorage :', qwerty);

    Alert.alert('Спасибо за участие.');
    setName('');
    setPhone('+7');
    setOrganization('');
    setPost('');
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <KeyboardAvoidingView style={styles.wrapper} behavior="padding">
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Icon style={styles.settings} name="settings" size={50}></Icon>
        </TouchableOpacity>
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
        <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
          <Text style={styles.btnText}>Записать</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Main;

const useStyle = () => {
  const {height, width} = useWindowDimensions();

  const styles = StyleSheet.create({
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: width,
      height: height,
    },
    title: {
      fontSize: width * 0.05,
      marginBottom: 50,
      color: '#fff',
    },
    input: {
      backgroundColor: '#fff',
      margin: 10,
      borderRadius: 10,
      width: width * 0.5,
    },
    btn: {
      width: width * 0.3,
      backgroundColor: '#005082',
      borderRadius: 10,
      alignItems: 'center',
      padding: 10,
      marginTop: 50,
    },
    btnText: {
      fontSize: width * 0.03,
      color: '#fff',
    },
    settings: {
      position: 'absolute',
      color: '#fff',
      left: width * 0.42,
      bottom: width * 0.01,
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
  });
  return {styles};
};

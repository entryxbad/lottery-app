import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React, {useState} from 'react';
import MaskInput from 'react-native-mask-input';
import {DATA_STORAGE_KEY, getData, setData} from './functions';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

const Main = ({navigation}) => {
  const {styles} = useStyle();
  const [persons, setPersons] = useState([]);
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [organization, setOrganization] = useState();
  const [post, setPost] = useState();

  const handleChange = (masked, newPhone) => {
    setPhone(masked);
    setPhone(newPhone);
  };

  const handleSubmt = async () => {
    const newPerson = {
      name: name,
      phone: phone,
      organization: organization,
      post: post,
    };

    setPersons((persons) => [...persons, newPerson]);
    await setData(DATA_STORAGE_KEY, persons);

    const qwerty = await getData(DATA_STORAGE_KEY);
    console.log('AsyncStorage :', qwerty);

    Alert.alert('Спасибо за участие.');
    setName('');
    setPhone('');
    setOrganization('');
    setPost('');
  };

  return (
    <KeyboardAvoidingView style={styles.wrapper} behavior="padding">
      <TouchableOpacity>
        <Icon
          style={styles.settings}
          name="settings"
          size={50}
          onPress={() => navigation.navigate('Settings')}></Icon>
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
      <TouchableOpacity style={styles.btn} onPress={handleSubmt}>
        <Text style={styles.btnText}>Записать</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
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
      marginTop: 50,
    },
    btnText: {
      fontSize: width * 0.03,
      color: '#fff',
    },
    settings: {
      position: 'absolute',
      color: '#fff',
      left: width * 0.4,
      bottom: width * 0.01,
    },
  });
  return {styles};
};

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useState} from 'react';
import MaskInput from 'react-native-mask-input';

const Main = () => {
  const {styles} = useStyle();
  const [phone, setPhone] = useState();

  const handleChange = masked => {
    setPhone(masked);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Заполните поля</Text>
      <TextInput style={styles.input} placeholder="Ваше имя"></TextInput>
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
        placeholder="Название организации"></TextInput>
      <TextInput style={styles.input} placeholder="Ваша должность"></TextInput>
      <TouchableOpacity style={styles.btn}>
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
import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  ImageBackground,
} from 'react-native';
import {DATA_STORAGE_KEY, getData} from './functions';
import Confetti from 'react-native-confetti';

const backgroundImage = require('./assets/screens/winner.jpg');

const Winner = () => {
  const {styles} = useStyle();
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [amount, setAmount] = useState('');
  const [regAmount, setRegAmount] = useState('');
  const confettiRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const lengthData = await getData(DATA_STORAGE_KEY);
      setRegAmount(lengthData.length);
    }
    fetchData();
  }, []);

  // Обработчик изменения количества победителей
  const handleNameInput = (text) => {
    setAmount(text);
  };

  // Обработчик нажатия кнопки "Сохранить" в модальном окне
  const handleSave = () => {
    setIsModalVisible(false);
  };

  // Функция получения случайных победителей
  const getRandom = async () => {
    setIsButtonVisible(false);
    const data = await getData(DATA_STORAGE_KEY);

    let result = [];

    while (result.length != amount) {
      const random = Math.floor(Math.random() * data.length);
      result.push(data[random]);
      result = result.filter((v, i, arr) => arr.indexOf(v) == i);
    }

    if (confettiRef.current) {
      confettiRef.current.startConfetti();
      setTimeout(() => {
        confettiRef.current.stopConfetti();
      }, 10000); // остановка конфетти через 3 секунды
    }

    setData(result);
    return result;
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.wrapper}>
        <View>
          {isModalVisible && (
            <Modal onRequestClose={() => setIsModalVisible(false)}>
              <ImageBackground
                source={backgroundImage}
                style={styles.backgroundImage}>
                <KeyboardAvoidingView style={styles.wrapper} behavior="padding">
                  <Text style={styles.title}>
                    Введите количество победителей
                  </Text>
                  <Text style={styles.text}>Всего участников: {regAmount}</Text>
                  <TextInput
                    style={styles.input}
                    value={amount}
                    keyboardType="numeric"
                    onChangeText={handleNameInput}
                  />
                  <TouchableOpacity style={styles.btn} onPress={handleSave}>
                    <Text style={styles.btnText}>Сохранить</Text>
                  </TouchableOpacity>
                </KeyboardAvoidingView>
              </ImageBackground>
            </Modal>
          )}
        </View>
        {isButtonVisible && (
          <TouchableOpacity style={styles.btn} onPress={getRandom}>
            <Text style={styles.btnText}>Разыграть</Text>
          </TouchableOpacity>
        )}
        <Confetti ref={confettiRef} />
        {data.length > 0 && (
          <View style={styles.wrapper}>
            <Text style={styles.title}>Поздравляем победителей!</Text>
            {data.map((item, index) => (
              <Text style={styles.text} key={index}>
                {item.name}: {item.phone}
              </Text>
            ))}
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

export default Winner;

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
      fontSize: width * 0.04,
      marginBottom: 50,
      color: '#fff',
    },
    btn: {
      width: '30%',
      backgroundColor: '#154f6a',
      borderRadius: 10,
      alignItems: 'center',
      padding: 10,
      marginTop: 10,
    },
    btnText: {
      fontSize: width * 0.03,
      color: '#fff',
    },
    text: {
      fontSize: width * 0.025,
      color: '#fff',
      marginTop: 50,
    },
    input: {
      backgroundColor: '#fff',
      margin: 10,
      borderRadius: 10,
      width: '50%',
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
  });
  return {styles};
};

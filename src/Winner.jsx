import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import {DATA_STORAGE_KEY, getData} from './functions';

const Winner = () => {
  const {styles} = useStyle();
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [amount, setAmount] = useState('');
  const [regAmount, setRegAmount] = useState('');

  useEffect(() => {
    async function fetchData() {
      const lengthData = await getData(DATA_STORAGE_KEY);
      setRegAmount(lengthData.length);
      console.log('Length of array:', lengthData.length);
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

    setData(result);
    return result;
  };

  return (
    <View style={styles.wrapper}>
      <View>
        {isModalVisible && (
          <Modal onRequestClose={() => setIsModalVisible(false)}>
            <KeyboardAvoidingView style={styles.wrapper}>
              <Text style={styles.title}>Введите количество победителей</Text>
              <Text style={styles.text}>
                Количество участников: {regAmount}
              </Text>
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
          </Modal>
        )}
      </View>
      {isButtonVisible && (
        <TouchableOpacity style={styles.btn} onPress={getRandom}>
          <Text style={styles.btnText}>Разыграть</Text>
        </TouchableOpacity>
      )}
      {data.map((item, index) => (
        <Text style={styles.text} key={index}>
          {item.name}: {item.phone}
        </Text>
      ))}
    </View>
  );
};

export default Winner;

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
      color: '#fff',
    },
    btn: {
      width: '30%',
      backgroundColor: '#3870c9',
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
  });
  return {styles};
};

import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import {DATA_STORAGE_KEY, getData} from './functions';

const Winner = () => {
  const {styles} = useStyle();
  const [data, setData] = useState([]);

  const getRandom = async () => {
    const data = await getData(DATA_STORAGE_KEY);

    let result = [];

    while (result.length != 3) {
      const random = Math.floor(Math.random() * data.length);
      result.push(data[random]);
      result = result.filter((v, i, arr) => arr.indexOf(v) == i);
    }

    setData(result);
    console.log('RESULT:', result);
    return result;
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.btn} onPress={getRandom}>
        <Text style={styles.btnText}>Разыграть</Text>
      </TouchableOpacity>
      {data.map((item) => (
        <Text style={styles.text} key={item.id}>
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
      fontSize: width * 0.03,
      color: '#fff',
      marginTop: 50,
    },
  });
  return {styles};
};

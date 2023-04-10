import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import {getWinner, saveData} from './functions';

const Settings = () => {
  const {styles} = useStyle();

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.btn} onPress={saveData}>
        <Text style={styles.btnText}>Сохранить</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={async () => {
          const result = await getWinner();
          console.log(`RESULT: ${result}`);
        }}>
        <Text style={styles.btnText}>Победитель</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;

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
      marginTop: 10,
    },
    btnText: {
      fontSize: width * 0.03,
      color: '#fff',
    },
    settings: {
      position: 'absolute',
      color: '#fff',
      left: width * 0.4,
    },
  });
  return {styles};
};

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import {saveData} from './functions';

const Settings = ({navigation}) => {
  const {styles} = useStyle();

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.btn} onPress={saveData}>
        <Text style={styles.btnText}>Сохранить</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Winner')}>
        <Text style={styles.btnText}>Розыгрыш</Text>
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
  });
  return {styles};
};

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import {saveData} from './functions';

const backgroundImage = require('./assets/screens/settings.jpg');

const Settings = ({navigation}) => {
  const {styles} = useStyle();

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
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
    </ImageBackground>
  );
};

export default Settings;

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
    btn: {
      width: width * 0.3,
      backgroundColor: '#103977',
      borderRadius: 10,
      alignItems: 'center',
      padding: 10,
      marginTop: 10,
    },
    btnText: {
      fontSize: width * 0.03,
      color: '#fff',
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
  });
  return {styles};
};

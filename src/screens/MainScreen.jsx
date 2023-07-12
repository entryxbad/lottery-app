import {
  ImageBackground,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View
} from 'react-native'

import MaskInput from 'react-native-mask-input'
import SettingsIcon from 'react-native-vector-icons/SimpleLineIcons'
import AwardIcon from 'react-native-vector-icons/FontAwesome5'
import { handleInputFocus, stopSoundAnotherScreen } from '../utils/player'
import useMainScreenLogic from '../utils/hooks/useMainScreenLogic'

const backgroundImage = require('../assets/screens/main.jpg')

const MainScreen = ({ navigation }) => {
  const {
    name,
    setName,
    phone,
    organization,
    setOrganization,
    post,
    setPost,
    handlePressOnDisplay,
    handleChange,
    handleSubmit
  } = useMainScreenLogic({ navigation })

  return (
    <ImageBackground
      source={backgroundImage}
      className='flex-1'
      resizeMode='cover'
    >
      <TouchableWithoutFeedback onPress={handlePressOnDisplay}>
        <View className='flex-1 justify-center items-center bg-backgroundShadow'>
          <TouchableHighlight className='absolute right-10 top-10'>
            <AwardIcon
              onPress={() => {
                stopSoundAnotherScreen()
                navigation.navigate('Winner')
              }}
              name='award'
              color='white'
              size={70}
            />
          </TouchableHighlight>
          <TouchableHighlight className='absolute left-10 top-10'>
            <SettingsIcon
              onPress={() => {
                stopSoundAnotherScreen()
                navigation.navigate('Settings')
              }}
              name='settings'
              color='white'
              size={70}
            />
          </TouchableHighlight>
          <Text className='color-white text-7xl mb-12'>Заполните поля</Text>
          <TextInput
            className='bg-white rounded-xl w-[50%] py-4 text-xl mb-3'
            value={name}
            onChangeText={(newName) => setName(newName)}
            placeholder='Ваше имя'
            onFocus={handleInputFocus}
          ></TextInput>
          <MaskInput
            className='bg-white rounded-xl w-[50%] py-4 text-xl mb-3'
            keyboardType='numeric'
            placeholder='+7 (___) ___-__-__'
            value={phone}
            onChangeText={handleChange}
            onFocus={handleInputFocus}
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
              /\d/
            ]}
          />
          <TextInput
            className='bg-white rounded-xl w-[50%] py-4 text-xl mb-3'
            value={organization}
            onChangeText={(newOrganization) => setOrganization(newOrganization)}
            placeholder='Название организации'
            onFocus={handleInputFocus}
          ></TextInput>
          <TextInput
            className='bg-white rounded-xl w-[50%] py-4 text-xl mb-3'
            value={post}
            onChangeText={(newPost) => setPost(newPost)}
            placeholder='Ваша должность'
            onFocus={handleInputFocus}
          ></TextInput>
          <TouchableHighlight
            className='bg-[#00e0f5] rounded-xl mt-8 w-[30%] items-center'
            onPress={handleSubmit}
          >
            <Text className='color-white text-4xl p-4'>Записать</Text>
          </TouchableHighlight>
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  )
}

export default MainScreen

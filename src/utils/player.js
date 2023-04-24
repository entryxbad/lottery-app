import Sound from 'react-native-sound'

const soundFile = new Sound(
  require('../assets/sounds/thankyou.mp3'),
  (error) => {
    if (error) {
      console.log('Не удалось загрузить звуковой файл', error)
      return
    }
    //soundFile.setNumberOfLoops(-1)
  }
)

let timeoutId = null
export let isPlaying = false

export const stopSound = (setIsPlaying) => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  soundFile.stop(() => {
    setIsPlaying(false)
    timeoutId = setTimeout(() => {
      playSound()
      setIsPlaying(true)
    }, 3000)
  })
}

export const playSound = () => {
  soundFile.play()
}

export const handleInputFocus = () => {
  soundFile.stop()
}

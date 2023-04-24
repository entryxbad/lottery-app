import Sound from 'react-native-sound'

const soundFile = new Sound(
  require('../assets/sounds/getPrizes.mp3'),
  (error) => {
    if (error) {
      console.log('Не удалось загрузить звуковой файл', error)
      return
    }
    soundFile.setNumberOfLoops(-1)
  }
)

const soundThanks = new Sound(
  require('../assets/sounds/thanksForParticipate.mp3'),
  (error) => {
    if (error) {
      console.log('Не удалось загрузить звуковой файл', error)
      return
    }
  }
)

let timeoutId = null

export const stopSound = (setIsPlaying, playThanksSound = false) => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  soundFile.stop(() => {
    setIsPlaying(false)
    if (playThanksSound) {
      playThanksSound()
    } else {
      timeoutId = setTimeout(() => {
        playSound()
        setIsPlaying(true)
      }, 3000)
    }
  })
}

export const playSound = () => {
  soundFile.play()
}

export const playThanksSound = () => {
  soundThanks.play()
}

export const handleInputFocus = () => {
  soundFile.stop()
}

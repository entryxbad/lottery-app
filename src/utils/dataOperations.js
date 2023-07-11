import RNFS from 'react-native-fs'
import { exists, readFile, writeFile } from 'react-native-fs'

const day = new Date().getDate()
const month = String(new Date().getMonth() + 1).padStart(2, '0')
const year = new Date().getFullYear()

const filePath = RNFS.ExternalDirectoryPath + `/${day}.${month}.${year}.txt`

const loadDataFromFile = async () => {
  const fileExists = await exists(filePath)
  if (fileExists) {
    const contents = await readFile(filePath, 'utf8')
    return JSON.parse(contents)
  }
  return []
}

const saveDataToFile = async (data) => {
  await writeFile(filePath, JSON.stringify(data))
}

export { filePath, loadDataFromFile, saveDataToFile }

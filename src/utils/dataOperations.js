import RNFS from 'react-native-fs'
import { exists, readFile, writeFile } from 'react-native-fs'

export const filePath = RNFS.ExternalDirectoryPath + '/data.txt'

export const loadDataFromFile = async () => {
  const fileExists = await exists(filePath)
  if (fileExists) {
    const contents = await readFile(filePath, 'utf8')
    return JSON.parse(contents)
  }
  return []
}

export const saveDataToFile = async (data) => {
  await writeFile(filePath, JSON.stringify(data))
}

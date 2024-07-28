import fs from 'fs'
import path from 'path'

export const UPLOAD_IMAGES_TEMP_DIR = path.resolve('uploads/images/temp')
export const UPLOAD_IMAGES_DIR = path.resolve('uploads/images')

export const IMAGE_FILE_SIZE = 3 * 1024 * 1024

export const initUploadFolder = () => {
  ;[UPLOAD_IMAGES_DIR, UPLOAD_IMAGES_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true
      })
    }
  })
}

export const getNameFromFullName = (fileName: string) => {
  const splitNameArr = fileName.split('.')
  return splitNameArr[0]
}

export const getFileExtenstion = (fileName: string) => {
  const splitNameArr = fileName.split('.')
  return splitNameArr[splitNameArr.length - 1]
}

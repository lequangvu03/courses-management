import CryptoJS from 'crypto-js'

export const encrypt = (value: string) => {
  return CryptoJS.AES.encrypt(value, import.meta.env.VITE_HASH_SECRET).toString()
}

export const decrypt = (value: string) => {
  const bytes = CryptoJS.AES.decrypt(value, import.meta.env.VITE_HASH_SECRET)
  return bytes.toString(CryptoJS.enc.Utf8)
}

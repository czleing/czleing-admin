/**
 * 记住登录用户
 * 密码加密保存
 */
import { encrypt, decrypt } from '@/utils/jsencrypt'

const storage = window.localStorage
const key = 'REMEMBERED_ACCOUNT'

export function setAccount (account, password, isRemember = false) {
  if (isRemember) {
    storage.setItem(key, JSON.stringify({ account, password: encrypt(password) }))
  } else {
    // const accountInfo = getAccount()
    // if (accountInfo && accountInfo.account === account) {
    //   clearAccount()
    // }
  }
}

export function getAccount () {
  const json = storage.getItem(key)
  if (json && /^\{.*\}$/.test(json)) {
    const account = JSON.parse(json)
    account.password = decrypt(account.password)
    return account
  } else {
    return null
  }
}

export function clearAccount () {
  storage.removeItem(key)
}

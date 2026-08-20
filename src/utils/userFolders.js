const STORAGE_KEY = "userFolders"

export function getUserFolders() {
  try {
    const folders = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")
    return Array.isArray(folders) ? folders : []
  } catch {
    return []
  }
}

export function setUserFolders(folders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(folders))
}

/**
 * フォルダ追加
 * @param {string} name
 * @param {string} icon
 * @returns {Object|null}
 */
export function addUserFolder(name, icon = "📁") {
  const folders = getUserFolders()

  if (!name.trim()) return null

  if (folders.some(folder => folder.name === name)) {
    return null
  }

  const folder = {
    id: crypto.randomUUID(),
    name,
    icon,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }

  folders.push(folder)
  setUserFolders(folders)

  return folder
}

/**
 * フォルダ削除
 * @param {string} id
 * @returns {boolean}
 */
import {
  deleteUserAssetsByFolder,
  moveUserAssetsToUncategorized
} from "./userAssets"

export function deleteUserFolder(id, mode="move") {
  const folders = getUserFolders()

  if(mode==="delete"){
    deleteUserAssetsByFolder(id)
  }

  if(mode==="move"){
    moveUserAssetsToUncategorized(id)
  }

  setUserFolders(
    folders.filter(
      folder => folder.id !== id
    )
  )

  return true
}

/**
 * フォルダ名変更
 * @param {string} id
 * @param {string} newName
 * @returns {boolean}
 */
export function renameUserFolder(id, newName) {
  const folders = getUserFolders()

  if (!newName.trim()) return false

  if (
    folders.some(
      folder =>
        folder.name === newName &&
        folder.id !== id
    )
  ) {
    return false
  }

  const folder = folders.find(
    folder => folder.id === id
  )

  if (!folder) return false

  folder.name = newName
  folder.updatedAt = Date.now()

  setUserFolders(folders)

  return true
}

/**
 * フォルダアイコン変更
 * @param {string} id
 * @param {string} icon
 * @returns {boolean}
 */
export function updateUserFolderIcon(id, icon) {
  const folders = getUserFolders()

  const folder = folders.find(
    folder => folder.id === id
  )

  if (!folder) return false

  folder.icon = icon
  folder.updatedAt = Date.now()

  setUserFolders(folders)

  return true
}

/**
 * IDからフォルダ取得
 * @param {string} id
 * @returns {Object|null}
 */
export function getUserFolder(id) {
  return (
    getUserFolders().find(
      folder => folder.id === id
    ) ?? null
  )
}

/**
 * 名前からフォルダ取得
 * @param {string} name
 * @returns {Object|null}
 */
export function getUserFolderByName(name) {
  return (
    getUserFolders().find(
      folder => folder.name === name
    ) ?? null
  )
}

/**
 * 全削除
 */
export function clearUserFolders() {
  localStorage.removeItem(STORAGE_KEY)
}
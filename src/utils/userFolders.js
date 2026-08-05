const STORAGE_KEY = "userFolders"

/**
 * フォルダ一覧取得
 * @returns {Array}
 */
export function getUserFolders() {
  try {
    const folders = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "[]"
    )

    return Array.isArray(folders)
      ? folders
      : []
  } catch {
    return []
  }
}

/**
 * フォルダ一覧保存
 * @param {Array} folders
 */
export function setUserFolders(folders) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(folders)
  )
}

/**
 * フォルダ追加
 * @param {string} name
 * @returns {Object|null}
 */
export function addUserFolder(name) {
  const folders = getUserFolders()

  if (
    folders.some(folder => folder.name === name)
  ) {
    return null
  }

  const folder = {
    id: crypto.randomUUID(),
    name
  }

  folders.push(folder)

  setUserFolders(folders)

  return folder
}

/**
 * フォルダ削除
 * @param {string} id
 */
export function deleteUserFolder(id) {
  const folders = getUserFolders()

  setUserFolders(
    folders.filter(
      folder => folder.id !== id
    )
  )
}

/**
 * フォルダ名変更
 * @param {string} id
 * @param {string} newName
 * @returns {boolean}
 */
export function renameUserFolder(
  id,
  newName
) {
  const folders = getUserFolders()

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
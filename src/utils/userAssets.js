const STORAGE_KEY = "userAssets"

/**
 * ユーザー画像一覧を取得
 * @returns {Object}
 */
export function getUserAssets() {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "{}"
    )
  } catch {
    return {}
  }
}

/**
 * ユーザー画像一覧を保存
 * @param {Object} assets
 */
export function setUserAssets(assets) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(assets)
  )
}

/**
 * 画像を追加
 * @param {string} name
 * @param {string} dataUrl
 */
export function saveUserAsset(name, dataUrl) {
  const assets = getUserAssets()

  assets[name] = dataUrl

  setUserAssets(assets)
}

/**
 * 画像を取得
 * @param {string} name
 * @returns {string|null}
 */
export function getUserAsset(name) {
  const assets = getUserAssets()

  return assets[name] ?? null
}

/**
 * 画像が存在するか
 * @param {string} name
 * @returns {boolean}
 */
export function existsUserAsset(name) {
  const assets = getUserAssets()

  return name in assets
}

/**
 * 画像を削除
 * @param {string} name
 */
export function deleteUserAsset(name) {
  const assets = getUserAssets()

  delete assets[name]

  setUserAssets(assets)
}

/**
 * 名前変更
 * @param {string} oldName
 * @param {string} newName
 */
export function renameUserAsset(
  oldName,
  newName
) {
  const assets = getUserAssets()

  if (!(oldName in assets)) return false

  if (newName in assets) return false

  assets[newName] = assets[oldName]

  delete assets[oldName]

  setUserAssets(assets)

  return true
}

/**
 * 画像一覧の名前だけ取得
 * @returns {string[]}
 */
export function getUserAssetNames() {
  return Object.keys(
    getUserAssets()
  )
}

/**
 * 全削除
 */
export function clearUserAssets() {
  localStorage.removeItem(STORAGE_KEY)
}
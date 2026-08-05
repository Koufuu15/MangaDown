const STORAGE_KEY = "userAssets"

/**
 * ユーザー画像一覧を取得
 * @returns {Array}
 */
export function getUserAssets() {
  try {
    const assets = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "[]"
    )

    return Array.isArray(assets)
      ? assets
      : []
  } catch {
    return []
  }
}

/**
 * ユーザー画像一覧を保存
 * @param {Array} assets
 */
export function setUserAssets(assets) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(assets)
  )
}

/**
 * 画像を追加
 * @param {Object} asset
 */
export function saveUserAsset(asset) {
  const assets = getUserAssets()

  assets.push({
    id: asset.id ?? crypto.randomUUID(),
    name: asset.name,
    src: asset.src,
    folderId: asset.folderId ?? "",
    tags: asset.tags ?? [],
    createdAt: asset.createdAt ?? Date.now(),
    updatedAt: Date.now()
  })

  setUserAssets(assets)
}

/**
 * 名前から画像取得
 * @param {string} name
 * @returns {Object|null}
 */
export function getUserAsset(name) {
  return (
    getUserAssets().find(
      asset => asset.name === name
    ) ?? null
  )
}

/**
 * 名前から画像URL取得
 * @param {string} name
 * @returns {string|null}
 */
export function getUserAssetSrc(name) {
  return (
    getUserAsset(name)?.src ?? null
  )
}

/**
 * 画像が存在するか
 * @param {string} name
 * @returns {boolean}
 */
export function existsUserAsset(name) {
  return getUserAssets().some(
    asset => asset.name === name
  )
}

/**
 * 画像削除
 * @param {string} id
 */
export function deleteUserAsset(id) {
  const assets = getUserAssets()

  setUserAssets(
    assets.filter(
      asset => asset.id !== id
    )
  )
}

/**
 * 名前変更
 * @param {string} id
 * @param {string} newName
 * @returns {boolean}
 */
export function renameUserAsset(
  id,
  newName
) {
  const assets = getUserAssets()

  if (
    assets.some(
      asset =>
        asset.name === newName &&
        asset.id !== id
    )
  ) {
    return false
  }

  const asset = assets.find(
    asset => asset.id === id
  )

  if (!asset) return false

  asset.name = newName
  asset.updatedAt = Date.now()

  setUserAssets(assets)

  return true
}

/**
 * フォルダ移動
 * @param {string} id
 * @param {string} folderId
 */
export function moveUserAsset(
  id,
  folderId
) {
  const assets = getUserAssets()

  const asset = assets.find(
    asset => asset.id === id
  )

  if (!asset) return

  asset.folderId = folderId
  asset.updatedAt = Date.now()

  setUserAssets(assets)
}

/**
 * タグ更新
 * @param {string} id
 * @param {string[]} tags
 */
export function updateUserAssetTags(
  id,
  tags
) {
  const assets = getUserAssets()

  const asset = assets.find(
    asset => asset.id === id
  )

  if (!asset) return

  asset.tags = tags
  asset.updatedAt = Date.now()

  setUserAssets(assets)
}

/**
 * 名前一覧取得
 * @returns {string[]}
 */
export function getUserAssetNames() {
  return getUserAssets().map(
    asset => asset.name
  )
}

/**
 * 名前順ソート
 * @returns {Array}
 */
export function getUserAssetsByName() {
  return [...getUserAssets()].sort(
    (a, b) =>
      a.name.localeCompare(
        b.name,
        "ja"
      )
  )
}

/**
 * 更新日時順ソート
 * @returns {Array}
 */
export function getUserAssetsByUpdated() {
  return [...getUserAssets()].sort(
    (a, b) =>
      b.updatedAt - a.updatedAt
  )
}

/**
 * 全削除
 */
export function clearUserAssets() {
  localStorage.removeItem(STORAGE_KEY)
}
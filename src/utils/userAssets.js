const STORAGE_KEY = "userAssets"

export function getUserAssets() {
  try {
    const assets = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "[]"
    )

    return Array.isArray(assets)
      ? assets.map(asset => ({
          ...asset,
          folder: asset.folder ?? asset.folderId ?? ""
        }))
      : []
  } catch {
    return []
  }
}

export function setUserAssets(assets) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(assets)
  )
}

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

export function getUserAsset(name) {
  return (
    getUserAssets().find(
      asset => asset.name === name
    ) ?? null
  )
}

export function getUserAssetSrc(name) {
  return (
    getUserAsset(name)?.src ?? null
  )
}

export function existsUserAsset(name) {
  return getUserAssets().some(
    asset => asset.name === name
  )
}

export function deleteUserAsset(id) {
  const assets = getUserAssets()

  setUserAssets(
    assets.filter(
      asset => asset.id !== id
    )
  )
}

export function renameUserAsset(id, newName) {
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

export function deleteUserAssetsByFolder(folderId){
  const assets = getUserAssets()

  setUserAssets(
    assets.filter(
      asset => asset.folderId !== folderId
    )
  )
}

export function moveUserAssetsToUncategorized(folderId){
  const assets = getUserAssets()

  assets.forEach(asset=>{
    if(asset.folderId === folderId){
      asset.folderId = ""
      asset.updatedAt = Date.now()
    }
  })

  setUserAssets(assets)
}

export function moveUserAsset(id, folderId) {
  const assets = getUserAssets()

  const asset = assets.find(
    asset => asset.id === id
  )

  if (!asset) return

  asset.folderId = folderId
  asset.updatedAt = Date.now()

  setUserAssets(assets)
}

export function updateUserAssetTags(id, tags) {
  const assets = getUserAssets()

  const asset = assets.find(
    asset => asset.id === id
  )

  if (!asset) return

  asset.tags = tags
  asset.updatedAt = Date.now()

  setUserAssets(assets)
}

export function getUserAssetNames() {
  return getUserAssets().map(
    asset => asset.name
  )
}

export function getUserAssetsByName() {
  return [...getUserAssets()].sort(
    (a, b) =>
      a.name.localeCompare(
        b.name,
        "ja"
      )
  )
}

export function getUserAssetsByUpdated() {
  return [...getUserAssets()].sort(
    (a, b) =>
      b.updatedAt - a.updatedAt
  )
}

export function clearUserAssets() {
  localStorage.removeItem(STORAGE_KEY)
}
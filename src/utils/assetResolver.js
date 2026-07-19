import { getUserAsset, getUserAssets, getUserAssetNames } from "./userAssets"

const builtinAssets = {
  detective: "/assets/builtin/characters/detective.png",
  girl: "/assets/builtin/characters/girl.png",
  boy: "/assets/builtin/characters/boy.png",
  office: "/assets/builtin/backgrounds/office.png",
  school: "/assets/builtin/backgrounds/school.png",
  smoke: "/assets/builtin/effects/smoke.png",
  sparkle: "/assets/builtin/effects/sparkle.png"
}

/**
 * asset名から画像URLを返す
 * @param {string} assetName
 * @returns {string|null}
 */
export function resolveAsset(assetName) {
  if (!assetName) return null
  if (builtinAssets[assetName]) return builtinAssets[assetName]
  return getUserAsset(assetName)
}

/**
 * 運営素材かどうか
 */
export function isBuiltinAsset(assetName) {
  return assetName in builtinAssets
}

/**
 * ユーザー素材かどうか
 */
export function isUserAsset(assetName) {
  return assetName in getUserAssets()
}

/**
 * すべての素材名を取得
 */
export function getAllAssetNames() {
  return [
    ...Object.keys(builtinAssets),
    ...getUserAssetNames()
  ]
}
import defaultAssets from "@/data/defaultAssets"
import {
  getUserAssetSrc,
  getUserAssets,
  getUserAssetNames
} from "./userAssets"

const builtinAssets = Object.fromEntries(
  defaultAssets.map(asset => [
    asset.name,
    asset.src
  ])
)

/**
 * asset名から画像URLを返す
 */
export function resolveAsset(assetName) {
  if (!assetName) return null

  if (builtinAssets[assetName]) {
    return builtinAssets[assetName]
  }

  return getUserAssetSrc(assetName)
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
  return getUserAssets().some(
    asset => asset.name === assetName
  )
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
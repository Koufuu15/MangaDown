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
  return defaultAssets.some(
    asset => asset.name === assetName
  )
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
    ...defaultAssets.map(
      asset => asset.name
    ),
    ...getUserAssetNames()
  ]
}

/**
 * AssetPicker用
 * すべての画像素材を取得
 */
export function getAllAssets() {
  return [
    ...defaultAssets.map(asset => ({
      ...asset,
      type:"builtin"
    })),

    ...getUserAssets().map(asset => ({
      ...asset,
      folderId:asset.folderId ?? "",
      type:"user"
    }))
  ]
}
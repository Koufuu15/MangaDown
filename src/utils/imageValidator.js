import { getAllAssetNames } from "./assetResolver"

/**
 * 画像名が利用可能か判定する
 *
 * @param {string} name
 * @returns {{
 *   valid: boolean,
 *   message: string
 * }}
 */
export function validateImageName(name) {

  const imageName = name.trim()

  if (!imageName) {
    return {
      valid: false,
      message: "画像名を入力してください。"
    }
  }

  if (getAllAssetNames().includes(imageName)) {
    return {
      valid: false,
      message: "同じ名前の画像が既に存在します。"
    }
  }

  return {
    valid: true,
    message: ""
  }

}
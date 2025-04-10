
/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  // const valid_map = ['admin', 'editor', 'maxiaoyun', 'zhangsan']
  // return valid_map.indexOf(str.trim()) >= 0
  var regex = /^[a-zA-Z\s]*$/ // 只允许英文字符和空格
  return regex.test(str)
}

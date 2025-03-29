import Cookies from 'js-cookie'

const TokenKey = 'online_recruitment_system_token'
const UserIdKey = 'online_recruitment_system_user_id'
const roleKey = 'online_recruitment_system_token_role'
const currentAvatar = 'online_recruitment_system_token_current_avatar'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserId() {
  return localStorage.getItem(UserIdKey)
}

export function setUserId(userId) {
  return localStorage.setItem(UserIdKey, userId)
}

export function removeUserId() {
  return localStorage.removeItem(UserIdKey)
}

export function getRole() {
  return localStorage.getItem(roleKey)
}

export function setRole(role) {
  return localStorage.setItem(roleKey, role)
}

export function removeRole() {
  return localStorage.removeItem(roleKey)
}

export function getAvatar() {
  return localStorage.getItem(currentAvatar)
}

export function setAvatar(avatar) {
  return localStorage.setItem(currentAvatar, avatar)
}

export function removeAvatar() {
  return localStorage.removeItem(currentAvatar)
}

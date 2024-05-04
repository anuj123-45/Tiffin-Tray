import config from "../../config.json";

export function clearToken(updateToken) {
  localStorage.removeItem(config.localStorageKey);
  updateToken(null, true);
}

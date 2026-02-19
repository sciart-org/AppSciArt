import { jwtDecode } from "jwt-decode";

class TokenService {
  getLocalRefreshToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.refreshToken;
  }

  getLocalAccessToken() {
    const rawJwt = localStorage.getItem("jwt");
    if (!rawJwt || rawJwt === "undefined") {
      return null
    }
    const jwt = JSON.parse(localStorage.getItem("jwt"));
    return jwt ? jwt : null;
  }

  hasTokenExpired() {
    const jwt = this.getLocalAccessToken();
    if (!jwt) return true;
    const decodedJwt = jwtDecode(jwt);
    return decodedJwt.exp * 1000 < Date.now();
  }

  checkToken() {
    const jwt = this.getLocalAccessToken();
    if (!jwt || this.hasTokenExpired()) {
      this.removeUser();
      return false;
    }
    return true;
  }

  updateLocalAccessToken(token) {
    window.localStorage.setItem("jwt", JSON.stringify(token));
  }

  getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  getIsAdmin() {
    const user = this.getUser()
    return user?.roles.includes("administrator")
  }

  setUser(user) {
    window.localStorage.setItem("user", JSON.stringify(user));
  }

  removeUser() {
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("jwt");
  }
}
const tokenService = new TokenService();

export default tokenService;

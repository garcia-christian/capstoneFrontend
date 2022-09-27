import api from "./api";
import TokenService from "./token.service";

// import axios from "axios";

// const API_URL = "/auth";

const signup = (email, password) => {
  return api
    .post("/auth/signup", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.access) {
        // localStorage.setItem("user", JSON.stringify(response.data));
        TokenService.setUser(response.data);
      }

      return response.data;
    });
};

const login = (email, password) => {
  return api
    .post("/auth/login", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.access) {
        // localStorage.setItem("user", JSON.stringify(response.data));
        TokenService.setUser(response.data);
      }

      return response.data;
    });
};

const logout = () => {
  // localStorage.removeItem("user");
  TokenService.removeUser();
};

const getCurrentUser = () => {
    console.log("passed");
  return JSON.parse(localStorage.getItem("user"));
};



const verifyCurrentUser = () => {
    const tok = JSON.parse(localStorage.getItem("user"))
    return api
    .get("/auth/is-verif", {
        Headers:{
            'token': tok.access
          }
    })
    
  };
const authService = {
  signup,
  login,
  logout,
  getCurrentUser,
  verifyCurrentUser,
};

export default authService;

import axios from 'axios';
import TokenService from './token.service';
import AuthService from "./auth.service";
import { useNavigate } from "react-router-dom";



const instance = axios.create({
  baseURL: "http://localhost:5000/",
  headers: {
    "Content-Type": "application/json",
  },
});



export default instance;
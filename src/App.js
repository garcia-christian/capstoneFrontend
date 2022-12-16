import React, { Fragment, useEffect, useState, useContext, useMemo } from "react";
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Home from './components/Home'
import Pos from './components/Pos'
import Inventory from "./components/Inventory";
import Orders from "./components/Orders";
import Sales from "./components/Sales";
import Purchase from "./components/Purchase";
import Settings from "./components/Settings";
import { PharmaContext } from "./context/PharmaContext"
import { urlApi } from "./context/urlAPI";
import { SocketContext } from "./context/SocketContext"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';


import api from "./services/api";
function App() {
  const [pharma, setPharma] = useState(null);
  const [BASEURL, setBASEURL] = useState('https://capstone-heremi.up.railway.app');
  const [socket, setSocket] = useState(null)

  const pharmacy = useMemo(() => ({ pharma, setPharma }), [pharma, setPharma]);
  const URLAPI = useMemo(() => ({ BASEURL, setBASEURL }), [BASEURL, setBASEURL]);
  const socketCont = useMemo(() => ({ socket, setSocket }), [socket, setSocket]);


  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (Boolean) => {
    setIsAuthenticated(Boolean);
  };

  async function isAuth() {
    try {
      const response = await fetch(BASEURL + `/auth/is-verify`, {
        method: "GET",
        headers: { token: localStorage.token }
      })

      const parseRes = await response.json()
      console.log(parseRes);

      if (parseRes === true) {
        setIsAuthenticated(true)
      }
      else {
        setIsAuthenticated(false)
      }

    } catch (error) {
      console.error(error.message)
    }


  }

  useEffect(() => {
    isAuth()

  }, [])




  return (
    <Fragment>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
      <urlApi.Provider value={URLAPI}>
        <PharmaContext.Provider value={pharmacy}>
          <SocketContext.Provider value={socketCont}>
            <Router>
              <Routes>
                <Route path={"/dashboard/*"} element={!isAuthenticated ? <Navigate replace to="/login" /> : <Dashboard setAuth={setAuth} />}>
                  <Route path='home' element={<Home />} />
                  <Route path='pos' element={<Pos />} />
                  <Route path='inventory' element={<Inventory />} />
                  <Route path='orders' element={<Orders />} />
                  <Route path='sales' element={<Sales />} />
                  <Route path='purchased' element={<Purchase />} />
                  <Route path='settings' element={<Settings />} />
                </Route>

                <Route path="/" element={isAuthenticated ? <Dashboard setAuth={setAuth} /> : <Navigate replace to="/dashboard/home" />} />
                <Route path="/login" element={!isAuthenticated ? <Login setAuth={setAuth} /> : <Navigate replace to="/dashboard/home" />} />
              </Routes>
            </Router>
          </SocketContext.Provider>
        </PharmaContext.Provider>
      </urlApi.Provider>
    </Fragment>

  );
};

export default App;

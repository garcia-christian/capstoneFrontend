import React, { Fragment, useState, useEffect, useContext } from "react";
import "./css/dashboardStyle.css"
import dash from "./css/dashboardstyle.module.scss"
import logo from './images/blue.png'
import Avatar from 'react-avatar';
import { PharmaContext } from "../context/PharmaContext"
import toast, { Toaster } from 'react-hot-toast';
import { NavLink, Outlet } from "react-router-dom";


const Dashboard = ({ setAuth }) => {
  const { pharma, setPharma } = useContext(PharmaContext);
  const [name, setName] = useState([]);
  const [userId, setId] = useState([]);
  const [pharmacy, setPharmacy] = useState([]);

  //console.log(statusU)
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  async function getName() {

    try {
      const response = await fetch(`http://localhost:5000/dashboard`, {
        method: "GET",
        headers: { token: localStorage.token }
      });

      const pareRes = await response.json()

      console.log(pareRes)
      setName(pareRes.admin_name)

      setId(pareRes.admin_id)
      setIsAuthenticated(true)

      const pharma_admin = await fetch("http://localhost:5000/dashboard/get-pharma-admin/" + pareRes.admin_id)
      const paData = await pharma_admin.json();

      const pharma = await fetch("http://localhost:5000/dashboard/get-pharma/" + paData[0].pharmacy_id)
      const pData = await pharma.json();

      const data = pData[0]
      data.admin = pareRes.admin_id
      setPharma(data)
      setPharmacy(data)
      console.log(pData[0]);

    } catch (error) {
      console.error(error.message)
      setIsAuthenticated(false)
    }

  }

  const logout = e => {
    e.preventDefault();
    localStorage.removeItem("token");
    setIsAuthenticated(false)
    setAuth(false);
    setPharma(null)
    toast('Logged Out Successfully',
      {
        style: {
          borderRadius: '10px',
          background: '#ed3450',
          color: '#fff',
        },
      }
    );
  }

  useEffect(() => {
    getName();

  }, [])

  return (
    <Fragment>

      <body classname="snippet-body" id="body-pd" class={`${dash.body} ${dash.pd}`}>
        <header class="header body-pd" id="header">
          <div className="hd" >
            <div>
              <h4 className="username">{name}</h4>
              <Avatar className="avatr" round="50px" src="https://images.unsplash.com/photo-1661493715434-47ac81ac0b04?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60" size="50" />
              <h1 className="pharmaname">{pharmacy.pharmacy_name}</h1>
            </div>
            <div className="location"><i class="bi bi-geo-alt-fill licon"></i><h4 className="pharmaloc">{pharmacy.pharmacy_location}</h4></div>
          </div>
        </header>
        <div class="l-navbar show" id="nav-bar">
          <nav class={`${dash.show} l-navbar`}>
            <div> <a href="#" class="nav_logo"> <img src={logo} class="slogo" alt="logo" /> </a>
              <div class="nav_list">
                <a class="nav_link"> <NavLink to="home"> <i class="bi bi-house-door-fill"></i> <span class="nav_name">Home</span> </NavLink></a>
                <a class="nav_link"> <NavLink to="pos" > <i class="bi bi-receipt-cutoff"></i> <span class="nav_name">POS</span> </NavLink></a>
                <a class="nav_link"> <NavLink to="inventory" class="nav_link">  <i class="bi bi-box-seam-fill"></i> <span class="nav_name">Inventory</span> </NavLink></a>
                <a class="nav_link"> <NavLink to="orders" class="nav_link "> <i class="bi bi-cart-plus-fill"></i> <span class="nav_name">Orders</span>  </NavLink></a>
                <a class="nav_link"> <NavLink to="sales" class="nav_link">  <i class="bi bi-graph-up-arrow"></i> <span class="nav_name">Sales</span>  </NavLink></a>
                <a class="nav_link"> <NavLink to="purchased" class="nav_link">  <i class="bi bi-list-task"></i> <span class="nav_name">Purchased</span>  </NavLink></a>
                <a class="nav_link"> <NavLink to="settings" class="nav_link">  <i class="bi bi-gear-fill"></i> <span class="nav_name">Settings</span>  </NavLink></a>
              </div>

            </div>
            <a href="#" class="nav_link"> <i class="bx bx-log-out nav_icon"></i> <span class="nav_name" onClick={e => logout(e)}>Logout </span>  </a>
          </nav>
        </div>
        <div class="mainboard">

          <Outlet />


        </div>
      </body>

    </Fragment>
  )
}

export default Dashboard
import React, { useEffect, useState, Fragment, useContext } from "react";
import { PharmaContext } from "../context/PharmaContext"
import "./css/homestyle.css"
import api from "../services/api";
const Home = () => {
    const [pharmacy, setPharmacy] = useState([]);
    const [admin, setAdmin] = useState([]);
    const { pharma, setPharma } = useContext(PharmaContext);

    const getCredentials = async () => {
        // try {
        // const response = await fetch(`http://localhost:5000/dashboard`, {
        //   method: "GET",
        //   headers: { token: localStorage.token }
        // });
        // const pareRes = await response.json()
        // setAdmin(pareRes)


        //     const pharma = await fetch("http://localhost:5000/dashboard/get-pharma/"+ 4 )
        //     const pData = await pharma.json();
        //     setPharmacy(pData[0])

        //   } catch (error) {
        //     console.error(error.message)
        //   }
    }


    const [currentMonth, setCurrentMonth] = useState([]);


    const getData = async () => {
        var date = new Date();
        var month = date.getMonth() + 1;
        if (pharma) {
            console.log(pharma);
            try {
                const respo = await fetch("http://localhost:5000/sell/this-month-report/" + pharma.pharmacy_id)
                const jData = await respo.json();
                console.log(jData);
                jData.map((value, index) => {
                    if (month == value.month) {
                        setCurrentMonth(value)
                    }
                })

            } catch (err) {
                console.error(err.message);
            }
        }
    }

    useEffect(() => {
        getData()

    }, [pharma])

    return (
        <Fragment>
            <div className="home">
                <div class="row mb-3 d-flex justify-content-center">
                    <div class="col-xl-3 col-sm-6 py-2   ">
                        <div class="card bg-black text-black h-100">
                            <div class="card-body bg-white    ">
                                <div class="rotate">
                                </div>
                                <h6 class="text-uppercase">Sales this month</h6>
                                <h1 class="display-4">₱{currentMonth ? currentMonth.revenue : 0}</h1>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-sm-6 py-2">
                        <div class="card text-black h-100">
                            <div class="card-body bg-white">
                                <div class="rotate">
                                </div>
                                <h6 class="text-uppercase">Sales last month</h6>
                                <h1 class="display-4">155K</h1>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-sm-6 py-2">
                        <div class="card text-black h-100">
                            <div class="card-body bg-white">
                                <div class="rotate">
                                </div>
                                <h6 class="text-uppercase">sales this year</h6>
                                <h2 class="display-4">9M</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mb-3 d-flex justify-content-center h-100">
                    <div class="col-xl-4 col-sm-6 py-2 ">
                        <div class="card bg-black text-black h-100">
                            <div class="card-body bg-white    ">
                                <div class="rotate">
                                    <i class="fa fa-user fa-4x"></i>
                                </div>
                                <h6 class="text-uppercase text-center">Items Status</h6>
                                <ul class="list-group">
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Cras justo odio
                                        <span class="badge badge-primary badge-pill">14</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Dapibus ac facilisis in
                                        <span class="badge badge-primary badge-pill">2</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Morbi leo risus
                                        <span class="badge badge-primary badge-pill">1</span>
                                    </li>
                                </ul>

                            </div>
                        </div>
                    </div>
                    <div class="col-xl-5 col-sm-6 py-2 ">
                        <div class="card text-black h-100">
                            <div class="card-body bg-white">
                                <div class="rotate">
                                </div>
                                <h6 class="text-uppercase text-center">Messages</h6>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item">Crsdas justo odio</li>
                                    <li class="list-group-item">Dapibus ac facilisis in</li>
                                    <li class="list-group-item">Morbi leo risus</li>
                                    <li class="list-group-item">Porta ac consectetur ac</li>
                                    <li class="list-group-item">Vestibulum at eros</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Fragment>
    )
}

export default Home
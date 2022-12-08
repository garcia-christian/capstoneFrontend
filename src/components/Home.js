import React, { useEffect, useState, Fragment, useContext } from "react";
import { PharmaContext } from "../context/PharmaContext"
import "./css/homestyle.css"
import api from "../services/api";
import { urlApi } from "../context/urlAPI";

const Home = () => {
    const { BASEURL } = useContext(urlApi);
    const [pharmacy, setPharmacy] = useState([]);
    const [admin, setAdmin] = useState([]);
    const { pharma, setPharma } = useContext(PharmaContext);
    const [thisyear, setThisyear] = useState()
    const [lastMonth, setLastMonth] = useState([]);
    const [currentMonth, setCurrentMonth] = useState([]);
    const [stockReport, setstockReport] = useState([]);

    const getData = async () => {
        var date = new Date();
        var month = date.getMonth() + 1;
        var lastmonth = date.getMonth();
        var year = date.getFullYear();
        if (pharma) {
            console.log(pharma);
            try {
                const respo = await fetch(BASEURL + "/sell/month-report/" + pharma.pharmacy_id)
                const jData = await respo.json();
                const respo4 = await fetch(BASEURL + "/sell/this-year-report/" + pharma.pharmacy_id)
                const jData4 = await respo4.json();
                const respo1 = await fetch(BASEURL + "/medicine/get-medicine-stock-status/" + pharma.pharmacy_id)
                const jData1 = await respo1.json();
                setstockReport(jData1)
                jData.map((value, index) => {
                    if (month == value.month) {
                        setCurrentMonth(value)
                    }
                    if (lastmonth == value.month) {
                        setLastMonth(value)
                    }
                })
                await jData4.map((value, index) => {
                    if (year == value.year) {
                        setThisyear(value)
                    }
                })

            } catch (err) {
                console.error(err.message);
            }
        }
    }
    function nFormatter(num, digits) {
        const lookup = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "k" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "G" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" }
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var item = lookup.slice().reverse().find(function (item) {
            return num >= item.value;
        });
        return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
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
                                <h1 class="display-4">₱{currentMonth ? nFormatter(currentMonth.revenue, 2) : 0}</h1>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-sm-6 py-2">
                        <div class="card text-black h-100">
                            <div class="card-body bg-white">
                                <div class="rotate">
                                </div>
                                <h6 class="text-uppercase">Sales last month</h6>
                                <h1 class="display-4">₱{lastMonth ? nFormatter(lastMonth.revenue, 2) : 0}</h1>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-sm-6 py-2">
                        <div class="card text-black h-100">
                            <div class="card-body bg-white">
                                <div class="rotate">
                                </div>
                                <h6 class="text-uppercase">sales this year</h6>
                                <h2 class="display-4">₱{thisyear ? nFormatter(thisyear.revenue, 2) : 0}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mb-3 d-flex justify-content-center h-100">
                    <div class="col-xl-4 col-sm-6 py-2 ">
                        <div class="card  text-black h-100">
                            <div class="card-body ">

                                <h6 class="text-uppercase text-center">Items Status</h6>
                                <ul class="list-group ">
                                    {stockReport.map((value, index) => (
                                        <li class="list-group-item d-flex justify-content-between align-items-center fs-5">
                                            {value.global_brand_name}
                                            {value.med_qty == 0 ? <span class="badge rounded-pill bg-danger">Out of stock</span> : <span class="badge rounded-pill bg-warning text-dark">Low stock</span>}
                                        </li>
                                    ))}

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
                                <h6 class="text-center mt-5">Comming Soon!</h6>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Fragment>
    )
}

export default Home
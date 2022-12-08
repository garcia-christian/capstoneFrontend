import React, { Fragment, useEffect, useState, useContext } from "react";

import { PharmaContext } from "../context/PharmaContext"
import "./css/salesStyle.css"
import SellCharts from "./SellCharts";
import { urlApi } from "../context/urlAPI";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import SalesAll from "./SalesAll";
import SalesMeds from "./SalesMeds";
import SellChartMeds from "./SellChartMeds";
import SalesMonthly from "./SalesMonthly";
import SellChartMonthly from "./SellChartMonthly";
const Sales = () => {
    const { BASEURL } = useContext(urlApi);
    const { pharma, setPharma } = useContext(PharmaContext);
    const [data, setData] = useState([])
    const [labels, setLabels] = useState([])
    const [cdata, setCdata] = useState([])
    const [ldata, setLdata] = useState([])
    const [today, setToday] = useState()
    const [thisyear, setThisyear] = useState()
    const [currentMonth, setCurrentMonth] = useState([]);
    const [lastMonth, setLastMonth] = useState([]);
    const [key, setKey] = useState('home');
    const [barData, setbarData] = useState([]);
    const [monthlyData, setmonthlyData] = useState([]);
    const getDaysInCurrentMonth = () => {
        const date = new Date();

        return new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0
        ).getDate();
    }
    const loadData = async () => {
        try {
            const respo = await fetch(BASEURL + "/sell/get-sales/" + pharma.pharmacy_id)
            const jData = await respo.json();
            const respo1 = await fetch(BASEURL + "/sell/get-daily-sales/" + pharma.pharmacy_id)
            const jData1 = await respo1.json();
            const respo3 = await fetch(BASEURL + "/sell/month-report/" + pharma.pharmacy_id)
            const jData3 = await respo3.json();
            const respo4 = await fetch(BASEURL + "/sell/this-year-report/" + pharma.pharmacy_id)
            const jData4 = await respo4.json();
            const respo5 = await fetch(BASEURL + "/sell/get-sales-meds/" + pharma.pharmacy_id)
            const jData5 = await respo5.json();
            setmonthlyData(jData3)
            setbarData(jData5)
            setData(jData)
            const days = []
            const dta = []
            const Ldta = []
            var date = new Date();
            var dy = date.getDate();
            var currmonth = date.getMonth() + 1;
            var lastmonth = date.getMonth();
            var year = date.getFullYear();
            jData3.map((value, index) => {
                if (currmonth == value.month) {
                    setCurrentMonth(value)
                }
                if (lastmonth == value.month) {
                    setLastMonth(value)
                }
            })

            await jData1.map((value, index) => {
                if (dy == value.day && value.month == currmonth) {
                    setToday(value)
                }
            })
            await jData4.map((value, index) => {
                if (year == value.year) {
                    setThisyear(value)
                }
            })

            for (let i = 1; i < getDaysInCurrentMonth() + 1; i++) {
                days.push(i)
                let o = 0
                let l = 0
                await jData1.map((value, index) => {
                    if (value.day == i && value.month == currmonth) {
                        dta.push(value.revenue)
                        o = 1
                    }
                    if (value.day == i && value.month == lastmonth) {
                        Ldta.push(value.revenue)
                        l = 1
                    }
                })
                if (o !== 1) {
                    dta.push(0)


                }
                if (l !== 1) {

                    Ldta.push(0)

                }
            }

            setLabels(days)
            setCdata(dta)
            setLdata(Ldta)
        } catch (err) {
            console.error(err.message);
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
        if (pharma) {
            loadData()
        }
    }, [pharma])
    return (
        <Fragment>
            <div className="sales">
                <div class="d-flex justify-content-center h-100 ">
                    <div class="col-xl-11 col-sm-6 py-2 h-100 ">

                        <div class="card bg-black text-black h-100 ">
                            <div class="card-body bg-white h-100 ">
                                <div class="rotate">
                                </div>
                                <div class="row mb-3 d-flex justify-content-center">
                                    <div class="col-xl-2 col-sm-6 py-2   ">
                                        <div class="card bg-black text-black h-100">
                                            <div class="card-body bg-white   ">
                                                <div class="rotate">
                                                </div>
                                                <h1 class="display-4 ">₱{today ? nFormatter(today.revenue, 2) : 0}</h1>
                                                <h6 class="text-uppercase">Today's Profit</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-sm-6 py-2 ml-5">
                                        <div class="card text-black h-100">
                                            <div class="card-body bg-white">
                                                <div class="rotate">
                                                </div>
                                                <h2 class="display-4">₱{currentMonth ? nFormatter(currentMonth.revenue, 2) : 0}</h2>
                                                <h6 class="text-uppercase">sales this month</h6>

                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-sm-6 py-2">
                                        <div class="card text-black h-100">
                                            <div class="card-body bg-white">
                                                <div class="rotate">
                                                </div>
                                                <h1 class="display-4">₱{lastMonth ? nFormatter(lastMonth.revenue, 2) : 0}</h1>
                                                <h6 class="text-uppercase">Sales last month</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-sm-6 py-2">
                                        <div class="card text-black h-100">
                                            <div class="card-body bg-white">
                                                <div class="rotate">
                                                </div>
                                                <h2 class="display-4">₱{thisyear ? nFormatter(thisyear.revenue, 2) : 0}</h2>
                                                <h6 class="text-uppercase">sales this year</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row d-flex justify-content-center mt-5 hlimit">
                                    {key == "monthly" && <SellChartMonthly dta={monthlyData} />}
                                    {key == "meds" && <SellChartMeds dta={barData} />}
                                    {key == "home" && <SellCharts lbl={labels} dta={cdata} ldta={ldata} />}
                                    <div class="row mb-3 d-flex justify-content-center">
                                        <Tabs
                                            id="controlled-tab-example"
                                            activeKey={key}
                                            onSelect={(k) => setKey(k)}
                                            className="mb-3 stabb"
                                        >
                                            <Tab eventKey="home" title="All">
                                                <SalesAll />
                                            </Tab>
                                            <Tab eventKey="meds" title="Medicine Sales">
                                                <SalesMeds />
                                            </Tab>
                                            <Tab eventKey="monthly" title="Monthly Report">
                                                <SalesMonthly />
                                            </Tab>
                                        </Tabs>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>


            </div>

        </Fragment>
    )
}

export default Sales
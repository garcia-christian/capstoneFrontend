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
    const [monthlyGraphData, setmonthlyGraphData] = useState([]);
    const [selectedMY, setSelectedMY] = useState(null)
    const [lastMY, setLastMY] = useState(null)
    const [selectedMY1, setSelectedMY1] = useState(null)
    const [lastMY1, setLastMY1] = useState(null)
    const [thisy, setThisy] = useState("")
    const [lasty, setLasty] = useState("")

    const setSMY1 = (value) => {
        setSelectedMY1(value)
    }
    const setLMY1 = (value) => {
        setLastMY1(value)
    }
    const setMGD = (value) => {
        setmonthlyGraphData(value)

    }
    const setSMY = (value) => {
        setSelectedMY(value)

        setThisy(value.monthword)
    }
    const setLMY = (value) => {
        setLastMY(value)
        if (value) {
            setLasty(value.monthword)
        } else {
            setLasty("No Data")
        }
    }
    const getDaysInCurrentMonth = () => {
        const date = new Date();

        return new Date(
            selectedMY.year,
            selectedMY.month,
            0
        ).getDate();
    }
    const loadData = async () => {
        try {
            const respo = await fetch(BASEURL + "/sell/get-sales/" + pharma.pharmacy_id + "/" + 0 + "/" + 0)
            const jData = await respo.json();
            const respo1 = await fetch(BASEURL + "/sell/get-daily-sales/" + pharma.pharmacy_id)
            const jData1 = await respo1.json();
            const respo3 = await fetch(BASEURL + "/sell/month-report/" + pharma.pharmacy_id)
            const jData3 = await respo3.json();
            const respo4 = await fetch(BASEURL + "/sell/this-year-report/" + pharma.pharmacy_id)
            const jData4 = await respo4.json();
            const respo5 = await fetch(BASEURL + "/sell/get-sales-meds/" + pharma.pharmacy_id + "/" + selectedMY1.year + "/" + selectedMY1.month)
            const jData5 = await respo5.json();
            setmonthlyData(jData3)
            setbarData(jData5)
            setData(jData)
            const days = []
            const dta = []
            const Ldta = []
            var date = new Date();
            var dy = date.getDate();
            var gencurrmonth = date.getMonth() + 1;
            var genlastmonth = date.getMonth();
            var currmonth = selectedMY.month;
            var lastmonth = (selectedMY.month === 1 ? 12 : selectedMY.month - 1);
            var year = date.getFullYear();
            jData3.map((value, index) => {
                if (gencurrmonth == value.month) {
                    setCurrentMonth(value)
                }
                if (genlastmonth == value.month) {
                    setLastMonth(value)
                }
            })

            await jData1.map((value, index) => {
                if (dy == value.day && value.month == gencurrmonth) {
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
    }, [pharma, selectedMY, selectedMY1])
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
                                    {key == "monthly" && <SellChartMonthly dta={monthlyGraphData} />}
                                    {key == "meds" && <SellChartMeds dta={barData} />}
                                    {key == "home" && <SellCharts lbl={labels} dta={cdata} ldta={ldata} smy={thisy} lmy={lasty} />}
                                    <div class="row mb-3 d-flex justify-content-center">
                                        <Tabs
                                            id="controlled-tab-example"
                                            activeKey={key}
                                            onSelect={(k) => setKey(k)}
                                            className="mb-3 stabb"
                                        >
                                            <Tab eventKey="home" title="Sales">
                                                <SalesAll setSMY={setSMY} setLMY={setLMY} />
                                            </Tab>
                                            <Tab eventKey="meds" title="Medicine Sales">
                                                <SalesMeds setSMY={setSMY1} setLMY={setLMY1} />
                                            </Tab>
                                            <Tab eventKey="monthly" title="Monthly Report">
                                                <SalesMonthly setMGD={setMGD} />
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
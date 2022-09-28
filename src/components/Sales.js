import React, { Fragment, useEffect, useState, useContext } from "react";

import { PharmaContext } from "../context/PharmaContext"
import "./css/salesStyle.css"
import SellCharts from "./SellCharts";
const Sales = () => {
    const { pharma, setPharma } = useContext(PharmaContext);
    const [data, setData] = useState([])
    const [labels, setLabels] = useState([])
    const [cdata, setCdata] = useState([])
    const [today, setToday] = useState()
    const [currentMonth, setCurrentMonth] = useState([]);
    const [lastMonth, setLastMonth] = useState([]);
    function daysInMonth(month, year) { // Use 1 for January, 2 for February, etc.
        return new Date(year, month, 0).getDate();
    }
    const loadData = async () => {
        try {
            const respo = await fetch("http://localhost:5000/sell/get-sales/" + pharma.pharmacy_id)
            const jData = await respo.json();
            const respo1 = await fetch("http://localhost:5000/sell/get-daily-sales/" + pharma.pharmacy_id)
            const jData1 = await respo1.json();
            const respo3 = await fetch("http://localhost:5000/sell/this-month-report/" + pharma.pharmacy_id)
            const jData3 = await respo3.json();

            setData(jData)
            const days = []
            const dta = []
            var date = new Date();
            var dy = date.getDate();
            var currmonth = date.getMonth() + 1;
            var lastmonth = date.getMonth();
            jData3.map((value, index) => {
                if (currmonth == value.month) {
                    setCurrentMonth(value)
                }
                if (lastmonth == value.month) {
                    setLastMonth(value)
                }
            })

            await jData1.map((value, index) => {
                if (dy == value.day) {
                    console.log('passed');
                    setToday(value)
                }
            })
            console.log(currmonth);
            for (let i = 1; i < daysInMonth(2021, 7); i++) {
                days.push(i)
                let o = 0
                await jData1.map((value, index) => {
                    if (value.day == i && value.month == currmonth) {
                        console.log(value.month);
                        dta.push(value.revenue)
                        o = 1
                    }
                })
                if (o !== 1) {
                    dta.push(0)
                }
            }

            setLabels(days)
            setCdata(dta)
            console.log(days);
            console.log(dta);
        } catch (err) {
            console.error(err.message);
        }
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
                                                <h1 class="display-4 ">₱{today ? today.revenue : 0}</h1>
                                                <h6 class="text-uppercase">Today's Profit</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-sm-6 py-2 ml-5">
                                        <div class="card text-black h-100">
                                            <div class="card-body bg-white">
                                                <div class="rotate">
                                                </div>

                                                <h1 class="display-4">₱{lastMonth ? lastMonth.revenue : 0}</h1>
                                                <h6 class="text-uppercase">Sales last month</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-sm-6 py-2">
                                        <div class="card text-black h-100">
                                            <div class="card-body bg-white">
                                                <div class="rotate">
                                                </div>
                                                <h2 class="display-4">₱{currentMonth ? currentMonth.revenue : 0}</h2>
                                                <h6 class="text-uppercase">sales this month</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-sm-6 py-2">
                                        <div class="card text-black h-100">
                                            <div class="card-body bg-white">
                                                <div class="rotate">
                                                </div>
                                                <h2 class="display-4">₱9M</h2>
                                                <h6 class="text-uppercase">sales this year</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row d-flex justify-content-center mt-5 hlimit">

                                    <SellCharts lbl={labels} dta={cdata} />

                                    <div class="row mb-3 d-flex justify-content-center">
                                        <div class="table-responsive">
                                            <table class="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Sale#</th>
                                                        <th>Total Ammount</th>
                                                        <th>Date</th>
                                                        <th>Cash</th>
                                                        <th>Discount</th>
                                                        <th>Change</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.map((value, index) => (
                                                        <tr>
                                                            <td><h6>{value.salesinvoice_id}</h6></td>
                                                            <td>₱{value.total_price} </td>
                                                            <td>{new Date(value.Date).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" })}</td>
                                                            <td>₱{value.payed_ammount}</td>
                                                            <td>{value.discount_desc}</td>
                                                            <td>₱{value.change}</td>
                                                        </tr>
                                                    ))}

                                                </tbody>
                                            </table>
                                        </div>
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
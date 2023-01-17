
import React, { useEffect, useState, useContext } from "react";
import Select from 'react-select'

import { PharmaContext } from "../context/PharmaContext"
import { urlApi } from "../context/urlAPI";

const SalesAll = ({ setSMY, setLMY }) => {
    const { BASEURL } = useContext(urlApi);
    const [data, setData] = useState([])
    const [dates, setDates] = useState([])
    const [date, setDate] = useState(null)
    const { pharma, setPharma } = useContext(PharmaContext);
    const loadDed = async () => {
        try {
            const respo1 = await fetch(BASEURL + "/sell/get-month-years/" + pharma.pharmacy_id)
            const jData1 = await respo1.json();
            setDates(jData1)
            setDate(jData1[0])
            setSMY(jData1[0])
            setLMY(jData1[1])
        } catch (err) {
            console.error(err.message);
        }
    }
    const loadData = async () => {
        try {
            const respo = await fetch(BASEURL + "/sell/get-sales/" + pharma.pharmacy_id + "/" + date.year + "/" + date.month)
            const jData = await respo.json();
            setData(jData)

        } catch (err) {
            console.error(err.message);
        }
    }
    useEffect(() => {
        if (pharma) {
            loadDed()
        }
    }, [pharma])
    useEffect(() => {
        loadData()
    }, [date])
    const handelChangeYear = e => {
        setDate(e)
        setSMY(e)
        dates.map((value, index) => {
            if (value.num === e.num) {
                setLMY(dates[index + 1]);
            }
        })
    }
    return (
        <div class="table-responsive">
            <div className="rotate">

                <Select
                    value={date}
                    options={dates}
                    getOptionLabel={e => e.monthword + " " + e.year}
                    getOptionValue={e => e.num}
                    defaultValue={date}
                    isSearchable={false}
                    isClearable={false}
                    defaultOptions={false}
                    onChange={handelChangeYear}
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                    className="sort" />


            </div>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Sale#</th>
                        <th>Total Ammount</th>
                        <th>Items Bought</th>
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
                            <td>{value.items} </td>
                            <td>{new Date(value.Date).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" })}</td>
                            <td>₱{value.payed_ammount}</td>
                            <td>{value.discount_desc}</td>
                            <td>₱{value.change}</td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    )
}

export default SalesAll
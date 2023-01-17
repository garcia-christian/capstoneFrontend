
import React, { useEffect, useState, useContext } from "react";
import Select from 'react-select'
import { PharmaContext } from "../context/PharmaContext"
import { urlApi } from "../context/urlAPI";
import ViewMonthSales from "./ViewMonthSales";
const SalesMonthly = ({ setMGD }) => {

    const { BASEURL } = useContext(urlApi);
    const [data, setData] = useState([])
    const [years, setYears] = useState([])
    const [year, setYear] = useState(null)
    const [month, setMonth] = useState(null)
    const { pharma, setPharma } = useContext(PharmaContext);
    const [toggle, setToggle] = useState(false)
    const handleClose = () => setToggle(false);
    const handleShow = () => setToggle(true);
    const loadData = async () => {
        try {

            const respo1 = await fetch(BASEURL + "/sell/get-years/" + pharma.pharmacy_id)
            const jData1 = await respo1.json();
            setYears(jData1)
            setYear(jData1[0])
        

        } catch (err) {
            console.error(err.message);
        }
    }
    const loadDed = async () => {
        try {
            const respo = await fetch(BASEURL + "/sell/monthly-report/" + pharma.pharmacy_id + "/" + year.year)
            const jData = await respo.json();
            setData(jData)
            setMGD(jData)
        } catch (err) {
            console.error(err.message);
        }
    }
    const handelChangeYear = value => {
        setYear(value)
        loadDed()
    }
    const cashFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });
    useEffect(() => {
        if (pharma) {
            loadData()
        }
    }, [pharma])
    useEffect(() => {
        loadDed()
    }, [year])
    const handelRowClick = value => {
        setToggle(true)
        setMonth(value)
        console.log(value);
    }
    return (
        <div class="table-responsive">
            <div className="rotate">

                <Select
                    isSearchable={false}
                    value={year}
                    options={years}
                    getOptionLabel={e => e.year}
                    getOptionValue={e => e.year}
                    onChange={handelChangeYear}
                    isClearable={false}
                    defaultOptions={false}
                    defaultValue={year}
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                    className="sort" />


            </div>

            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Transactions</th>
                        <th>Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((value, index) => (
                        <tr onClick={(e) => handelRowClick(value)}>
                            <td><h6>{value.monthlong}</h6></td>
                            <td>{value.transactions} </td>
                            <td>{cashFormatter.format(value.revenue)}</td>
                        </tr>
                    ))}

                </tbody>
            </table>
            <ViewMonthSales toggle={toggle} show={handleShow} close={handleClose} year={year} month={month} />
        </div>
    )
}

export default SalesMonthly
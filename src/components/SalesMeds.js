
import React, { useEffect, useState, useContext } from "react";
import Select from 'react-select'
import { PharmaContext } from "../context/PharmaContext"
import { urlApi } from "../context/urlAPI";

const SalesMeds = ({ setSMY, setLMY }) => {
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
            const respo = await fetch(BASEURL + "/sell/get-sales-meds/" + pharma.pharmacy_id + "/" + date.year + "/" + date.month)
            const jData = await respo.json();
            setData(jData)

        } catch (err) {
            console.error(err.message);
        }
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
                        <th>Medicine #</th>
                        <th>Brand Name</th>
                        <th>Generic Name</th>
                        <th>Category</th>
                        <th>Items Sold</th>
                        <th>Total Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((value, index) => (
                        <tr>
                            <td><h6>{value.med_id}</h6></td>
                            <td>{value.global_brand_name} </td>
                            <td>{value.global_generic_name}</td>
                            <td>{value.med_cat_desc}</td>
                            <td>{value.purchased ? value.purchased : 0}</td>
                            <td>{cashFormatter.format(value.revenue)}</td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    )
}

export default SalesMeds
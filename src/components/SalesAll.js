
import React, { useEffect, useState, useContext } from "react";

import { PharmaContext } from "../context/PharmaContext"
import { urlApi } from "../context/urlAPI";

const SalesAll = () => {
    const { BASEURL } = useContext(urlApi);
    const [data, setData] = useState([])
    const { pharma, setPharma } = useContext(PharmaContext);
    const loadData = async () => {
        try {
            const respo = await fetch(BASEURL + "/sell/get-sales/" + pharma.pharmacy_id)
            const jData = await respo.json();
            setData(jData)

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
    )
}

export default SalesAll
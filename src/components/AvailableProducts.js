
import React, { useEffect, useState, useContext } from "react";

import { PharmaContext } from "../context/PharmaContext"
import { urlApi } from "../context/urlAPI";
const cashFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});
const AvailableProducts = () => {
    const { BASEURL } = useContext(urlApi);
    const [data, setData] = useState([])
    const { pharma, setPharma } = useContext(PharmaContext);
    const loadData = async () => {
        try {
            const respo = await fetch(BASEURL + "/medicine/get-stock/" + pharma.pharmacy_id)
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
                        <th>Product name</th>
                        <th>Brand</th>
                        <th>Available Quantity</th>
                        <th>Price</th>
                        <th>Batches</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody >
                    {data.map((value, index) => (
                        <tr>
                            <td>
                                <h6>{value.global_brand_name}</h6>
                                {value.global_generic_name}
                            </td>
                            <td>
                                {value.global_brand}
                            </td>
                            <td>
                                {value.total}
                            </td>
                            <td>
                                {cashFormatter.format(value.med_price)}
                            </td>
                            <td>
                                {value.batches}
                            </td>
                            <td>{value.med_notes}</td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    )
}

export default AvailableProducts
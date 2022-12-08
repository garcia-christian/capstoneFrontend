
import React, { useEffect, useState, useContext } from "react";

import { PharmaContext } from "../context/PharmaContext"
import { urlApi } from "../context/urlAPI";

const SalesMeds = () => {
    const { BASEURL } = useContext(urlApi);
    const [data, setData] = useState([])
    const { pharma, setPharma } = useContext(PharmaContext);
    const loadData = async () => {
        try {
            const respo = await fetch(BASEURL + "/sell/get-sales-meds/" + pharma.pharmacy_id)
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
            loadData()
        }
    }, [pharma])
    return (
        <div class="table-responsive">
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
                            <td>{value.purchased?value.purchased:0}</td>
                            <td>{cashFormatter.format(value.revenue)}</td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    )
}

export default SalesMeds
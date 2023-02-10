
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
const StockList = ({ pharmacy }) => {
    const { BASEURL } = useContext(urlApi);
    const [data, setData] = useState([])
    const { pharma, setPharma } = useContext(PharmaContext);
    const loadData = async () => {
        try {
            const respo = await fetch(BASEURL+"/medicine/get-stock-list/" + pharma.pharmacy_id)
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
                        <th>Batch #</th>
                        <th className="w-50">Product Name</th>
                        <th className="w-25">Date Manufactured</th>
                        <th className="w-25">Date Expired</th>
                        <th>Listed Quantity</th>
                        <th>Listing Price</th>
                    </tr>
                </thead>
                <tbody >
                    {data.map((value, index) => (
                        <tr>
                            <td>
                                <h6>{value.onPurhcaseInv_id}</h6>

                            </td>
                            <td>
                                {value.global_brand_name}
                                {" | "}
                                {value.global_generic_name}
                            </td>
                            <td>
                                {new Date(value.manufactureDate).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" })}
                            </td>
                            <td>
                                {new Date(value.expiry_date).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" })}
                            </td>
                            <td >
                                {value.listedqty}
                            </td>
                            <td className="text-end" >{cashFormatter.format(value.listing_price)}</td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    )
}

export default StockList

import React, { useEffect, useState, useContext } from "react";

import { PharmaContext } from "../context/PharmaContext"
const StockList = ({pharmacy}) => {
const [data,setData] = useState([])
const { pharma, setPharma } = useContext(PharmaContext);
const loadData = async () => {
    try {
        const respo = await fetch("http://localhost:5000/medicine/get-stock-list/"+ pharma.pharmacy_id)
        const jData = await respo.json();
        setData(jData)
    } catch (err) {
        console.error(err.message);
    }
}
useEffect(() => {
    if(pharma){
        loadData()
    }
}, [pharma])
  return (
    <div class="table-responsive">
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Batch #</th>
                <th>Product Name</th>
                <th>Date Manufactured</th>
                <th>Date Expired</th>
                <th>Listed Quantity</th>
                <th>Retail Price</th>
            </tr>
        </thead>
        <tbody >
            {data.map((value,index) => (
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
                        {new Date(value.manufactureDate).toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"}) }
                    </td>
                    <td>
                        {new Date(value.expiry_date).toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"}) }
                    </td>
                    <td>
                        {value.listedqty}
                    </td>
                    <td>₱{value.med_price}</td>
                </tr>
            ))}

        </tbody>
    </table>
</div>
  )
}

export default StockList
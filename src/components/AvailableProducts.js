
import React, { useEffect, useState, useContext } from "react";

import { PharmaContext } from "../context/PharmaContext"

const AvailableProducts = () => {
const [data,setData] = useState([])
const { pharma, setPharma } = useContext(PharmaContext);
const loadData = async () => {
    try {
        const respo = await fetch("http://localhost:5000/medicine/get-stock/"+ pharma.pharmacy_id)
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
                <th>Product name</th>
                <th>Brand</th>
                <th>Available Quantity</th>
                <th>Price</th>
                <th>Batches Available</th>
                <th>Notes</th>
            </tr>
        </thead>
        <tbody >
            {data.map((value,index) => (
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
                        ₱{value.med_price}
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
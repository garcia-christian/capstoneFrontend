
import React, { useEffect, useState, useContext } from "react";
import Button from 'react-bootstrap/Button';
import { PharmaContext } from "../context/PharmaContext"
import { urlApi } from "../context/urlAPI";
import AddMissing from "./AddMissing";
const cashFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});
const Missing = () => {
    const { BASEURL } = useContext(urlApi);
    const [data, setData] = useState([])
    const { pharma, setPharma } = useContext(PharmaContext);
    const [toggle, setToggle] = useState(false)
    const handleClose = () => setToggle(false);
    const handleShow = () => setToggle(true);
    const loadData = async () => {
        try {
            const respo = await fetch(BASEURL + "/medicine/get-missing-medicine/" + pharma.pharmacy_id)
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
        <div>
            <div class="table-responsive mistable">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Missing ID</th>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Item Price</th>
                            <th>Report Date</th>
                        </tr>
                    </thead>
                    <tbody >
                        {data.map((value, index) => (
                            <tr>
                                <td>
                                    <h6>{value.missing_id}</h6>

                                </td>
                                <td>
                                    {value.global_brand_name}
                                    {" | "}
                                    {value.global_generic_name}
                                </td>
                                <td>
                                    {value.quantity}
                                </td>
                                <td>
                                    {cashFormatter.format(value.current_item_price)}
                                </td>
                                <td>
                                    {new Date(value.report_date).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" })}

                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>

            </div>
            <div className="d-grid gap-2">
                <Button variant="primary" size="lg" onClick={handleShow} >
                    <i class="bi bi-plus-lg"></i> Add Missing/Damaged/Expired Product
                </Button>

            </div>
            {toggle && <AddMissing toggle={toggle} refresh={loadData} close={handleClose} />}
        </div>
    )
}

export default Missing
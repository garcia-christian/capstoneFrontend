import React, { useEffect, useState, Fragment, useContext, useRef } from "react";
import { PharmaContext } from "../context/PharmaContext"
import { urlApi } from "../context/urlAPI";
import Button from 'react-bootstrap/Button';
import AddDiscount from "./AddDiscount";
import EditDiscount from "./EditDiscount";
import toast from "react-hot-toast";
const DiscountSettings = () => {
    const { pharma, setPharma } = useContext(PharmaContext);
    const { BASEURL } = useContext(urlApi);
    const [rawData, setRawData] = useState([]);
    const [toggle, setToggle] = useState(false)
    const handleClose = () => setToggle(false);
    const handleShow = () => setToggle(true);
    const [etoggle, seteToggle] = useState(false)
    const ehandleClose = () => seteToggle(false);
    const ehandleShow = () => seteToggle(true);
    const [edit, setEdit] = useState('')
    const editinit = (value) => {
        setEdit(value);
        seteToggle(true);
    }
    const loadData = async () => {
        try {
            const respo = await fetch(BASEURL + "/sell/discount/" + pharma.pharmacy_id)
            const jData = await respo.json();
            setRawData(jData)
            console.log(jData);
        } catch (err) {
            console.error(err.message);
        }
    }
    const deleteDisc = async (delDisc) => {
        try {
            const editdisc = await fetch(BASEURL + "/settings/delete-discount/" + delDisc.discount_id, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },

            });
            const jData = await editdisc.json();
            loadData()
            toast.success(delDisc.discount_desc + " Deleted")
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
            <h5 className="normtext">Discount List</h5>
            <div class="table-responsive settable">
                <table class="table table-hover ">
                    <thead>
                        <tr>
                            <th>ID #</th>
                            <th>Discount Description</th>
                            <th>Discount Value</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody >
                        {rawData.map((value, index) => (
                            <tr>
                                <td>
                                    <h6>{value.discount_id}</h6>
                                </td>
                                <td>
                                    {value.discount_desc}
                                </td>
                                <td>
                                    {value.discount_cost * 100 + "%"}
                                </td>
                                <td className="eedtit">
                                    <i class="bi bi-pencil-square eedtit" onClick={(e) => { editinit(value) }}></i>
                                </td>
                                <td className="deleteee">
                                    <i class="bi bi-x-square " onClick={(e) => { deleteDisc(value) }}></i>
                                </td>
                            </tr>
                        ))}



                    </tbody>
                </table>
            </div>
            <div className="d-grid gap-2">
                <Button variant="primary" onClick={handleShow} size="lg">
                    <i class="bi bi-plus-lg"></i> Add Discount
                </Button>

            </div>
            {toggle && <AddDiscount toggle={toggle} show={handleShow} load={loadData} close={handleClose} />}
            {etoggle && <EditDiscount toggle={etoggle} show={ehandleShow} data={edit} load={loadData} close={ehandleClose} />}

        </div>


    )
}

export default DiscountSettings
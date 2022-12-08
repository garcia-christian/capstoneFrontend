import React, { useEffect, useState, Fragment, useContext, useRef } from "react";
import { PharmaContext } from "../context/PharmaContext"
import { urlApi } from "../context/urlAPI";
import Button from 'react-bootstrap/Button';
import AddStaff from "./AddStaff";
import EditStaff from "./EditStaff";
import toast, { Toaster } from 'react-hot-toast';

const StaffSettings = () => {
    const { pharma, setPharma } = useContext(PharmaContext);
    const { BASEURL } = useContext(urlApi);
    const [rawData, setRawData] = useState([]);
    const [toggle, setToggle] = useState(false)
    const handleClose = () => setToggle(false);
    const handleShow = () => setToggle(true);
    const [toggle2, setToggle2] = useState(false)
    const handleClose2 = () => setToggle2(false);
    const handleShow2 = () => setToggle2(true);
    const [access, setAccess] = useState('');
    const [staff, setStaff] = useState()

    const edit = (value) => {
        setToggle2(true)
        setStaff(value)
    }

    const loadData = async () => {
        try {
            const respo = await fetch(BASEURL + "/settings/get-staff/" + pharma.pharmacy_id)
            const jData = await respo.json();
            setRawData(jData)

        } catch (err) {
            console.error(err.message);
        }
    }
    useEffect(() => {
        if (pharma) {
            loadData()
        }
    }, [pharma])
    const deleteStaff = async (value) => {
        try {
            const editdisc = await fetch(BASEURL + "/settings/delete-staff/", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pa_id: value.pa_id, admin_id: value.admin_id })

            });
            const jData = await editdisc.json();
            loadData()

        } catch (err) {
            console.error(err.message);
        }
    }
    return (
        <div>
            <h5 className="normtext">Staff List</h5>
            <div class="table-responsive settable">
                <table class="table table-hover ">
                    <thead>
                        <tr>
                            <th>ID #</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Access</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody >
                        {rawData.map((value, index) => (
                            <tr >
                                <td>
                                    <h6>{value.admin_id}</h6>
                                </td>
                                <td>
                                    {value.admin_name}
                                </td>
                                <td>
                                    {value.admin_email}
                                </td>

                                <td>
                                    {value.roleDesc}
                                </td>
                                <td>
                                    {value.access}/6
                                </td>
                                <td className="eedtit">
                                    <i class="bi bi-pencil-square " onClick={(e) => edit(value)}></i>
                                </td>
                                <td className="deleteee">
                                    <i class="bi bi-x-square" onClick={(e) => { deleteStaff(value) }}></i>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="d-grid gap-2">
                <Button variant="primary" size="lg" onClick={handleShow}>
                    <i class="bi bi-plus-lg"></i> Add Staff
                </Button>

            </div>
            {toggle && <AddStaff toggle={toggle} close={handleClose} refresh={loadData} />}
            {toggle2 && <EditStaff toggle={toggle2} close={handleClose2} data={staff} refresh={loadData} />}
        </div>
    )
}

export default StaffSettings
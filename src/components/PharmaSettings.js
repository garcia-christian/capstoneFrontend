import React, { useEffect, useState, Fragment, useContext, useRef } from "react";
import { PharmaContext } from "../context/PharmaContext"
import { urlApi } from "../context/urlAPI";
import './css/settings.css'
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";
import toast, { Toaster } from 'react-hot-toast';



const PharmaSettings = () => {
    const [pname, setPname] = useState('');
    const [ploc, setPloc] = useState('');
    const [ptimeo, setPtimeo] = useState('');
    const [ptimec, setPtimec] = useState('');
    const [rawData, setRawData] = useState([]);
    const { pharma, setPharma } = useContext(PharmaContext);
    const { BASEURL } = useContext(urlApi);
    const [active, setActive] = useState(true);
    const getData = async () => {
        try {
            const respo = await fetch(BASEURL + "/settings/get-pharma/" + pharma.pharmacy_id)
            const jData = await respo.json();
            setRawData(jData);
            setPname(jData.pharmacy_name);
            setPloc(jData.pharmacy_location);
            setPtimeo(jData.pharamcy_openingtime)
            setPtimec(jData.pharamcy_closingtime)
            console.log(rawData);
        } catch (err) {
            console.error(err.message);
        }
    }
    const saveChanges = async () => {
        if (pname == "") {
            toast.error("Pharmacy Nmae cannot be empty")
        } else if (ploc == "") {
            toast.error("Location cannot be empty")
        } else if (ptimec == "") {
            toast.error("Please set up closing time")
        } else if (ptimeo == "") {
            toast.error("Please set up opening time")
        } else {

            const toastId = toast.loading('Loading...');
            const body = {
                id: rawData.pharmacy_id,
                name: pname,
                loc: ploc,
                open: ptimeo,
                close: ptimec
            }

            try {
                const editmd = await fetch(BASEURL + "/settings/edit-pharma/", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });
                const res = await editmd.json();
                if (editmd.status == 200) {
                    toast.success("Changes Saved")
                    toast.dismiss(toastId);
                    window.location.reload();
                } else {
                    toast.dismiss(toastId);
                    toast.error(res)
                }
            } catch (error) {
                console.error(error.message)
                toast.dismiss(toastId);
                toast.error('Saving Failed')
            }
        }
    }
    useEffect(() => {
        if (pharma) {
            getData()
            console.log("sds");
        }
    }, [])
    useEffect(() => {
        if (rawData.pharmacy_name == pname && rawData.pharmacy_location == ploc && rawData.pharamcy_openingtime == ptimeo && rawData.pharamcy_closingtime == ptimec) {
            setActive(true)
        } else if (pname == "" && ploc == "" && ptimeo == "" && ptimec) {
            setActive(true)
        }
        else {
            setActive(false)
        }
    }, [pname, ploc, ptimec, ptimeo])
    return (
        <div>
            <h5 class="mt-3 normtext">Pharmacy Name</h5>
            <div class="form-row mt-3 ">
                <div class="col-6">
                    <input type="text" value={pname} onChange={(e) => setPname(e.target.value)} class="form-control" placeholder="Pharmacy Name" />
                </div>
            </div>
            <h5 class="mt-4 normtext">Display Location</h5>
            <div class="form-row mt-3 ">
                <div class="col-6">
                    <input type="text" value={ploc} onChange={(e) => setPloc(e.target.value)} class="form-control" placeholder="Location" />
                </div>
            </div>
            <h5 class="mt-4 normtext">Opening Time</h5>
            <div class="form-row mt-3 ">
                <div class="col-3">
                    <Form.Control value={ptimeo} onChange={(e) => setPtimeo(e.target.value)} type="time"></Form.Control>

                </div>
            </div>
            <h5 class="mt-4 normtext">Closing time</h5>
            <div class="form-row mt-3 ">
                <div class="col-3">
                    <Form.Control value={ptimec} onChange={(e) => setPtimec(e.target.value)} type="time"></Form.Control>

                </div>
            </div>
            <div class="form-row mt-4 ">
                <div class="col-5 ">
                    <Button disabled={active} onClick={saveChanges} variant="primary">Save Changes</Button>
                </div>

            </div>

        </div>
    )
}

export default PharmaSettings
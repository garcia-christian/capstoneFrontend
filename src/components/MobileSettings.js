import React, { useEffect, useState, Fragment, useContext, useRef } from "react";
import hrmds from "./images/hrmds.png";
import { PharmaContext } from "../context/PharmaContext"
import { urlApi } from "../context/urlAPI";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import toast, { Toaster } from 'react-hot-toast';

const MobileSettings = () => {
    const [selected, setSelected] = useState(0);
    const { pharma, setPharma } = useContext(PharmaContext);
    const { BASEURL } = useContext(urlApi);
    function hrSetter(params) {
        if (params == 1) {
            return params + " Hour"
        } else {
            return params + " Hours"
        }
    }
    const loadData = async () => {
        try {
            const respo = await fetch(BASEURL + "/settings/get-pharma/" + pharma.pharmacy_id)
            const jData = await respo.json();
            setSelected(jData.pharmacy_timelimit)

        } catch (err) {
            console.error(err.message);
        }
    }
    const saveChanges = async (val) => {
        const toastId = toast.loading('Loading...');
        setSelected(val)
        try {

            const body = {
                pharmacy: pharma.pharmacy_id,
                time: val,

            }
            const editmd = await fetch(BASEURL + "/settings/edit-pharma-timelimit/", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });


            const res = await editmd.json();
            toast.success("Saved")
            toast.dismiss(toastId);
        } catch (error) {
            console.log(error.message);
            toast.dismiss(toastId);
            toast.error('Saving Failed')
        }


    }


    useEffect(() => {
        if (pharma) {
            loadData()
        }
    }, [pharma])




    return (
        <div>
            <h5 class="mt-3 normtext">Set Pick-up Time Limit</h5>
            <div class="form-row mt-3 ">
                <div class="col-3">
                    <DropdownButton title={selected ? hrSetter(selected) : "Select Time Limit"} id="dropdown-item-button-drop-down">
                        <Dropdown.ItemText>Select Discount</Dropdown.ItemText>
                        <Dropdown.Item onClick={() => saveChanges(1)} as="button" >1hr</Dropdown.Item>
                        <Dropdown.Item onClick={() => saveChanges(2)} as="button" >2hrs</Dropdown.Item>
                        <Dropdown.Item onClick={() => saveChanges(3)} as="button" >3hrs</Dropdown.Item>
                        <Dropdown.Item onClick={() => saveChanges(4)} as="button" >4hrs</Dropdown.Item>
                        <Dropdown.Item onClick={() => saveChanges(5)} as="button" >5hrs</Dropdown.Item>
                        <Dropdown.Item onClick={() => saveChanges(6)} as="button" >6hrs</Dropdown.Item>
                        <Dropdown.Item onClick={() => saveChanges(7)} as="button" >7hrs</Dropdown.Item>
                        <Dropdown.Item onClick={() => saveChanges(8)} as="button" >8hrs</Dropdown.Item>
                    </DropdownButton>
                </div>
            </div>
            <h5 class="mt-5 normtext">Mobile App</h5>
            <div class="form-row mt-3 ">
                <div class="col-6">
                    <h6 className='normtext '>Download  <a className='heremedslink' target="_blank" href='https://www.google.com.ph/'>  <img class="hrmpng" src={hrmds} alt="hereMeds" />  <i class="bi bi-box-arrow-up-right"></i></a></h6>
                </div>
            </div>
        </div >
    )
}

export default MobileSettings
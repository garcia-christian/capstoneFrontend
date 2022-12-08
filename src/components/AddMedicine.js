import React, { useEffect, useState, Fragment, useContext, useRef } from "react";
import { PharmaContext } from "../context/PharmaContext"
import AsyncSelect from 'react-select/async'
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { urlApi } from "../context/urlAPI";






const AddMedicine = ({ getData }) => {
    const { BASEURL } = useContext(urlApi);
    const refMed = useRef(null);
    const refPr = useRef(null);
    const { pharma, setPharma } = useContext(PharmaContext);
    const [notes, setNotes] = useState('');
    const [storage, setStorage] = useState('');
    const [price, setPrice] = useState(0);
    const [threshold, setThreshold] = useState(0);
    const [inputValue, setinputValue] = useState('');
    const [selectedValue, setSelectedValue] = useState(null)
    const [href, setHref] = useState('');
    const fetchData = () => {
        return fetch(BASEURL + "/medicine/get-global-med/" + inputValue).then(res => {

            return res.json()
        })
    }

    const handleInputChange = value => {
        setinputValue(value);
    }

    const handleChange = value => {
        setSelectedValue(value);
        console.log(value);
    }

    const submit = async () => {
        const toastId = toast.loading('Loading...');



        try {
            const medbody = {
                pharmacy: pharma.pharmacy_id,
                global_med: selectedValue.global_med_id,
                price: price,
                storage: storage,
                notes: notes,
                threshold: threshold
            }
            const addlocalMed = await fetch(BASEURL + "/medicine/add-local", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(medbody)
            });
            const res = await addlocalMed.json();
            console.log(addlocalMed.status);
            if (addlocalMed.status == 200) {
                setHref('modal')
                getData()
                setNotes('')
                setStorage('')
                setThreshold('')
                setPrice(0)
                setinputValue('')
                setSelectedValue(null)
                toast.dismiss(toastId);
                toast.success('Added')
            } else {
                setHref('')
                getData()
                setNotes('')
                setStorage('')
                setThreshold('')
                setPrice(0)
                setinputValue('')
                setSelectedValue(null)
                toast.dismiss(toastId);
                toast.error(res)
            }
        } catch (error) {
            setHref('')
            console.error(error.message)
            toast.dismiss(toastId);
            toast.error('Saving Failed')
        }


    }
    const checkSubmit = () => {
        if (!selectedValue) {
            toast.error('Select a medicine')
            refMed.current.focus();
            setHref('')
        }
        else if (!price) {
            setHref('')
            toast.error('Price cannot be empty')
            refPr.current.focus();
        } else {
            setHref('modal')
        }
    }
    useEffect(() => {
        if (!selectedValue) {
            setHref('')
        }
        else if (!price) {
            setHref('')
        }
        else if (!threshold) {
            setHref('')
        } else {
            setHref('modal')
        }
    }, [selectedValue, price])
    return (
        <div>
            <div class="modal fade" id="addModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalToggleLabel">Register Medicine</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <h6 class="mt-2">Medicine</h6>

                            <div class="form-row ">
                                <div class="col-12">
                                    <AsyncSelect
                                        ref={refMed}
                                        cacheOptions
                                        defaultOptions
                                        value={selectedValue}
                                        getOptionLabel={e => e.global_brand_name + " | " + e.global_generic_name}
                                        getOptionValue={e => e.global_med_id}
                                        loadOptions={fetchData}
                                        onInputChange={handleInputChange}
                                        onChange={handleChange}
                                        className="med" />

                                </div>

                            </div>
                            <h6 class="mt-3">Set Price</h6>
                            <div class="form-row mt-2 ">

                                <div class="col-5">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text" id="inputGroup-sizing-default">₱</span>
                                        </div>
                                        <input type="number" pattern="[0-9]*" ref={refPr} value={price} onChange={(e) => setPrice(e.target.value)} placeholder='Set med Price' class="form-control numnum" aria-label="Default" aria-describedby="inputGroup-sizing-default" />
                                    </div>
                                </div>
                            </div>
                            <h6 class="mt-3">Quantity Warning Threshold</h6>
                            <div class="form-row mt-2 ">
                                <div class="col-6">
                                    <input type="number" pattern="[0-9]*" value={threshold} onChange={(e) => setThreshold(e.target.value)} class="form-control numnum" placeholder="Threshold" />
                                </div>
                            </div>
                            <h6 class="mt-3">Storage Notes</h6>
                            <div class="form-row mt-2 ">
                                <div class="col-6">
                                    <input type="text" value={storage} onChange={(e) => setStorage(e.target.value)} class="form-control" placeholder="Storage Notes" />
                                </div>
                            </div>
                            <h6 class="mt-3">Notes</h6>
                            <div class="form-row mt-2 ">
                                <div class="col-9">
                                    <textarea class="form-control" value={notes} onChange={(e) => setNotes(e.target.value)} id="exampleFormControlTextarea1" rows="2"></textarea>                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-primary" data-bs-target="#addModalToggle2" onClick={checkSubmit} data-bs-toggle={href} data-bs-dismiss={href}>Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal fade" id="addModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalToggleLabel2">Modal 2</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            Confirm Added Medicine
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-primary" data-bs-target="#exampleModalToggle" onClick={submit} data-bs-dismiss="modal">Yes</button>
                        </div>
                    </div>
                </div>
            </div>
            <a class="btn btn-primary ml-4 mb-2" data-bs-toggle="modal" href="#addModalToggle" role="button">Register Medicine</a>
        </div>
    )
}

export default AddMedicine
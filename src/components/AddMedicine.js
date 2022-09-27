import React, { useEffect, useState, Fragment, useContext } from "react";
import { PharmaContext } from "../context/PharmaContext"
import AsyncSelect from 'react-select/async'
import { useNavigate } from "react-router-dom";

const AddMedicine = () => {
    const { pharma, setPharma } = useContext(PharmaContext);
    const [notes, setNotes] = useState('');
    const [storage, setStorage] = useState('');
    const [price, setPrice] = useState(0);
    const [inputValue, setinputValue] = useState('');
    const [selectedValue, setSelectedValue] = useState(null)
    const navigate = useNavigate();
    const fetchData = () => {
        return fetch("http://localhost:5000/medicine/get-global-med/" + inputValue).then(res => {

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
        const medbody = {
            pharmacy: pharma.pharmacy_id,
            global_med: selectedValue.global_med_id,
            price: price,
            storage: storage,
            notes: notes,
            med_qty: 0
        }
        const addlocalMed = await fetch("http://localhost:5000/medicine/add-local", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(medbody)
        });
        const res = await addlocalMed.json();
        console.log(res);
        navigate(0);
    }

    return (
        <div>
            <div class="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalToggleLabel">Register Medicine</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <h6 class="mt-2">Global Medicine</h6>

                            <div class="form-row ">
                                <div class="col-8">
                                    <AsyncSelect
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
                                        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder='Set med Price' class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" />
                                    </div>
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
                            <button class="btn btn-primary" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal" data-bs-dismiss="modal">Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
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
            <a class="btn btn-primary ml-4 mb-2" data-bs-toggle="modal" href="#exampleModalToggle" role="button">Register Medicine</a>
        </div>
    )
}

export default AddMedicine
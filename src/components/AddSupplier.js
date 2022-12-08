import React, { useEffect, useState, Fragment, useContext } from "react";
import { PharmaContext } from "../context/PharmaContext"
import { useNavigate } from "react-router-dom";
import { urlApi } from "../context/urlAPI";
import toast, { Toaster } from 'react-hot-toast';

const AddSupplier = ({ getData }) => {
    const { BASEURL } = useContext(urlApi);
    const { pharma, setPharma } = useContext(PharmaContext);
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');
    const navigate = useNavigate();
    const submit = async () => {
        const toastId = toast.loading('Loading...');
        try {
            const suppbody = {
                company_name: name,
                contact: number,
                email: email,
                address: location,
                pharmacy: pharma.pharmacy_id
            }
            const addsupp = await fetch(BASEURL + "/purchase/add-suppliers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(suppbody)
            });
            const res = await addsupp.json();
            toast.success('Added')
            getData()
        } catch (error) {
            console.error(error.message)
            toast.dismiss(toastId);
            toast.error('Saving Failed')
        }
    }
    return (
        <div>
            <div class="modal fade" id="addSuppToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalToggleLabel">Add Suppliers</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <h6 class="mt-2">Company</h6>

                            <div class="form-row ">
                                <div class="col-8">
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} class="form-control" placeholder="Company Name" />


                                </div>

                            </div>
                            <h6 class="mt-3">Contact Number</h6>
                            <div class="form-row mt-2 ">

                                <div class="col-5">
                                    <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} class="form-control" placeholder="082-344-211" />

                                </div>
                            </div>
                            <h6 class="mt-3">Email Address</h6>
                            <div class="form-row mt-2 ">
                                <div class="col-12">
                                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} class="form-control" placeholder="example@gmail.com" />
                                </div>
                            </div>
                            <h6 class="mt-3">Location</h6>
                            <div class="form-row mt-2 ">
                                <div class="col-9">
                                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} class="form-control" placeholder="Davao City" />
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-primary" data-bs-target="#addSuppToggle2" data-bs-toggle="modal" data-bs-dismiss="modal">Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal fade" id="addSuppToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalToggleLabel2">Modal 2</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            Confirm Added Supplier
                        </div>
                        <div class="modal-footer">
                            <button onClick={submit} class="btn btn-primary" data-bs-target="#addSuppToggle" data-bs-dismiss="modal">Yes</button>
                        </div>
                    </div>
                </div>
            </div>
            <a class="btn btn-primary ml-4 mb-2" data-bs-toggle="modal" href="#addSuppToggle" role="button">Add Supplier</a>
        </div>
    )
}

export default AddSupplier
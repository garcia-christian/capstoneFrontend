import React, { useEffect, useState, Fragment, useContext, useRef } from "react"; import { PharmaContext } from "../context/PharmaContext"
import toast, { Toaster } from 'react-hot-toast';
import "./css/modal.css"
import { urlApi } from "../context/urlAPI";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
const EditSupplier = ({ toggle, close, sup, refresher }) => {
    const { BASEURL } = useContext(urlApi);
    const { pharma, setPharma } = useContext(PharmaContext);
    const refMed = useRef(null);
    const refPr = useRef(null);
    const [supname, setSuppname] = useState('');
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');
    const [inputValue, setinputValue] = useState('');
    const [selectedValue, setSelectedValue] = useState(null)
    const [href, setHref] = useState('');
    const [enabled, setEnabled] = useState(true);

    useEffect(() => {
        setName(sup.companyName)
        setNumber(sup.contact)
        setEmail(sup.email)
        setLocation(sup.address)
    }, [sup])

    useEffect(() => {
        if (sup.companyName == name && sup.contact == number && sup.email == email && sup.address == location) {
            setEnabled(true)
        }
        else {
            setEnabled(false)
        }
    }, [name, number, email])

    const saveChanges = async () => {
        if (name == "") {
            toast.error("Company Name cannot be empty")
        } else {

            const toastId = toast.loading('Loading...');
            const body = {
                id: sup.supplier_id,
                company_name: name,
                contact: number,
                email: email,
                address: location,
            }

            try {
                const editmd = await fetch(BASEURL + "/purchase/edit-suppliers/", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });
                const res = await editmd.json();
                if (editmd.status == 200) {
                    close();
                    toast.success("Supplier Edited")
                    toast.dismiss(toastId);
                    refresher()
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

    return (
        <Fragment>
            <Modal show={toggle}  >
                <Modal.Header >
                    <Modal.Title>Edit Medicine </Modal.Title>
                    <CloseButton onClick={close} />
                </Modal.Header>
                <Modal.Body>
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={close} >
                        Close
                    </Button>
                    <Button variant="primary" disabled={enabled} onClick={saveChanges}>
                        Accept
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment >
    )
}

export default EditSupplier
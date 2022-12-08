import React, { useEffect, useState, Fragment, useContext, useRef } from "react";
import { PharmaContext } from "../context/PharmaContext"
import toast, { Toaster } from 'react-hot-toast';
import "./css/modal.css"
import { urlApi } from "../context/urlAPI";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
const EditMedicine = ({ toggle, close, med, refresher }) => {
    const { BASEURL } = useContext(urlApi);
    const { pharma, setPharma } = useContext(PharmaContext);
    const refMed = useRef(null);
    const refPr = useRef(null);
    const [medname, setMedname] = useState('');
    const [notes, setNotes] = useState();
    const [storage, setStorage] = useState();
    const [price, setPrice] = useState(0);
    const [inputValue, setinputValue] = useState('');
    const [selectedValue, setSelectedValue] = useState(null)
    const [threshold, setThreshold] = useState(0);
    const [href, setHref] = useState('');
    const [enabled, setEnabled] = useState(true);

    useEffect(() => {
        setMedname(med.global_brand_name + " | " + med.global_generic_name)
        setPrice(med.med_price)
        setStorage(med.med_storage)
        setNotes(med.med_notes)
        setThreshold(med.warning_threshold)
    }, [med])

    useEffect(() => {
        if (med.med_price == price && med.med_storage == storage && med.med_notes == notes && med.warning_threshold == threshold) {
            setEnabled(true)
        } else if (price === null) {
            setEnabled(true)
        }
        else {
            setEnabled(false)
        }
    }, [notes, storage, price, threshold])

    const saveChanges = async () => {
        if (price == "") {
            toast.error("Price cannot be empty")
        } else if (threshold == "") {
            toast.error("Threshold cannot be empty")
        } else {

            const toastId = toast.loading('Loading...');
            const body = {
                id: med.med_id,
                price: price,
                storage: storage,
                notes: notes,
                threshold: threshold
            }

            try {
                const editmd = await fetch(BASEURL + "/medicine/edit-medicine/", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });
                const res = await editmd.json();
                close();
                refresher();
                if (editmd.status == 200) {
                    toast.success("Medicine Edited")
                    toast.dismiss(toastId);
                    refresher();
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
                    <h6 class="mt-2">Medicine</h6>

                    <div class="form-row ">
                        <div class="col-12">
                            <input type="text" disabled={true} value={medname} class="form-control" />
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={close} >
                        Close
                    </Button>
                    <Button variant="primary" disabled={enabled} onClick={saveChanges}  >
                        Accept
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment >
    )
}

export default EditMedicine
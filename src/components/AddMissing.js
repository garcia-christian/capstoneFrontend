import React, { useEffect, useState, Fragment, useContext, useRef } from "react";
import { PharmaContext } from "../context/PharmaContext"
import toast, { Toaster } from 'react-hot-toast';
import "./css/modal.css"
import { urlApi } from "../context/urlAPI";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Select from 'react-select'
import CloseButton from 'react-bootstrap/CloseButton';
const AddMissing = ({ toggle, close, refresh }) => {
    const { BASEURL } = useContext(urlApi);
    const { pharma, setPharma } = useContext(PharmaContext);
    const refMed = useRef(null);
    const refPr = useRef(null);
    const [meds, setMeds] = useState([]);
    const [enabled, setEnabled] = useState(true);
    const [med, setMed] = useState([]);
    const [price, setPrice] = useState();
    const [quantity, setQuantity] = useState();

    const submit = async () => {
        const toastId = toast.loading('Loading...');
        try {
            const suppbody = {
                med_id: med.med_id,
                qty: quantity,
                price: price,
                pharma: pharma.pharmacy_id

            }

            const addsupp = await fetch(BASEURL + "/medicine/add-missing-med/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(suppbody)
            });
            const res = await addsupp.json();
            if (addsupp.status != 200) {
                toast.dismiss(toastId);
                toast.error(res)
            } else {
                toast.success("added")
                toast.dismiss(toastId);
                refresh()
                close()
            }

        } catch (error) {
            console.error(error.message)
            toast.dismiss(toastId);
            toast.error('Saving Failed')
        }
    }
    const getData = async () => {

        try {
            const respo = await fetch(BASEURL + "/medicine/get-local-available-med/" + pharma.pharmacy_id)
            const jData = await respo.json();

            setMeds(jData)

        } catch (err) {
            console.error(err.message);
        }

    }
    const handelChangeMeds = value => {
        setMed(value)
        setPrice(value.med_price)
    }


    useEffect(() => {
        if (pharma) {
            getData()
        }
    }, [pharma])
    useEffect(() => {
        if (!med || !price || !quantity) {
            setEnabled(true)
        } else {
            setEnabled(false)
        }
    }, [med, price, quantity])


    return (
        <Fragment>
            <Modal show={toggle}  >
                <Modal.Header >
                    <Modal.Title>Report Missing/Damaged/Expired Product</Modal.Title>
                    <CloseButton onClick={close} />
                </Modal.Header>
                <Modal.Body>
                    <h6 class="mt-2">Medicine</h6>

                    <div class="form-row ">
                        <div class="col-12">
                            <Select
                                value={med}
                                options={meds}
                                getOptionLabel={e => e.global_brand_name + " | " + e.global_generic_name}
                                getOptionValue={e => e.med_id}
                                isClearable={true}
                                onChange={handelChangeMeds}
                                defaultOptions={false}
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                className="med" />
                        </div>

                    </div>
                    <h6 class="mt-3">Current Price</h6>
                    <div class="form-row mt-2 ">

                        <div class="col-5">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="inputGroup-sizing-default">₱</span>
                                </div>
                                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} pattern="[0-9]*" placeholder='Price' class="form-control numnum" aria-label="Default" aria-describedby="inputGroup-sizing-default" />
                            </div>
                        </div>
                    </div>
                    <h6 class="mt-3">Quantity</h6>
                    <div class="form-row mt-2 ">
                        <div class="col-6">
                            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} pattern="[0-9]*" class="form-control numnum" placeholder="Quantity lost/missing" />
                        </div>
                    </div>


                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={close} >
                        Close
                    </Button>
                    <Button variant="primary" onClick={submit} disabled={enabled}      >
                        Accept
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment >
    )
}

export default AddMissing
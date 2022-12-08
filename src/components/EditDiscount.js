import React, { useEffect, useState, Fragment, useContext, useRef } from "react";
import { PharmaContext } from "../context/PharmaContext"
import toast, { Toaster } from 'react-hot-toast';
import "./css/modal.css"
import { urlApi } from "../context/urlAPI";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';


const EditDiscount = ({ toggle, close, load, data }) => {
    const { BASEURL } = useContext(urlApi);
    const { pharma, setPharma } = useContext(PharmaContext);
    const [discDesc, setDiscDesc] = useState("");
    const [discValue, setDiscValue] = useState()
    const [enabled, setEnabled] = useState(true);

    const submit = async () => {
        const toastId = toast.loading('Loading...');
        try {
            const suppbody = {
                id: data.discount_id,
                name: discDesc,
                cost: discValue /100,
            }
            const editdisc = await fetch(BASEURL + "/settings/edit-discount", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(suppbody)
            });
            
            const res = await editdisc.json();
            toast.success('Added')
            toast.dismiss(toastId);
            load()
            close()
        } catch (error) {
            console.error(error.message)
            toast.dismiss(toastId);
            toast.error('Saving Failed')
        }
    }

    useEffect(() => {
        if (discValue > 100 || discValue < 0) {
            toast.error("Value must be 0 - 100 only")
            setDiscValue("")
        }
    }, [discValue])

    useEffect(() => {
        setDiscDesc(data.discount_desc)
        setDiscValue(data.discount_cost *100 )
    }, [data])

    useEffect(() => {
        if (discValue == "") {
            setEnabled(true)
        } else if (discDesc == "") {
            setEnabled(true)
        } else {
            setEnabled(false)
        }
    }, [discValue, discDesc])
    useEffect(() => {
        if (discValue == data.discount_cost) {
            setEnabled(true)
        } else if (discDesc == data.discount_desc) {
            setEnabled(true)
        } else {
            setEnabled(false)
        }
    }, [discValue, discDesc])




    return (
        <Fragment>
            <Modal show={toggle}  >
                <Modal.Header >
                    <Modal.Title>Edit Discount</Modal.Title>
                    <CloseButton onClick={close} />
                </Modal.Header>
                <Modal.Body>
                    <h6 class="mt-2">Discount Description</h6>

                    <div class="form-row ">
                        <div class="col-12">
                            <input type="text" value={discDesc} onChange={(e) => setDiscDesc(e.target.value)} placeholder="e.g. Senior Citzen" class="form-control" />
                        </div>

                    </div>
                    <h6 class="mt-3">Set Value</h6>
                    <div class="form-row mt-2 ">

                        <div class="col-5">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="inputGroup-sizing-default">%</span>
                                </div>
                                <input value={discValue} onChange={(e) => setDiscValue(e.target.value)} type="number" pattern="[0-9]*" placeholder='e.g. 20%' class="form-control numnum" aria-label="Default" aria-describedby="inputGroup-sizing-default" />
                            </div>
                        </div>
                    </div>


                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={close} >
                        Close
                    </Button>
                    <Button variant="primary" disabled={enabled} onClick={submit}      >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment >
    )
}

export default EditDiscount
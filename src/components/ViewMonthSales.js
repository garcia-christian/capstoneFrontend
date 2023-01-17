import React, { useEffect, useState, Fragment, useContext, useRef } from "react";
import { PharmaContext } from "../context/PharmaContext"
import toast, { Toaster } from 'react-hot-toast';
import "./css/modal.css"
import { urlApi } from "../context/urlAPI";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';


const ViewMonthSales = ({ toggle, close, load, year, month }) => {
    const { BASEURL } = useContext(urlApi);
    const { pharma, setPharma } = useContext(PharmaContext);
    const [enabled, setEnabled] = useState(true);
    const [data, setData] = useState([])
    const [mon, setMon] = useState(null)
    const loadData = async () => {

        const respo = await fetch(BASEURL + "/sell/get-sales/" + pharma.pharmacy_id + "/" + year.year + "/" + month.month)
        const jData = await respo.json();
        setData(jData)
        if (month) {
            setMon(month.monthlong + " " + year.year)

        }
    }
    useEffect(() => {
        if (pharma && year && month) {
            loadData()
        }
    }, [toggle, year, month])


    return (
        <Fragment>
            <Modal show={toggle}  >
                <Modal.Header >
                    <Modal.Title>{mon ? mon : ""}</Modal.Title>
                    <CloseButton onClick={close} />
                </Modal.Header>
                <Modal.Body>
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Sale#</th>
                                    <th>Total Ammount</th>
                                    <th>Items</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((value, index) => (
                                    <tr>
                                        <td><h6>{value.salesinvoice_id}</h6></td>
                                        <td>₱{value.total_price} </td>
                                        <td>{value.items} </td>
                                        <td>{new Date(value.Date).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" })}</td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={close} >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment >
    )
}

export default ViewMonthSales
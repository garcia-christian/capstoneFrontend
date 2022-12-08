import React, { Fragment, useEffect, useState, useContext } from "react";
import { PharmaContext } from "../context/PharmaContext"
import toast, { Toaster } from 'react-hot-toast';
import "./css/modal.css"
import { urlApi } from "../context/urlAPI";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
const SellOrdersModal = ({ toggle, close, show, order_id, cus_id, finished }) => {
    const { BASEURL } = useContext(urlApi);
    const { pharma, setPharma } = useContext(PharmaContext);
    const [prods, setProds] = useState([]);
    const [Total, setTotal] = useState(0)
    const [Subtotal, setSubtotal] = useState(0)
    const [order, setOrder] = useState([]);
    const [discount, setDiscount] = useState("");
    const getProds = async () => {
        try {
            const respo = await fetch(BASEURL + "/orders/get-items/" + order_id)
            const jData = await respo.json();
            setProds(jData)
            const respo1 = await fetch(BASEURL + "/orders/get-order/" + order_id)
            const jData1 = await respo1.json();
            setOrder(jData1)
        } catch (err) {
            console.error(err.message);
        }
    }
    
    const onCheck = () => {
        finished(order_id, cus_id);
        close();

    }
    const calculator = () => {
        let totalinit = 0;

        prods.map((value, key) => {

            totalinit = totalinit + value.med_price * value.quantity


        })
        setSubtotal(totalinit)
        let total = 0
        total = Subtotal
        setTotal(total)
    }
    useEffect(() => {
        getProds();
       
    }, [])
    useEffect(() => {
        getProds();
        calculator();
    }, [prods])

    return (
        <Fragment>
            <Modal show={toggle} >
                <Modal.Header closeButton>
                    <Modal.Title>Order# {order_id} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6>Items</h6>
                    <div class="row">
                        {prods.map((value, index) => (
                            <>
                                <div class="col-xl-10">
                                    <p>{value.quantity}x {value.global_brand_name}</p>
                                </div>
                                <div class="col-xl-2">
                                    <p class="float-end">₱{value.med_price * value.quantity}
                                    </p>
                                </div>
                            </>

                        )
                        )}
                        <hr class='totalline' />
                        <div class="col-xl-10">
                            <p>Sub Total</p>
                        </div>
                        <div class="col-xl-2">
                            <p class="float-end">
                                ₱{Subtotal}
                            </p>
                        </div>
                        <div class="col-xl-10">
                            <p>Discount</p>
                        </div>
                        <div class="col-xl-2">
                            <p class="float-end">
                                -
                            </p>
                        </div>
                        <hr class='totalline' />
                        <div class="col-xl-10 fw-bold">
                            <p>Total</p>
                        </div>
                        <div class="col-xl-2">
                            <p class="float-end fw-bold">
                                ₱{Total}
                            </p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={close} >
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => onCheck()} >
                        Accept
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment >
    )
}

export default SellOrdersModal
import React, { Fragment, useEffect, useState, useContext } from "react";
import { PharmaContext } from "../context/PharmaContext"
import toast, { Toaster } from 'react-hot-toast';
import "./css/modal.css"
import { urlApi } from "../context/urlAPI";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { SubTitle } from "chart.js";
import Form from 'react-bootstrap/Form';
const SellOrdersPurchaseModal = ({ toggle, close, show, order_id, cus_id, finished }) => {
    const { BASEURL } = useContext(urlApi);
    const { pharma, setPharma } = useContext(PharmaContext);
    const [prods, setProds] = useState([]);
    const [Total, setTotal] = useState(0)
    const [Subtotal, setSubtotal] = useState(0)
    const [cash, setCash] = useState('')
    const [change, setChange] = useState(0)
    const [order, setOrder] = useState([]);
    const [discount, setDiscount] = useState("");

    const [revoke, setRevoke] = useState(false);

    const changeHandle = () => {
        setChange(parseInt(cash) - Total)
    }

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

    const checkSubmit = () => {
        if (cash) {
            if (cash < Total) {
                toast.error('Insuffcient Cash Ammount')

            } else {
                onCheck();
            }
        }
        else {

            toast.error('Please Enter Cash Ammount')
        }
    }
    const saveCustomerMeds = async () => {

        try {
            await prods.map(async (value, index) => {
                const body = {
                    customer: order.customer_id,
                    local_med: value.med_id,
                    qty: value.quantity
                }

                const respo = await fetch(BASEURL + "/orders/save-customer-meds", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });
                const res = await respo.json();

            })
        } catch (error) {
            console.log(errror.err);
        }

    }
    const onCheck = () => {
        finished(order_id, cus_id);
        saveCustomerMeds();
        onSubmit();
        close();
    }
    const onSubmit = async () => {
        const toastId = toast.loading('Loading...');
        let disc = 1
        if (discount != 0) {
            disc = order.discount_id
        }
        try {

            const body = {
                admin: pharma.admin,
                pharmacy: pharma.pharmacy_id,
                total_price: Total,
                discount: disc,
                payed_ammount: cash,
                change: change,
                payment_type: 1
            }
            const respo = await fetch(BASEURL + "/sell", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            const id_sale = await respo.json();

            const orderbody = {
                oid: order_id,
                sid: id_sale.rows[0].salesinvoice_id,

            }
            const orderres = await fetch(BASEURL + "/orders/confirmed-purchase", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderbody)
            });
            const order = await orderres.json();

            await prods.map(async (value, index) => {
                const body = {
                    sales_id: id_sale.rows[0].salesinvoice_id,
                    qty_purchased: value.quantity,
                    total_price: Total,
                    med: value.med_id
                }

                const respo = await fetch(BASEURL + "/sell/save", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });
                const res = await respo.json();

            })
            toast.dismiss(toastId);
            toast.success('Transaction Saved')
            onSuccess();

        } catch (error) {
            console.error(error.message)
            toast.dismiss(toastId);
            toast.error('Saving Failed')
        }


    }

    const onSuccess = () => {
        setChange(0)
    }


    const calculator = () => {
        let totalinit = 0;

        prods.map((value, key) => {

            totalinit = totalinit + value.med_price * value.quantity


        })
        setSubtotal(totalinit)
        let total = 0
        if (revoke) {
            total = Subtotal
        } else {
            total = Subtotal - (Subtotal * (discount / 100))
        }
        setTotal(total)
    }
    useEffect(() => {
        getProds();

    }, [])

    useEffect(() => {
        setDiscount(order.discount_cost * 100)
        calculator();
    }, [order])
    useEffect(() => {
        calculator();
    }, [prods, discount, revoke])

    useEffect(() => {
        changeHandle()
    }, [cash])

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
                            <p>Discount {revoke ? "None" : order.discount_desc}   </p>
                        </div>
                        <div class="col-xl-2">
                            <p class="float-end">
                                {revoke ? "0" : discount}%

                            </p>
                        </div>
                        <div class="col-xl-2">

                            {discount != 0 ? <Form.Check
                                onClick={(e) => setRevoke(e.target.checked)}
                                checked={revoke}
                                inline
                                label="Revoke"
                                type='checkbox'
                                id={`inline-checkbox-4`}

                            /> : ""}

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
                        <div class="input-group mb-3">

                            <div class="input-group-prepend">

                                <span class="input-group-text" id="inputGroup-sizing-default">₱</span>
                            </div>
                            <input onChange={(e) => setCash(e.target.value)} value={cash} type="text" placeholder='Please Enter Customer Payment' class="form-control numnum" aria-label="Default" aria-describedby="inputGroup-sizing-default" />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={close} >
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => checkSubmit()} >
                        Accept
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment >
    )
}

export default SellOrdersPurchaseModal
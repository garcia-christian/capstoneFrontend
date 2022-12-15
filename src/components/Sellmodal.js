import React, { Fragment, useEffect, useState, useContext } from "react";
import { PharmaContext } from "../context/PharmaContext"
import toast, { Toaster } from 'react-hot-toast';
import "./css/modal.css"
import { urlApi } from "../context/urlAPI";

const Sellmodal = ({ Subtotal, Total, discount, Cart, allClear, Reload }) => {
    const { BASEURL } = useContext(urlApi);
    const [cash, setCash] = useState('')
    const [change, setChange] = useState(0)
    const [href, setHref] = useState('')
    const [href2, setHref2] = useState('')

    const { pharma, setPharma } = useContext(PharmaContext);

    const changeHandle = () => {
        setChange(parseInt(cash) - Total)
    }

    const onSuccess = () => {
        allClear();
        setCash('');
        setChange(0)
        setHref('')
        setHref2('')
    }

    const onSubmit = async () => {
        const toastId = toast.loading('Loading...');
        let disc = 1
        if (!discount.length == 0) {
            disc = discount[0].discount_id
        }
        try {
            console.log(discount);
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

            await Cart.map(async (value, index) => {
                const body = {
                    sales_id: id_sale.rows[0].salesinvoice_id,
                    qty_purchased: value.quantity,
                    total_price: Total,
                    med: value[0].med_id
                }

                const respo = await fetch(BASEURL + "/sell/save", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });
                const res = await respo.json();

                const storageBody = {
                    id: value[0].med_id,
                    qty: value.quantity,
                    pharmacy: pharma.pharmacy_id
                }
                const store = await fetch(BASEURL + "/medicine/deduct-qty", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(storageBody)
                });
                const storage_res = await store.json();

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
    const check = () => {
        if (!Cart.length == 0) {
            setHref('#exampleModalToggle')
        } else {
            setHref('')
            toast.error('No Products selected')

        }
    }
    const checkSubmit = () => {
        if (cash) {
            if (cash < Total) {
                toast.error('Insuffcient Cash Ammount')
                setHref2('')
            } else {
                setHref2('modal')
            }
        }
        else {
            setHref2('')
            toast.error('Please Enter Cash Ammount')
        }
    }

    useEffect(() => {
        changeHandle()
        if (cash) {
            if (cash < Total) {

                setHref2('')
            } else {
                setHref2('modal')
            }
        }
        else {
            setHref2('')

        }
    }, [cash])

    useEffect(() => {
        if (!Cart.length == 0) {
            setHref('#exampleModalToggle')
        } else {
            setHref('')

        }
    }, [Cart])

    return (
        <Fragment>
            <div>
                <div class="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
                    <div class="modal-dialog modal-dialog-centered ">
                        <div class="modal-content ">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalToggleLabel">Enter Cash Amount</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <ul class="list-unstyled">
                                  
                                        <li class="text-muted mt-1">{new Date().toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })}</li>
                                    </ul>
                                    <hr class='totalline' />
                                    <div class="col-xl-10">
                                        <p>Sub Total</p>
                                    </div>
                                    <div class="col-xl-2">
                                        <p class="float-end">₱{Subtotal}
                                        </p>
                                    </div>
                                    <div class="col-xl-10">
                                        <p>Discount</p>
                                    </div>
                                    <div class="col-xl-2">
                                        <p class="float-end">{discount.length == 0 ? "-" : (discount[0].discount_cost) * 100 + "%"}
                                        </p>
                                    </div>
                                    <hr class='totalline' />
                                    <div class="col-xl-10 fw-bold">
                                        <p>Total</p>
                                    </div>
                                    <div class="col-xl-2">
                                        <p class="float-end fw-bold">₱{Total}
                                        </p>
                                    </div>
                                </div>

                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="inputGroup-sizing-default">₱</span>
                                    </div>
                                    <input onChange={(e) => setCash(e.target.value)} value={cash} type="number" pattern="[0-9]*" placeholder='Please Enter Exact Amount' class="form-control numnum" aria-label="Default" aria-describedby="inputGroup-sizing-default" />
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-primary" data-bs-target="#exampleModalToggle2" onClick={checkSubmit} data-bs-toggle={href2} data-bs-dismiss={href2}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>




                <div class="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalToggleLabel2">Confirm Recipt</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <ul class="list-unstyled">

                                        <li class="text-black mt-1">{new Date().toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })}</li>
                                    </ul>
                                    {Cart.map((value, index) => (
                                        <>
                                            <div class="col-xl-10">
                                                <p>{value.quantity}x {value[0].global_brand_name}</p>
                                            </div>
                                            <div class="col-xl-2">
                                                <p class="float-end">₱{value[0].med_price * value.quantity}
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
                                        <p class="float-end">₱{Subtotal}
                                        </p>
                                    </div>
                                    <div class="col-xl-10">
                                        <p>Discount</p>
                                    </div>
                                    <div class="col-xl-2">
                                        <p class="float-end">{discount.length == 0 ? "-" : (discount[0].discount_cost) * 100 + "%"}
                                        </p>
                                    </div>
                                    <hr class='totalline' />
                                    <div class="col-xl-10 fw-bold">
                                        <p>Total</p>
                                    </div>
                                    <div class="col-xl-2">
                                        <p class="float-end fw-bold">₱{Total}
                                        </p>
                                    </div>
                                    <div class="col-xl-10">
                                        <p>Cash</p>
                                    </div>
                                    <div class="col-xl-2">
                                        <p class="float-end">₱{cash}
                                        </p>
                                    </div>
                                    <div class="col-xl-10">
                                        <p>Change</p>
                                    </div>
                                    <div class="col-xl-2">
                                        <p class="float-end">₱{change}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button onClick={onSubmit} class="btn btn-primary" data-bs-toggle="modal" data-bs-dismiss="modal">Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
                <a class="btn btn-primary d-flex justify-content-center w-100 mt-2" data-bs-toggle="modal" onClick={check} href={href} role="button"> Check out</a>
            </div>
        </Fragment>
    )
}

export default Sellmodal
import React, { useEffect, useState, Fragment, useContext } from "react";
import { PharmaContext } from "../context/PharmaContext"
import "./css/purchasestyle.css"
import Form from "react-bootstrap/Form";
import Select from 'react-select'
import ConfimationModal from "./ConfimationModal";
import AddMedicine from "./AddMedicine";
import AddSupplier from "./AddSupplier";
const Purchase = () => {

    const { pharma, setPharma } = useContext(PharmaContext);
    const [suppliers, setSuppliers] = useState([])
    const [supplier, setSupplier] = useState([])
    const [meds, setMeds] = useState([])
    const [purhcased, setPurchased] = useState([])
    const [med, setMed] = useState([])
    const [quantity, setQuantity] = useState()
    const [listing_price, setlisting_price] = useState()
    const [retail_price, setRetail_price] = useState()
    const [date_exp, setDate_exp] = useState(new Date())
    const [date_man, setDate_man] = useState(new Date())
    const [retail_priceTotal, setRetail_priceTotal] = useState(0)
    const [listing_priceTotal, setListing_priceTotal] = useState(0)
    const [emptylist, setEmptylist] = useState(false)


    const getData = async () => {
        try {
            const respo = await fetch("http://localhost:5000/medicine/get-local-med/"+pharma.pharmacy_id)
            const jData = await respo.json();
            const respo1 = await fetch("http://localhost:5000/purchase/get-suppliers/"+pharma.pharmacy_id)
            const jData1 = await respo1.json();
            setMeds(jData)
            setSuppliers(jData1)
        } catch (err) {
            console.error(err.message);
        }
    }
    const handelChangeMeds = value => {
        setMed(value)
        setRetail_price(value.med_price)
    }
    const handelChangeSupp = value => {
        setSupplier(value)
    }

    const saveDatabase = async () => {


        const pInvoiceBody = {
            admin: pharma.admin, pharmacy: pharma.pharmacy_id,
            supplier: supplier.supplier_id,
            total_price: listing_priceTotal,

        }
        const purchaseInvoice = await fetch("http://localhost:5000/purchase/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pInvoiceBody)
        });
        const pInvoice_res = await purchaseInvoice.json();


        purhcased.map(async (value, key) => {



            const storageBody = {
                id: value.med_id,
                qty: value.quantity
            }
            const store = await fetch("http://localhost:5000/medicine/add-qty", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(storageBody)
            });
            const storage_res = await store.json();


            const onInvoiceBody = {
                med_id: value.med_id,
                purchase_invoice: pInvoice_res.rows[0].purchaseInvoice_id,
                quantity: value.quantity,
                listing_price: value.listing_price,
                retail_price: value.retail_price,
                date_exp: value.date_exp,
                date_man: value.date_man,
            }
            const onInvoice = await fetch("http://localhost:5000/purchase/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(onInvoiceBody)
            });

        })
        setPurchased([])
        setSupplier(null)
        setRetail_priceTotal(0)
        setListing_priceTotal(0)

    }
    const confirmAdd = async () => {
        let total_pr = listing_price * quantity
        const addedData = {
            med_id: med.med_id,
            brand_name: med.global_brand_name,
            generic_name: med.global_generic_name,
            quantity: quantity,
            supplier_id: supplier.supplier_id,
            company: supplier.companyName,
            listing_price: listing_price,
            retail_price: retail_price,
            date_exp: date_exp,
            date_man: date_man,
            total_price: total_pr,
        }

        const newData = [...purhcased, addedData]
        setPurchased(newData)
        clearData()


    }
    const calculate = () => {
        let totalRet = 0;
        let totalList = 0;
        purhcased.map((value, key) => {

            totalRet = totalRet + value.retail_price * value.quantity
            totalList = totalList + value.listing_price * value.quantity

        })
        setRetail_priceTotal(totalRet)
        setListing_priceTotal(totalList)
    }
    const clearData = () => {
        setMed(null)
        setDate_exp("")

        setDate_man("")
        setQuantity("")
        setlisting_price("")
        setRetail_price("")
    }

    useEffect(() => {
        calculate()
        if (purhcased.length == 0) {
            setEmptylist(false)
        } else {
            setEmptylist(true)
        }
    }, [purhcased])


    useEffect(() => {
        if(pharma){
            getData()
        }
    }, [pharma])

    return (
        <Fragment>

            <div className="pos">

                <div class="d-flex justify-content-center h-100 ">

                    <div class="col-xl-7 col-sm-6 py-2 h-100 ">

                        <div class={`card bg-black text-black h-50`}>
                            <div class="card-body bg-white">

                                <div class="justify-content-left px-1">

                                    <h6>Supplier</h6>
                                    <div class="form-row">
                                        <Select
                                            isDisabled={emptylist}
                                            value={supplier}
                                            isClearable={true}
                                            defaultOptions={false}
                                            onChange={handelChangeSupp}
                                            getOptionLabel={e => e.companyName}
                                            getOptionValue={e => e.supplier_id}
                                            options={suppliers}
                                            className="sply col-5" />
                                    </div>
                                    <h6 class="mt-2">Medicine</h6>

                                    <div class="form-row ">

                                        <div class="col-5">

                                            <Select
                                                value={med}
                                                isClearable={true}
                                                defaultOptions={false}
                                                onChange={handelChangeMeds}
                                                getOptionLabel={e => e.global_brand_name + " | " + e.global_generic_name}
                                                getOptionValue={e => e.med_id}
                                                options={meds}
                                                className="med" />

                                        </div>
                                        <div class="col-1">
                                            <input type="text" onChange={(e) => setQuantity(e.target.value)} value={quantity} class="form-control" placeholder="Qty" />
                                        </div>
                                        <div class="col">
                                            <input type="text" onChange={(e) => setlisting_price(e.target.value)} value={listing_price} class="form-control" placeholder="Listing Price" />
                                        </div>
                                        <div class="col">
                                            <input type="text" disabled={true} value={retail_price} class="form-control" placeholder="Retail Price" />
                                        </div>
                                    </div>


                                    <div class="form-row " id="exp">
                                        <div className="col-4">
                                            <h6 class="mt-2">Exp Date</h6>
                                            <Form.Control value={date_exp} onChange={(e) => setDate_exp(e.target.value)} type="date"></Form.Control>
                                        </div>
                                        <div id="manf" className="col-4">
                                            <h6 class="mt-2">Date Manufactured</h6>
                                            <Form.Control value={date_man} onChange={(e) => setDate_man(e.target.value)} type="date"></Form.Control>
                                        </div>
                                        <div className="col-1 ">

                                        </div>
                                        <div className="col-3 mt-4">

                                            <button class="btn btn-primary mt-3 btn-block" onClick={confirmAdd}  >Add Purchase</button>

                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="card bg-black text-black mt-4 h-100 ">
                            <div class="card-body bg-white h-100 ">

                                <div class="table-responsive">
                                    <h5>Purchased Products</h5>

                                    <table class="table table-hover">

                                        <thead>
                                            <tr>
                                                <th>Product Details</th>
                                                <th>Quantity</th>
                                                <th>Listing Price</th>
                                                <th>Retail Price</th>
                                                <th>Delete</th>

                                            </tr>
                                        </thead>
                                        {purhcased.map((value, index) => (
                                            <tr>
                                                <td>
                                                    {value.brand_name} | {value.generic_name}
                                                </td>
                                                <td>{value.quantity}</td>
                                                <td>₱{value.listing_price}</td>
                                                <td>₱{value.retail_price}</td>
                                                <td className="del" ><h6 class="text-danger" >Delete</h6></td>

                                            </tr>

                                        ))}

                                    </table>

                                </div>

                            </div>
                        </div>

                    </div>

                    <div class="col-xl-3 col-sm-6 py-2 h-50 "  >
                        <div class="card bg-black text-black h-100">
                            <div class="card-body bg-white h-100">
                                <div class="rotate">
                                </div>
                                <div class="container">
                                    <div class="row">
                                        <ul class="list-unstyled">
                                            <li class="text-muted mt-1"><span class="text-black">Purchase Invoice</span> #12345</li>
                                            <li class="text-black mt-1">{new Date().toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })}</li>
                                        </ul>
                                        <hr />
                                        <div class="col-xl-10">
                                            <p>Total Retail Price</p>
                                        </div>
                                        <div class="col-xl-2">
                                            <p class="float-end">₱{retail_priceTotal}
                                            </p>
                                        </div>
                                        <div class="col-xl-10">
                                            <p>Total Listing Price</p>
                                        </div>
                                        <div class="col-xl-2">
                                            <p class="float-end">₱{listing_priceTotal}
                                            </p>
                                        </div>

                                    </div>

                                </div>

                            </div>

                            <ConfimationModal
                                title={'Save Changes'}
                                descrip={'Add '}
                                buttonsave={'Save Changes'}
                                button={'Save Purchased'}
                                btnstyle={'btn btn-primary mr-4 ml-4 mb-2 '}
                                method={saveDatabase}
                            />

                        </div>

                        <div class="card bg-black text-black h-100 mt-5 custcart">
                            <div class="card-body bg-white h-100">
                                <div class="rotate">
                                </div>
                                <div class="container">
                                <h6>Supplier List</h6>
                                    <hr />
                                    <div class="table-responsive tblimit">
                                        <table class="table table-hover  ">

                                            <tbody>
                                                {suppliers.map((value, index) => (
                                                    <tr >
                                                         <td>{value.companyName}</td>

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>
                            <AddSupplier/>
                        </div>

                        <div class="card bg-black text-black h-100 mt-4">
                            <div class="card-body bg-white h-100">
                                <div class="rotate">
                                </div>
                                <div class="container">
                                    <h6>Medicine List</h6>
                                    <hr />
                                    <div class="table-responsive tblimit">
                                        <table class="table table-hover  ">

                                            <tbody>
                                                {meds.map((value, index) => (
                                                    <tr >
                                                        <td>{value.global_brand_name}</td>

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                </div>

                            </div>
                            <AddMedicine />

                        </div>
                    </div>



                </div>


            </div>
        </Fragment>
    )
}

export default Purchase
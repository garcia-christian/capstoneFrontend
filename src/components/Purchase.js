import React, { useEffect, useState, Fragment, useContext, useRef } from "react";
import { PharmaContext } from "../context/PharmaContext"
import { urlApi } from "../context/urlAPI";
import "./css/purchasestyle.css"
import Form from "react-bootstrap/Form";
import Select from 'react-select'
import ConfimationModal from "./ConfimationModal";
import AddMedicine from "./AddMedicine";
import AddSupplier from "./AddSupplier";
import EditSupplier from "./EditSupplier";
import EditMedicine from "./EditMedicine";
import toast, { Toaster } from 'react-hot-toast';


const Purchase = () => {
    const { BASEURL } = useContext(urlApi);
    const refSupp = useRef(null);
    const refMed = useRef(null);
    const refQty = useRef(null);
    const refPrice = useRef(null);
    const refExp = useRef(null);
    const refMan = useRef(null);
    const { pharma, setPharma } = useContext(PharmaContext);
    const [suppliers, setSuppliers] = useState([])
    const [supplier, setSupplier] = useState(null)
    const [meds, setMeds] = useState([])
    const [purhcased, setPurchased] = useState([])
    const [med, setMed] = useState(null)
    const [quantity, setQuantity] = useState()
    const [listing_price, setlisting_price] = useState()
    const [retail_price, setRetail_price] = useState()
    const [date_exp, setDate_exp] = useState()
    const [date_man, setDate_man] = useState()
    const [retail_priceTotal, setRetail_priceTotal] = useState(0)
    const [listing_priceTotal, setListing_priceTotal] = useState(0)
    const [emptylist, setEmptylist] = useState(false)
    const [toggle, setToggle] = useState(false)
    const handleClose = () => setToggle(false);
    const handleShow = () => setToggle(true);
    const [toggle2, setToggle2] = useState(false)
    const handleClose2 = () => setToggle2(false);
    const handleShow2 = () => setToggle2(true);
    const [editmed, setEditMed] = useState([]);
    const [filteredMed, setFilteredMed] = useState([]);
    const [searchMed, setSearchMed] = useState();
    const [editSup, setEditSup] = useState([]);
    const [filteredSup, setFilteredSup] = useState([]);
    const [searchSup, setSearchSup] = useState();
    const medFilter = (event) => {
        const searchWord = event.target.value;
        setSearchMed(searchWord);
        const newFilter = meds.filter((value) => {
            const word = value.global_brand_name
            return word.toLowerCase().includes(searchWord.toLowerCase());
        });
        setFilteredMed(newFilter)
    }
    const supFilter = (event) => {
        const searchWord = event.target.value;
        setSearchSup(searchWord);
        const newFilter = suppliers.filter((value) => {
            const word = value.companyName
            return word.toLowerCase().includes(searchWord.toLowerCase());
        });
        setFilteredSup(newFilter)
    }


    const getData = async () => {
        try {
            const respo = await fetch(BASEURL + "/medicine/get-local-med/" + pharma.pharmacy_id)
            const jData = await respo.json();
            const respo1 = await fetch(BASEURL + "/purchase/get-suppliers/" + pharma.pharmacy_id)
            const jData1 = await respo1.json();
            setMeds(jData)
            setFilteredMed(jData)
            setSuppliers(jData1)
            setFilteredSup(jData1)
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
        const toastId = toast.loading('Loading...');
        try {

            const pInvoiceBody = {
                admin: pharma.admin,
                pharmacy: pharma.pharmacy_id,
                supplier: supplier.supplier_id,
                total_price: listing_priceTotal,

            }
            const purchaseInvoice = await fetch(BASEURL + "/purchase/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pInvoiceBody)
            });
            const pInvoice_res = await purchaseInvoice.json();
            console.log(pInvoice_res);

            purhcased.map(async (value, key) => {

                const storageBody = {
                    id: value.med_id,
                    qty: value.quantity
                }
                const store = await fetch(BASEURL + "/medicine/add-qty", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(storageBody)
                });
                const storage_res = await store.json();
                console.log(122);

                const onInvoiceBody = {
                    med_id: value.med_id,
                    purchase_invoice: pInvoice_res.rows[0].purchaseInvoice_id,
                    quantity: value.quantity,
                    listing_price: value.listing_price,
                    retail_price: value.retail_price,
                    date_exp: value.date_exp,
                    date_man: value.date_man,
                }
                const onInvoice = await fetch(BASEURL + "/purchase/save", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(onInvoiceBody)
                });

            })
            toast.dismiss(toastId);
            toast.success('Transaction Saved')
            setPurchased([])
            setSupplier(null)
            setRetail_priceTotal(0)
            setListing_priceTotal(0)
        } catch (error) {
            console.error(error.message)
            toast.dismiss(toastId);
            toast.error('Saving Failed')
        }

    }
    const confirmAdd = async () => {

        if (!supplier) {
            toast.error('Select Supplier')
            refSupp.current.focus();
        } else if (!med) {
            toast.error('Select Medicine')
            refMed.current.focus();
        } else if (!quantity) {
            toast.error('Quantity cannot be empty')
            refQty.current.focus();
        } else if (!listing_price) {
            toast.error('Listing price cannot be empty')
            refPrice.current.focus();
        } else if (!retail_price) {
            toast.error('LOL')
        } else if (!date_exp) {
            toast.error('Please set the Expiration Date')
            refExp.current.focus();
        } else if (!date_man) {
            toast.error('Please set the Manufacture Date')
            refMan.current.focus();
        } else {
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
            console.log(newData);
            clearData()
        }



    }
    const editSupControl = (sup) => {
        setToggle2(true)
        setEditSup(sup)
    }
    const editMedControl = (med) => {
        setToggle(true)
        setEditMed(med)
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
        if (pharma) {
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
                                            ref={refSupp}
                                            isDisabled={emptylist}
                                            value={supplier}
                                            isClearable={true}
                                            defaultOptions={false}
                                            onChange={handelChangeSupp}
                                            getOptionLabel={e => e.companyName}
                                            getOptionValue={e => e.supplier_id}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                            options={suppliers}
                                            className="sply col-5" />
                                    </div>
                                    <h6 class="mt-2">Medicine</h6>

                                    <div class="form-row ">

                                        <div class="col-5">

                                            <Select
                                                ref={refMed}
                                                value={med}
                                                isClearable={true}
                                                defaultOptions={false}
                                                onChange={handelChangeMeds}
                                                getOptionLabel={e => e.global_brand_name + " | " + e.global_generic_name}
                                                getOptionValue={e => e.med_id}
                                                options={meds}
                                                menuPortalTarget={document.body}
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                className="med" />

                                        </div>
                                        <div class="col-1">
                                            <input ref={refQty} type="number" pattern="[0-9]*" onChange={(e) => setQuantity(e.target.value)} value={quantity} class="form-control numnum" placeholder="Qty" />
                                        </div>
                                        <div class="col">
                                            <input ref={refPrice} type="number" pattern="[0-9]*" onChange={(e) => setlisting_price(e.target.value)} value={listing_price} class="form-control numnum" placeholder="Listing Price" />
                                        </div>
                                        <div class="col">
                                            <input type="text" disabled={true} value={med ? `Retail Price: ₱${retail_price}` : ''} class="form-control" placeholder="Retail Price" />
                                        </div>
                                    </div>


                                    <div class="form-row " id="exp">
                                        <div className="col-4">
                                            <h6 class="mt-2">Exp Date</h6>
                                            <Form.Control ref={refExp} value={date_exp} onChange={(e) => setDate_exp(e.target.value)} type="date"></Form.Control>
                                        </div>
                                        <div id="manf" className="col-4">
                                            <h6 class="mt-2">Date Manufactured</h6>
                                            <Form.Control ref={refMan} value={date_man} onChange={(e) => setDate_man(e.target.value)} type="date"></Form.Control>
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
                                Purchased={purhcased}
                            />

                        </div>

                        <div class="card bg-black text-black h-100 mt-5 custcart">
                            <div class="card-body bg-white h-100">
                                <div class="rotate">
                                </div>
                                <div class="container">
                                    <div class="row">
                                        <div class="col-xl-5">
                                            <h6 class="medlisttitle">Supplier List</h6>
                                        </div>
                                        <div class="col-xl-7">
                                            <input class="form-control medsearch" placeholder="Search" value={searchSup} onChange={supFilter} />
                                        </div>
                                    </div>

                                    <hr />
                                    <div class="table-responsive tblimit">
                                        <table class="table table-hover  ">

                                            <tbody>
                                                {filteredSup.map((value, index) => (
                                                    <tr onClick={(e) => editSupControl(value)} >
                                                        <td>{value.companyName}</td>

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>
                            <AddSupplier />
                        </div>

                        <div class="card bg-black text-black h-100 mt-4">
                            <div class="card-body bg-white h-100">
                                <div class="rotate">
                                </div>
                                <div class="container">

                                    <div class="row">
                                        <div class="col-xl-5">
                                            <h6 class="medlisttitle">Medicine List</h6>
                                        </div>
                                        <div class="col-xl-7">
                                            <input class="form-control medsearch" value={searchMed} onChange={medFilter} placeholder="Search" />
                                        </div>
                                    </div>
                                    <hr />
                                    <div class="table-responsive tblimit">
                                        <table class="table table-hover  ">

                                            <tbody>
                                                {filteredMed.map((value, index) => (
                                                    <tr onClick={(e) => editMedControl(value)} >
                                                        <td>{value.global_brand_name}</td>

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                </div>

                            </div>
                            <AddMedicine getData={getData} />

                        </div>
                    </div>
                    {
                        toggle &&
                        <EditMedicine toggle={toggle} close={handleClose} show={handleShow} med={editmed} refresher={getData} />
                    }
                    {
                        toggle2 &&
                        <EditSupplier toggle={toggle2} close={handleClose2} show={handleShow2} sup={editSup} refresher={getData} />
                    }

                </div>


            </div>
        </Fragment>
    )
}

export default Purchase
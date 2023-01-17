import React, { Fragment, useEffect, useState, useContext } from "react";
import { PharmaContext } from "../context/PharmaContext"
import toast, { Toaster } from 'react-hot-toast';
import "./css/posstyle.css"
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Sellmodal from "./Sellmodal";
import { urlApi } from "../context/urlAPI";
import Form from 'react-bootstrap/Form';
const Pos = () => {
    const { BASEURL } = useContext(urlApi);
    const { pharma, setPharma } = useContext(PharmaContext);
    const [meds, setMeds] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [discount, setDiscount] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState("");
    const [searchCardSize, setsearchCardSize] = useState("h-0")
    const [cart, setCart] = useState([])
    const [Subtotal, setSubtotal] = useState(0)
    const [Total, setTotal] = useState(0)

    const cashFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    const allClear = () => {
        getData();
        setTotal(0);
        setSubtotal(0);
        setCart([]);
        setWordEntered("");
        setFilteredData([])
        setDiscount([])
        setsearchCardSize("h-0")
    }



    const calculator = () => {
        let totalinit = 0;
        let totaldiscounted = 0;
        console.log(cart.length);
        cart.map((value, key) => {

            totalinit = totalinit + value[0].med_price * value.quantity


        })
        if (discount.length !== 0) {//has discount
            cart.map((value, key) => {
                if (value.disc) {
                    totaldiscounted = totaldiscounted + value[0].med_price * value.quantity
                }
            })
            let discountinit = 0
            discountinit = totalinit - totaldiscounted;
            let total = 0
            total = totaldiscounted - (totaldiscounted * (discount.length == 0 ? 0 : (discount[0].discount_cost))) + discountinit
            setSubtotal(totalinit)
            setTotal(total)
            console.log(totalinit);
        } else {

            setSubtotal(totalinit)
            let total = 0
            total = Subtotal 
            setTotal(total)


        }

    }


    const getData = async () => {
        try {
            const respo = await fetch(BASEURL + "/medicine/get-local-med/" + pharma.pharmacy_id)
            const jData = await respo.json();
            const respo1 = await fetch(BASEURL + "/sell/discount/" + pharma.pharmacy_id)
            const jData1 = await respo1.json();
            setMeds(jData)
            setDiscounts(jData1)
            console.log(discounts);
        } catch (err) {
            console.error(err.message);
        }
    }

    const selectData = async (id) => {

        let qty = 1
        let i = 0

        const res = meds.filter(med => med.med_id == id)

        if (res[0].med_qty != 0) {
            cart.map((value, index) => {
                if (value[0].med_id === id) {
                    qty++
                    i = index

                }
            })

            if (qty === 1) {
                res.quantity = qty
                res.disc = false
                const newData = [...cart, res]
                setCart(newData)

                console.log(newData);

            } else {
                const newData = [...cart]
                if (newData[i].quantity < newData[i][0].med_qty) {
                    newData[i].quantity++
                    setCart(newData)
                } else {
                    toast.error('Max quantity reached')
                }
            }


        } else {
            toast.error('Not Available')
        }

        console.log(cart);


    }
    const selectDiscount = (value) => {

        const res = discounts.filter(des => des.discount_id == value.discount_id)
        setDiscount(res)

    }
    const handleFilter = (event) => {
        const searchWord = event.target.value;
        setWordEntered(searchWord);
        const newFilter = meds.filter((value) => {
            const word = value.global_brand_name + " | " + value.global_generic_name
            return word.toLowerCase().includes(searchWord.toLowerCase());
        });

        if (searchWord == "") {
            setFilteredData([]);
            setsearchCardSize("h-0")

        }
        else if (newFilter.length == 0) {
            setsearchCardSize("h-0")
        }
        else {
            setFilteredData(newFilter);
            setsearchCardSize("h-50")
        }
    };
    const onQChange = (e, value) => {
        const newData = [...cart]
        const id = newData[e][0].med_id
        const qty = parseInt(newData[e][0].med_qty)
        console.log(newData[e]);
        console.log('val= ' + value);
        if (value > qty) {
            value = qty
            toast.error('Max quantity reached')
        }
        if (value == '0' || value < 0) {
            setCart(newData.filter(data => data[0].med_id !== id))
        } else {

            newData[e].quantity = value
            setCart(newData)

        }


    };
    const onDChange = (e, value) => {
        const newData = [...cart]
        console.log(value);
        newData[e].disc = value
        setCart(newData)




    };
    const deleteCart = (e) => {
        const newData = [...cart]
        const id = newData[e][0].med_id
        setCart(newData.filter(data => data[0].med_id !== id))

    };

    const enterKeyPress = (event) => {
        if (event.key === 'Enter') {


            if (filteredData.length !== 0) {

                filteredData.map((value, index) => {
                    if (index == 0) {
                        selectData(value.med_id)
                    }
                })

            }
        }
    }
    useEffect(() => {
        calculator()
        getData()
    }, [cart, Subtotal, discount, pharma])
    return (
        <Fragment>

            <div className="pos">

                <div class="d-flex justify-content-center h-100 ">

                    <div class="col-xl-7 col-sm-6 py-2 h-100 ">

                        <div class={`card bg-black text-black ${searchCardSize}`}>
                            <div class="card-body bg-white">

                                <div class="d-flex justify-content-center px-1">

                                    <div class="search"> <input type="text" value={wordEntered} onKeyPress={enterKeyPress} onChange={handleFilter} class="search-input" placeholder="Product search..." name="" />
                                        {filteredData.length != 0 && (
                                            <table class="table table-hover mt-2">
                                                <tbody>

                                                    {filteredData.slice(0, 15).map((value, index) => {
                                                        return (
                                                            <tr key={index} onClick={() => selectData(value.med_id)} >
                                                                <td>{value.global_brand_name}</td>
                                                                <td>{value.global_generic_name}</td>
                                                                <td>{cashFormatter.format(value.med_price)}</td>
                                                                <td>{value.med_qty} pcs</td>
                                                            </tr>
                                                        );
                                                    })}

                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card bg-black text-black mt-4 h-100 ">
                            <div class="card-body bg-white h-100 ">
                                <div class="rotate">
                                </div>

                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Product name</th>
                                                <th>Category</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th>Delete</th>
                                                {discount.length != 0 && <th>Discount Eligibility</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cart.map((value, index) => (

                                                <tr>
                                                    <td>
                                                        <h6>{value[0].global_brand_name}</h6>
                                                        {value[0].global_generic_name}

                                                    </td>
                                                    <td>{value[0].med_cat_desc}</td>
                                                    <td>{cashFormatter.format(value[0].med_price)}</td>
                                                    <td className="num" > <input type="number" step="1" value={value.quantity} onChange={(e) => onQChange(index, e.target.value)} name="quantity" class="quantity-field border-0 num w-25" /></td>
                                                    <td className="del" ><h6 class="text-danger" onClick={() => deleteCart(index)}>Delete</h6></td>
                                                    {discount != 0 && <td> <Form.Check
                                                        inline
                                                        checked={value.disc}
                                                        onChange={(e) => onDChange(index, e.target.checked)}
                                                        label="Discounted"
                                                        name="group1"
                                                        type='checkbox'
                                                        id={`inline-checkbox-2`}
                                                    /></td>}
                                                </tr>

                                            )
                                            )}


                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div class="col-xl-3 col-sm-6 py-2 h-100">
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
                                            <p>Sub Total</p>
                                        </div>
                                        <div class="col-xl-2">
                                            <p class="float-end">{cashFormatter.format(Subtotal)}
                                            </p>
                                        </div>


                                    </div>
                                    <div class="row">
                                        <div class="col-xl-10">
                                            <p>VAT</p>
                                        </div>
                                        <div class="col-xl-2">
                                            <p class="float-end">-
                                            </p>
                                        </div>

                                    </div>
                                    <div class="row">
                                        <div class="col-xl-10">
                                            <p>Discount</p>
                                        </div>
                                        <div class="col-xl-2">
                                            <p class="float-end">{discount.length == 0 ? "-" : (discount[0].discount_cost) * 100 + "%"}
                                            </p>
                                        </div>
                                        <hr className="res3" />
                                    </div>
                                    <div class="row text-black">

                                        <div class="col-xl-10 fw-bold">
                                            <p>Total</p>
                                        </div>
                                        <div class="col-xl-2">
                                            <p class="float-end fw-bold">{cashFormatter.format(Total)}
                                            </p>
                                        </div>
                                        <div class="col-xl-10">
                                            <p>Cash</p>
                                        </div>
                                        <div class="col-xl-2">
                                            <p class="float-end">-
                                            </p>
                                        </div>
                                        <div class="col-xl-10">
                                            <p>Change</p>
                                        </div>
                                        <div class="col-xl-2">
                                            <p class="float-end">-
                                            </p>
                                        </div>
                                        <hr className="res2" />
                                        <DropdownButton id="dropdown-item-button-drop-down" title={discount.length == 0 ? "Select Discount" : discount[0].discount_desc}>
                                            <Dropdown.ItemText>Select Discount</Dropdown.ItemText>
                                            {discounts.map((value, index) => (
                                                <Dropdown.Item onClick={() => selectDiscount(value)} as="button" >{value.discount_desc}</Dropdown.Item>

                                            ))}
                                            <Dropdown.Item onClick={() => selectDiscount([])} as="button" >None</Dropdown.Item>

                                        </DropdownButton>


                                        <Sellmodal Subtotal={Subtotal} Total={Total} discount={discount} Cart={cart} allClear={allClear} />
                                    </div>


                                </div>

                            </div>
                        </div>
                    </div>



                </div>


            </div>
        </Fragment>
    )
}

export default Pos 
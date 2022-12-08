import React, { useEffect, useState, useContext } from "react";
import "./css/orderstyles.css"
import ConfirmedOrder from "./ConfirmedOrder";
import CompletedOrder from "./CompletedOrder";
import { PharmaContext } from "../context/PharmaContext"
import { urlApi } from "../context/urlAPI";
import { io } from "socket.io-client";
import { SocketContext } from "../context/SocketContext";
import CanceledOrder from "./CanceledOrder";
import toast, { Toaster } from 'react-hot-toast';
import SellOrdersModal from "./SellOrdersModal";
const Orders = () => {
    const { BASEURL } = useContext(urlApi);
    const [data, setData] = useState([])
    const [completed, setCompleted] = useState([])
    const [toggle, setToggle] = useState(false)
    const { pharma, setPharma } = useContext(PharmaContext);
    const { socket, setSocket } = useContext(SocketContext);
    const [selected, setSelected] = useState()
    const [selectedC, setSelectedC] = useState()
    const handleClose = () => setToggle(false);
    const handleShow = () => setToggle(true);
    

    const checkIC = (id, c_id) => {
        handleShow();
        setSelected(id)
        setSelectedC(c_id)
    }

    const setComp = (data) => {
        setCompleted(data);
    }

    const loadData = async () => {
        try {
            const respo = await fetch(BASEURL + "/orders/pending/" + pharma.pharmacy_id)
            const jData = await respo.json();
            setData(jData)

        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        if (pharma) {
            loadData()
        }
    }, [pharma, socket])

    const onCheck = async (id, c_id) => {
        try {
            const respo = await fetch(BASEURL + "/orders/pending-confirm/" + id, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            })
            const jData = await respo.json();
            setData(data.filter(data => data.order_id != id))
            socket?.emit("statChange", {
                sendeID: pharma.pharmacy_id,
                receiverID: c_id,
                type: 1,
            })

            setComp(data)
        } catch (err) {
            console.error(err.message);
        }
    }
    const onEx = async (id, c_id) => {
        console.log("sds");
        try {
            const respo = await fetch(BASEURL + "/orders/pending-cancel/" + id, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            })
            const jData = await respo.json();
            setData(data.filter(data => data.order_id != id))
            socket?.emit("statChange", {
                sendeID: pharma.pharmacy_id,
                receiverID: c_id,
                type: 2,
            })
            toast.error("Order Canceled")
        } catch (err) {
            console.error(err.message);
        }
    }
    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    useEffect(() => {
        socket?.on("getNotification", (data) => {
            if (pharma) {
                loadData();

            }
        }, [socket]);

    }, [socket])

    return (
        <div className="ordr">
            <div class="d-flex justify-content-center h-100 ">
                <div class="col-xl-4 col-sm-6 py-2 h-75 "  >

                    <div class="card bg-black text-black h-100">
                        <div class="card-body bg-white h-100">
                            <div class="rotate">
                            </div>
                            Pending Orders
                            <table class="table table-hover">

                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>@username</th>
                                        <th>Time Listed</th>
                                        <th>Accept?</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {data.map((value, index) => (
                                        <tr>
                                            <td>
                                                <h6>{value.order_id}</h6>
                                            </td>
                                            <td>
                                                @{value.username}
                                            </td>
                                            <td>
                                                {formatAMPM(new Date(value.order_created))}
                                            </td>
                                            <td class="choice">
                                                <i class="bi bi-check-lg check" onClick={() => checkIC(value.order_id, value.customer_id)} ></i><i class="bi bi-slash-lg slh"></i><i class="bi bi-x-lg exx" onClick={() => onEx(value.order_id, value.customer_id)}></i>
                                            </td>

                                        </tr>
                                    ))}

                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>

                <div class="col-xl-7 col-sm-6 py-2 h-100 ">
                    <div class="card bg-black text-black h-100 ">
                        <div class="card-body bg-white h-100 ">
                            <div class="rotate">
                            </div>
                            <ul class="nav nav-tabs tabb" id="myTab" role="tablist">
                                <li class="nav-item tabb" role="presentation">
                                    <button class="nav-link tabb active" id="home-tab" data-bs-toggle="tab" data-bs-target="#confirmed" type="button" role="tab" aria-controls="home" aria-selected="true">Confirmed Orders</button>
                                </li>
                                <li class="nav-item tabb" role="presentation">
                                    <button class="nav-link tabb" id="profile-tab" data-bs-toggle="tab" data-bs-target="#completed" type="button" role="tab" aria-controls="profile" aria-selected="false">Completed Orders</button>
                                </li>
                                <li class="nav-item tabb" role="presentation">
                                    <button class="nav-link tabb" id="profile-tab" data-bs-toggle="tab" data-bs-target="#canceled" type="button" role="tab" aria-controls="profile" aria-selected="false">Canceled Orders</button>
                                </li>
                            </ul>
                            <div class="tab-content" id="myTabContent">
                                <div class="tab-pane fade show active" id="confirmed" role="tabpanel" aria-labelledby="confirmed-tab"><ConfirmedOrder processing={data} setComp={setComp} /> </div>
                                <div class="tab-pane fade" id="completed" role="tabpanel" aria-labelledby="profile-tab"><CompletedOrder completed={completed} /></div>
                                <div class="tab-pane fade" id="canceled" role="tabpanel" aria-labelledby="profile-tab"><CanceledOrder completed={completed} /></div>
                            </div>

                        </div>
                    </div>
                </div>
                {
                    toggle &&
                    <SellOrdersModal toggle={toggle} close={handleClose} show={handleShow} cus_id={selectedC} order_id={selected} finished={onCheck} />
                }
            </div>


        </div>

    )
}

export default Orders
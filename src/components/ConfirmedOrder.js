import React, { useEffect, useState, useContext } from "react";
import { PharmaContext } from "../context/PharmaContext"
import { urlApi } from "../context/urlAPI";
import { SocketContext } from "../context/SocketContext";
import toast, { Toaster } from 'react-hot-toast';
import SellOrdersPurchaseModal from "./SellOrdersPurchaseModal";

const ConfirmedOrder = ({ processing, setComp }) => {
  const { BASEURL } = useContext(urlApi);
  const [data, setData] = useState([])
  const { pharma, setPharma } = useContext(PharmaContext);
  const { socket, setSocket } = useContext(SocketContext);
  const [toggle, setToggle] = useState(false)
  const handleClose = () => setToggle(false);
  const handleShow = () => setToggle(true);
  const [selected, setSelected] = useState()
  const [selectedC, setSelectedC] = useState()

  const checkIC = (id, c_id) => {
    handleShow();
    setSelected(id)
    setSelectedC(c_id)
  }

  const loadData = async () => {
    try {
      const respo = await fetch(BASEURL + "/orders/confirmed/" + pharma.pharmacy_id)
      const jData = await respo.json();
      setData(jData)

    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    if (pharma) {
      loadData()
      setComp(data)
    }
  }, [pharma, processing])

  const onCheck = async (id, c_id) => {
    try {
      const respo = await fetch(BASEURL + "/orders/confirmed-confirm/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      })
      const jData = await respo.json();
      setData(data.filter(data => data.order_id != id))
      socket?.emit("statChange", {
        sendeID: pharma.pharmacy_id,
        receiverID: c_id,
        type: 3,
      })
      toast.success("Order Confirmed")
      setComp(data)
    } catch (err) {
      console.error(err.message);
    }
  }



  const onEx = async (id, c_id) => {
    console.log("sds");
    try {
      const respo = await fetch(BASEURL + "/orders/confirmed-cancel/" + id, {
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
      setComp(data)
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

  return (
    <div class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>@username</th>
            <th>Time Listed</th>
            <th>Total Cost</th>
            <th>Date Added</th>
            <th>Status</th>
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
              <td>
                ₱{value.order_totalprice}
              </td>
              <td>
                {new Date(value.order_created).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" })}
              </td>
              <td class="choice">
                <i class="bi bi-check-lg check" onClick={() => checkIC(value.order_id, value.customer_id)}></i><i class="bi bi-slash-lg slh"></i><i class="bi bi-x-lg exx" onClick={() => onEx(value.order_id, value.customer_id)}></i>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
      {
        toggle &&
        <SellOrdersPurchaseModal toggle={toggle} close={handleClose} show={handleShow} cus_id={selectedC} order_id={selected} finished={onCheck} />
      }
    </div>
  )
}

export default ConfirmedOrder
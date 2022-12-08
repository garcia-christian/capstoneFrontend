import React, { useEffect, useState, useContext } from "react";
import { PharmaContext } from "../context/PharmaContext"
import { urlApi } from "../context/urlAPI";
import { SocketContext } from "../context/SocketContext";

const CanceledOrder = ({ completed }) => {
  const { BASEURL } = useContext(urlApi);
  const [data, setData] = useState([])
  const { pharma, setPharma } = useContext(PharmaContext);
  const { socket, setSocket } = useContext(SocketContext);

  const loadData = async () => {
    try {
      const respo = await fetch(BASEURL + "/orders/canceled/" + pharma.pharmacy_id)
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
  }, [pharma, completed])


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
            <th>Time Canceled</th>
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
              <td>
                {formatAMPM(new Date(value.order_finished))}
              </td>
              <td>
                {value.status_desc}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CanceledOrder
import React, { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
const ConfimationModal = ({ title, descrip, button, buttonsave, method, btnstyle, Purchased }) => {
    const [href, setHref] = useState('')
    const checkBtn = () => {
        if (Purchased.length == 0) {
            setHref('')
            toast.error('No Products Added')
        } else {
            setHref('modal')

        }
    }
    useEffect(() => {
        if (Purchased.length == 0) {
            setHref('')
        } else {
            setHref('modal')

        }
    }, [Purchased])

    return (
        <div>
            <button type="button" onClick={checkBtn} class={` ${btnstyle} `} data-bs-toggle={href} data-bs-target="#exampleModal">
                {button}
            </button>


            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">{title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            {descrip}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={method} >{buttonsave}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfimationModal
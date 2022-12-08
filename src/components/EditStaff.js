import React, { useEffect, useState, Fragment, useContext, useRef } from "react";
import { PharmaContext } from "../context/PharmaContext"
import toast, { Toaster } from 'react-hot-toast';
import "./css/modal.css"
import { urlApi } from "../context/urlAPI";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
const EditStaff = ({ toggle, close, data, refresh }) => {
    const { BASEURL } = useContext(urlApi);
    const { pharma, setPharma } = useContext(PharmaContext);
    const refMed = useRef(null);
    const refPr = useRef(null);
    const [role, setRole] = useState('');
    const [selectRoles, setSelectRoles] = useState([]);
    const [enabled, setEnabled] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pos, setPos] = useState(false);
    const [inv, setInv] = useState(false);
    const [orders, setOrders] = useState(false);
    const [sales, setSales] = useState(false);
    const [purchased, setPurchased] = useState(false);
    const [settings, setSettings] = useState(false);

    const submit = async () => {
        if (username == "" || email == "" || role == "") {
            toast.error("Fields Cannot be empty")
        } else {

            const toastId = toast.loading('Loading...');
            const body = {
                name: username,
                email: email,
                password: password,
                pos: pos,
                inventory: inv,
                orders: orders,
                purchased: purchased,
                sales: sales,
                settings: settings,
                role: role,
                pa_id: data.pa_id,
                admin_id: data.admin_id
            }
            try {
                const editmd = await fetch(BASEURL + "/settings/edit-staff/", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });
                const res = await editmd.json();
                if (editmd.status == 200) {
                    close();
                    toast.success("Staff Edited")
                    toast.dismiss(toastId)
                    refresh()
                } else {
                    toast.dismiss(toastId)
                    toast.error(res)
                }
            } catch (error) {
                console.error(error.message)
                toast.dismiss(toastId);
                toast.error('Saving Failed')
            }
        }
    }
    useEffect(() => {
        if (username == "" || password == "" || role == "" || email == "") {
            setEnabled(true)
        }
        else {
            setEnabled(false)
        }

    }, [username, email, password, pos, inv, orders, purchased, sales, settings, role])

    useEffect(() => {
        setUsername(data.admin_name)
        setEmail(data.admin_email)
        setRole(data.roleDesc)
        setPos(data.pos)
        setInv(data.inventory)
        setOrders(data.orders)
        setPurchased(data.purchased)
        setSales(data.sales)
        setSettings(data.settings)
    }, [data])
    useEffect(() => {
        if (username == data.admin_name
            && role == data.roleDesc
            && email == data.admin_email
            && pos == data.pos
            && inv == data.inventory
            && orders == data.orders
            && purchased == data.purchased
            && sales == data.sales
            && settings == data.settings
            && password == "") {
            setEnabled(true)
        } else {
            setEnabled(false)
        }


    }, [username, email, password, pos, inv, orders, purchased, sales, settings, role])

    return (
        <Fragment>
            <Modal show={toggle}  >
                <Modal.Header >
                    <Modal.Title>Edit Staff </Modal.Title>
                    <CloseButton onClick={close} />
                </Modal.Header>
                <Modal.Body>
                    <h6 class="mt-2">Username</h6>

                    <div class="form-row ">
                        <div class="col-9">
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} class="form-control" />
                        </div>

                    </div>

                    <h6 class="mt-3">Email</h6>
                    <div class="form-row mt-2 ">
                        <div class="col-12">
                            <input type="email" class="form-control" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>
                    <h6 class="mt-3">Password</h6>
                    <div class="form-row mt-2 ">
                        <div class="col-12">
                            <input type="password" class="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (Change Password)" />
                        </div>
                    </div>
                    <h6 class="mt-3">Role</h6>
                    <div class="form-row mt-2 ">
                        <div class="col-6">
                            <input type="text" value={role} onChange={(e) => setRole(e.target.value)} class="form-control" placeholder="Role Description" />
                        </div>
                    </div>
                    <h6 class="mt-3">Access Restriction</h6>
                    <div class="form-row mt-3 ">
                        <div class="col-10">
                            <Form.Check
                                inline
                                checked={pos}
                                onClick={(e) => setPos(e.target.checked)}
                                label="Point of sale"
                                name="group1"
                                type='checkbox'
                                id={`inline-checkbox-1`}
                            />
                            <Form.Check
                                checked={inv}

                                onClick={(e) => setInv(e.target.checked)}
                                inline
                                label="Inventory"
                                name="group1"
                                type='checkbox'
                                id={`inline-checkbox-2`}
                            />
                            <Form.Check
                                checked={orders}
                                onClick={(e) => setOrders(e.target.checked)}
                                inline
                                label="Orders"
                                type='checkbox'
                                id={`inline-checkbox-3`}
                            />
                            <Form.Check
                                onClick={(e) => setSales(e.target.checked)}
                                checked={sales}
                                inline
                                label="Sales"
                                type='checkbox'
                                id={`inline-checkbox-4`}

                            />

                            <Form.Check
                                onClick={(e) => setPurchased(e.target.checked)}
                                checked={purchased}
                                inline
                                label="Purchased"
                                type='checkbox'
                                id={`inline-checkbox-5`}
                            />
                            <Form.Check
                                onClick={(e) => setSettings(e.target.checked)}
                                checked={settings}
                                inline
                                label="Settings"
                                type='checkbox'
                                id={`inline-checkbox-6`}
                            />

                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={close} >
                        Close
                    </Button>
                    <Button variant="primary" onClick={submit} disabled={enabled}    >
                        Accept
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment >
    )
}

export default EditStaff
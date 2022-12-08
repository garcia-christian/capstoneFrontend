import React from 'react'
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import "./css/settings.css"
import PharmaSettings from './PharmaSettings';
import StaffSettings from './StaffSettings';
import DiscountSettings from './DiscountSettings';
import MobileSettings from './MobileSettings';
const Settings = () => {
    return (
        <div className="inv">

            <div class="d-flex justify-content-center h-100">

                <div class="col-xl-10 col-sm-6 py-2 h-100 ">

                    <div class="card bg-black text-black h-100 ">

                        <div class="card-body bg-white h-100 ">
                            <div class="rotate">

                            </div>
                            <Tab.Container id="left-tabs-example" defaultActiveKey="first" >
                                <Row>
                                    <Col sm={3}>
                                        <Nav variant="pills" className="flex-column setabb">
                                            <Nav.Item>
                                                <Nav.Link eventKey="first">Pharmacy Settings</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="second">Staff Management</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="third">Discounts</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="fourth">Mobile App</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="fifth">About <i class="bi bi-info-circle"></i></Nav.Link>
                                            </Nav.Item>

                                        </Nav>
                                    </Col>
                                    <Col sm={9}>
                                        <Tab.Content>
                                            <Tab.Pane eventKey="first">
                                                <PharmaSettings />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="second">
                                                <StaffSettings />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="third">
                                                <DiscountSettings />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="fourth">
                                                <MobileSettings />
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Col>
                                </Row>
                            </Tab.Container>


                        </div>
                    </div>
                </div>





            </div>


        </div>
    )
}

export default Settings
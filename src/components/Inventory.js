import React, { useEffect, useState, Fragment } from "react";

import AvailableProducts from "./AvailableProducts";
import StockList from "./StockList";
import "./css/InventoryStyle.css"
const Inventory = () => {

    return (
        <Fragment>
            
            <div className="pos">
           
                <div class="d-flex justify-content-center h-100 ">
                    
                    <div class="col-xl-11 col-sm-6 py-2 h-100 ">

                        <div class="card bg-black text-black h-100 ">

                            <div class="card-body bg-white h-100 ">
                                <div class="rotate">
                                </div>

                                <ul class="nav nav-tabs tabb" id="myTab" role="tablist">
                                    <li class="nav-item tabb" role="presentation">
                                        <button class="nav-link tabb active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Available Products</button>
                                    </li>
                                    <li class="nav-item tabb" role="presentation">
                                        <button class="nav-link tabb" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Stock List</button>
                                    </li>
                                </ul>
                                <div class="tab-content" id="myTabContent">
                                    <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab"><AvailableProducts /></div>
                                    <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab"><StockList /></div>
                                </div>

                            </div>
                        </div>
                    </div>





                </div>


            </div>
        </Fragment>
    )
}

export default Inventory
import React, { Fragment } from "react";

const Sales = () => {
  return (
    <Fragment>
    <div className="pos">
        <div class="d-flex justify-content-center h-100 ">
            <div class="col-xl-7 col-sm-6 py-2 h-100 ">
            
                <div class="card bg-black text-black h-100 ">
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
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Hitesh Chauhan</td>
                                                <td>Engine</td>
                                                <td>₱20</td>
                                                <td className="num" > <input type="number" step="1" max="10" value="1" name="quantity" class="quantity-field border-0 num w-25" /></td>
                                                <td className="del" ><h6 class="text-danger">X</h6></td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </div>

                    </div>
                </div>
            </div>

            <div class="col-xl-3 col-sm-6 py-2 h-100 "  >
                <div class="card bg-black text-black h-100">
                    <div class="card-body bg-white h-100">
                        <div class="rotate">
                        </div>
                       

                    </div>
                </div>
            </div>



        </div>


    </div>
</Fragment>
  )
}

export default Sales
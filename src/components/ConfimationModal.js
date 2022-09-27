import React from 'react'

const ConfimationModal = ({title,descrip,button,buttonsave,method,btnstyle}) => {
  return (
    <div>
    <button type="button"  class={` ${btnstyle} `} data-bs-toggle="modal" data-bs-target="#exampleModal">
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
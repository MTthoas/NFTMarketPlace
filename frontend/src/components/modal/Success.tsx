import React from 'react'
import PropTypes from 'prop-types'

import './stylesheets/Success.css'
export interface SuccessProps {
    setShowModalSucces: any,
    transaction : any
    transactionHash: string
}

function Success(props : SuccessProps) {
  return (
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none modal-container">        
            {/*content*/}
                <div className="body border-0 rounded-lg h-1/3 w-1/3 shadow-lg relative flex flex-col bg-white outline-none focus:outline-none App flex flex-col items-center justify-center ">                  
                        <h3 className="text-2xl font-semibold mt-5">Transaction validée</h3>
                        <p className="text-sm text-gray-600">Transaction Hash : {props.transactionHash}</p>
                        <div className="success-animation pt-2 pb-5 ">
                            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" /><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>
                        </div>
                        <button type="button" onClick={() => {
                            props.setShowModalSucces(false)
                        }} className="text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 mr-2 mb-2">
                            {/* <svg className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="apple" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path></svg> */}
                            Close window
                        </button>
                </div>
        </div>

  )
}

export default Success

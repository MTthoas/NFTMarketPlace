import React, { useState } from 'react';
import { NFT } from '../interface/NFT';

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";


export interface ListTokenProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  listMethod: any;
  value: any;
}

const ListToken = (props: ListTokenProps) => {

  console.log("Modal ");

  const [time, setTime] = useState('');

  const handleChange = (event: any) => {
    setTime(event.target.value as string);
  };

  // const price, but not parseInt
  const [price, setPrice] = useState('0.00');
  const [method, setMethod] = useState('Fixed price');
  const [enableNone, setEnableNone] = useState(true);

  const handleMethodChange = (method: string) => {
    setMethod(method);
    setEnableNone(method === 'Fixed price');
  }


  return (
    <div>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative my-6 mx-auto max-w-3xl w-120">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-6 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-2xl font-semibold">
                Listing de {props.value.name} - #{props.value.tokenId}
              </h3>
              <button
                className="p-1 pb-2 ml-auto border-0 text-black float-right text-2xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => props.setShowModal(false)}
              >
                ×
              </button>
            </div>
            {/*body*/}
            <div id="body" className="relative p-6 flex-auto overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
              <p className="text-sm text-gray-600">
                Enter price to allow users instantly purchase your NFT
              </p>

              <div className="flex gap-x-5 mt-4">
              <div onClick={() => handleMethodChange('fixed')} className={`w-1/2 h-40 border NonTransition hover:border-2 transform transition duration-0 hover:scale-105 text-nautral cursor-pointer border-gray-300 hover:border-gray-600 rounded-xl flex justify-center text-center ${method === 'fixed' ? 'bg-neutral' : 'text-neutral'}`}>
               <div className={`flex flex-col justify-center font-bold text-white ${method === 'fixed' ? 'text-white': 'text-neutral'}`}>
                    <div className="flex justify-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 font-black"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 6h.008v.008H6V6z"
                        />
                      </svg>
                    </div>
                    <h2>Fixed price</h2>
                  </div>
                </div>
                <div onClick={() => handleMethodChange('auction')} className={`w-1/2 h-40 border NonTransition hover:border-3 hover:scale-105 transform transition duration-0 cursor-pointer border-gray-300 hover:border-gray-600 rounded-xl flex justify-center text-center ${method === 'auction' ? 'bg-neutral' : ''}`}>
                  <div className={`flex flex-col justify-center font-bold  ${method === 'auction' ? 'text-white' : ''}`}>
                    <div className="flex justify-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h2>Timed auction</h2>
                  </div>
                </div>
              </div>


              <h2 className="text-bold mt-4 font-bold">Price</h2>
              <div>
                <div className="relative mt-2 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">ETH</span>
                  </div>
                  <input
                    type="text"
                    name="price"
                    id="price"
                    className="block w-full rounded-md border-0 py-1.5 pl-12 pr-20 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 ring-gray-300  sm:text-sm sm:leading-6"
                    placeholder="0.00"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center"></div>
                </div>
              </div>
              {/* <div className="mt-3 border border-gray-300 rounded-xl h-32">
              </div> */}
              
              <h2 className="text-bold mt-4">Date of listing expiration</h2>

              <div className="mt-2 w-full h-full">

              <FormControl fullWidth>
                <Select
                  labelId="time-select-label"
                  id="time-select"
                  value={time}
                  onChange={handleChange}
                >
                  <MenuItem value={"30 minutes"}>30 minutes</MenuItem>
                  <MenuItem value={"1 heure"}>1 heure</MenuItem>
                  <MenuItem value={"2 heures"}>2 heures</MenuItem>
                  <MenuItem value={"2 heures"}>6 heures</MenuItem>
                  <MenuItem value={"1 jour"}>1 journée</MenuItem>
                  {enableNone && <MenuItem value={"none"}>Aucune</MenuItem>}
                  {/* Ajoutez ici d'autres options si nécessaire */}
                </Select>
              </FormControl>

              </div>
            </div>

            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b gap-x-5">

            <div className="border border-gray-300 rounded-xl w-2/3 h-22 flex flex-col px-5 py-3">
              <p className="text-xs"> Name : {props.value.name} - #{props.value.tokenId} </p>
              <p className="text-xs"> Price : {price} ETH  </p>
              <p className="text-xs"> Methode : {method}</p>
              {/* // Si time n'est pas none, afficher le temps */}
              {time !== "" && <p className="text-xs"> Time : {time} </p>}


          
            </div>
              
            <button type="button"  onClick={() => {
                  // Convert time string to minutes
                    let auctionTime = 0;
                    if (time !== "none") {
                      const [value, unit] = time.split(' ');
                      if (unit.startsWith('minute')) {
                        auctionTime = parseFloat(value);
                      } else if (unit.startsWith('heure')) {
                        auctionTime = parseFloat(value) * 60;
                      } else if (unit.startsWith('jour')) {
                        auctionTime = parseFloat(value) * 60 * 24;
                      }
                    }
                    props.listMethod(props.value.tokenId, method, price, auctionTime);
                    props.setShowModal(false);
                  }}
                  className="text-gray-900 bg-gray-100 w-1/3 py-3 h-20 hover:bg-gray-200  focus:outline-none font-medium rounded-lg text-sm px-7 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2">
                  <svg className="w-6 h-6 mr-2 text-[#626890]" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="ethereum" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                 List for sale
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div>
  );
};

export default ListToken;

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

import Contracts from "../../../contracts/contracts.json";

import axios from "axios";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const contract = new ethers.Contract(
  Contracts.MyNFT.address,
  Contracts.MyNFT.abi as any,
  provider.getSigner()
);

function Create() {
  const { address } = useAccount();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tokenName, setTokenName] = useState<string>("");
  const [tokenDescription, setTokenDescription] = useState<string>("");
  const [tokenPrice, setTokenPrice] = useState<string>("");
  const [network, setNetwork] = useState<string>("");

  const JWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjN2U5ZjAyYy04MzAzLTRjOGYtOWIwZC0xMzQ1YWI5MDlmMjIiLCJlbWFpbCI6Im1hbHRoYXphcjIyN0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZGM0MTUyYzk5YThhYTI0ZmEzMjIiLCJzY29wZWRLZXlTZWNyZXQiOiJhZmZlYzRiZDQ2ZGE1NjUzZWMyMWE3ZGU4Nzc0OGZlNThlNzVmYTI4MWI0YjczZjBmYzVjMzcxYjIxYmEzOGFjIiwiaWF0IjoxNjg2MjYwNTI2fQ.GwwGHhM8E6ZN_YnMtJIqIB8KVArhxFmc-0Uq5h5it88";

    useEffect(() => {
      const getNetwork = async () => {
        const network = await provider.getNetwork();
        setNetwork(network.name);
      };
  
      getNetwork();
    }, []);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const createNewNFT = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!file) {
      setLoading(false);
      setErrorMessage("Please upload an image.");
      return;
    }

    if (!tokenName) {
      setLoading(false);
      setErrorMessage("Please fill in all the requested fields.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${JWT}`,
          },
        }
      );

      if (res.data.IpfsHash) {
        const attributes = [
          {
            trait_type: "Breed",
            value: "Maltipoo",
          },
          {
            trait_type: "Eye color",
            value: "Mocha",
          },
        ];

        const priceInWei = ethers.utils.parseEther("0");

        const transaction = await contract.createNFT(
          tokenName,
          tokenDescription,
          res.data.IpfsHash,
          priceInWei,
          attributes
        );
        await transaction.wait();

        setSuccessMessage("NFT created successfully");
      }
    } catch (error: any) {
      setErrorMessage("An error occurred while creating the NFT.");
      console.log(error);
    } finally {
      resetForm();
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setTokenPrice("");
    setTokenName("");
    setTokenDescription("");
  };

  return (
    <div className="flex max-w-4xl mx-auto lg:my-10 md:my-8 my-6 lg:px-10 md:px-8 px-6 justify-center">
      {address ? (
        <div>
          {/* Title */}
          <div className="mb-6">
            <h1 className="font-bold text-2xl md:text-3xl">Create New NFT</h1>
            <h3 className="font-semibold mt-2 text-slate-600">
              Single edition on Ethereum
            </h3>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 ">
            {/* Left */}
            <div className="col-span-1 md:col-span-2 flex flex-col justify-center " >
              {/* Address */}
              <div className="mb-8 flex flex-row place-items-center border border-gray-400 p-4 rounded-xl border-solid">
                <div>
                  <img
                    className="w-10"
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMSAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMTAuNSAyMS41QzQuNzAxMDEgMjEuNSAwIDE2Ljc5OSAwIDExQzAgNS4yMDA5OCA0LjcwMTAxIDAuNDk5OTY5IDEwLjUgMC40OTk5NjlDMTYuMjk5IDAuNDk5OTY5IDIxIDUuMjAwOTggMjEgMTFDMjEgMTYuNzk5IDE2LjI5OSAyMS41IDEwLjUgMjEuNVoiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8zMTIxXzk1MDIpIi8+CiAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNC42MDEgMTEuMTJMMTAuNDk5NyA0LjQzNzQ3TDYuMzk5OTMgMTEuMTJMMTAuNDk5NyAxMy41Mjg5TDE0LjYwMSAxMS4xMlpNMTQuNjAxMSAxMS44ODU2TDEwLjQ5OTcgMTQuMjYzMUw2LjM5NzIzIDExLjg4MzJMMTAuNDk5NyAxNy41NTlMMTQuNjAxMSAxMS44ODU2WiIgZmlsbD0iI0ZERkVGRSIvPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzMxMjFfOTUwMiIgeDE9IjEwLjUiIHkxPSIwLjQ5OTk2OSIgeDI9IjEwLjUiIHkyPSIyMS41IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiM2QjhDRUYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNkI3MEVGIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KPC9zdmc+Cg=="
                    alt="ETH logo"
                  />
                </div>
                <div className="w-full ml-4">
                  <div className="flex grow justify-between">
                    <p className="font-bold text-lg">
                      {formatAddress(address)}
                    </p>
                    <div>
                      <div className="px-1.5 py-1 rounded bg-green-200/[.5]">
                        <p className="text-green-500 text-xs font-medium leading-4">
                          Connected
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{network}</p>
                  </div>
                </div>
              </div>

              {/* Upload file */}
              <div className="mb-8 hover:cursor-pointer">
                <p className="mb-2 font-bold text-lg">Upload file</p>
                <div className="place-items-center grid border border-gray-400 px-16 py-10 rounded-xl border-dashed relative">
                  {preview ? (
                    <div className="flex items-center justify-center">
                      <img
                        className="w-full"
                        src={preview.toString()}
                        alt="Preview"
                      />
                      <div className="absolute top-6 right-6 p-1 border rounded-xl">
                        <svg
                          onClick={removeImage}
                          className="cursor-pointer"
                          fill="none"
                          viewBox="0 0 24 24"
                          height="24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.46967 8.53033C7.17678 8.23744 7.17678 7.76256 7.46967 7.46967C7.76256 7.17678 8.23744 7.17678 8.53033 7.46967L12 10.9393L15.4697 7.46967C15.7626 7.17678 16.2374 7.17678 16.5303 7.46967C16.8232 7.76256 16.8232 8.23744 16.5303 8.53033L13.0607 12L16.5303 15.4697C16.8232 15.7626 16.8232 16.2374 16.5303 16.5303C16.2374 16.8232 15.7626 16.8232 15.4697 16.5303L12 13.0607L8.53033 16.5303C8.23744 16.8232 7.76256 16.8232 7.46967 16.5303C7.17678 16.2374 7.17678 15.7626 7.46967 15.4697L10.9393 12L7.46967 8.53033Z"
                            clipRule="evenodd"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="w-12 h-12 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                      <span className="mt-4 mb-2 text-grey font-semibold text-xl">
                        JPG, PNG, GIF. Max 10mb.
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        className="block w-full text-sm hover:cursor-pointer  text-slate-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-black-50 file:text-black-700
                          hover:file:bg-black-100"
                        />
                    </div>
                  )}
                </div>
              </div>

              {/* Inputs */}
              <div className="">
                <div className="grid mb-4">
                  <label className="mb-1 font-bold text-base">Name</label>
                  <input
                    type="text"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    placeholder="My NFT name"
                    className="border-2 hover:border-gray-400 border-transparent px-4 py-2 rounded-xl transition-colors"
                  />
                </div>
                <div className="grid mb-4">
                  <label className="mb-1 font-bold text-base">
                    Description{" "}
                    <span className="text-xs text-slate-600">(Optional)</span>
                  </label>
                  <textarea
                    value={tokenDescription}
                    onChange={(e) => setTokenDescription(e.target.value)}
                    placeholder="NFT Description"
                    className="border-2 hover:border-gray-400 border-transparent px-4 py-2 rounded-xl transition-colors"
                  />
                </div>

                <button
                  onClick={() => !loading && createNewNFT()}
                  disabled={loading !== false}
                  className={`mt-6 bg-black text-white w-full font-semibold py-3 px-12 rounded-xl ${
                    loading
                      ? "opacity-50 cursor-not-allowed w-full"
                      : "hover:bg-gray-900 w-full"
                  }`}
                >
                  {loading && !errorMessage && !successMessage ? (
                    <div role="status ">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 mx-auto flex justify-start text-gray-200 animate-spin dark:text-gray-600 fill-white"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    "Create NFT"
                  )}
                </button>
                {successMessage && (
                  <p className="mt-4 text-green-500">{successMessage}</p>
                )}
                {errorMessage && (
                  <p className="mt-4 text-red-500">{errorMessage}</p>
                )}
              </div>
            </div>

            {/* Right */}
            <div className="hidden md:block">
              <div className="grid sticky top-24">
                <p className="mb-2 font-bold text-lg">Preview</p>
                <div className="min-h-[358px]">
                  <div className="h-full border rounded-xl border-gray-400">
                    {preview ? (
                      <div className="flex flex-col p-1.5">
                        <img
                          className="w-full h-[200px] object-cover rounded-xl"
                          src={preview.toString()}
                          alt="Preview"
                        />
                        <div className="mt-4">
                          <div className="mx-3 flex justify-between">
                            <p className="font-semibold text-lg">
                              {tokenName || "Untitled"}
                            </p>
                            <p className="border border-gray-400 text-xs ml-2 my-auto py-1 px-2 rounded-lg">
                              #1
                            </p>
                          </div>
                          <p className="mx-3 mb-4 text-sm text-slate-500">
                            Owner: {formatAddress(address)}
                          </p>
                          <div className="inline-grid grid-cols-2 gap-3 bg-slate-200 mx-auto px-3 py-2.5 rounded-xl w-full">
                            <div className="col-span-1 w-full">
                              <p className="font-semibold text-sm text-slate-500">
                                Price
                              </p>
                              <p className="font-semibold">
                                {"0.00 ETH"}
                              </p>
                            </div>
                            <div className="col-span-1 w-full">
                              <p className="font-semibold text-sm text-slate-500">
                                Highest bid
                              </p>
                              <p className="font-semibold wrapper">
                                No bids yet
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col py-6 px-8 text-center justify-center items-center">
                        <p className="text-sm text-slate-600">
                          Upload file and choose collection to preview your
                          brand new NFT
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-semibold text-red-600">
            Please connect your wallet to create a new NFT.
          </p>
        </div>
      )}
    </div>
  );
}

export default Create;

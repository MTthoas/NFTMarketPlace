import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  createBrowserRouter,
} from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import Header from "./components/header/header";
import Home from "./components/pages/home/home";
import Market from "./components/pages/market/market";

import NFT from "./components/pages/nft/Nft";

import ErrorPage from "./components/pages/error/error-page";
import "./index.css";

function getLibrary(provider) {
  return new Web3Provider(provider);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <Router>
      <div>
        <div className="drawer">
          <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col bg-base-100">
            <Header />
            <Toaster />

            <Routes>
              <Route path="*" element={<ErrorPage />} />
              <Route path="/" element={<Home />} />
              <Route path="/market" element={<Market />} />
              <Route path="/nft/:id" element={<NFT />} />
            </Routes>
          </div>

          <div className="drawer-side">
            <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
            <ul className="menu p-4 w-60 bg-base-100">
              <div class="mt-5">
                <a class="text-3xl font-bold text-neutral dark:text-white ml-3 mt-1">
                  <span class="text-white">ART</span>
                  <span class="text-secondary">X</span>
                </a>
                <div className="form-control mt-5">
                  <input
                    type="text"
                    placeholder="Search"
                    className="input input-bordered w-48"
                  />
                </div>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </Router>
  </Web3ReactProvider>
);

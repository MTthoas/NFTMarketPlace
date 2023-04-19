import React, { useState } from "react";
import "react-modern-drawer/dist/index.css";

import useDarkSide from "hook/useDarkSide.jsx";
import "./App.css";

import NftCardGrid from "./nftCarGrid/nftCardGrid";
import NftTopCollection from "./nfttopCollection/nftTopCollection";

function App() {
  const [theme, setTheme] = useDarkSide();
  // const [darkSide, setDarkSide] = useState(theme === "light" ? false : true);
  // const [drawerOpen, setDrawerOpen] = useState(true);

  // const toggleDarkMode = (checked) => {
  //   setTheme(theme);
  //   setDarkSide(checked);
  // };

  React.useEffect(() => {
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);

  // const handleClose = () => {
  //   setDrawerOpen(false);
  // };

  // let Links = [
  //   { name: "HOME", link: "/" },
  //   { name: "SERVICE", link: "/" },
  //   { name: "BLOG'S", link: "/" },
  //   { name: "CONTACT", link: "/" },
  // ];

  return (
    <div className="w-full">
      {/* Header / nav */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[837/678] w-[36.125rem] -translate-x-1/2 rotate-[53deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl py-12 sm:py-12 lg:py-24">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-400 ">
              Announcing our next round of funding.{" "}
              <a href="#" className="font-semibold text-white">
                <span className="absolute inset-0" aria-hidden="true" />
                Read more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neutral sm:text-6xl">
              Discover, collect and sell extraordinary NFTs
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-400">
              Digital marketplace for Non-Fungible Tokens (NFTs). Buy, sell, and
              discover exclusive digital assets.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button class="bg-transparent  hover:bg-secondary text-secondary font-semibold hover:text-white py-2 px-4 border border-secondary hover:border-transparent rounded-full">
                View collection
              </button>
              <a
                href="#"
                className="text-sm font-semibold leading-6 text-neutral"
              >
                About us <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-70rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1100/900] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#9089fc] to-[#ff80b5] opacity-30 sm:left-[calc(50%+rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>

      {/* NFT Card Grid */}
      <div className="container flex flex-row px-4 py-7 mx-auto">
        <NftCardGrid />
      </div>

      {/* Text part : Create and Sell Your NFTs */}
      <div className="container px-4 py-7 mx-auto">
        <h2 className="text-2xl text-center font-semibold text-white pb-7">
          Create and Sell Your NFTs
        </h2>
        <div className="flex flex-col md:flex-row justify-around gap-10 md:gap-20">
          <div className="flex flex-col items-center justify-center h-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
              />
            </svg>
            <h3 className="text-xl font-bold text-center py-2">
              Setup your wallet
            </h3>
            <p className="text-center">
              Once you’ve set up your wallet of choice, connect it to ArtX by
              clicking the wallet icon in the navigation menu
            </p>
          </div>
          <div className="flex flex-col items-center justify-center h-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            <h3 className="text-xl font-bold text-center py-2">
              Upload & Create Collection
            </h3>
            <p className="text-center">
              Once you’ve set up your wallet of choice, connect it to ArtX by
              clicking the wallet icon in the navigation menu
            </p>
          </div>
          <div className="flex flex-col items-center justify-center h-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
              />
            </svg>
            <h3 className="text-xl font-bold text-center py-2">
              List them for sale
            </h3>
            <p className="text-center">
              Upload your work then Click My Collections and set up your
              collection. Add social links and a description to your NFTs
            </p>
          </div>
        </div>
      </div>

      {/* Top Collection */}
      <div className="container flex flex-row px-4 py-7 mx-auto">
        <NftTopCollection />
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect, Fragment } from "react";
import { ethers } from "ethers";
import MarketPlaceJSON from "../../../contracts/marketplace.json";

import Contracts from "../../../contracts/contracts.json";

import { NFT } from "../../interface/NFT";
import NFT_CARD_WALLET from "../../card/NFT_CARD_WALLET";

import ListToken from "../Create/ListToken";

import { BigNumber } from "ethers";
import { Transition, Dialog, Disclosure, Menu } from "@headlessui/react";
import {
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  ChevronDownIcon,
  FunnelIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { add } from "date-fns";

const sortOptions = [
  { name: "Most Popular", href: "#", current: true },
  { name: "Best Rating", href: "#", current: false },
  { name: "Newest", href: "#", current: false },
  { name: "Price: Low to High", href: "#", current: false },
  { name: "Price: High to Low", href: "#", current: false },
];

const subCategories = [
  { name: "Totes", href: "#" },
  { name: "Backpacks", href: "#" },
  { name: "Travel Bags", href: "#" },
  { name: "Hip Bags", href: "#" },
  { name: "Laptop Sleeves", href: "#" },
];

const filters = [
  {
    id: "color",
    name: "Color",
    options: [
      { value: "white", label: "White", checked: false },
      { value: "beige", label: "Beige", checked: false },
      { value: "blue", label: "Blue", checked: true },
      { value: "brown", label: "Brown", checked: false },
      { value: "green", label: "Green", checked: false },
      { value: "purple", label: "Purple", checked: false },
    ],
  },
  {
    id: "category",
    name: "Category",
    options: [
      { value: "new-arrivals", label: "New Arrivals", checked: false },
      { value: "sale", label: "Sale", checked: false },
      { value: "travel", label: "Travel", checked: true },
      { value: "organization", label: "Organization", checked: false },
      { value: "accessories", label: "Accessories", checked: false },
    ],
  },
  {
    id: "size",
    name: "Size",
    options: [
      { value: "2l", label: "2L", checked: false },
      { value: "6l", label: "6L", checked: false },
      { value: "12l", label: "12L", checked: false },
      { value: "18l", label: "18L", checked: false },
      { value: "20l", label: "20L", checked: false },
      { value: "40l", label: "40L", checked: true },
    ],
  },
];
function convertDurationToSeconds(durationText : any) {
    let durationInSeconds;
    switch (durationText) {
        case "1 minutes":
            durationInSeconds = (60);
        break;
        case "5 minutes":
            durationInSeconds = (5 * 60);
        break;
        case "15 minutes":
            durationInSeconds = (30 * 60)/2;
        break;
        case "30 minutes":
            durationInSeconds = 30 * 60;
            break;
        case "1 heure":
            durationInSeconds = 1 * 60 * 60;
            break;
        case "2 heures":
            durationInSeconds = 2 * 60 * 60;
            break;
        case "6 heures":
            durationInSeconds = 6 * 60 * 60;
            break;
        case "1 jour":
            durationInSeconds = 24 * 60 * 60;
            break;
        default:
            durationInSeconds = 0; // Si aucune option n'est sélectionnée ou pour une entrée non valide
            break;
    }
    return durationInSeconds;
  }
  

function Wallet() {
  const [data, updateData] = useState<NFT[]>([]);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [adress, setAdress] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [value, setValue] = useState<NFT>();
  const [dataLogs, setData] = useState(data);

  const [loading, setLoading] = useState<Record<string, boolean>>({});

  async function getMyNFTs() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      let NFTContract = new ethers.Contract(
        Contracts.NFTMarket.address,
        Contracts.NFTMarket.abi,
        provider
      );
      let myNftMarket = new ethers.Contract(
        Contracts.MyNFT.address,
        Contracts.MyNFT.abi,
        provider
      );

      // Get adress of user

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];

      // GetAllMyNfts with the user adress in parameter

      let transaction = await NFTContract.getMyNFTs(account);

      // let nftData = await myNftMarket.getTokenData(0);

      //  console.log(nftData)

      const items = await Promise.all(
        transaction.map(async (tokenId: BigNumber) => {
          console.log(tokenId.toNumber());
          const data = await myNftMarket.getTokenData(tokenId.toNumber());

          const getAllData = await NFTContract.getAllData(tokenId.toNumber());
          const price = ethers.utils.formatEther(getAllData.price);

          const isOnSale = await NFTContract.isTokenOnSale(tokenId);
          const isOnAuction = await NFTContract.isTokenOnAuction(tokenId);

          let type = "none";

          if (isOnSale) {
            type = "sale";
          } else if (isOnAuction) {
            type = "auction";
          }

          console.log("Type : " + type);

          const item = {
            tokenId: tokenId.toNumber(),
            name: data[0],
            description: data[1],
            image: data[2],
            owner: data[4],
            price: price,
            type: type,
          };

          console.dir(item);
          return item;
        })
      );

      updateData(items);
    } catch (error: any) {
      console.log(error);
    }
  }

  const ListOnMarketPlace = async (
    tokenId: any,
    method: any,
    price: string,
    time: any
  ) => {
    try {
        
        const timeConverted = convertDurationToSeconds(time);

      setLoading((prev) => ({ ...prev, [tokenId]: true }));
      console.log("List");
      localStorage.setItem(`loading-${tokenId}`, "true"); // save loading state to local storage

      console.log("TokenId :" + tokenId);
      console.log("Method :" + method);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let NFTContract = new ethers.Contract(
        Contracts.MyNFT.address,
        Contracts.MyNFT.abi,
        signer
      );
      let nftMarketContract = new ethers.Contract(
        Contracts.NFTMarket.address,
        Contracts.NFTMarket.abi,
        signer
      );

      const priceInWei = ethers.utils.parseEther(price);

      const methodNumber =
        method === "Fixed price" ? 1 : method === "Timed auction" ? 2 : 0;

      const approveTx = await NFTContract.approve(
        Contracts.NFTMarket.address,
        tokenId
      );
      await approveTx.wait();


      const sale = await nftMarketContract.setSale(tokenId, methodNumber, priceInWei, timeConverted);
      const receipt = await sale.wait();

      

    } catch (error) {
      console.error("Transaction was rejected: ", error);
    } finally {
      setLoading((prev) => ({ ...prev, [tokenId]: false }));
      localStorage.setItem(`loading-${tokenId}`, "false"); // save loading state to local storage
    }
  };

  const UnlistOnMarketPlace = async (tokenId: any) => {
    try {
      setLoading((prev) => ({ ...prev, [tokenId]: true }));
      localStorage.setItem(`loading-${tokenId}`, "true"); // save loading state to local storage

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      let NFTContract = new ethers.Contract(
        Contracts.NFTMarket.address,
        Contracts.NFTMarket.abi,
        provider
      );
      let myNftMarket = new ethers.Contract(
        Contracts.MyNFT.address,
        Contracts.MyNFT.abi,
        provider
      );

      const isOnSale = await NFTContract.isTokenOnSale(tokenId);
      const isOnAuction = await NFTContract.isTokenOnAuction(tokenId);

      let type = "none";

      if (isOnSale) {
        type = "sale";

        const transaction = await NFTContract.removeSale(tokenId);

        const receipt = await transaction.wait();

        if (receipt.status === 0) {
          localStorage.setItem(`loading-${tokenId}`, "false"); // save loading state to local storage
          throw new Error("Transaction failed");
        }

        console.log("Transaction Done");

      } else if (isOnAuction) {
        type = "auction";

        const transaction = await NFTContract.removeAuction(tokenId);

        const receipt = await transaction.wait();

        if (receipt.status === 0) {
          localStorage.setItem(`loading-${tokenId}`, "false"); // save loading state to local storage
          throw new Error("Transaction failed");
        }

        console.log("Transaction Done");

      }

    } catch (error) {
      console.error("Transaction was rejected: ", error);

      setLoading((prev) => ({ ...prev, [tokenId]: false }));

      localStorage.setItem(`loading-${tokenId}`, "false"); // save loading state to local storage
    } finally {
      setLoading((prev) => ({ ...prev, [tokenId]: false }));

      localStorage.setItem(`loading-${tokenId}`, "false"); // save loading state to local storage
    }
  };

  useEffect(() => {
    setInfos();
    getMyNFTs();
  }, []);

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
  }

  const setInfos = async () => {
    // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    // setAdress(accounts[0])
  };

  return (
    <div className="container mx-auto">
      {/* Mobile filter dialog */}
      <Transition.Root show={mobileFiltersOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          onClose={setMobileFiltersOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Filters */}
                <form className="mt-4 border-t border-gray-200">
                  <h3 className="sr-only">Categories</h3>
                  <ul
                    role="list"
                    className="px-2 py-3 font-medium text-gray-900"
                  >
                    {subCategories.map((category) => (
                      <li key={category.name}>
                        <a href={category.href} className="block px-2 py-3">
                          {category.name}
                        </a>
                      </li>
                    ))}
                  </ul>

                  {filters.map((section) => (
                    <Disclosure
                      as="div"
                      key={section.id}
                      className="border-t border-gray-200 px-4 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between px-2 py-3 text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                {section.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6">
                              {section.options.map((option, optionIdx) => (
                                <div
                                  key={option.value}
                                  className="flex items-center"
                                >
                                  <input
                                    id={`filter-mobile-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    defaultValue={option.value}
                                    type="checkbox"
                                    defaultChecked={option.checked}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                    className="ml-3 min-w-0 flex-1 text-gray-500"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <main className="container mx-auto pl-12 pr-14">
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            My Wallet
          </h1>

          <div className="flex items-center">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  Sort
                  <ChevronDownIcon
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <Menu.Item key={option.name}>
                        {({ active }) => (
                          <a
                            href={option.href}
                            className={classNames(
                              option.current
                                ? "font-medium text-gray-900"
                                : "text-gray-500",
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            {option.name}
                          </a>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            <button
              type="button"
              className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
            >
              <span className="sr-only">View grid</span>
              <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <span className="sr-only">Filters</span>
              <FunnelIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <section aria-labelledby="products-heading" className="pb-24 pt-6">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Filters */}
            <form className="hidden lg:block">
              <h3 className="sr-only">Categories</h3>
              <ul
                role="list"
                className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900"
              >
                {subCategories.map((category) => (
                  <li key={category.name}>
                    <a href={category.href}>{category.name}</a>
                  </li>
                ))}
              </ul>

              {filters.map((section) => (
                <Disclosure
                  as="div"
                  key={section.id}
                  className="border-b border-gray-200 py-6"
                >
                  {({ open }) => (
                    <>
                      <h3 className="-my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between py-3 text-sm text-gray-400 hover:text-gray-500">
                          <span className="font-medium text-gray-900">
                            {section.name}
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-4">
                          {section.options.map((option, optionIdx) => (
                            <div
                              key={option.value}
                              className="flex items-center"
                            >
                              <input
                                id={`filter-${section.id}-${optionIdx}`}
                                name={`${section.id}[]`}
                                defaultValue={option.value}
                                type="checkbox"
                                defaultChecked={option.checked}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label
                                htmlFor={`filter-${section.id}-${optionIdx}`}
                                className="ml-3 text-sm text-gray-600"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </form>

            <div
              className=" grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3   xl:grid-cols-4 3xl:grid-cols-5
              gap-x-0 md:gap-x-2 lg:gap-x-64 gap-y-5"
            >
              {data.map((value, index) => {
                return (
                  <div key={index}>
                    <NFT_CARD_WALLET
                      key={index}
                      tokenId={value.tokenId}
                      owner={value.owner}
                      //seller={value.seller}
                      price={value.price}
                      image={value.image}
                      type={value.type}
                      data={value}
                      setShowModal={setShowModal}
                      setValue={setValue}
                      loading = {loading[value.tokenId] || false}
                      unlistMethod={UnlistOnMarketPlace}
                    />
                  </div>
                );
              })}

              {showModal ? (
                <ListToken
                  setShowModal={setShowModal}
                  value={value}
                  unlistMethod={UnlistOnMarketPlace}
                  listMethod={ListOnMarketPlace}
                />
              ) : null}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Wallet;

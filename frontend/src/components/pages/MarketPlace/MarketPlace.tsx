import React, {Fragment} from 'react'
import { useState, useEffect } from "react";
import { ethers } from 'ethers';
import MarketPlaceJSON from '../../../contracts/marketplace.json';
import axios from 'axios';

import Contracts from '../../../contracts/contracts.json';


import { NFT } from '../../interface/NFT';

import { NFT_Auction } from '../../interface/NFT_Auction';
import { NFT_Sales } from '../../interface/NFT_Sales';


import NFT_CARD_MARKETPLACE from '../../card/NFT_CARD_MARKETPLACE';

import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'


const sortOptions = [
  { name: 'Most Popular', href: '#', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
  { name: 'Price: Low to High', href: '#', current: false },
  { name: 'Price: High to Low', href: '#', current: false },
]

const subCategories = [
  { name: 'Totes', href: '#' },
  { name: 'Backpacks', href: '#' },
  { name: 'Travel Bags', href: '#' },
  { name: 'Hip Bags', href: '#' },
  { name: 'Laptop Sleeves', href: '#' },
]

const filters = [
  {
    id: 'color',
    name: 'Color',
    options: [
      { value: 'white', label: 'White', checked: false },
      { value: 'beige', label: 'Beige', checked: false },
      { value: 'blue', label: 'Blue', checked: true },
      { value: 'brown', label: 'Brown', checked: false },
      { value: 'green', label: 'Green', checked: false },
      { value: 'purple', label: 'Purple', checked: false },
    ],
  },
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'new-arrivals', label: 'New Arrivals', checked: false },
      { value: 'sale', label: 'Sale', checked: false },
      { value: 'travel', label: 'Travel', checked: true },
      { value: 'organization', label: 'Organization', checked: false },
      { value: 'accessories', label: 'Accessories', checked: false },
    ],
  },
  {
    id: 'size',
    name: 'Size',
    options: [
      { value: '2l', label: '2L', checked: false },
      { value: '6l', label: '6L', checked: false },
      { value: '12l', label: '12L', checked: false },
      { value: '18l', label: '18L', checked: false },
      { value: '20l', label: '20L', checked: false },
      { value: '40l', label: '40L', checked: true },
    ],
  },
]


export default function MarketPlace() {

    const [data, updateData] = useState<NFT[]>([]);

    const [ NFT_Auction_data, update_NFT_Auction_data] = useState<NFT_Auction[]>([]);
    const [ NFT_Sales_data, update_NFT_Sales_data] = useState<NFT_Sales[]>([]);

    const [filtersVisible, setFiltersVisible] = useState(true);
    const [adress, setAdress] = useState("")

    const toggleFilters = () => {
      setFiltersVisible(!filtersVisible);
    };

    const setInfos = async() => {

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAdress(accounts[0])

    }

    function getCurrentTimestampInSeconds () {
      return Math.floor(Date.now() / 1000)
    }

  
    async function getAllNFTs() {

      try {

        console.log("getAllNFTs")
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        let myNftMarket = new ethers.Contract(Contracts.NFTMarket.address, Contracts.NFTMarket.abi, provider);
        let myNFT = new ethers.Contract(Contracts.MyNFT.address, Contracts.MyNFT.abi, provider);
        
        // let transactionAuction = await auctionContract.getAllAuctions();
        let transactionSales = await myNftMarket.getAllSales();
        // let transactionAuction = await myNftMarket.getAllAuctions();

        const Sales = await Promise.all(transactionSales.map(async (i: any) => {

          const data = await myNFT.getTokenData(i.toNumber());

          const getAllData = await myNftMarket.getAllData(i.toNumber());
          console.log(getAllData)

          const price = ethers.utils.formatEther(getAllData.price);

          console.log("Price: ", price)

          const isOnSale = await myNftMarket.isTokenOnSale(i.toNumber());
          const isOnAuction = await myNftMarket.isTokenOnAuction(i.toNumber());

          console.log(data[0], isOnSale, isOnAuction)
          let type = "none";
          let listEndTime = 0;
          let remainingMilliseconds = 0;

          if(isOnSale) {
            type = "sale";
            listEndTime = getAllData.salesEndTime.toNumber();
          } else if(isOnAuction) {
              type = "auction";
              listEndTime = getAllData.auctionEndTime.toNumber();
          }
      
          const remainingSeconds = listEndTime - getCurrentTimestampInSeconds();
          
          if (remainingSeconds > 0) {
              remainingMilliseconds = remainingSeconds * 1000;
          }

          
          console.log("List End Time: ", remainingMilliseconds)

          const item = {
            tokenId: i.toNumber(),
            name: data[0],
            description: data[1],
            image: data[2],
            price: price, 
            owner: data[4],
            type: type.toString(),
            listEndTime : remainingMilliseconds
          }

          return item;

        }));


      // updateData(Sales)

      console.table(Sales)

      updateData(Sales)
      

      } catch (error) {
          console.log(error);
      }
    }
    

    useEffect(() => {
        getAllNFTs();
        setInfos();
    }, []);

    function classNames(...classes: any) {
      return classes.filter(Boolean).join(' ')
    }

    const purchaseNFT = async (nft: NFT) => {
        try {
            console.log(`NFT Infos: `, nft);
            
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(MarketPlaceJSON.address, MarketPlaceJSON.abi, signer);
    
            const priceWei = ethers.utils.parseEther(nft.price.toString());
            const transaction = await contract.executeSale(nft.tokenId, { value: priceWei });
    
            await transaction.wait();  // Attendez que la transaction soit minée
            
    
            console.log('NFT acheté avec succès !');
        } catch (error) {
            console.log('Erreur lors de l\'achat du NFT: ', error);
        }
    };
    
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

    
    return (
      <div>
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
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
                    <ul role="list" className="px-2 py-3 font-medium text-gray-900">
                      {subCategories.map((category) => (
                        <li key={category.name}>
                          <a href={category.href} className="block px-2 py-3">
                            {category.name}
                          </a>
                        </li>
                      ))}
                    </ul>

                    {filters.map((section) => (
                      <Disclosure as="div" key={section.id} className="border-t border-gray-200 px-4 py-6">
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between px-2 py-3 text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">{section.name}</span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                  ) : (
                                    <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-6">
                                {section.options.map((option, optionIdx) => (
                                  <div key={option.value} className="flex items-center">
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
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">New Arrivals</h1>

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
                                option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm'
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

              <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
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
                <ul role="list" className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
                  {subCategories.map((category) => (
                    <li key={category.name}>
                      <a href={category.href}>{category.name}</a>
                    </li>
                  ))}
                </ul>

                {filters.map((section) => (
                  <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6">
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">{section.name}</span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon className="h-5 w-5" aria-hidden="true" />
                              ) : (
                                <PlusIcon className="h-5 w-5" aria-hidden="true" />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            {section.options.map((option, optionIdx) => (
                              <div key={option.value} className="flex items-center">
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

              {/* Product grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3   xl:grid-cols-4 3xl:grid-cols-5
              gap-x-0 md:gap-x-2 lg:gap-x-64 gap-y-5">               
              {data.map((value, index) => {
                  return(
                      <div key={index}>
                          <NFT_CARD_MARKETPLACE 
                              key={index}
                              tokenId={value.tokenId}
                              // seller={value.seller}
                              owner={value.owner}
                              price={value.price}
                              image={value.image}
                              type={value.type}
                              data={value}
                          />
                      </div>
                      
                  )
              })}
          </div>
            </div>
          </section>
        </main>

                {/* NFTs */}
        {/* <div className={filtersVisible ? 'w-4/5  ml-2' : 'w-full'}>
          
        </div>

      </div>
    </div> */}

      </div>
    </div>
    );
}

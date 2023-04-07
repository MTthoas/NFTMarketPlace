import React, { useState } from 'react'
import 'react-modern-drawer/dist/index.css'

import useDarkSide from "hook/useDarkSide.jsx" ;
import { DarkModeSwitch } from 'react-toggle-dark-mode'
import './App.css'

import NFT1 from './storage/NFT1.png'

import Header from './components/header/header'
import Footer from './components/footer/footer'

import './App.css'

function App() {

  const [ theme, setTheme] = useDarkSide() ;
  const [darkSide, setDarkSide] = useState( theme === "light" ? false : true);
  const [drawerOpen, setDrawerOpen] = useState(true);
  
  const toggleDarkMode = (checked) => {
      setTheme(theme)
      setDarkSide (checked )
  };

  React.useEffect(() => {
    document.querySelector('html').setAttribute('data-theme', theme);
  }, [theme]);

  const handleClose = () => {
    setDrawerOpen(false);
  };


  let Links =[
    {name:"HOME",link:"/"},
    {name:"SERVICE",link:"/"},
    {name:"BLOG'S",link:"/"},
    {name:"CONTACT",link:"/"},
  ];
  
  return (
    <div className="App">

      <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" /> 

        <main className="drawer-content flex flex-col bg-base-100">

          <Header/>

          {/* <div className="circle1"> </div>
          <div className="circle1"> </div> */}

          {/* Main menu */}

          <div className="h-screen w-screen">

              <div className="relative isolate px-6 pt-14 lg:px-8">
                <div  className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"aria-hidden="true">
                  <div className="relative left-[calc(50%-11rem)] aspect-[837/678] w-[36.125rem] -translate-x-1/2 rotate-[53deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    style={{ clipPath:  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',  }}
                  />
            </div>
            <div className="mx-auto max-w-2xl py-12 sm:py-12 lg:py-24">
              <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-400 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                  Announcing our next round of funding.{' '}
                  <a href="#" className="font-semibold text-indigo-600">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Read more <span aria-hidden="true">&rarr;</span>
                  </a> 
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Discover, collect and sell extraordinary NFTs
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-400">
                  Digital marketplace for Non-Fungible Tokens (NFTs). Buy, sell, and discover exclusive digital assets.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                <button class="bg-transparent  mr-3 hover:bg-secondary text-secondary font-semibold hover:text-white py-2 px-4 border border-secondary hover:border-transparent rounded-full">
                    View collection
                    </button>
                  <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                    Learn more <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>

            <div
              className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-70rem)]"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%+3rem)] aspect-[1100/900] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#9089fc] to-[#ff80b5] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
              />
            </div>
          
          </div>

          

          </div>


        </main>

        
        
        
        {/* Drawer */}

        <div className="drawer-side">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label> 
            <ul className="menu p-4 w-60 bg-base-100">

              <div class="mt-5">
              <a class="text-3xl font-bold text-neutral dark:text-white ml-3 mt-1">
                  <span class="text-white">ART</span>
                  <span class="text-secondary">X</span>
                </a>
 
                <div className="form-control mt-5">
                  <input type="text" placeholder="Search" className="input input-bordered w-48" />
                </div>

              </div>
              
      
            </ul>
        </div>
{/*         
        <p> test </p> */}
      </div>

      <div className="h-screen w-screen">

           <div className="container flex flex-row px-4 py-4  mx-auto">

                    <div className="flex flex-row  mx-auto">
                      <div>
                        <img src={NFT1} alt="NFT1" className="max-w-sm rounded-lg shadow-2xl" />
                      </div>
                      <div>
                        <h1 className="text-white"> Live Auction</h1>
                      </div>
                    </div>

           </div>

      </div>
  
   


    </div>
  );
}

export default App;

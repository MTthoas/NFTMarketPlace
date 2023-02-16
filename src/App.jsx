import React, { useState } from 'react'
import 'react-modern-drawer/dist/index.css'

import useDarkSide from "hook/useDarkSide.jsx" ;
import { DarkModeSwitch } from 'react-toggle-dark-mode'
import './App.css'


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

        <div className="drawer-content flex flex-col">
          <div className="navbar bg-base-100 mr-2 lg:px-7">

            <div className="navbar-start mt-1">
                <div className="dropdown pt-2 Hamburger">
                  <label tabIndex={0} className="btn btn-ghost lg:hidden" htmlFor="my-drawer-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                  </label>
                  
                </div>
                <a className=" text-4xl font-bold dark:text-white pt-3 ml-3 font-RoseQuay"> artx </a>

                <div className="hidden lg:flex lg:ml-7" >

                <div class="relative w-full mt-3">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
                        <svg aria-hidden="true" class="w-5 h-5 text-normal" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
                    </div>
                    <input type="text" id="small-input" class=" Search w-48  block border p-2 bg-base-100 border-gray-300 text-gray-900 text-sm rounded-lg pl-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white " placeholder="Search collection" required/>
                </div>

                {/* <div className="form-control mt-5">
                  <input type="text" placeholder="Search" className="input input-bordered w-48" />
                </div> */}

                </div>
                
            </div>

            <div className="navbar-center hidden lg:flex pt-1">
              
                <ul className="menu menu-horizontal px-4 space-x-4">
                  <li><a href="#" className="btn-ghost mt-2">Item 1</a></li>
                  <li><a href="#" className="btn-ghost mt-2">Item 2</a></li>
                  <li tabIndex={0}>
                    <a href="#" className="btn-ghost mt-2">
                      Parent
                      <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </a>
                    <ul className="p-2">
                      <li><a className="btn-ghost">Submenu 1</a></li>
                      <li><a className="btn-ghost">Submenu 2</a></li>
                    </ul>
                  </li>
                  <li><a href="#" className="btn-ghost mt-2">Item 3</a></li>
                </ul>
            </div>


            <div className="navbar-end pt-3 mr-3">

      
                <a className="px-3">Login</a>
                <btn className="btn px-4 SignUp text-white">Register</btn>

                    <DarkModeSwitch
                      className='ml-3 mr-1'
                      checked={darkSide}
                      onChange={toggleDarkMode}
                      size={20}
                    />
            </div>
            
          </div>

          {/* Main menu */}

          <div className="">

            <div className="md:h-128 lg:h-114 w-90">

              <div className="flex flex-row gap-12 mx-9 py-24">

                <div className=" w-full h-full">

                  <h1 className="text-7xl font-bold font-RoseQuay dark:text-white">Collect </h1>
                  <h1 className="text-7xl font-bold font-RoseQuay dark:text-white">virtual art </h1>
                  
                  <p className="text-xl ml-2"> Buy and sell NFT's and earn rewards</p>
                  
                  <button className="btn mt-16 ml-2 SignUp text-white"> Explore the virtual world </button>

                </div>

                <div className=" w-full h-full">
                </div>

              </div>

            </div>

            <div className="bg-neutral h-56 w-90 ">


                <div className="grid grid-cols-3 gap-12 mx-8 py-12">

{/*                     
                  <div className="bg-white w-full h-20">
                  </div> 

                  <div className="bg-white w-full h-full">
                  </div> 

                  <div className="bg-white w-full h-full">
                  </div>  */}

                </div> 
            </div>


          </div>


        </div>
        
        
        {/* Drawer */}

        <div className="drawer-side">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label> 
            <ul className="menu p-4 w-60 bg-base-100">

              <div class="mt-5">
                <a className="lg:mx-4  text-3xl font-borld dark:text-white pt-1 ml-3 font-RoseQuay"> ARTX </a>
 
                <div className="form-control mt-5">
                  <input type="text" placeholder="Search" className="input input-bordered w-48" />
                </div>

              </div>
              
      
            </ul>
        </div>
{/*         
        <p> test </p> */}
      </div>
   


    </div>
  );
}

export default App;

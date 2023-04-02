import React, { useState, useTheme } from 'react'
import 'react-modern-drawer/dist/index.css'

import useDarkSide from "hook/useDarkSide.jsx" ;
import { DarkModeSwitch } from 'react-toggle-dark-mode'
import './App.css'

function Header() {

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


  return (

    <div className="navbar bg-base-100 pr-2 lg:px-7">

            <div className="navbar-start">
                <div className="dropdown pt-5 Hamburger">
                <label tabIndex={0} className="btn btn-ghost lg:hidden" htmlFor="my-drawer-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${theme === 'dark' ? 'dark:text-white' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                  </svg>
                </label>
                  
                </div>
                <a className=" text-4xl font-bold text-neutral dark:text-white ml-3"> artx </a>

                
            </div>

            <div className="navbar-center hidden lg:flex">
              
                <ul className="menu menu-horizontal px-4 space-x-4 mt-1">
                  <li><a href="#" className="btn-ghost mt-2"> Item 1 </a></li>
                  <li><a href="#" className="btn-ghost mt-2"> Item 2 </a></li>
                  <li tabIndex={0}>
                    <a href="#" className="btn-ghost mt-2">
                      Parent
                      <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </a>
                    <ul className="p-2">
                      <li><a className="btn-ghost"> Submenu 1</a></li>
                      <li><a className="btn-ghost"> Submenu 2</a></li>
                    </ul>
                  </li>
                  <li><a href="#" className="btn-ghost mt-2"> Item 3 </a></li>
                </ul>
            </div>


            <div className="navbar-end mr-3">
{/* 
                <a className="px-3">Login</a> */}
                <btn className="btn  mb- md:mx-4 SignUp text-white mt-2"> Connect to wallet </btn>

                    <DarkModeSwitch
                      className='ml-3 mr-1 mt-1'
                      checked={darkSide}
                      onChange={toggleDarkMode}
                      size={20}
                    />
            </div>
            
          </div>
    
  );
}

export default Header;

import React, { useState } from 'react'
import 'react-modern-drawer/dist/index.css'

import useDarkSide from "hook/useDarkSide.jsx";
import { DarkModeSwitch } from 'react-toggle-dark-mode'
import './App.css'
import Wallet from './Wallet'

import { Link } from "react-router-dom";


function Header() {

  const [theme, setTheme] = useDarkSide();
  const [darkSide, setDarkSide] = useState(theme === "light" ? false : true);
  // const [drawerOpen, setDrawerOpen] = useState(true);



  const toggleDarkMode = (checked) => {
    setTheme(theme)
    setDarkSide(checked)
  };

  React.useEffect(() => {
    document.querySelector('html').setAttribute('data-theme', theme);
  }, [theme]);

  // const handleClose = () => {
  //   setDrawerOpen(false);
  // };



  return (

    <div className="navbar bg-transparant z-20 container mx-auto">

      <div className="navbar-start">
        <div className="dropdown pt-1 Hamburger">
          <label tabIndex={0} className="btn btn-ghost lg:hidden" htmlFor="my-drawer-3">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${theme === 'dark' ? 'dark:text-white' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>

        </div>
        <Link to="/" className="text-3xl font-bold text-neutral dark:text-white ml-3 mt-1">
          <span className="text-white">ART</span>
          <span className="text-secondary">X</span>
        </Link>

      </div>

      <div className="navbar-center hidden lg:flex">

        <ul className="menu menu-horizontal px-4 space-x-4 mt-1">
          <li>
            <Link to="/" className="btn-ghost mt-2 text-neutral"> Home </Link>
          </li>
          <li>
            <Link to="/market" className="btn-ghost mt-2 text-neutral "> Marketplace </Link>
          </li>
          <li>
            <a href="#" className="btn-ghost mt-2 text-neutral"> Workshop </a>
          </li>

          <li>
            <a href="#" className="btn-ghost mt-2 text-neutral"> About </a>
          </li>
        </ul>
      </div>


      <div className="navbar-end mr-3">

        <Wallet />

        <DarkModeSwitch
          className='ml-3 mr-1 mt-3'
          checked={darkSide}
          onChange={toggleDarkMode}
          size={20}
        />
      </div>

    </div>

  );
}

export default Header;

import React, { useState } from 'react'
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

    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" /> 
        <div className="drawer-content flex flex-col">
          <div className="navbar bg-base-100 mr-2 lg:px-7">

            <div className="navbar-start mt-1">
                <div className="dropdown pt-2 Hamburger">
                  <label tabIndex={0} className="btn btn-ghost lg:hidden" htmlFor="my-drawer-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                  </label>
                  
                  {/* <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a href="#" >Item 1</a></li>
                    <li><a href="#" className="btn-ghost">Item 1</a></li>
                    <li tabIndex={0}>
                      <a href="#" className="justify-between">
                        Parent
                        <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/></svg>
                      </a>
                      <ul className="pt-2">
                        <li><a href="#">Submenu 1</a></li>
                        <li><a href="#">Submenu 2</a></li>
                      </ul>
                    </li>
                    <li><a href="#">Item 3</a></li>
                  </ul> */}
                </div>
                <a className=" text-3xl font-bold dark:text-white pt-1"> ARTX </a>

                <div className="hidden lg:flex lg:ml-7" >

                <div className="form-control  pt-3">
                  <input type="text" placeholder="Search" className="Search input input-bordered w-full" />
                </div>

                </div>
                
            </div>


            <div className="navbar-center hidden lg:flex pt-1">
              
                <ul className="menu menu-horizontal px-4 space-x-4">
                  <li><a href="#" className="btn-ghost mt-2">Item 1</a></li>
                  <li><a href="#" className="btn-ghost mt-2">Item 2</a></li>
                  <li tabIndex={0}>
                    <a className="btn-ghost mt-2">
                      Parent
                      <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </a>
                    <ul className="p-2">
                      <li><a className="btn-ghost ">Submenu 1</a></li>
                      <li><a className="btn-ghost">Submenu 2</a></li>
                    </ul>
                  </li>
                  <li><a className="btn-ghost mt-2">Item 3</a></li>
                </ul>
            </div>


            <div className="navbar-end pt-3 mr-3">

      
                <a className="px-3">Login</a>
                <btn className="btn px-4 SignUp">Register</btn>

                    <DarkModeSwitch
                      className='ml-3 mr-1'
                      checked={darkSide}
                      onChange={toggleDarkMode}
                      size={20}
                    />
            </div>
            
          </div>
        </div>
        <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label> 
        <ul className="menu p-4 w-60 bg-base-100">
          {/* <!-- Sidebar content here --> */}
          {/* <button htmlFor="my-drawer-3" type="button" data-drawer-hide="drawer-navigation" aria-controls="drawer-navigation" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" >
              <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
              <span class="sr-only">Close menu</span>
          </button> */}
          <div class="mt-5">
            <a className="lg:mx-4 text-3xl font-bold dark:text-white pt-1 pl-3"> ARTX </a>

            
            <div className="form-control mt-5">
              <input type="text" placeholder="Search" className="input input-bordered w-48" />
            </div>

            {/* <li><a>Sidebar Item 1</a></li> */}
          </div>
         
        </ul>
        
      </div>
    </div>
    
  );
}

export default Header;

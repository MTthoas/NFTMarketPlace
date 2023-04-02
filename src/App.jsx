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
          <Header/>

          {/* Main menu */}

          <div className="">

            <div className="md:h-128 lg:h-114 w-90">

              <div className="flex flex-row gap-12 mx-9 py-24">

                <div className=" w-full h-full">

                </div>

                <div className=" w-full h-full">
                </div>

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

import React, { Component, useContext } from 'react';
import { Link } from "react-router-dom";
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { ethers } from 'ethers';

import {CustomButton} from './CustomConnectButton';

declare global {
  interface Window {
    ethereum: any;
  }
}

type HeaderState = {
  theme: string,
  darkSide: boolean,
  headerColor: string,
  scrollPosition: number
};

class Header extends Component<{}, HeaderState> {

  constructor(props: {}) {
    super(props);

    const theme = localStorage.getItem('theme') || 'light';
    this.state = {
      theme,
      darkSide: theme === 'dark',
      headerColor: 'transparent',
      scrollPosition: 0
    };
  }

  componentDidMount() {
    document.querySelector('html')?.setAttribute('data-theme', this.state.theme);
    // window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  componentWillUnmount() {
    // window.removeEventListener('scroll', this.handleScroll);
  }

  // handleScroll = () => {
  //   const position = window.pageYOffset;
  //   this.setState({ scrollPosition: position });
  //   const headerColor = this.state.scrollPosition >= 1 ? 'base-100 bg-opacity-100' : 'transparent';
  //   this.setState({ headerColor });
  // }

  toggleDarkMode = (checked: boolean) => {
    const theme = checked ? 'dark' : 'light';
    this.setState({ darkSide: checked, theme });
    localStorage.setItem('theme', theme);
    document.querySelector('html')?.setAttribute('data-theme', theme);
  }



  render() {
    const { theme, darkSide, headerColor } = this.state;

    return (
      <div className={`sticky top-0 z-20 w-full  bg-base-100 `}>
        <div className="navbar  container mx-auto px-9 ">
          <div className="navbar-start ">
            <div className="dropdown pt-1 Hamburger">
              <label tabIndex={0} className="btn btn-ghost lg:hidden" htmlFor="my-drawer-3">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${theme === 'dark' ? 'dark:text-white' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
              </label>
            </div>
            <a className="text-3xl font-bold ml-3 mt-1">
            <span
                    className=" mt-2 bg-clip-text font-extrabold  text-transparent bg-gradient-to-r from-neutral via-neutral to-base-100 md:inline-block"
                > ARTX </span>
            </a>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-4 space-x-4 mt-1">
              <li>
                <Link to="/">
                  <p className="btn-ghost mt-2 text-neutral"> Home </p>
                </Link>
              </li>
              <li>
                <Link to="/marketplace">
                  <p className="btn-ghost mt-2 text-neutral "> Marketplace </p>
                </Link>
              </li>
              <Link to="/wallet">
                <li>
                  <p className="btn-ghost mt-2 text-neutral"> Wallet </p></li>
              </Link>
              <li>
                <Link to="/create">
                  <p  className="btn-ghost mt-2 text-neutral"> Create </p>
                </Link>
              </li>

            </ul>
          </div>
          <div className="navbar-end mr-3 gap-x-3">
			
            <div className="mt-3">
				      <CustomButton/>
            </div>

            <DarkModeSwitch
              className='ml-3 mr-1 mt-3'
              checked={darkSide}
              onChange={this.toggleDarkMode}
              size={20}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
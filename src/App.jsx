import React from 'react'
import 'react-modern-drawer/dist/index.css'

import Header from './components/header/header'
import Footer from './components/footer/footer'

import './App.css'

function App() {

  let Links =[
    {name:"HOME",link:"/"},
    {name:"SERVICE",link:"/"},
    {name:"BLOG'S",link:"/"},
    {name:"CONTACT",link:"/"},
  ];
  
  return (
    <div className="App">
      <Header Links={Links} />
      <div className="h-screen ">
      </div> 
      {/* <Footer /> */}
    </div>
  );
}

export default App;

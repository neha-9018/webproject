import { Outlet } from "react-router-dom";

import React from 'react'
import Header from '../header/Header'

const Layout = () => {
  return (
    <main style={{position: 'relative'}}>
      <div style={{position:'sticky', top:0, zIndex: 1000, boxShadow:'0 4px 16px rgba(0,0,0,0.4)'}}>
        <Header/>
      </div>
      <div style={{position: 'relative', zIndex: 1}}>
        <Outlet/>
      </div>
    </main>
  )
}

export default Layout
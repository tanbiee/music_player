import React from 'react'
import { FaHome } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";

export default function SideMenu() {
  return (
    <div>
        <aside className='sidemenu-root'>
            <div className="sidemenu-header">
                <img src="" alt="project Logo" className='sidemenu-logo-img'/>
                <h2 className="sidemenu-logo-title">Musical</h2>
            </div>
            
            <nav className="sidemenu-nav" aria-label='Main Navigation'>
                <ul className="sidemenu-nav-list">
                    <li>
                        <button className="sidemenu-nav-btn active">
                            <FaHome className='sidemenu-nav-icon' size={18} />
                            <span>Home</span>
                        </button>
                    </li>

                    <li>
                        <button className="sidemenu-nav-btn active">
                            <CiSearch className='sidemenu-nav-icon' size={18} />
                            <span>Search</span>
                        </button>
                    </li>

                    <li>
                        <button className="sidemenu-nav-btn active">
                            <CiHeart className='sidemenu-nav-icon' size={18} />
                            <span>My Favourite</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    </div>
  )
}

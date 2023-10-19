import React from 'react'
import Sidebar from '../Sidebar/sidebar'
import Header from '../Sidebar/header'
import '../../assets/global/style.css';
import '../styles/react-style.css';
function dashboard() {
  return (
    <div className='Dashboard-container'>
        <div className="sidebar-bag">
            <Sidebar/>
        </div>

        {/* <div className="Dashboard-content">
            <div className="bodyof-card">
                  <div className="dash-card">
                      
                  </div>
              </div>
        </div> */}

    </div>
  );
}

export default dashboard
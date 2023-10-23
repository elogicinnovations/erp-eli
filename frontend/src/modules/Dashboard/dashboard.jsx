import React from 'react';
import Sidebar from '../Sidebar/sidebar';
import Header from '../Sidebar/header';
import '../../assets/global/style.css';
import '../styles/react-style.css';
import dashboardImg from '../../assets/image/dashboard.png'; // Ensure correct case and extension

function Dashboard() {


  return (
    <div className='main-of-containers'>
      <div className="left-of-main-containers">
        <Sidebar />
      </div>

      <div className="mid-of-main-containers">
      </div>

      <div className="right-of-main-containers">
        <div className="right-body-contents">
            
        </div>
      </div>
     
    </div>
  );
}

export default Dashboard;

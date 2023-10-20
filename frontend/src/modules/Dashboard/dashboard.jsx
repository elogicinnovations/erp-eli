import React from 'react';
import Sidebar from '../Sidebar/sidebar';
import Header from '../Sidebar/header';
import '../../assets/global/style.css';
import '../styles/react-style.css';
import './dash.css'
import dashboardImg from '../../assets/image/dashboard.png'; // Ensure correct case and extension

function Dashboard() {


  return (
    <div className='Masterlist-main'>
      <div className="masterlist-sidebar">
        <Sidebar />
      </div>
      <div className="masterlist-content">
        <div className="master-cardbody">
          <div >
            <img className='imdashboard' src={dashboardImg} alt="" srcset="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

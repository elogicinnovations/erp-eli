import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../Sidebar/sidebar';
import axios from 'axios';
import BASE_URL from '../../assets/global/url';
import swal from 'sweetalert';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import receiving from "../../assets/global/receiving";
import Dropdown from 'react-bootstrap/Dropdown';
import {
    MagnifyingGlass,
    Gear, 
    Bell,
    UserCircle,
    Plus,
    Trash,
    NotePencil,
    Eye,
    ArrowUUpLeft,
    DotsThreeCircle,
  } from "@phosphor-icons/react";


import '../../assets/skydash/vendors/feather/feather.css';
import '../../assets/skydash/vendors/css/vendor.bundle.base.css';
import '../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css';
import '../../assets/skydash/vendors/datatables.net/jquery.dataTables';
import '../../assets/skydash/vendors/ti-icons/css/themify-icons.css';
import '../../assets/skydash/css/vertical-layout-light/style.css';
import '../../assets/skydash/vendors/js/vendor.bundle.base';
import '../../assets/skydash/vendors/datatables.net/jquery.dataTables';
import '../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4';
import '../../assets/skydash/js/off-canvas';

import * as $ from 'jquery';  

function Inventory() {

    // Artificial Data

    const Data = [
        {
          a: '1',
          b: '1',
          c: '1',
          d: '1',
          e: '1',
        },
        {
          a: '1',
          b: '1',
          c: '1',
          d: '1',
          e: '1',
        },
        {
          a: '1',
          b: '1',
          c: '1',
          d: '1',
          e: '1',
        },
      ]

    // Artificial Data

    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    // Close dropdown when the component unmounts or when another tab is selected
    return () => setShowDropdown(false);
  }, []);

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [rotatedIcons, setRotatedIcons] = useState(Array(Data.length).fill(false));
  
  const toggleDropdown = (event, index) => {
    // Check if the clicked icon is already open, close it
    if (index === openDropdownIndex) {
      setRotatedIcons((prevRotatedIcons) => {
        const newRotatedIcons = [...prevRotatedIcons];
        newRotatedIcons[index] = !newRotatedIcons[index];
        return newRotatedIcons;
      });
      setShowDropdown(false);
      setOpenDropdownIndex(null);
    } else {
      // If a different icon is clicked, close the currently open dropdown and open the new one
      setRotatedIcons(Array(Data.length).fill(false));
      const iconPosition = event.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: iconPosition.bottom + window.scrollY,
        left: iconPosition.left + window.scrollX,
      });
      setRotatedIcons((prevRotatedIcons) => {
        const newRotatedIcons = [...prevRotatedIcons];
        newRotatedIcons[index] = true;
        return newRotatedIcons;
      });
      setShowDropdown(true);
      setOpenDropdownIndex(index);
    }
  };

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dots-icon')) {
        setRotatedIcons(Array(Data.length).fill(false));
        setShowDropdown(false);
        setOpenDropdownIndex(null);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

    React.useEffect(() => {
        $(document).ready(function () {
          $('#order-listing').DataTable();
        });
      }, []);

      React.useEffect(() => {
          $(document).ready(function () {
            $('#order1-listing').DataTable();
          });
        }, []);

        React.useEffect(() => {
            $(document).ready(function () {
              $('#order2-listing').DataTable();
            });
          }, []);

    const tabStyle = {
        padding: '10px 15px', 
        margin: '0 10px',
        color: '#333',
        transition: 'color 0.3s',
    };
    return (
        <div className="main-of-containers">
            <div className="left-of-main-containers">
            <Sidebar />
            </div>

            <div className="mid-of-main-containers">
            </div>
                <div className="right-of-main-containers">
                    <div className="right-body-contents">

                    <div className="settings-search-master">

                        <div className="dropdown-and-iconics">
                            <div className="dropdown-side">

                            </div>
                            <div className="iconic-side">
                                <div className="gearsides">
                                    <Gear size={35}/>
                                </div>
                                <div className="bellsides">
                                    <Bell size={35}/>
                                </div>
                                <div className="usersides">
                                    <UserCircle size={35}/>
                                </div>
                                <div className="username">
                                <h3>User Name</h3>
                                </div>
                            </div>
                        </div>

                        </div>
                        <div className="tabbutton-sides">
                            <Tabs
                                defaultActiveKey="inventory"
                                transition={false}
                                id="noanim-tab-example"
                                >
                                <Tab eventKey="inventory" title={<span style={{...tabStyle, fontSize: '20px', overflowY: 'auto'}}>Inventory</span>}>
                                    <div className="tab-titles">
                                        <h1>Inventory</h1>
                                    </div>
                                    <div className="table-containss">
                                        <div className="main-of-all-tables">
                                            <table id='order-listing'>
                                                    <thead>
                                                    <tr>
                                                        <th className='tableh'>User #</th>
                                                        <th className='tableh'>Name</th>
                                                        <th className='tableh'>Contact</th>
                                                        <th className='tableh'>Description</th>
                                                        <th className='tableh'>Action</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Data.map((data, i) => (
                                                        <tr key={i}>
                                                            <td>{data.a}</td>
                                                            <td>{data.b}</td>
                                                            <td>{data.c}</td>
                                                            <td>{data.d}</td>
                                                            <td>
                                                            <DotsThreeCircle
                                                                size={32}
                                                                className="dots-icon"
                                                                style={{
                                                                cursor: 'pointer',
                                                                transform: `rotate(${rotatedIcons[i] ? '90deg' : '0deg'})`,
                                                                color: rotatedIcons[i] ? '#666' : '#000',
                                                                transition: 'transform 0.3s ease-in-out, color 0.3s ease-in-out',
                                                                }}
                                                                onClick={(event) => toggleDropdown(event, i)}
                                                            />
                                                            <div
                                                                className='choices'
                                                                style={{
                                                                position: 'fixed',
                                                                top: dropdownPosition.top - 30 + 'px',
                                                                left: dropdownPosition.left - 100 + 'px',
                                                                opacity: showDropdown ? 1 : 0,
                                                                visibility: showDropdown ? 'visible' : 'hidden',
                                                                transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
                                                                boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
                                                                }}
                                                            >
                                                                {/* Your dropdown content here */}
                                                                <button>View</button>
                                                                <button>Add</button>
                                                                <button>Return</button>
                                                            </div>
                                                            </td>
                                                        </tr>
                                                        ))}
                                                    </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab eventKey="issuance" title={<span style={{...tabStyle, fontSize: '20px' }}>Issuance</span>}>
                                    <div className="tab-titles">
                                        <h1>Issuance</h1>
                                        <div>
                                            <Link to={'/createIssuance'} className="issuance-btn">
                                            <span style={{marginRight: '4px'}}>
                                                <Plus size={20} />
                                            </span>
                                                Add Issuance
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="table-containss">
                                        <div className="main-of-all-tables">
                                            <table id='order1-listing'>
                                                    <thead>
                                                    <tr>
                                                        <th className='tableh'>User #</th>
                                                        <th className='tableh'>Name</th>
                                                        <th className='tableh'>Contact</th>
                                                        <th className='tableh'>Description</th>
                                                        <th className='tableh'>Action</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Data.map((data, i) => (
                                                        <tr key={i}>
                                                            <td>{data.a}</td>
                                                            <td>{data.b}</td>
                                                            <td>{data.c}</td>
                                                            <td>{data.d}</td>
                                                            <td>
                                                            <DotsThreeCircle
                                                                size={32}
                                                                className="dots-icon"
                                                                style={{
                                                                cursor: 'pointer',
                                                                transform: `rotate(${rotatedIcons[i] ? '90deg' : '0deg'})`,
                                                                color: rotatedIcons[i] ? '#666' : '#000',
                                                                transition: 'transform 0.3s ease-in-out, color 0.3s ease-in-out',
                                                                }}
                                                                onClick={(event) => toggleDropdown(event, i)}
                                                            />
                                                            <div
                                                                className='choices'
                                                                style={{
                                                                position: 'fixed',
                                                                top: dropdownPosition.top - 30 + 'px',
                                                                left: dropdownPosition.left - 100 + 'px',
                                                                opacity: showDropdown ? 1 : 0,
                                                                visibility: showDropdown ? 'visible' : 'hidden',
                                                                transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
                                                                boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
                                                                }}
                                                            >
                                                                {/* Your dropdown content here */}
                                                                <button>View</button>
                                                                <button>Add</button>
                                                                <button>Return</button>
                                                            </div>
                                                            </td>
                                                        </tr>
                                                        ))}
                                                    </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab eventKey="return" title={<span style={{...tabStyle, fontSize: '20px' }}>Return</span>}>
                                    <div className="tab-titles">
                                        <h1>Return</h1>
                                    </div>
                                    <div className="table-containss">
                                        <div className="main-of-all-tables">
                                            <table id='order2-listing'>
                                                    <thead>
                                                    <tr>
                                                        <th className='tableh'>User #</th>
                                                        <th className='tableh'>Name</th>
                                                        <th className='tableh'>Contact</th>
                                                        <th className='tableh'>Description</th>
                                                        <th className='tableh'>Action</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Data.map((data, i) => (
                                                        <tr key={i}>
                                                            <td>{data.a}</td>
                                                            <td>{data.b}</td>
                                                            <td>{data.c}</td>
                                                            <td>{data.d}</td>
                                                            <td>
                                                            <DotsThreeCircle
                                                                size={32}
                                                                className="dots-icon"
                                                                style={{
                                                                cursor: 'pointer',
                                                                transform: `rotate(${rotatedIcons[i] ? '90deg' : '0deg'})`,
                                                                color: rotatedIcons[i] ? '#666' : '#000',
                                                                transition: 'transform 0.3s ease-in-out, color 0.3s ease-in-out',
                                                                }}
                                                                onClick={(event) => toggleDropdown(event, i)}
                                                            />
                                                            <div
                                                                className='choices'
                                                                style={{
                                                                position: 'fixed',
                                                                top: dropdownPosition.top - 30 + 'px',
                                                                left: dropdownPosition.left - 100 + 'px',
                                                                opacity: showDropdown ? 1 : 0,
                                                                visibility: showDropdown ? 'visible' : 'hidden',
                                                                transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
                                                                boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
                                                                }}
                                                            >
                                                                {/* Your dropdown content here */}
                                                                <button>View</button>
                                                                <button>Add</button>
                                                                <button>Return</button>
                                                            </div>
                                                            </td>
                                                        </tr>
                                                        ))}
                                                    </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>

                </div>
            </div>    
        </div>
    );
}
export default Inventory;

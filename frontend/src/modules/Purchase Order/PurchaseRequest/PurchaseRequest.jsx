import React, { useEffect, useState } from 'react';
import Sidebar from '../../Sidebar/sidebar';
import '../../../assets/global/style.css';
import '../../styles/react-style.css';
import axios from 'axios';
import BASE_URL from '../../../assets/global/url';
import Button from 'react-bootstrap/Button';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {
    MagnifyingGlass,
    Gear, 
    Bell,
    UserCircle,
    Plus,
    Trash,
    NotePencil,
    DotsThreeCircle
  } from "@phosphor-icons/react";
  import '../../../assets/skydash/vendors/feather/feather.css';
  import '../../../assets/skydash/vendors/css/vendor.bundle.base.css';
  import '../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css';
  import '../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
  import '../../../assets/skydash/vendors/ti-icons/css/themify-icons.css';
  import '../../../assets/skydash/css/vertical-layout-light/style.css';
  import '../../../assets/skydash/vendors/js/vendor.bundle.base';
  import '../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
  import '../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4';
  import '../../../assets/skydash/js/off-canvas';
  
  import * as $ from 'jquery';

function PurchaseRequest() {

    
// Artifitial data

const data = [
    {
      samA: 'asd',
      samB: 'asd',
      samC: 'asd',
      samD: 'asd',
      samE: 'asd',
    },
    {
      samA: 'asd',
      samB: 'asd',
      samC: 'asd',
      samD: 'asd',
      samE: 'asd',
    },
    {
      samA: 'asd',
      samB: 'asd',
      samC: 'asd',
      samD: 'asd',
      samE: 'asd',
    },
  ]
      
// Artifitial data


    const [purchaseRequest, setPurchaseRequest] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [rotatedIcons, setRotatedIcons] = useState(Array(purchaseRequest.length).fill(false));
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  
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
        setRotatedIcons(Array(purchaseRequest.length).fill(false));
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
        if ($('#order-listing').length > 0) {
          $('#order-listing').DataTable();
        }
      }, []);


  return (
    <div className="main-of-containers">
        <div className="left-of-main-containers">
            <Sidebar/>
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
                <div className="Employeetext-button">
                    <div className="employee-and-button">
                        <div className="emp-text-side">
                            <p>Purchase Request</p>
                        </div>

                        <div className="button-create-side">
                        <div className="Buttonmodal-new">
                            <button>
                                <Link to="/createPurchaseRequest" className='button'>
                                <span style={{ }}>
                                <Plus size={25} />
                                </span>
                                New PR
                                </Link>
                            </button>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="table-containss">
                    <div className="main-of-all-tables">
                        <table id='order-listing'>
                                <thead>
                                <tr>
                                    <th className='tableh'>PR No.</th>
                                    <th className='tableh'>Requestor</th>
                                    <th className='tableh'>Status</th>
                                    <th className='tableh'>Date Created</th>
                                    <th className='tableh'>Remarks</th>
                                    <th className='tableh'>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                      {data.map((data,i) =>(
                                        <tr key={i}>
                                        <td>{data.samA}</td>
                                        <td>{data.samB}</td>
                                        <td>{data.samC}</td>
                                        <td>{data.samD}</td>
                                        <td>{data.samE}</td>
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
                                          <button className='btn'>
                                          <Link to="/updatePurchaseRequest" style={{textDecoration: 'none', color: '#252129'}}>
                                            Update
                                            </Link>
                                            </button>
                                          <button className='btn'>Delete</button>
                                          </div>
                                          </td>
                                        </tr>
                                      ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    </div>
  )
}

export default PurchaseRequest
import React, { useEffect, useState } from 'react';
import Sidebar from '../../../../Sidebar/sidebar';
import '../../../../../assets/global/style.css';
import '../../../../styles/react-style.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import swal from 'sweetalert';
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
  } from "@phosphor-icons/react";
  import '../../../../../assets/skydash/vendors/feather/feather.css';
  import '../../../../../assets/skydash/vendors/css/vendor.bundle.base.css';
  import '../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css';
  import '../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
  import '../../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css';
  import '../../../../../assets/skydash/css/vertical-layout-light/style.css';
  import '../../../../../assets/skydash/vendors/js/vendor.bundle.base';
  import '../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
  import '../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4';
  import '../../../../../assets/skydash/js/off-canvas';
  
  import * as $ from 'jquery';

function CostCenter() {
    

// Artifitial data

      const aData = [
        {
          cat_id: '2434',
          cat_name: 'Spare Part A',
          cat_supplier: 'Supplier A',
          cat_sub: '--',
          cat_details: '--',
        },
      ]

// Artifitial data

    const [showModal, setShowModal] = useState(false);
    const [updateModalShow, setUpdateModalShow] = useState(false);
    const navigate = useNavigate();
  
    const handleClose = () => {
      setShowModal(false);
    };
  
    const handleShow = () => setShowModal(true);
  
    const handleModalToggle = () => {
      setUpdateModalShow(!updateModalShow);
    };
  
    const handleDelete = async param_id => {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this user file!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          try {
          } catch (err) {
            console.log(err);
          }
        } else {
          swal({
            title: "Cancelled Successfully",
            text: "Spare Part not Deleted!",
            icon: "warning",
          });
        }
      });
    };
  
  
    React.useEffect(() => {
      $(document).ready(function () {
        $('#order-listing').DataTable();
      });
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
                            <p>Cost Center</p>
                        </div>

                        <div className="button-create-side">
                        <div className="Buttonmodal-new">
                            <Link to='/createCostCenter' onClick={handleShow} className='button'>
                                <span style={{ }}>
                                <Plus size={25} />
                                </span>
                                Create New
                            </Link>
                            </div>
                        </div>

                    </div>
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
                                      {aData.map((data,i) =>(
                                        <tr key={i}>
                                          <td>{data.cat_id}</td>
                                          <td>{data.cat_name}</td>
                                          <td>{data.cat_supplier}</td>
                                          <td>{data.cat_details}</td>
                                          <td>
                                          <Link to='/updateCostCenter' onClick={() => handleModalToggle(data)} className='btn'><NotePencil size={32} /></Link>
                                          <button onClick={() => handleDelete(data.bin_id)} className='btn'><Trash size={32} color="#e60000" /></button>
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

export default CostCenter

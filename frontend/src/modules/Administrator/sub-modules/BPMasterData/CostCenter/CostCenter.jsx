import React, { useEffect, useState } from 'react';
import Sidebar from '../../../../Sidebar/sidebar';
import '../../../../../assets/global/style.css';
import '../../../../styles/react-style.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import swal from 'sweetalert';
import BASE_URL from '../../../../../assets/global/url';
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios';

import {
    MagnifyingGlass,
    Gear, 
    Bell,
    UserCircle,
    Plus,
    Trash,
    NotePencil,
  } from "@phosphor-icons/react";
  
  import * as $ from 'jquery';

function CostCenter() {
  const [CostCenter, setCostCenter] = useState([]);   

// Fetch Data
  useEffect(() => {
    axios.get(BASE_URL + '/costCenter/getCostCenter')
      .then(res => setCostCenter(res.data))
      .catch(err => console.log(err));
  }, []);

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

    //search
    useEffect(() => {
      // Initialize DataTable when role data is available
      if ($('#order-listing').length > 0 && CostCenter.length > 0) {
        $('#order-listing').DataTable();
      }
    }, [CostCenter]);

    //date format
    function formatDatetime(datetime) {
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      };
      return new Date(datetime).toLocaleString('en-US', options);
    }

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
                                    <th className='tableh'>ID</th>
                                    <th className='tableh'>Name</th>
                                    <th className='tableh'>Assigned User</th>
                                    <th className='tableh'>Contact #</th>
                                    <th className='tableh'>Status</th>
                                    <th className='tableh'>Date Created</th>
                                    <th className='tableh'>Date Modified</th>
                                    <th className='tableh'>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                      {CostCenter.map((data,i) =>(
                                        <tr key={i}>
                                          <td>{data.id}</td>
                                          <td>{data.name}</td>
                                          <td>{data.masterlist.col_Fname}</td>
                                          <td>{data.masterlist.col_phone}</td>
                                          <td>{data.status}</td>
                                          <td>{formatDatetime(data.createdAt)}</td>
                                          <td>{formatDatetime(data.updatedAt)}</td>
                                          <td>
                                          <Link to={`/initUpdateCostCenter/${data.id}`} onClick={() => handleModalToggle(data)} className='btn'><NotePencil size={32} /></Link>
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

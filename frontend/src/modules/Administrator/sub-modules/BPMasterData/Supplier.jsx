import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../../Sidebar/sidebar';
import { useNavigate } from 'react-router';
import axios from 'axios';
import BASE_URL from '../../../../assets/global/url';
import swal from 'sweetalert';
import {
    Gear, 
    Bell,
    UserCircle,
    Plus,
    Trash,
    NotePencil,
  } from "@phosphor-icons/react";
import '../../../../assets/skydash/vendors/feather/feather.css';
import '../../../../assets/skydash/vendors/css/vendor.bundle.base.css';
import '../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css';
import '../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
import '../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css';
import '../../../../assets/skydash/css/vertical-layout-light/style.css';
import '../../../../assets/skydash/vendors/js/vendor.bundle.base';
import '../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
import '../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4';
import '../../../../assets/skydash/js/off-canvas';

import * as $ from 'jquery';  



function Supplier() {

    const [supplier, setsupplier] = useState([]);

    useEffect(() => {
        axios.get(BASE_URL + '/supplier/fetchTable')
          .then(res => setsupplier(res.data))
          .catch(err => console.log(err));
      }, []);
  
      function formatDate(isoDate) {
        const date = new Date(isoDate);
        return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
      }
      
      function padZero(num) {
        return num.toString().padStart(2, '0');
      }


      const handleDelete = async table_id => {


        swal({
          title: "Are you sure?",
          text: "Once deleted, you will not be able to recover this supplier data!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then(async (willDelete) => {
          if (willDelete) {
            try {
              const  response = await axios.delete(BASE_URL + `/supplier/delete/${table_id}`);
             
              if (response.status === 200) {
                swal({
                  title: 'The Supplier has been deleted!',
                  text: 'The Supplier has been updated successfully.',
                  icon: 'success',
                  button: 'OK'
                }).then(() => {
                  setsupplier(prev => prev.filter(data => data.supplier_code !== table_id));
                  
                });
              } else if (response.status === 202) {
                swal({
                  icon: 'error',
                  title: 'Delete Prohibited',
                  text: 'You cannot delete Supplier that is used'
                });
              } else {
                swal({
                  icon: 'error',
                  title: 'Something went wrong',
                  text: 'Please contact our support'
                });
              }
    
            } catch (err) {
              console.log(err);
            }
    
           
          } else {
            swal({
              title: "Cancelled Successfully",
              text: "Product not Deleted!",
              icon: "warning",
            });
          }
        });
      };



      useEffect(() => {
        // Initialize DataTable when role data is available
        if ($('#order-listing').length > 0 && supplier.length > 0) {
          $('#order-listing').DataTable();
        }
      }, [supplier]);
      
    const navigate = useNavigate();
    return(

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

                    <div className="Employeetext-button">
                        <div className="employee-and-button">
                            <div className="emp-text-side">
                                <p>Supplier</p>
                            </div>

                            <div className="button-create-side">
                            <div className="Buttonmodal-new">
                                <Link to={'/CreateSupplier'} style={{textDecoration: 'none', backgroundColor: 'inherit'}}>
                                <button>
                                    <span style={{ }}>
                                    <Plus size={25} />
                                    </span>
                                    Create New
                                </button>
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
                                        <th className='tableh'>SUPPLIER Code</th>
                                        <th className='tableh'>SUPPLIER NAME</th>
                                        <th className='tableh'>CONTACT</th>
                                        <th className='tableh'>Date Created</th>
                                        <th className='tableh'>Date Modified</th>
                                        <th className='tableh'>ACTION</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {supplier.map((data,i) =>(
                                            <tr key={i}>
                                                <td>{data.supplier_code}</td>
                                                <td>{data.supplier_name}</td>
                                                <td>{data.supplier_contactPerson}</td>
                                                <td>{formatDate(data.createdAt)}</td>
                                                <td>{formatDate(data.updatedAt)}</td>
                                                <td>
                                                    <button className='btn'  type='button' >
                                                        <Link to={`/editSupp/${data.supplier_code}`} ><NotePencil size={32} /></Link>
                                                    </button>
                                                    <button className='btn' type='button' onClick={() => handleDelete(data.supplier_code)}>
                                                        <Trash size={32} color="#e60000" />
                                                    </button>
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
    );
}

export default Supplier;
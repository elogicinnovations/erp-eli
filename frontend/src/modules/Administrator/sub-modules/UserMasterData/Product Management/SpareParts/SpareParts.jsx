import React, { useEffect, useState } from 'react';
import Sidebar from '../../../../../Sidebar/sidebar';
import '../../../../../../assets/global/style.css';
import '../../../../styles/react-style.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../../../../../assets/global/url';
import swal from 'sweetalert';
import {
    Gear, 
    Bell,
    UserCircle,
    Plus,
    Trash,
    NotePencil,
  } from "@phosphor-icons/react";
  import '../../../../../../assets/skydash/vendors/feather/feather.css';
  import '../../../../../../assets/skydash/vendors/css/vendor.bundle.base.css';
  import '../../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css';
  import '../../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
  import '../../../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css';
  import '../../../../../../assets/skydash/css/vertical-layout-light/style.css';
  import '../../../../../../assets/skydash/vendors/js/vendor.bundle.base';
  import '../../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
  import '../../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4';
  import '../../../../../../assets/skydash/js/off-canvas';
  
  import * as $ from 'jquery';

function SpareParts() {
    
  const [sparePart, setSparePart] = useState([]);
  const reloadTable  = () => {
    axios.get(BASE_URL + '/sparePart/fetchTable')
    .then(res => setSparePart(res.data))
    .catch(err => console.log(err));
}
  useEffect(() => {
     reloadTable()
    }, []);

    function formatDate(isoDate) {
      const date = new Date(isoDate);
      return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
    }
    
    function padZero(num) {
      return num.toString().padStart(2, '0');
    }
    const handleDelete = async (table_id) => {
      try {
        const willDelete = await swal({
          title: "Are you sure?",
          text: "Once deleted, you will not be able to recover this product data!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        });
    
        if (willDelete) {
          const response = await axios.delete(BASE_URL + `/sparePart/delete/${table_id}`);
    
          if (response.status === 200) {
            swal({
              title: 'The Product has been deleted!',
              text: 'The Product has been deleted successfully.',
              icon: 'success',
              button: 'OK'
            }).then(() => {
              reloadTable();
            });
          } else if (response.status === 202) {
            swal({
              icon: 'error',
              title: 'Delete Prohibited',
              text: 'You cannot delete a product that is in use'
            });
          } else {
            swal({
              icon: 'error',
              title: 'Something went wrong',
              text: 'Please contact our support'
            });
          }
        } else {
          swal({
            title: "Cancelled Successfully",
            text: "Product not Deleted!",
            icon: "warning",
          });
        }
      } catch (error) {
        // Handle errors here
        console.error(error);
      }
    };
    
    useEffect(() => {
      // Initialize DataTable when role data is available
      if ($('#order-listing').length > 0 && sparePart.length > 0) {
        $('#order-listing').DataTable();
      }
    }, [sparePart]);

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
                            <p>Spare Parts</p>
                        </div>

                        <div className="button-create-side">
                        <div className="Buttonmodal-new">
                            <Link to='/createSpareParts' className='button'>
                                <span style={{ }}>
                                <Plus size={25} />
                                </span>
                                New Product
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
                                    <th className='tableh'>Code</th>
                                    <th className='tableh'>Spare Parts Name</th>
                                    <th className='tableh'>Description</th>
                                    <th className='tableh'>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                      {sparePart.map((data,i) =>(
                                        <tr key={i}>
                                          <td>{data.spareParts_code}</td>
                                          <td>{data.spareParts_name}</td>
                                          <td>{data.spareParts_desc}</td>
                                          <td>
                                            <Link
                                              to={`/updateSpareParts/${data.id}`}
                                              // onClick={() => handleModalToggle(data)} 
                                              className='btn'><NotePencil size={32} />
                                            </Link>
                                          <button 
                                            onClick={() => handleDelete(data.id)} 
                                            className='btn'><Trash size={32} color="#e60000" /></button>
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

export default SpareParts

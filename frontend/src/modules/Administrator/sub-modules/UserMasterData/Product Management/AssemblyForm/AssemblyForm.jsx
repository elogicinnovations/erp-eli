import React, { useEffect, useState } from 'react';
import Sidebar from '../../../../../Sidebar/sidebar';
import '../../../../../../assets/global/style.css';
import '../../../../styles/react-style.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import axios from 'axios';
import BASE_URL from '../../../../../../assets/global/url';
import swal from 'sweetalert';
import {
    Gear, 
    Bell,
    UserCircle,
    Plus,
    DotsThreeCircle
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

function AssemblyForm() {
    
  const [assembly, setAssembly] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [rotatedIcons, setRotatedIcons] = useState(Array(assembly.length).fill(false));
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const navigate = useNavigate();

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
      setRotatedIcons(Array(assembly.length).fill(false));
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

  const reloadTable  = () => {
    axios.get(BASE_URL + '/assembly/fetchTable')
    .then(res => setAssembly(res.data))
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
    const handleDelete = async table_id => {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this product data!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          try {
            const  response = await axios.delete(BASE_URL + `/assembly/delete/${table_id}`);
             
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
                text: 'You cannot delete product that is used'
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
      if ($('#order-listing').length > 0 && assembly.length > 0) {
        $('#order-listing').DataTable();
      }
    }, [assembly]);

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
                            <p>Assembly Form</p>
                        </div>

                        <div className="button-create-side">
                        <div className="Buttonmodal-new">
                            <Link to='/createAssemblyForm' className='button'>
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
                                    <th className='tableh'>Product Code</th>
                                    <th className='tableh'>Assemble Name</th>
                                    <th className='tableh'>Details</th>
                                    <th className='tableh'>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                      {assembly.map((data,i) =>(
                                        <tr key={i}>
                                          <td onClick={() => navigate(`/viewAssembleForm/${data.id}`)}>{data.assembly_code}</td>
                                          <td onClick={() => navigate(`/viewAssembleForm/${data.id}`)}>{data.assembly_name}</td>
                                          <td onClick={() => navigate(`/viewAssembleForm/${data.id}`)}>{data.assembly_desc}</td>
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
                                              
                                          <Link to={`/updateAssemblyForm/${data.id}`} style={{fontSize:'12px'}} className='btn'>Update</Link>
                                          <button onClick={() => handleDelete(data.id)} className='btn'>Delete</button>
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

export default AssemblyForm

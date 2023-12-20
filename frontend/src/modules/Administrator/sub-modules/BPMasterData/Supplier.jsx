import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../../Sidebar/sidebar";
import axios from "axios";
import BASE_URL from "../../../../assets/global/url";
import swal from "sweetalert";
import {
  Gear,
  Bell,
  UserCircle,
  Plus,
  Trash,
  NotePencil,
  DotsThreeCircle,
  DotsThreeCircleVertical,
} from "@phosphor-icons/react";
import "../../../../assets/skydash/vendors/feather/feather.css";
import "../../../../assets/skydash/vendors/css/vendor.bundle.base.css";
import "../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css";
import "../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
import "../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css";
import "../../../../assets/skydash/css/vertical-layout-light/style.css";
import "../../../../assets/skydash/vendors/js/vendor.bundle.base";
import "../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
import "../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4";
import "../../../../assets/skydash/js/off-canvas";

import * as $ from 'jquery';

import { jwtDecode } from "jwt-decode";



function Supplier() {
  const [supplier, setsupplier] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [rotatedIcons, setRotatedIcons] = useState(
    Array(supplier.length).fill(false)
  );
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
      setRotatedIcons(Array(supplier.length).fill(false));
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
    axios
      .get(BASE_URL + "/supplier/fetchTable")
      .then((res) => setsupplier(res.data))
      .catch((err) => console.log(err));
  }, []);

  function formatDate(isoDate) {
    const date = new Date(isoDate);
    return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(
      date.getDate()
    )} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(
      date.getSeconds()
    )}`;
  }

  function padZero(num) {
    return num.toString().padStart(2, "0");
  }

  const handleDelete = async (table_id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this supplier data!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await axios.delete(
            BASE_URL + `/supplier/delete/${table_id}`
          );

          if (response.status === 200) {
            swal({
              title: "Suppliers Delete Successful!",
              text: "The Suppliers has been Deleted Successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              setsupplier((prev) =>
                prev.filter((data) => data.supplier_code !== table_id)
              );
            });
          } else if (response.status === 202) {
            swal({
              icon: "error",
              title: "Delete Prohibited",
              text: "You cannot delete Supplier that is used",
            });
          } else {
            swal({
              icon: "error",
              title: "Something went wrong",
              text: "Please contact our support",
            });
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        swal({
          title: "Cancelled Successfully",
          text: "Supplier not Deleted!",
          icon: "warning",
        });
      }
    });
  };

  const [visibleButtons, setVisibleButtons] = useState({}); // Initialize as an empty object
  const [isVertical, setIsVertical] = useState({}); // Initialize as an empty object

  const toggleButtons = (userId) => {
    setVisibleButtons((prevVisibleButtons) => {
      const updatedVisibleButtons = { ...prevVisibleButtons };

      // Close buttons for other items
      Object.keys(updatedVisibleButtons).forEach((key) => {
        if (key !== userId) {
          updatedVisibleButtons[key] = false;
        }
      });

      // Toggle buttons for the clicked item
      updatedVisibleButtons[userId] = !prevVisibleButtons[userId];

      return updatedVisibleButtons;
    });

    setIsVertical((prevIsVertical) => {
      const updateVertical = { ...prevIsVertical };

      Object.keys(updateVertical).forEach((key) => {
        if (key !== userId) {
          updateVertical[key] = false;
        }
      });

      // Toggle buttons for the clicked item
      updateVertical[userId] = !prevIsVertical[userId];

      return updateVertical;
    });
  };

  const closeVisibleButtons = () => {
    setVisibleButtons({});
    setIsVertical({});
  };

  const setButtonVisibles = (userId) => {
    return visibleButtons[userId] || false; // Return false if undefined (closed by default)
  };

      useEffect(() => {
        // Initialize DataTable when role data is available
        if ($('#order-listing').length > 0 && supplier.length > 0) {
          $('#order-listing').DataTable();
        }
      }, [supplier]);

      const [authrztn, setauthrztn] = useState([]);
      useEffect(() => {

        var decoded = jwtDecode(localStorage.getItem('accessToken'));
        axios.get(BASE_URL + '/masterList/viewAuthorization/'+ decoded.uid)
          .then((res) => {
            if(res.status === 200){
              setauthrztn(res.data.authorization);
            }
        })
          .catch((err) => {
            console.error(err);
        });

      }, [authrztn]);

    const navigate = useNavigate();
    return(

        <div className="main-of-containers">
            {/* <div className="left-of-main-containers">
            <Sidebar />
            </div> */}
      <div className="right-of-main-containers">
        <div className="right-body-contents">
          {/* <div className="settings-search-master">

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

                    </div> */}

          <div className="Employeetext-button">
            <div className="employee-and-button">
              <div className="emp-text-side">
                <p>Supplier</p>
              </div>

                            <div className="button-create-side">
                            <div className="Buttonmodal-new">
                                <Link to={'/CreateSupplier'} style={{textDecoration: 'none', backgroundColor: 'inherit'}}>
                                { authrztn.includes('Supplier - Add') && (
                                <button>
                                    <span style={{ }}>
                                    <Plus size={25} />
                                    </span>
                                    Create New
                                </button>
                                )}
                                </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="table-containss">
                        <div className="main-of-all-tables">
                            <table className='table-hover' id='order-listing'>
                                    <thead>
                                    <tr>
                                        <th className='tableh'>SUPPLIER Code</th>
                                        <th className='tableh'>SUPPLIER NAME</th>
                                        <th className='tableh'>CONTACT</th>
                                        <th className='tableh'>STATUS</th>
                                        <th className='tableh'>Date Created</th>
                                        <th className='tableh'>Date Modified</th>
                                        <th className='tableh'>ACTION</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {supplier.map((data,i) =>(
                                            <tr key={i}>
                                                <td onClick={() => navigate(`/viewSupplier/${data.supplier_code}`)}>{data.supplier_code}</td>
                                                <td onClick={() => navigate(`/viewSupplier/${data.supplier_code}`)}>{data.supplier_name}</td>
                                                <td onClick={() => navigate(`/viewSupplier/${data.supplier_code}`)}>{data.supplier_contactPerson}</td>
                                                <td onClick={() => navigate(`/viewSupplier/${data.supplier_code}`)}>{data.supplier_status}</td>
                                                <td onClick={() => navigate(`/viewSupplier/${data.supplier_code}`)}>{formatDate(data.createdAt)}</td>
                                                <td onClick={() => navigate(`/viewSupplier/${data.supplier_code}`)}>{formatDate(data.updatedAt)}</td>
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
                                                    }}>

                                                    {/* Your dropdown content here */}

                                                    { authrztn.includes('Supplier - Edit') && (
                                                    <button className='btn'  type='button' >
                                                        <Link to={`/editSupp/${data.supplier_code}`} style={{textDecoration:'none', color:'#252129'}}>Update</Link>
                                                    </button>
                                                    )}

                                                    { authrztn.includes('Supplier - Delete') && (
                                                    <button className='btn' type='button' onClick={() => handleDelete(data.supplier_code)}>
                                                        Delete
                                                    </button>
                                                    )}

                                                </div>


                                                </td>
                                                {/* <td>
                                                    <button className='btn'  type='button' >
                                                        <Link to={`/editSupp/${data.supplier_code}`} ><NotePencil size={32} /></Link>
                                                    </button>
                                                    <button className='btn' type='button' onClick={() => handleDelete(data.supplier_code)}>
                                                        <Trash size={32} color="#e60000" />
                                                    </button>
                                                </td> */}
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

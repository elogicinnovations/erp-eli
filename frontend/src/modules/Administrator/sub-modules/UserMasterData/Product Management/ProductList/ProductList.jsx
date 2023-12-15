import React, { useEffect, useState } from "react";
import Sidebar from "../../../../../Sidebar/sidebar";
import "../../../../../../assets/global/style.css";
import "../../../../../styles/react-style.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import axios from "axios";
import BASE_URL from "../../../../../../assets/global/url";
import swal from "sweetalert";
import {
  Gear,
  Bell,
  UserCircle,
  Plus,
  DotsThreeCircle,
  DotsThreeCircleVertical,
  CircleNotch, 
} from "@phosphor-icons/react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from "react-bootstrap/Form";
import "../../../../../../assets/skydash/vendors/feather/feather.css";
import "../../../../../../assets/skydash/vendors/css/vendor.bundle.base.css";
import "../../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css";
import "../../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
import "../../../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css";
import "../../../../../../assets/skydash/css/vertical-layout-light/style.css";
import "../../../../../../assets/skydash/vendors/js/vendor.bundle.base";
import "../../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
import "../../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4";
import "../../../../../../assets/skydash/js/off-canvas";

import * as $ from "jquery";
import { fontSize } from "@mui/system";

function ProductList() {
  const navigate = useNavigate();

  const [product, setproduct] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [rotatedIcons, setRotatedIcons] = useState(
    Array(product.length).fill(false)
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
      setRotatedIcons(Array(product.length).fill(false));
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
    axios
      .get(BASE_URL + "/product/fetchTable")
      .then((res) => setproduct(res.data))
      .catch((err) => console.log(err));
}
  useEffect(() => {
    reloadTable()
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
      text: "Once deleted, you will not be able to recover this product data!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await axios.delete(
            BASE_URL + `/product/delete/${table_id}`
          );
          if (response.status === 200) {
            swal({
              title: "The Product has been deleted!",
              text: "The Product has been deleted successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              setproduct((prev) =>
                prev.filter((data) => data.product_code !== table_id)
              );
            });
          } else if (response.status === 202) {
            swal({
              icon: "error",
              title: "Delete Prohibited",
              text: "You cannot delete product that is used",
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
          text: "Product not Deleted!",
          icon: "warning",
        });
      }
    });
  };

  const [visibleButtons, setVisibleButtons] = useState({}); // Initialize as an empty object
  const [isVertical, setIsVertical] = useState({}); // Initialize as an empty object

  const toggleButtons = (userId) => {
    setVisibleButtons((prevVisibleButtons) => ({
      ...prevVisibleButtons,
      [userId]: !prevVisibleButtons[userId],
    }));
    setIsVertical((prevIsVertical) => ({
      ...prevIsVertical,
      [userId]: !prevIsVertical[userId],
    }));
  };

  const closeVisibleButtons = () => {
    setVisibleButtons({});
    setIsVertical({});
  };

  const setButtonVisibles = (userId) => {
    return visibleButtons[userId] || false; // Return false if undefined (closed by default)
  };


  //This section when user click the checkbox in th, should check all the checkbox in td
  const [show, setShow] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [showChangeStatusButton, setShowChangeStatusButton] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const handleCheckboxChange = (productId) => {
  const updatedCheckboxes = [...selectedCheckboxes];

  if (updatedCheckboxes.includes(productId)) {
    updatedCheckboxes.splice(updatedCheckboxes.indexOf(productId), 1);
  } else {
    updatedCheckboxes.push(productId);
  }

  setSelectedCheckboxes(updatedCheckboxes);
  setShowChangeStatusButton(updatedCheckboxes.length > 0);
};

const handleSelectAllChange = () => {
  const allProductIds = product.map((data) => data.product_id);
  setSelectedCheckboxes(selectAllChecked ? [] : allProductIds);
  setShowChangeStatusButton(!selectAllChecked);
  $("input[type='checkbox']").prop("checked", !selectAllChecked);
};



const [selectedStatus, setSelectedStatus] = useState('Active'); // Add this state

const handleStatusChange = (event) => {
  setSelectedStatus(event.target.value);
};

const handleSave = () => {
  axios.put(BASE_URL + "/product/statusupdate", {
    productIds: selectedCheckboxes,
    status: selectedStatus,
  })
  .then((res) => {
    if (res.status === 200) {
      swal({
        title: 'Status Updating!',
        text: 'The status has been updated successfully.',
        icon: 'success',
        button: 'OK'
      }).then(() => {
        handleClose();
        reloadTable();
      });
    } 
  })
  .catch((err) => {
    console.error(err);
  });
};

  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($("#order-listing").length > 0 && product.length > 0) {
      $("#order-listing").DataTable();
    }
  }, [product]);

  return (
    <div className="main-of-containers">
      {/* <div className="left-of-main-containers">
        <Sidebar />
      </div> */}
      <div className="right-of-main-containers">
        <div className="right-body-contents">
          {/* <div className="settings-search-master">
            <div className="dropdown-and-iconics">
              <div className="dropdown-side"></div>
              <div className="iconic-side">
                <div className="gearsides">
                  <Gear size={35} />
                </div>
                <div className="bellsides">
                  <Bell size={35} />
                </div>
                <div className="usersides">
                  <UserCircle size={35} />
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
                <p>Product List</p>
              </div>

              <div className="button-create-side">
              {showChangeStatusButton ? (
                <div className="Buttonmodal-change">
                  <button className="buttonchanges" onClick={handleShow}>
                    <span style={{}}>
                      <CircleNotch size={25} />
                    </span>
                    Change Status
                  </button>
                </div>
              ) : (
                <div className="Buttonmodal-new">
                  <Link to="/createProduct" className="button">
                    <span style={{}}>
                      <Plus size={25} />
                    </span>
                    New Product
                  </Link>
                </div>
              )}
            </div>


            </div>
          </div>
          <div className="table-containss">
            <div className="main-of-all-tables">
              <table className="table-hover" id="order-listing">
                <thead>
                  <tr>
                    <th className="tableh" id="check">
                      <input
                        type="checkbox"
                        checked={selectAllChecked}
                        onChange={handleSelectAllChange}
                      />
                    </th>
                    <th className="tableh">Product Code</th>
                    <th className="tableh">Item Name</th>
                    <th className="tableh">U/M</th>
                    <th className="tableh">Status</th>
                    <th className="tableh">Date Created</th>
                    <th className="tableh">Date Modified</th>
                    <th className="tableh">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {product.map((data, i) => (
                    <tr key={i}>
                      <td>
                        <input type="checkbox" 
                        checked={selectedCheckboxes.includes(data.product_id)}
                        onChange={() => handleCheckboxChange(data.product_id)}
                        />
                        </td>
                      <td
                        onClick={() =>
                          navigate(`/productSupplier/${data.product_id}`)
                        }>
                        {data.product_code}
                      </td>

                      <td
                        onClick={() =>
                          navigate(`/productSupplier/${data.product_id}`)
                        }>
                        {data.product_name}
                      </td>

                      <td
                        onClick={() =>
                          navigate(`/productSupplier/${data.product_id}`)
                        }>
                        {data.product_unitMeasurement !== ""
                          ? data.product_unitMeasurement
                          : "--"}
                      </td>
                      
                      <td
                        onClick={() => 
                          navigate(`/productSupplier/${data.product_id}`)}>
                          <div
                            className="colorstatus"
                            style={{
                              backgroundColor: data.product_status === 'Active' ? 'green' : 'red',
                              color: 'white',
                              padding: '5px',
                              borderRadius: '5px',
                              textAlign: 'center',  
                              width: '80px'
                            }}>
                            {data.product_status}
                          </div>
                        </td>

                      <td
                        onClick={() =>
                          navigate(`/productSupplier/${data.product_id}`)
                        }>
                        {formatDate(data.createdAt)}
                      </td>

                      <td
                        onClick={() =>
                          navigate(`/productSupplier/${data.product_id}`)
                        }>
                        {formatDate(data.updatedAt)}
                      </td>

                      <td>
                        {isVertical[data.product_id] ? (
                          <DotsThreeCircle
                            size={32}
                            className="dots-icon"
                            onClick={() => {
                              toggleButtons(data.product_id);
                            }}
                          />
                        ) : (
                          <DotsThreeCircleVertical
                            size={32}
                            className="dots-icon"
                            onClick={() => {
                              toggleButtons(data.product_id);
                            }}
                          />
                        )}
                        <div>
                          {setButtonVisibles(data.product_id) && (
                            <div
                              className="choices"
                              style={{ position: "absolute" }}>    
                              <Link to={`/updateProduct/${data.product_id}`} style={{fontSize:'12px'}} className='btn'>Update</Link>                         
                              <button
                                className="btn"
                                type="button"
                                onClick={() => {
                                  handleDelete(data.product_id);
                                  closeVisibleButtons();
                                }}>
                                Delete
                              </button>
                            </div>
                          )}
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
            <Modal size="md" show={show} onHide={handleClose} backdrop="static" animation={false}>
              <Modal.Header closeButton>
                <Modal.Title style={{ fontSize: "24px" }}>Change Status</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Label style={{ fontSize: "20px" }}>Status</Form.Label>
                <Form.Select
                  style={{ height: "40px", fontSize: "15px" }}
                  onChange={handleStatusChange}
                  value={selectedStatus}>
                    <option value="Active">
                      Active
                    </option>
                    <option value="Inactive">
                      Inactive
                    </option>
                </Form.Select>
              </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="outline-warning" onClick={handleSave}
                style={{ fontSize: "20px" }}>
                  Save
                </Button>
                <Button variant="outline-secondary" onClick={handleClose}
                style={{ fontSize: "20px" }}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
    </div>
  );
}

export default ProductList;

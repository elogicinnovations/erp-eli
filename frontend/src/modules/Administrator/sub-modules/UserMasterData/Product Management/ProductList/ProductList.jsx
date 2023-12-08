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
} from "@phosphor-icons/react";
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

  useEffect(() => {
    axios
      .get(BASE_URL + "/product/fetchTable")
      .then((res) => setproduct(res.data))
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

  const setButtonVisibles = (userId) => {
    return visibleButtons[userId] || false; // Return false if undefined (closed by default)
  };
  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($("#order-listing").length > 0 && product.length > 0) {
      $("#order-listing").DataTable();
    }
  }, [product]);

  return (
    <div className="main-of-containers">
      <div className="left-of-main-containers">
        <Sidebar />
      </div>

      <div className="mid-of-main-containers"></div>

      <div className="right-of-main-containers">
        <div className="right-body-contents">
          <div className="settings-search-master">
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
          </div>
          <div className="Employeetext-button">
            <div className="employee-and-button">
              <div className="emp-text-side">
                <p>Product List</p>
              </div>

              <div className="button-create-side">
                <div className="Buttonmodal-new">
                  <Link
                    to="/createProduct"
                    className="button">
                    <span style={{}}>
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
              <table id="order-listing">
                <thead>
                  <tr>
                    <th className="tableh">Product Code</th>
                    <th className="tableh">Item Name</th>
                    <th className="tableh">U/M</th>
                    <th className="tableh">Date Created</th>
                    <th className="tableh">Date Modified</th>
                    <th className="tableh">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {product.map((data, i) => (
                    <tr key={i}>
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
                              <button
                                className="btn"
                                type="button"
                                onClick={() => handleDelete(data.product_id)}>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      {/* <td>
                        <Link to={`/updateProduct/${data.product_id}`}className='btn'><NotePencil size={32}/></Link>
                        <button className='btn' type="button" onClick={() => handleDelete(data.product_id)}><Trash size={32} color="#e60000" /></button>
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

export default ProductList;

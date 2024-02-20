import React, { useEffect, useState } from "react";
import "../../../../../assets/global/style.css";
import "../../../../styles/react-style.css";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/esm/Button";
import * as $ from "jquery";
import {
    Plus,
    DotsThreeCircle,
    DotsThreeCircleVertical,
  } from "@phosphor-icons/react";
import BASE_URL from "../../../../../assets/global/url";
import ReactLoading from 'react-loading';
import NoData from '../../../../../assets/image/NoData.png';
import NoAccess from '../../../../../assets/image/NoAccess.png';

function Warehouse ({authrztn}) {

const [warehousename, setWarehousename] = useState("");
const [locatename, setLocatename] = useState("");
const [description, setDescription] = useState("")
const [validated, setValidated] = useState(false);
const [warehouses, setWarehouses] = useState([]);
const [visibleButtons, setVisibleButtons] = useState({});
const [isVertical, setIsVertical] = useState({});
const [showModal, setShowModal] = useState(false);
const [updateModalShow, setUpdateModalShow] = useState(false);
const [isLoading, setIsLoading] = useState(true);

const handleClose = () => {
    setShowModal(false);
};

const handleShow = () => setShowModal(true);


const reloadTable = () => {
  const delay = setTimeout(() => {
  axios
  .get(BASE_URL + "/warehouses/fetchtableWarehouses")
  .then((res) => {
    setWarehouses(res.data)
    setIsLoading(false);
  })
  .catch((err) => {
    console.log(err)
    setIsLoading(false);
  });
}, 1000);

return () => clearTimeout(delay);
};

  useEffect(() => {
    reloadTable();
  }, []);

  function formatDatetime(datetime) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(datetime).toLocaleString("en-US", options);
  }

  const add = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (warehousename.trim() === "" || locatename.trim() === "") {
      swal({
        icon: "error",
        title: "Fields are required",
        text: "Please fill the Required text fields",
      });
      setValidated(true);
      return;
    }

    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      swal({
        icon: "error",
        title: "Fields are required",
        text: "Please fill the Required text fields",
      });
    } else {
      axios
        .post(BASE_URL + "/warehouses/createWarehouse", {
          warehousename,
          locatename,
          description,
        })
        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Warehouse Add Successful!",
              text: "The Warehouse has been Added Successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              handleClose();
              reloadTable();
            });
          } else if (res.status === 201) {
            swal({
              title: "Warehouse is Already Exist",
              text: "Please Input a New Warehouse ",
              icon: "error",
            });
          } else {
            swal({
              title: "Something went wrong",
              text: "Please Contact our Support",
              icon: "error",
              button: "OK",
            });
          }
        });
    }
    setValidated(true);
  };



  const toggleButtons = (warehouseId) => {
    setVisibleButtons((prevVisibleButtons) => {
      const updatedVisibleButtons = { ...prevVisibleButtons };

      // Close buttons for other items
      Object.keys(updatedVisibleButtons).forEach((key) => {
        if (key !== warehouseId) {
          updatedVisibleButtons[key] = false;
        }
      });

      // Toggle buttons for the clicked item
      updatedVisibleButtons[warehouseId] = !prevVisibleButtons[warehouseId];

      return updatedVisibleButtons;
    });

    setIsVertical((prevIsVertical) => {
      const updateVertical = { ...prevIsVertical };

      Object.keys(updateVertical).forEach((key) => {
        if (key !== warehouseId) {
          updateVertical[key] = false;
        }
      });

      // Toggle buttons for the clicked item
      updateVertical[warehouseId] = !prevIsVertical[warehouseId];

      return updateVertical;
    });
  };

  const closeVisibleButtons = () => {
    setVisibleButtons({});
    setIsVertical({});
  };
  const setButtonVisibles = (warehouseId) => {
    return visibleButtons[warehouseId] || false;
};


//Update warehouse in modal
const [updateFormData, setUpdateFormData] = useState({
  warehouse_name: "",
  location: "",
  details: "",
  id: null,
});

const handleModalToggle = (updateData = null) => {
  setUpdateModalShow(!updateModalShow);
  if (updateData) {
    setUpdateFormData({
      warehouse_name: updateData.warehouse_name,
      location: updateData.location,
      details: updateData.details,
      id: updateData.id,
    });
  } else {
    setUpdateFormData({
      warehouse_name: "",
      location: "",
      details: "",
      id: null,
    });
  }
};

const handleUpdateFormChange = (e) => {
  const { name, value } = e.target;

  setUpdateFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

const handleUpdateSubmit = async (e) => {
  e.preventDefault();

  if (updateFormData.warehouse_name.trim() === "") {
    // Display an error message or take any other action you want when the category name is empty
    swal({
      icon: "error",
      title: "Warehouse Name is required",
      text: "Please enter a Warehouse Name before updating.",
    });
    return;
  }

  try {
    const updaemasterID = updateFormData.id;
    const response = await axios.put(
      BASE_URL + `/warehouses/updateWarehouse/${updateFormData.id}`,
      {
        warehouse_name: updateFormData.warehouse_name,
        location: updateFormData.location,
        details: updateFormData.details
      }
    );

    if (response.status === 200) {
      swal({
        title: "Warehouse Update Successful!",
        text: "The Warehouse has been Updated Successfully.",
        icon: "success",
        button: "OK",
      }).then(() => {
        handleModalToggle();
        reloadTable()
      });
    } else if (response.status === 202) {
      swal({
        icon: "error",
        title: "Warehouse already exists",
        text: "Please input another Warehouse",
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
};

//delete warehouse
const handleDelete = async (table_id) => {
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this user file!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then(async (willDelete) => {
    if (willDelete) {
      try {
        const response = await axios.delete(
          BASE_URL + `/warehouses/deleteWarehouse/${table_id}`
        );

        if (response.status === 200) {
          swal({
            title: "Warehouse Delete Succesful!",
            text: "The Warehouse has been Deleted Successfully.",
            icon: "success",
            button: "OK",
          }).then(() => {
            reloadTable()
          });
        } else if (response.status === 202) {
          swal({
            icon: "error",
            title: "Delete Prohibited",
            text: "You cannot delete Warehouse that is used",
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
    }
  });
};


  useEffect(() => {
    if ($("#order-listing").length > 0 && warehouses.length > 0) {
        $("#order-listing").DataTable();
      }
    }, [warehouses]);
    return(
        <div className="main-of-containers">
        <div className="right-of-main-containers">
        {isLoading ? (
                <div className="loading-container">
                  <ReactLoading className="react-loading" type={'bubbles'}/>
                  Loading Data...
                </div>
              ) : (
                authrztn.includes('Warehouses - View') ? (

          <div className="right-body-contents">
            <div className="Employeetext-button">
              <div className="employee-and-button">
                <div className="emp-text-side">
                  <p>Warehouse</p>
                </div>
  
                <div className="button-create-side">
                  <div className="Buttonmodal-new">
                    { authrztn?.includes('Warehouses - Add') && (
                    <button onClick={handleShow}>
                      <span style={{}}>
                        <Plus size={25} />
                      </span>
                      Create New
                    </button>
                    )}
  
                  </div>
                </div>
              </div>
            </div>
            <div className="table-containss">
              <div className="main-of-all-tables">
                <table className="table-hover" id="order-listing">
                  <thead>
                    <tr>
                      <th className="tableh">Warehouse Name</th>
                      <th className="tableh">Location Name</th>
                      <th className="tableh">Date Created</th>
                      <th className="tableh">Date Modified</th>
                      <th className="tableh">Action</th>
                    </tr>
                  </thead>
                  {warehouses.length > 0 ?(
                    <tbody>
                  {warehouses.map((data, i) => (
                      <tr key={i}>
                        <td>{data.warehouse_name}</td>
                        <td>{data.location}</td>
                        <td>{formatDatetime(data.createdAt)}</td>
                        <td>{formatDatetime(data.updatedAt)}</td>
                        <td>
                          {isVertical[data.id] ? (
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                            <DotsThreeCircleVertical
                                size={32}
                                className="dots-icon"
                                onClick={() => {
                                toggleButtons(data.id);
                                }}
                            />
                            <div className="float" style={{ position: 'absolute', left: '-125px', top: '0' }}>
                                {setButtonVisibles(data.id) && (
                                <div className="choices">
                                { authrztn?.includes('Bin Location - Edit') && (
                                <button
                                className="btn"
                                  onClick={() => {
                                      handleModalToggle(data);
                                      closeVisibleButtons();
                                  }}>
                                    Update
                                    </button>
                                  )}

                                { authrztn?.includes('Bin Location - Delete') && (
                                <button
                                className="btn"
                                onClick={() => {
                                    handleDelete(data.id);
                                    closeVisibleButtons();
                                    }}>
                                    Delete
                                </button>
                                )}
                                </div>
                                )}
                            </div>
                          </div>
                        ) : (
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                            <DotsThreeCircle
                                size={32}
                                className="dots-icon"
                                onClick={() => {
                                toggleButtons(data.id);
                                }}
                            />
                            <div className="float" style={{ position: 'absolute', left: '-125px', top: '0' }}>
                                {setButtonVisibles(data.id) && (
                                <div className="choices">
                                { authrztn?.includes('Bin Location - Edit') && (
                                <button
                                className="btn"
                                onClick={() => {
                                    handleModalToggle(data);
                                    closeVisibleButtons();
                                }}>
                                Update
                                </button>
                                )}

                                { authrztn?.includes('Bin Location - Delete') && (
                                <button
                                className="btn"
                                onClick={() => {
                                    handleDelete(data.id);
                                    closeVisibleButtons();
                                }}>
                                Delete
                                </button>
                                )}
                                </div>
                                )}
                            </div>
                            </div>
                        )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                   ) : (
                    <div className="no-data">
                      <img src={NoData} alt="NoData" className="no-data-img" />
                      <h3>
                        No Data Found
                      </h3>
                    </div>
                )}
                </table>
              </div>
            </div>
            
          </div>
              ) : (
                <div className="no-access">
                  <img src={NoAccess} alt="NoAccess" className="no-access-img"/>
                  <h3>
                    You don't have access to this function.
                  </h3>
                </div>
              )
            )}
        </div>
  
        <Modal
         show={updateModalShow}
          onHide={() => handleModalToggle()}
           backdrop="static"
            keyboard={false}
             size="lg"
             >
            <Modal.Header closeButton>
                <Modal.Title
                style={{fontSize: '24px',
                fontFamily: 'Poppins, Source Sans Pro'}}>
                    Update Warehouse
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form noValidate validated={validated} onSubmit={handleUpdateSubmit}>
                <div className="row">
                    <div className="col-6">
                        <Form.Group controlId="">
                            <Form.Label style={{ fontSize: "20px",
                                fontFamily: 'Poppins, Source Sans Pro'}}>
                                Warehouse Name
                            </Form.Label>
                            <Form.Control
                            type="text"
                            style={{ height: "40px", 
                            fontSize: "15px", 
                            fontFamily: 'Poppins, Source Sans Pro' }}
                            value={updateFormData.warehouse_name}
                            onChange={handleUpdateFormChange}
                            name="warehouse_name"
                            >
                            </Form.Control>
                        </Form.Group>
                    </div>
                    <div className="col-6">
                        <Form.Group controlId="">
                            <Form.Label style={{ fontSize: "20px" ,
                                fontFamily: 'Poppins, Source Sans Pro'}}>
                                Address
                            </Form.Label>
                            <Form.Control
                            type="text"
                            style={{ height: "40px", 
                            fontSize: "15px", 
                            fontFamily: 'Poppins, Source Sans Pro' }}
                            value={updateFormData.location}
                            onChange={handleUpdateFormChange}
                            name="location"
                            >
                            </Form.Control>
                        </Form.Group>
                    </div>
                    <div className="mt-3">
                        <Form.Group
                        controlId="exampleForm.ControlTextarea1">
                            <Form.Label style={{ fontSize: "20px", 
                            fontFamily: 'Poppins, Source Sans Pro' }}>
                                Description
                            </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            style={{
                            fontFamily: 'Poppins, Source Sans Pro',
                            fontSize: "16px",
                            height: "200px",
                            maxHeight: "200px",
                            resize: "none",
                            overflowY: "auto",
                            }}
                            value={updateFormData.details}
                            onChange={handleUpdateFormChange}
                            name="details"
                        />
                        </Form.Group>
                    </div>
                </div>
                <div className="save-cancel">
                <Button 
                    variant="warning"
                    size="md"
                    style={{ fontSize: "20px",
                    fontFamily: 'Poppins, Source Sans Pro',
                    margin: "0px 5px"}}
                    type="submit">
                      Update
                </Button>
                <Button 
                    variant="secondary" 
                    onClick={() => setUpdateModalShow(!updateModalShow)}
                    size="md"
                    style={{ fontSize: "20px",
                    fontFamily: 'Poppins, Source Sans Pro',
                    margin: "0px 5px"}}>
                    Close
                </Button>
                </div>
                </Form>
            </Modal.Body>
        </Modal>

        <Modal
         show={showModal}
          onHide={handleClose}
           backdrop="static"
            keyboard={false}
             size="lg">
            <Modal.Header closeButton>
                <Modal.Title
                style={{fontSize: '24px',
                fontFamily: 'Poppins, Source Sans Pro'}}>
                    Create Warehouse
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form noValidate validated={validated} onSubmit={add}>
                <div className="row">
                    <div className="col-6">
                        <Form.Group controlId="">
                            <Form.Label style={{ fontSize: "20px",
                                fontFamily: 'Poppins, Source Sans Pro'}}>
                                Warehouse Name:{" "}
                            </Form.Label>
                            <Form.Control
                            type="text"
                            style={{ height: "40px", 
                            fontSize: "15px", 
                            fontFamily: 'Poppins, Source Sans Pro' }}
                            onChange={(e) => setWarehousename(e.target.value)}
                            required
                            >
                            </Form.Control>
                        </Form.Group>
                    </div>
                    <div className="col-6">
                        <Form.Group controlId="">
                            <Form.Label style={{ fontSize: "20px" ,
                                fontFamily: 'Poppins, Source Sans Pro'}}>
                                Warehouse address
                            </Form.Label>
                            <Form.Control
                            type="text"
                            style={{ height: "40px", fontSize: "15px", fontFamily: 'Poppins, Source Sans Pro' }}
                            onChange={(e) => setLocatename(e.target.value)}
                            required
                            >
                            </Form.Control>
                        </Form.Group>
                    </div>

                </div>
                <div className="mt-3">
                        <Form.Group
                        controlId="exampleForm.ControlTextarea1">
                            <Form.Label style={{ fontSize: "20px", 
                            fontFamily: 'Poppins, Source Sans Pro' }}>
                                Description
                            </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            style={{
                            fontFamily: 'Poppins, Source Sans Pro',
                            fontSize: "16px",
                            height: "200px",
                            maxHeight: "200px",
                            resize: "none",
                            overflowY: "auto",
                            }}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        </Form.Group>
                    </div>
                <div className="save-cancel">
                <Button 
                    variant="warning"
                    size="md"
                    style={{ fontSize: "20px",
                    fontFamily: 'Poppins, Source Sans Pro',
                    margin: "0px 5px"}}
                    type="submit">Save</Button>
                <Button 
                    variant="secondary" 
                    onClick={handleClose}
                    size="md"
                    style={{ fontSize: "20px",
                    fontFamily: 'Poppins, Source Sans Pro',
                    margin: "0px 5px"}}>
                    Close
                </Button>
                </div>
                </Form>
            </Modal.Body>
        </Modal>
      </div>
    )
}

export default Warehouse;
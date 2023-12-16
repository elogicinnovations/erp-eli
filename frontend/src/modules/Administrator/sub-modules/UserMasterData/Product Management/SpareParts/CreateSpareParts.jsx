import React, { useState, useEffect } from "react";
import Sidebar from "../../../../../Sidebar/sidebar";
import "../../../../../../assets/global/style.css";
import { Link, useNavigate } from "react-router-dom";
import "../../../../../styles/react-style.css";
import Form from "react-bootstrap/Form";
import axios from "axios";
import BASE_URL from "../../../../../../assets/global/url";
import swal from "sweetalert";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import { Plus, Trash, NotePencil } from "@phosphor-icons/react";

function CreateSpareParts() {
  const [validated, setValidated] = useState(false);
  const [fetchSupp, setFetchSupp] = useState([]);
  const [fetchSubPart, setFetchSubPart] = useState([]);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [supp, setSupp] = useState([]);
  const [desc, setDesc] = useState("");
  const [sparepriceInput, setsparePriceInput] = useState({});
  const [SpareaddPriceInput, setsparePriceInputbackend] = useState([]);
  // for display selected subPart in Table
  const [SubParts, setSubParts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(BASE_URL + "/supplier/fetchTable")
      .then((res) => setFetchSupp(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/subPart/fetchTable")
      .then((res) => setFetchSubPart(res.data))
      .catch((err) => console.log(err));
  }, []);

  //for supplier selection values
  const handleSelectChange = (selectedOptions) => {
    setSupp(selectedOptions);
  };

  const handleSelectChange_SubPart = (selectedOptions) => {
    setSubParts(selectedOptions);
  };

  const handleAddSupp = () => {
    setShowDropdown(true);
  };

  const handleSparePriceinput = (value, priceValue) => {
    setsparePriceInput((prevInputs) => {
      const updatedInputs = {
        ...prevInputs,
        [priceValue]: value,
      };

      // Use the updatedInputs directly to create the serializedProducts array
      const serializedPrice = supp.map((supp) => ({
        price: updatedInputs[supp.value] || "",
        code: supp.codes,
      }));
      setsparePriceInputbackend(serializedPrice);

      console.log("Price Inputted:", serializedPrice);

      // Return the updatedInputs to be used as the new state
      return updatedInputs;
    });
  };

  const add = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      // if required fields has NO value
      //    console.log('requried')
      swal({
        icon: "error",
        title: "Fields are required",
        text: "Please fill the Required text fields",
      });
    } else {
      axios
        .post(`${BASE_URL}/sparePart/create`, {
          code,
          name,
          desc,
          SubParts,
          SpareaddPriceInput,
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            swal({
              title: "Product Spare-Part Add Succesful!",
              text: "The Product Spare-Part has been Added Successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate("/spareParts");
            });
          } else if (res.status === 201) {
            swal({
              title: "Product Spare-Part is Already Exist",
              text: "Please Input a New Product Spare-Part ",
              icon: "error",
            });
          } else {
            swal({
              icon: "error",
              title: "Something went wrong",
              text: "Please contact our support",
            });
          }
        });
    }

    setValidated(true); //for validations
  };

  // React.useEffect(() => {
  //     $(document).ready(function () {
  //         $('#order-listing').DataTable();
  //     });
  //     }, []);

  return (
    <div className="main-of-containers">
      {/* <div className="left-of-main-containers">
            <Sidebar/>
        </div> */}
      <div className="right-of-main-containers">
        <div className="right-body-contents-a">
          <Form noValidate validated={validated} onSubmit={add}>
            <h1>Add Spare Parts</h1>
            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "20px",
              }}>
              General Information
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "81%",
                  left: "18rem",
                  transform: "translateY(-50%)",
                }}></span>
            </div>

            <div className="row mt-3">
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>Code: </Form.Label>
                  <Form.Control
                    onChange={(e) => setCode(e.target.value)}
                    required
                    type="text"
                    placeholder="Enter item code"
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>Name: </Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter item name"
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Subpart:{" "}
                  </Form.Label>
                  <Select
                    isMulti
                    options={fetchSubPart.map((subPart) => ({
                      value: subPart.id,
                      label: subPart.subPart_name,
                    }))}
                    onChange={handleSelectChange_SubPart}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label style={{ fontSize: "20px" }}>Details: </Form.Label>
                <Form.Control
                  onChange={(e) => setDesc(e.target.value)}
                  as="textarea"
                  placeholder="Enter details name"
                  style={{ height: "100px", fontSize: "15px" }}
                />
              </Form.Group>
            </div>

            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "30px",
              }}>
              Supplier List
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "85%",
                  left: "12rem",
                  transform: "translateY(-50%)",
                }}></span>
            </div>
            <div className="supplier-table">
              <div className="table-containss">
                <div className="main-of-all-tables">
                  <table>
                    <thead>
                      <tr>
                        <th className="tableh">Supplier Code</th>
                        <th className="tableh">Name</th>
                        <th className="tableh">Email</th>
                        <th className="tableh">Contact</th>
                        <th className="tableh">Address</th>
                        <th className="tableh">Receiving Area</th>
                        <th className="tableh">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supp.length > 0 ? (
                        supp.map((supp) => (
                          <tr>
                            <td>{supp.codes}</td>
                            <td>{supp.names}</td>
                            <td>{supp.email}</td>
                            <td>{supp.contact}</td>
                            <td>{supp.address}</td>
                            <td>{supp.sparereceving}</td>
                            <td>
                              <span
                                style={{
                                  fontSize: "20px",
                                  marginRight: "5px",
                                }}>
                                ₱
                              </span>
                              <input
                                type="number"
                                style={{ height: "50px" }}
                                placeholder="Input Price"
                                value={sparepriceInput[supp.value] || ""}
                                onChange={(e) =>
                                  handleSparePriceinput(
                                    e.target.value,
                                    supp.value
                                  )
                                }
                                required
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td>No Supplier selected</td>
                        </tr>
                      )}
                    </tbody>
                    {showDropdown && (
                      <div className="dropdown mt-3">
                        <Select
                          isMulti
                          options={fetchSupp.map((supp) => ({
                            value: supp.supplier_code,
                            label: (
                              <div>
                                Supplier Code:{" "}
                                <strong>{supp.supplier_code}</strong> / Name:{" "}
                                <strong>{supp.supplier_name}</strong>
                              </div>
                            ),
                            codes: supp.supplier_code,
                            names: supp.supplier_name,
                            email: supp.supplier_email,
                            contact: supp.supplier_number,
                            address: supp.supplier_address,
                            sparereceving: supp.supplier_receiving,
                            price: supp.supplier_price,
                          }))}
                          onChange={handleSelectChange}
                        />
                      </div>
                    )}

                    <Button
                      variant="outline-warning"
                      onClick={handleAddSupp}
                      size="md"
                      style={{ fontSize: "15px", marginTop: "10px" }}>
                      Add Supplier
                    </Button>
                  </table>
                </div>
              </div>
            </div>
            <div className="save-cancel">
              <Button
                type="submit"
                className="btn btn-warning"
                size="md"
                style={{ fontSize: "20px", margin: "0px 5px" }}>
                Save
              </Button>
              <Link
                to="/spareParts"
                className="btn btn-secondary btn-md"
                size="md"
                style={{ fontSize: "20px", margin: "0px 5px" }}>
                Close
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default CreateSpareParts;

import React, { useEffect, useState } from "react";
import "../../../../../../assets/global/style.css";
import "../../../../styles/react-style.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../../../../assets/global/url";
import Button from "react-bootstrap/Button";
import swal from "sweetalert";
import Form from "react-bootstrap/Form";
import Select from "react-select";
// import * as $ from "jquery";
import cls_unitMeasurement from "../../../../../../assets/global/unitMeasurement";
import cls_unit from "../../../../../../assets/global/unit";

function UpdateSubparts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [binLocation, setbinLocation] = useState([]); // for fetching bin location data
  const [manufacturer, setManufacturer] = useState([]); // for fetching manufacturer data
  const [fetchSupp, setFetchSupp] = useState([]); //for retrieving ng mga supplier
  const [category, setcategory] = useState([]);

  const [prodcode, setprodcode] = useState("");
  const [prodname, setprodname] = useState("");
  const [produnit, setprodunit] = useState("");
  const [prodlocation, setprodlocation] = useState([]);
  const [prodmeasurement, setprodmeasurement] = useState("");
  const [prodmanufacture, setprodmanufacture] = useState("");
  const [prodthreshold, setprodthreshold] = useState("");
  const [proddetails, setproddetails] = useState("");
  const [prodcategory, setprodcategory] = useState([]);
  const [tablesupplier, settablesupplier] = useState([]); // for fetching supplier na nakatag sa subparts
  const [subpartTAGSuppliers, setsubpartTAGSuppliers] = useState([]); //for handling ng onchange sa dropdown ng supplier para makuha price at subpart id

  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);//for disabled of Save button

  useEffect(() => {
    axios
      .get(BASE_URL + "/subpart/fetchsubpartEdit", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setprodcode(res.data[0].subPart_code);
        setprodname(res.data[0].subPart_name);
        setprodunit(res.data[0].subPart_unit);
        setprodlocation(res.data[0].subPart_location);
        setprodmeasurement(res.data[0].subPart_unitMeasurement);
        setprodmanufacture(res.data[0].subPart_Manufacturer);
        setprodthreshold(res.data[0].threshhold);
        setproddetails(res.data[0].subPart_desc);
        setprodcategory(res.data[0].category_code);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleSelectChange = (selectedOptions) => {
    setsubpartTAGSuppliers(selectedOptions);
    const updatedTable = [
      ...tablesupplier.filter((row) =>
        selectedOptions.some(
          (option) => option.value === row.supplier.supplier_code
        )
      ),
      ...selectedOptions
        .filter(
          (option) =>
            !tablesupplier.some(
              (row) => row.supplier.supplier_code === option.value
            )
        )
        .map((option) => ({
          supplier_code: option.value,
          supplier: {
            supplier_name: option.label.split("/ Name: ")[1].trim(),
            supplier_code: option.suppcodes,
            supplier_email: option.email,
            supplier_number: option.number,
            supplier_address: option.address,
            supplier_receiving: option.receiving,
          },
        })),
    ];
    settablesupplier(updatedTable);
    setIsSaveButtonDisabled(false);
  };

  const handlePriceChange = (index, value) => {
    const updatedTable = [...tablesupplier];
    updatedTable[index].supplier_price = value;

    const subpartTAGSuppliersData = subpartTAGSuppliers.map((row) => {
      if (row.value === updatedTable[index].supplier_code) {
        return {
          ...row,
          price: value,
        };
      }
      return row;
    });

    setsubpartTAGSuppliers(subpartTAGSuppliersData);
    settablesupplier(updatedTable);
    setIsSaveButtonDisabled(false);
  };

  useEffect(() => {
    axios
      .get(BASE_URL + "/subpartSupplier/fetchSubSupplier", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        const data = res.data;
        settablesupplier(data);
        const selectedSupplierOptions = data.map((row) => ({
          value: row.supplier.supplier_code,
          label: `Supplier Code: ${row.supplier_code} / Name: ${row.supplier.supplier_name}`,
          price: row.supplier_price,
        }));
        setsubpartTAGSuppliers(selectedSupplierOptions);
      })
      .catch((err) => console.log(err));
  }, [id]);

  //   console.log(prodcode)

  //Bin Location Fetch
  useEffect(() => {
    axios
      .get(BASE_URL + "/binLocation/fetchTable")
      .then((response) => {
        setbinLocation(response.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  //Manufacture Fetch
  useEffect(() => {
    axios
      .get(BASE_URL + "/manufacturer/retrieve")
      .then((response) => {
        setManufacturer(response.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  //Supplier Fetch
  useEffect(() => {
    axios
      .get(BASE_URL + "/supplier/fetchTable")
      .then((res) => setFetchSupp(res.data))
      .catch((err) => console.log(err));
  }, []);

  //category fetch
  useEffect(() => {
    axios
      .get(BASE_URL + "/category/fetchTable")
      .then((response) => {
        setcategory(response.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  //input for subpart code
  const handleSubpartCode = (event) => {
    setprodcode(event.target.value);
    setIsSaveButtonDisabled(false);
  };

  //input for subpart name 
  const handleSubpartname = (event) => {
    setprodname(event.target.value);
    setIsSaveButtonDisabled(false);
  };

  //input for threshold 
  const handlethreshold = (event) => {
    setprodthreshold(event.target.value);
    setIsSaveButtonDisabled(false);
  };

  //input for details
  const handledetails = (event) => {
    setproddetails(event.target.value);
    setIsSaveButtonDisabled(false);
  }

  // for Unit on change function
  const handleChangeUnit = (event) => {
    setprodunit(event.target.value);
    setIsSaveButtonDisabled(false);
  };

  // for Bin Location on change function
  const handleFormChangeBinLocation = (event) => {
    setprodlocation(event.target.value);
    setIsSaveButtonDisabled(false);
  };

  // for Manufacturer on change function
  const handleFormChangeManufacturer = (event) => {
    setprodmanufacture(event.target.value);
    setIsSaveButtonDisabled(false);
  };

  // for Unit Measurement on change function
  const handleChangeMeasurement = (event) => {
    setprodmeasurement(event.target.value);
    setIsSaveButtonDisabled(false);
  };

  //for category on change function
  const handleFormChangeCategory = (event) => {
    setprodcategory(event.target.value);
    setIsSaveButtonDisabled(false);
  };
  //when user click the Add supplier button
  const handleAddSupp = () => {
    setShowDropdown(true);
  };

  const update = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
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
        .post(`${BASE_URL}/subpart/update`, null, {
          params: {
            id,
            prodcode,
            prodname,
            produnit,
            prodlocation,
            prodmeasurement,
            prodmanufacture,
            proddetails,
            prodthreshold,
            prodcategory,
            subpartTAGSuppliers,
          },
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            swal({
              title: "The Product Sub Part Update Successful!",
              text: "The Product Part has been Updated Successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate("/subParts");
              setIsSaveButtonDisabled(true);
            });
          } else if (res.status === 201) {
            swal({
              icon: "error",
              title: "Product Sub Part Already Exist",
              text: "Please input another Product Sub Part",
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
  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
        <div className="right-body-contentss">
          <Form noValidate validated={validated} onSubmit={update}>
            <h1>Update Sub Parts</h1>
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

            <div className="row">
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    SubParts Code{" "}
                  </Form.Label>
                  <Form.Control
                    value={prodcode}
                    required
                    onChange={(e) => handleSubpartCode(e)}
                    type="text"
                    placeholder="Enter item code"
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    SubParts Name{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    value={prodname}
                    onChange={(e) => handleSubpartname(e)}
                    type="text"
                    placeholder="Enter item name"
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Category:{" "}
                  </Form.Label>
                  <Form.Select
                    aria-label=""
                    onChange={handleFormChangeCategory}
                    required
                    style={{ height: "40px", fontSize: "15px" }}
                    value={prodcategory}>
                    <option disabled value="">
                      Select Category ...
                    </option>
                    {category.map((category) => (
                      <option
                        key={category.category_code}
                        value={category.category_code}>
                        {category.category_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>Unit: </Form.Label>
                  <Form.Select
                    aria-label=""
                    style={{ height: "40px", fontSize: "15px" }}
                    defaultValue=""
                    value={produnit}
                    onChange={handleChangeUnit}>
                    {cls_unit.map((unit, index) => (
                      <option key={index} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Bin Location:{" "}
                  </Form.Label>
                  <Form.Select
                    aria-label=""
                    onChange={handleFormChangeBinLocation}
                    value={prodlocation}
                    style={{ height: "40px", fontSize: "15px" }}>
                    {binLocation.map((binLocation) => (
                      <option
                        key={binLocation.bin_id}
                        value={binLocation.bin_id}>
                        {binLocation.bin_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Unit of Measurement:{" "}
                  </Form.Label>
                  <Form.Select
                    aria-label=""
                    value={prodmeasurement}
                    style={{ height: "40px", fontSize: "15px" }}
                    onChange={handleChangeMeasurement}>
                    {cls_unitMeasurement.map((unitM, index) => (
                      <option key={index} value={unitM}>
                        {unitM}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Manufacturer:{" "}
                  </Form.Label>
                  <Form.Select
                    aria-label=""
                    onChange={handleFormChangeManufacturer}
                    required
                    value={prodmanufacture}
                    style={{ height: "40px", fontSize: "15px" }}>
                    {manufacturer.map((manufacturer) => (
                      <option
                        key={manufacturer.manufacturer_code}
                        value={manufacturer.manufacturer_code}>
                        {manufacturer.manufacturer_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Critical Inventory Thresholds:{" "}
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => {
                      const sanitizedValue = e.target.value.replace(/\D/g, "");
                      handlethreshold({ target: { value: sanitizedValue } });
                    }}
                    type="text"
                    placeholder="Minimum Stocking"
                    style={{ height: "40px", fontSize: "15px" }}
                    maxLength={10}
                    pattern="[0-9]*"
                    value={prodthreshold}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
              </div>
            </div>

            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontSize: "20px" }}>Details</Form.Label>
              <Form.Control
                onChange={(e) => handledetails(e)}
                as="textarea"
                placeholder="Enter details"
                style={{ height: "100px", fontSize: "15px", resize: "none" }}
                value={proddetails}
              />
            </Form.Group>

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
                  <table id="order-listing">
                    <thead>
                      <tr>
                        <th className="tableh">Product Code</th>
                        <th className="tableh">Supplier</th>
                        <th className="tableh">Email</th>
                        <th className="tableh">Contact</th>
                        <th className="tableh">Address</th>
                        <th className="tableh">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tablesupplier.length > 0 ? (
                        tablesupplier.map((supp, i) => (
                          <tr key={i}>
                            <td>{supp.supplier.supplier_code}</td>
                            <td>{supp.supplier.supplier_name}</td>
                            <td>{supp.supplier.supplier_name}</td>
                            <td>{supp.supplier.supplier_number}</td>
                            <td>{supp.supplier.supplier_address}</td>
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
                                value={supp.supplier_price || ""}
                                onKeyDown={(e) =>
                                  ["e", "E", "+", "-"].includes(e.key) &&
                                  e.preventDefault()
                                }
                                onChange={(e) =>
                                  handlePriceChange(i, e.target.value)
                                }
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            style={{ textAlign: "center", fontSize: "18px" }}>
                            No Supplier selected
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {showDropdown && (
                      <div className="dropdown mt-3">
                        <Select
                          isMulti
                          options={fetchSupp.map((supplier) => ({
                            value: supplier.supplier_code,
                            label: `Supplier Code: ${supplier.supplier_code} / Name: ${supplier.supplier_name}`,
                            suppcodes: supplier.supplier_code,
                            email: supplier.supplier_email,
                            number: supplier.supplier_number,
                            address: supplier.supplier_address,
                            receiving: supplier.supplier_receiving,
                          }))}
                          value={subpartTAGSuppliers}
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
                style={{ fontSize: "20px", margin: "0px 5px" }}
                disabled={isSaveButtonDisabled}>
                Save
              </Button>
              <Link
                to="/subParts"
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

export default UpdateSubparts;

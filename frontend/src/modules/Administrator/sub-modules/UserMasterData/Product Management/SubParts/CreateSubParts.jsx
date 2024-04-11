import React, { useState, useEffect, useRef } from "react";
// import Sidebar from "../../../../../Sidebar/sidebar";
// import Dropzone from "react-dropzone";
import "../../../../../../assets/global/style.css";
import { Link, useNavigate } from "react-router-dom";
import ReactLoading from 'react-loading';
import NoData from '../../../../../../assets/image/NoData.png';
import NoAccess from '../../../../../../assets/image/NoAccess.png';
import "../../../../../styles/react-style.css";
import Form from "react-bootstrap/Form";
import axios from "axios";
import BASE_URL from "../../../../../../assets/global/url";
import swal from "sweetalert";
import Button from "react-bootstrap/Button";
import Select from "react-select";
// import { Plus, Trash, NotePencil, X } from "@phosphor-icons/react";
import cls_unitMeasurement from "../../../../../../assets/global/unitMeasurement";
import {
  ArrowCircleLeft
} from "@phosphor-icons/react";
import { jwtDecode } from "jwt-decode";

function CreateSubParts({authrztn}) {
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const [category, setcategory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [binLocation, setbinLocation] = useState([]);
  const [manufacturer, setManufacturer] = useState([]);

 
  const [unitMeasurement, setunitMeasurement] = useState("");
  const [thresholds, setThresholds] = useState("");
  const [slct_binLocation, setslct_binLocation] = useState([]);
  const [slct_manufacturer, setslct_manufacturer] = useState([]);
  const [slct_category, setslct_category] = useState([]);
  const [selectedimage, setselectedimage] = useState([]);
 

  const [code, setCode] = useState("");
  const [subpartName, setsubpartName] = useState("");
  const [details, setDetails] = useState("");
  const [priceInput, setPriceInput] = useState({});
  const [SubaddPriceInput, setaddPriceInputbackend] = useState([]);

  const [supp, setSupp] = useState([]);
  const [fetchSupp, setFetchSupp] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [Fname, setFname] = useState('');
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userId, setuserId] = useState('');

  const decodeToken = () => {
    var token = localStorage.getItem('accessToken');
    if(typeof token === 'string'){
    var decoded = jwtDecode(token);
    setUsername(decoded.username);
    setFname(decoded.Fname);
    setUserRole(decoded.userrole);
    setuserId(decoded.id);
    }
  }

  useEffect(() => {
    decodeToken();
  }, [])

  // useEffect(() => {
  //   axios
  //     .get(BASE_URL + "/subpart/lastCode")
  //     .then((res) => {
  //       const codes =
  //         res.data !== null ? res.data.toString().padStart(6, "0") : "000001";

  //       // Increment the value by 1
  //       setCode(codes);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/product/lastCode")
      .then((res) => {
        // const codes =
        //   res.data !== null ? res.data.toString().padStart(6, "0") : "000001";

        // // Increment the value by 1
        // setCode(codes);

        const codes =
          res.data !== null ? res.data.toString().padStart(6, "0") : "000000";
          setCode(codes);
      })
      .catch((err) => console.log(err));
  }, []);


  const handleAddSuppClick = () => {
    setShowDropdown(true);
  };

  const handleSelectChange_Supp = (selectedOptions) => {
    setSupp(selectedOptions);
  };


  // for Unit Measurement on change function
  const handleChangeMeasurement = (event) => {
    setunitMeasurement(event.target.value);
  };
  // for Bin Location on change function
  const handleFormChangeBinLocation = (event) => {
    setslct_binLocation(event.target.value);
  };
  // for Unit Measurement on change function
  const handleFormChangeManufacturer = (event) => {
    setslct_manufacturer(event.target.value);
  };

  // for Catergory on change function
  const handleFormChangeCategory = (event) => {
    setslct_category(event.target.value);
  };

  // console.log(slct_binLocation);

  useEffect(() => {
    const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/supplier/fetchTable")
      .then((res) => {
        setFetchSupp(res.data)
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, 1000);
  
  return () => clearTimeout(delay);
  }, []);

  const handlePriceinput = (value, priceValue) => {
    setPriceInput((prevInputs) => {
      const updatedInputs = {
        ...prevInputs,
        [priceValue]: value,
      };

      // Use the updatedInputs directly to create the serializedProducts array
      const serializedPrice = supp.map((supp) => ({
        price: updatedInputs[supp.value] || "",
        code: supp.codes,
      }));

      setaddPriceInputbackend(serializedPrice);

      console.log("Price Inputted:", serializedPrice);

      // Return the updatedInputs to be used as the new state
      return updatedInputs;
    });
  };

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

  // const handleKeyPress = (e) => {
  //   if (e.key === "e" || isNaN(e.key)) {
  //     e.preventDefault();
  //   }
  //   e.target.value = e.target.value.replace(/[^0-9.]/);
  // };


const [images, setImages] = useState([]);
const [isDragging, setIsDragging] = useState([]);
const fileInputRef = useRef(null);

function selectFiles() {
  fileInputRef.current.click();
}

function onFileSelect(event) {
  const files = event.target.files;

  if (files.length === 0) return;

  if (images.length + files.length > 5) {
    swal({
      icon: "error",
      title: "File Limit Exceeded",
      text: "You can upload up to 5 images only.",
    });
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const fileType = files[i].type.split('/')[1].toLowerCase();
    const fileSize = files[i].size / (1024 * 1024); // Convert size to MB

    if (fileSize > 5) {
      swal({
        icon: "error",
        title: "File Size Limit Exceeded",
        text: "Each image must be up to 5MB in size.",
      });
      continue;
    }

    if (fileType !== 'jpeg' && fileType !== 'png' && fileType !== 'webp') {
      swal({
        icon: "error",
        title: "Invalid File Type",
        text: "Only JPEG and PNG files are allowed.",
      });
      continue;
    }

    if (!images.some((e) => e.name === files[i].name)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prevImages) => [
          ...prevImages,
          {
            name: files[i].name,
            url: URL.createObjectURL(files[i]),
            base64Data: e.target.result.split(',')[1],
          },
        ]);
      };
      reader.readAsDataURL(files[i]);
    }
  }
}

function deleteImage(index){
  setImages((prevImages) => 
    prevImages.filter((_, i) => i !== index)
  )
}

function onDragOver(event){
  event.preventDefault();
  setIsDragging(true);
  event.dataTransfer.dropEffect = "copy";
}

function onDragLeave(event) {
  event.preventDefault();
  setIsDragging(false);
}

function onDropImages(event) {
  event.preventDefault();
  setIsDragging(false);
  const files = event.dataTransfer.files;

  if (images.length + files.length > 5) {
    swal({
      icon: "error",
      title: "File Limit Exceeded",
      text: "You can upload up to 5 images only.",
    });
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const fileType = files[i].type.split('/')[1].toLowerCase();
    const fileSize = files[i].size / (1024 * 1024); // Convert size to MB

    if (fileSize > 5) {
      swal({
        icon: "error",
        title: "File Size Limit Exceeded",
        text: "Each image must be up to 5MB in size.",
      });
      continue;
    }

    if (fileType !== 'jpeg' && fileType !== 'png' && fileType !== 'webp') {
      swal({
        icon: "error",
        title: "Invalid File Type",
        text: "Only JPEG and PNG files are allowed.",
      });
      continue;
    }

    if (!images.some((e) => e.name === files[i].name)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prevImages) => [
          ...prevImages,
          {
            name: files[i].name,
            url: URL.createObjectURL(files[i]),
            base64Data: e.target.result.split(',')[1],
          },
        ]);
      };
      reader.readAsDataURL(files[i]);
    }
  }
}


  const add = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      swal({
        icon: "error",
        title: "Fields are required",
        text: "Please fill in the required fields marked in red.",
      });
    } else {

      axios
        .post(`${BASE_URL}/subpart/createsubpart`, {
          code,
          subpartName,
          details,
          SubaddPriceInput,
          slct_binLocation,
          unitMeasurement,
          slct_manufacturer,
          thresholds,
          slct_category,
          images,
          userId,
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            swal({
              title: "Product Sub-Part Added Successfully!",
              text: "The new product sub-part has been added successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate("/subParts");
            });
          } else if (res.status === 201) {
            swal({
              icon: "error",
              title: "Sub-Part Code Already Exists",
              text: "Please enter a new product sub-part.",
            });
          } else {
            swal({
              icon: "error",
              title: "Something went wrong",
              text: "Please contact our support team.",
            });
          }
        });
    }
    setValidated(true); //for validations
  };

  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
              {isLoading ? (
                <div className="loading-container">
                  <ReactLoading className="react-loading" type={'bubbles'}/>
                  Loading Data...
                </div>
              ) : (
        authrztn.includes('Sub-Part - Add') ? (
        <div className="right-body-contentss">
          <Form noValidate validated={validated} onSubmit={add}>
          <div className="arrowandtitle">
              <Link to="/subParts">
                  <ArrowCircleLeft size={45} color="#60646c" weight="fill" />
              </Link>
                  <div className="titletext">
                      <h1>Add Sub Parts</h1>
                  </div>
              </div>
            
            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "20px",
                fontFamily: "Poppins, Source Sans Pro"
              }}>
              General Information
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "81%",
                  left: "21rem",
                  transform: "translateY(-50%)",
                  
                }}></span>
            </div>

            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    SubParts Code{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    onChange={(e) => setCode(e.target.value)}
                    type="text"
                    placeholder="Enter item code"
                    style={{ height: "40px", fontSize: "15px" }}
                    value={code}
                    readOnly
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    SubParts Name{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    onChange={(e) => setsubpartName(e.target.value)}
                    type="text"
                    placeholder="Enter item name"
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Bin Location:{" "}
                  </Form.Label>
                  <Form.Select
                    aria-label=""
                    onChange={handleFormChangeBinLocation}
                    required
                    style={{ height: "40px", fontSize: "15px" }}
                    defaultValue="">
                    <option disabled value="">
                      Select Bin Location ...
                    </option>
                    {binLocation.map((binLocation) => (
                      <option
                        key={binLocation.bin_id}
                        value={binLocation.bin_id}>
                          <strong>{binLocation.bin_name + "-"}</strong>
                          <strong>{binLocation.bin_subname}</strong>
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-6">
              <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Category:{" "}
                  </Form.Label>

                  <Form.Select
                    aria-label=""
                    onChange={handleFormChangeCategory}
                    required
                    style={{ height: "40px", fontSize: "15px" }}
                    defaultValue="">
                    <option disabled value="">
                      Select Category
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
                            <Form.Label style={{ fontSize: "20px" }}>
                              Unit of Measurement:{" "}
                            </Form.Label>
                            <Form.Select
                              aria-label=""
                              style={{ height: "40px", fontSize: "15px" }}
                              defaultValue=""
                              onChange={handleChangeMeasurement}>
                              <option disabled value="">
                                Select Unit Measurement ...
                              </option>
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
                              style={{ height: "40px", fontSize: "15px" }}
                              defaultValue="">
                              <option disabled value="">
                                Select Manufacturer ...
                              </option>
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

                  <div className="row mt-3">
                    <div className="col-6">
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label style={{ fontSize: "20px" }}>
                          Critical Inventory Thresholds:{" "}
                        </Form.Label>
                        <Form.Control
                          required
                          value={thresholds}
                          onChange={(e) => {
                            if(e.target.value > 100){
                              setThresholds(100)
                            }
                            else if(e.target.value === '0'){
                              setThresholds(1)
                            }
                            else{
                              setThresholds(e.target.value)
                            }                  
                          }}
                          // onInput={handleKeyPress}
                          onKeyDown={(e) => {
                            ["e", "E", "+", "-"].includes(e.key) &&
                              e.preventDefault();
                          }}
                          type="number"
                          placeholder="Minimum Stocking"
                          style={{ height: "40px", fontSize: "15px" }}
                          maxLength={10}
                          pattern="[0-9]*"
                        />
                      </Form.Group>
                    </div>
                    <div className="col-6">
                    </div>
                  </div>

                    <div className="row mt-3">
                      <div className="col-6">
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label style={{ fontSize: "20px" }}>Details</Form.Label>
                            <Form.Control
                              onChange={(e) => setDetails(e.target.value)}
                              as="textarea"
                              rows={3}
                              style={{
                              fontFamily: 'Poppins, Source Sans Pro',
                              fontSize: "16px",
                              height: "122px",
                              maxHeight: "122px",
                              resize: "none",
                              overflowY: "auto",
                              }}
                            />
                          </Form.Group>
                      </div>

                      <div className="col-6">
                      <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label style={{ fontSize: "20px" }}>
                              Image Upload:{" "}
                            </Form.Label>
                            <div className="card" onClick={selectFiles}>
                              <div className="drag-area" 
                              onDragOver={onDragOver} 
                              onDragLeave={onDragLeave} 
                              onDrop={onDropImages}>
                                  <>
                                  Drag & Drop image here or {" "}
                                  <span className="select" 
                                  role="button" 
                                  onClick={selectFiles}>
                                    Browse
                                  </span>
                                  </>
                                <input name="file" 
                                type="file" 
                                className="file" 
                                multiple ref={fileInputRef} 
                                onChange={onFileSelect}/>
                              </div>
                              <div className="ccontainerss">
                                {images.map((images,index)=>(
                                <div className="imagess" key={index}>
                                  <span className="delete" onClick={() => deleteImage(index)}>&times;</span>
                                  <img src={images.url} alt={images.name} /> 
                                </div>
                                ))}
                              </div>
                            </div>
                        </Form.Group>
                      </div>
                    </div>

                <div
                  className="gen-info"
                  style={{
                    fontSize: "20px",
                    position: "relative",
                    paddingTop: "30px",
                    fontFamily: "Poppins, Source Sans Pro"
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
                            <th className="tableh">VAT</th>
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
                                <td>
                                <div className="d-flex align-items-center">
                                  <span
                                    style={{
                                      fontSize: "20px",
                                      marginRight: "5px",
                                    }}>
                                    ₱
                                  </span>
                                  <Form.Control
                                    type="number"
                                    style={{ height: "35px", fontSize: '14px', fontFamily: 'Poppins, Source Sans Pro'}}
                                    placeholder="Input Price"
                                    value={priceInput[supp.value] || ""}
                                    onChange={(e) =>
                                      handlePriceinput(e.target.value, supp.value)
                                    }
                                    onKeyDown={(e) =>
                                      ["e", "E", "+", "-"].includes(e.key) &&
                                      e.preventDefault()
                                    }
                                    required
                                  />
                                  </div>
                                </td>
                                <td>
                                {isNaN((supp.vatable / 100) * priceInput[supp.value]) ? 0 : ((supp.vatable / 100) * priceInput[supp.value]).toFixed(2)}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="7"
                                style={{ textAlign: "center"}}>
                                No Supplier selected
                              </td>
                            </tr>
                          )}
                        </tbody>
                        {showDropdown && (
                          <div className="dropdown mt-3">
                            <Select
                              isMulti
                              options={fetchSupp.map((supp) => ({
                                value: `${supp.supplier_code} - ${supp.supplier_name}`,
                                label: (
                                  <div>
                                    Supplier Code: <strong>{supp.supplier_code}</strong> / Name:{" "}
                                    <strong>{supp.supplier_name}</strong>
                                  </div>
                                ),
                                codes: supp.supplier_code,
                                vatable: supp.supplier_vat,
                                names: supp.supplier_name,
                                email: supp.supplier_email,
                                contact: supp.supplier_number,
                                address: supp.supplier_address,
                                price: supp.supplier_price,
                              }))}
                              onChange={handleSelectChange_Supp}
                            />
                          </div>
                        )}

                        <Button
                          variant="outline-warning"
                          onClick={handleAddSuppClick}
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
                      to="/subParts"
                      className="btn btn-secondary btn-md"
                      size="md"
                      style={{ fontSize: "20px", margin: "0px 5px" }}>
                      Close
                    </Link>
                  </div>
                </Form>
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
          </div>
  );
}

export default CreateSubParts;

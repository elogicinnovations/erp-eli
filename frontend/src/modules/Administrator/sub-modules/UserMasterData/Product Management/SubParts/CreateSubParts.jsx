import React, { useState, useEffect, useRef } from "react";
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
import { Plus, Trash, NotePencil, X } from "@phosphor-icons/react";
import Dropzone from "react-dropzone";
import cls_unitMeasurement from "../../../../../../assets/global/unitMeasurement";

function CreateSubParts() {
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const [category, setcategory] = useState([]);

  const [binLocation, setbinLocation] = useState([]);
  const [manufacturer, setManufacturer] = useState([]);

 
  const [unitMeasurement, setunitMeasurement] = useState("");
  const [thresholds, setThresholds] = useState("");
  const [slct_binLocation, setslct_binLocation] = useState([]);
  const [slct_manufacturer, setslct_manufacturer] = useState([]);
  const [slct_category, setslct_category] = useState([]);
  const [selectedimage, setselectedimage] = useState([]);
  const fileInputRef = useRef(null);

  const [code, setCode] = useState("");
  const [subpartName, setsubpartName] = useState("");
  const [details, setDetails] = useState("");
  const [priceInput, setPriceInput] = useState({});
  const [SubaddPriceInput, setaddPriceInputbackend] = useState([]);

  const [supp, setSupp] = useState([]);
  const [fetchSupp, setFetchSupp] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

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
    axios
      .get(BASE_URL + "/supplier/fetchTable")
      .then((res) => setFetchSupp(res.data))
      .catch((err) => console.log(err));
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

  const onDropImage = (acceptedFiles) => {
    const newSelectedImages = [...selectedimage];

    acceptedFiles.forEach((file) => {
      if (
        (file.type === "image/png" || file.type === "image/jpeg") &&
        newSelectedImages.length < 5
      ) {
        newSelectedImages.push(file);
      } else {
        swal({
          title: "Invalid file type or maximum limit reached",
          text: "Please select PNG or JPG files, and ensure the total selected images do not exceed 5.",
          icon: "error",
          button: "OK",
        });
      }
    });

    setselectedimage(newSelectedImages);
  };

  const removeImage = (index) => {
    const newSelectedImages = [...selectedimage];
    newSelectedImages.splice(index, 1);
    setselectedimage(newSelectedImages);
  };
  const uploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  // console.log(selectedimage);
  const [img, setImg] = useState([]);
  // console.log("Image: ",img);
  // selectedimage.forEach(image => {
  //   var filereader = new FileReader();
  //   let imageData = []
  //   filereader.onload = function (event){
  //     image.blobData = event.target.result
  //     imageData = [...imageData , image]
  //     // setImg([...img, image])
  //     console.log("base 64 data: ",btoa(image.blobData))
  //   }

  //   setImg(imageData)

  //   // console.log(image.file)
  //   if(image instanceof Blob){
  //     // filereader.readAsArrayBuffer(image);
  //     filereader.readAsBinaryString(image);
  //   }
  // });


useEffect(() => {
  // Create a function to handle the image processing
  const processImages = () => {
    const imageDataArray = [];

    selectedimage.forEach((image, index) => {
      const filereader = new FileReader();

      filereader.onload = function (event) {
        // Process image data
        const processedImage = {
          index, // or any other identifier for the image
          blobData: event.target.result,
          base64Data: btoa(event.target.result),
        };

        imageDataArray.push(processedImage);
      };

      if (image instanceof Blob) {
        filereader.readAsBinaryString(image);
      }
    });

    // Set the state once after processing all images
    setImg(imageDataArray);
  };

  // Call the image processing function
  processImages();
}, [selectedimage]);

  const add = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      swal({
        icon: "error",
        title: "Fields are required",
        text: "Please fill the red text fields",
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
          img
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            swal({
              title: "Product Sub-Parts Add Successful!",
              text: "The Product Sub-Parts has been Added Successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate("/subParts");
            });
          } else if (res.status === 201) {
            swal({
              icon: "error",
              title: "Code Already Exist",
              text: "Please input another code",
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
      {/* <div className="left-of-main-containers">
                <Sidebar/>
            </div> */}
      <div className="right-of-main-containers">
        <div className="right-body-contentss">
          <Form noValidate validated={validated} onSubmit={add}>
            <h1>Add Sub Parts</h1>
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
                    required
                    onChange={(e) => setCode(e.target.value)}
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
                    onChange={(e) => setsubpartName(e.target.value)}
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
              <div className="col-4">
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
              <div className="col-4">
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
              <div className="col-4">
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

            

            

            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Critical Inventory Thresholds:{" "}
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const sanitizedValue = inputValue.replace(/\D/g, "");
                      setThresholds(sanitizedValue);
                    }}
                    type="text"
                    placeholder="Minimum Stocking"
                    style={{ height: "40px", fontSize: "15px" }}
                    maxLength={10}
                    pattern="[0-9]*"
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Image Upload:{" "}
                  </Form.Label>
                  <div
                    style={{
                      border: "1px #DFE3E7 solid",
                      height: "auto",
                      maxHeight: "140px",
                      fontSize: "15px",
                      width: "720px",
                      padding: 10,
                    }}>
                    <Dropzone onDrop={onDropImage}>
                      {({ getRootProps, getInputProps }) => (
                        <div
                          className="w-100 h-100"
                          style={{ width: "700px" }}
                          {...getRootProps()}>
                          <input
                            ref={fileInputRef}
                            type="file"
                            style={{ display: "none" }}
                            {...getInputProps()}
                          />
                          <div
                            className="d-flex align-items-center"
                            style={{ width: "700px", height: "2.5em" }}>
                            <p
                              className="fs-5 w-100 p-3 btn btn-secondary"
                              onClick={uploadClick}
                              style={{ color: "white", fontWeight: "bold" }}>
                              Drag and drop a file here, or click to select a
                              file
                            </p>
                          </div>
                          {selectedimage.length > 0 && (
                            <div
                              className="d-flex align-items-center justify-content-center"
                              style={{
                                border: "1px green solid",
                                width: "700px",
                                height: "5em",
                                padding: "1rem",
                                overflowY: "auto",
                              }}>
                              Uploaded Images:
                              <p
                                style={{
                                  color: "green",
                                  fontSize: "15px",
                                  display: "flex",
                                  height: "4em",
                                  flexDirection: "column",
                                }}>
                                {selectedimage.map((image, index) => (
                                  <div key={index}>
                                    <div className="imgContainer">
                                      <span className="imgUpload">
                                        {image.name}
                                      </span>
                                      <X
                                        size={20}
                                        onClick={removeImage}
                                        className="removeButton"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </Dropzone>
                  </div>
                </Form.Group>
              </div>
            </div>

            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontSize: "20px" }}>Details</Form.Label>
              <Form.Control
                onChange={(e) => setDetails(e.target.value)}
                as="textarea"
                placeholder="Enter details"
                style={{ height: "100px", fontSize: "15px", resize: "none" }}
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
                      {supp.length > 0 ? (
                        supp.map((supp) => (
                          <tr>
                            <td>{supp.codes}</td>
                            <td>{supp.names}</td>
                            <td>{supp.email}</td>
                            <td>{supp.contact}</td>
                            <td>{supp.address}</td>
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
                                value={priceInput[supp.value] || ""}
                                onChange={(e) =>
                                  handlePriceinput(e.target.value, supp.value)
                                }
                                onKeyDown={(e) =>
                                  ["e", "E", "+", "-"].includes(e.key) &&
                                  e.preventDefault()
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
      </div>
    </div>
  );
}

export default CreateSubParts;

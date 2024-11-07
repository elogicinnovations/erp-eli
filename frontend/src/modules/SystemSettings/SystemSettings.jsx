import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import swal from "sweetalert";
import axios from "axios";
import BASE_URL from "../../assets/global/url";
import { WarningCircle } from "@phosphor-icons/react";
import { jwtDecode } from "jwt-decode";
function SystemSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [userId, setuserId] = useState(null);
  const [validated, setValidated] = useState(false);

  const decodeToken = () => {
    var token = localStorage.getItem("accessToken");
    if (typeof token === "string") {
      var decoded = jwtDecode(token);
      setuserId(decoded.id);
    }
  };

  useEffect(() => {
    decodeToken();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetrackIssuance = () => {
    // wag paki alaman para ito sa nag multiple ng insert upon appproval sa issuance para ma align ang mga issued products
    swal({
      title: "Are you sure?",
      text: "This will retrack the issuance!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((confirmed) => {
      if (confirmed) {
        try {
          axios
            .post(BASE_URL + "/issuance/retrackIssuance")
            .then((res) => {
              if (res.status === 200) {
                swal({
                  title: "Success!",
                  text: "Issuance retracked successfully!",
                  icon: "success",
                });
              } else {
                swal({
                  title: "Something went wrong",
                  text: "Please contact your support immediately!",
                  icon: "error",
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } catch (err) {
          swal({
            title: "Something went wrong",
            text: "Please contact your support immediately!",
            icon: "error",
          });
        }
      }
    });
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
    // You may want to reset form values or handle other cleanup tasks here
  };

  // ----------------------------------Start Handle Submit------------------------------//
  const handleFormSubmit = async (e) => {
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
        .put(BASE_URL + "/Setting/update/", {
          id,
          name,
          phone,
          email,
          street,
          barangay,
          city,
          zipcode,
        })
        .then((response) => {
          if (response.status === 200) {
            swal({
              title: "Setting Update Succesful!",
              text: "The Setting has been Updated Successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate("/settingView/1");
            });
          } else if (response.status === 201) {
            swal({
              title: "Setting is Already Exist",
              text: "Please Input a New Setting ",
              icon: "error",
            });
          }
        });
    }

    setValidated(true); //for validations
  };

  const SuccessInserted = (res) => {
    swal({
      title: "Cost Center Created",
      text: "The Cost Center has been added successfully",
      icon: "success",
      button: "OK",
    }).then(() => {
      navigate("/systemSettings");
    });
  };

  const Duplicate_Message = () => {
    swal({
      title: "Cost Center Already Exist",
      text: "Please input other cost center name",
      icon: "error",
      button: "OK",
    });
  };
  const ErrorInserted = () => {
    swal({
      title: "Something went wrong",
      text: "Please Contact our Support",
      icon: "error",
      button: "OK",
    });
  };

  useEffect(() => {
    axios
      .get(BASE_URL + "/Setting/SettingView", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setName(res.data[0].name);
        setPhone(res.data[0].phone);
        setEmail(res.data[0].email);
        setStreet(res.data[0].street);
        setBarangay(res.data[0].barangay);
        setCity(res.data[0].city);
        setZipcode(res.data[0].zipcode);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
        <div className="right-body-contentss">
          <h1>Settings</h1>
          <div
            className="gen-info"
            style={{
              fontSize: "20px",
              position: "relative",
              marginTop: "10px",
            }}
          >
            Company Profile
            <span
              style={{
                position: "absolute",
                height: "0.5px",
                width: "-webkit-fill-available",
                background: "#FFA500",
                top: "81%",
                left: "15rem",
                transform: "translateY(-50%)",
              }}
            ></span>
          </div>
          <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
            <div className="row mt-3">
              <div className="col-9">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Company Name:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    style={{ height: "40px", fontSize: "15px" }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    // disabled={!isEditMode}
                  />
                </Form.Group>
              </div>
              <div className="col-3">
                <Form.Group className="logo">
                  <Form.Label
                    style={{
                      fontSize: "15px",
                      position: "absolute",
                      left: "10px",
                    }}
                  >
                    Company Logo:{" "}
                  </Form.Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                    id="logoInput"
                    disabled={!isEditMode}
                  />
                  <label htmlFor="logoInput" style={{ cursor: "pointer" }}>
                    <div
                      style={{
                        marginTop: "20px",
                        width: "200px",
                        height: "200px",
                        border: "solid 1px gray",
                        borderRadius: "50%",
                        overflow: "hidden",
                        position: "relative",
                        backgroundColor: "#eee",
                      }}
                    >
                      {image ? (
                        <img
                          src={image}
                          alt="Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            color: "#555",
                          }}
                        >
                          <span>Upload Logo</span>
                        </div>
                      )}
                    </div>
                  </label>
                </Form.Group>
              </div>
            </div>
            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                marginTop: "10px",
              }}
            >
              Contact and Location
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "81%",
                  left: "19rem",
                  transform: "translateY(-50%)",
                }}
              ></span>
            </div>
            <div className="row mt-3">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Phone Number:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Phone Number..."
                    style={{ height: "40px", fontSize: "15px" }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    // disabled={!isEditMode}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>Email: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Email..."
                    style={{ height: "40px", fontSize: "15px" }}
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    // disabled={!isEditMode}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Building / Street:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Building or Street..."
                    style={{ height: "40px", fontSize: "15px" }}
                    onChange={(e) => setStreet(e.target.value)}
                    value={street}
                    // disabled={!isEditMode}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Barangay:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Barangay..."
                    style={{ height: "40px", fontSize: "15px" }}
                    onChange={(e) => setBarangay(e.target.value)}
                    value={barangay}
                    // disabled={!isEditMode}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>City: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter City..."
                    style={{ height: "40px", fontSize: "15px" }}
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                    // disabled={!isEditMode}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Zipcode:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Zipcode..."
                    style={{ height: "40px", fontSize: "15px" }}
                    onChange={(e) => setZipcode(e.target.value)}
                    value={zipcode}
                    // disabled={!isEditMode}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="save-cancel">
              <Link
                to="/dashboard"
                type="button"
                className="btn btn-secondary btn-md"
                size="md"
                style={{ fontSize: "20px", margin: "0px 5px" }}
              >
                Cancel
              </Link>
              <Button
                type="submit"
                className="btn btn-primary"
                size="md"
                style={{ fontSize: "20px", margin: "0px 5px" }}
              >
                Save Changes
              </Button>
            </div>

            {userId === 1 && (
              <div className="row">
                <div className="col-sm">
                  <Button variant="danger" onClick={handleRetrackIssuance}>
                    <span>
                      <WarningCircle size={20} />
                    </span>
                    Retrack Issuance
                  </Button>
                </div>
              </div>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SystemSettings;

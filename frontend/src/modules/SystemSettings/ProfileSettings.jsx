import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import BASE_URL from "../../assets/global/url";
import user from "../../assets/image/user.png";
import Image from "react-bootstrap/Image";
import swal from "sweetalert";
import { jwtDecode } from "jwt-decode";

function ProfileSettings() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [name, setName] = useState("");
  const [cnum, setCnum] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPass2, setNewPass2] = useState("");

  const [userId, setuserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (typeof token === "string") {
      const decoded = jwtDecode(token);
      setuserId(decoded.id);
      setIsLoading(true); // Set loading state

      axios
        .get(BASE_URL + "/userProfile/fetchInfo", {
          params: { userId: decoded.id },
        })
        .then((res) => {
          setName(res.data[0].col_Fname);
          setCnum(res.data[0].col_phone);
          setEmail(res.data[0].col_email);
          setRole(res.data[0].userRole.col_rolename);
          setAddress(res.data[0].col_address);
          setUsername(res.data[0].col_username);
          setproductImages(res.data[0].image);
        })
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false));
    }
  }, []);

  const [productImages, setproductImages] = useState("");
  const fileInputRef = useRef(null);

  const onFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    const maxSize = 5 * 1024 * 1024;
    if (
      selectedFile &&
      allowedTypes.includes(selectedFile.type) &&
      selectedFile.size <= maxSize
    ) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        setproductImages(base64String);
      };
    } else {
      swal({
        icon: "error",
        title: "File Selection Error",
        text: "Please select a valid image file (PNG, JPEG, JPG, or WEBP) with a maximum size of 5MB.",
      });
    }
  };

  const handleUpdate = async () => {
    swal({
      title: "Are you sure?",
      text: "You are about to update your information. You will be logged out after some changes",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (yes) => {
      if (yes) {
        try {
          const response = await axios.put(BASE_URL + `/userProfile/update`, {
            // Set headers for multipart/form-data requests
            productImages,
            userID: userId,
            name,
            address,
            username,
            cnum,
            email,
          });

          if (response.status === 200) {
            swal({
              title: "Information successfully updated",
              text: "",
              icon: "success",
              button: "OK",
            }).then(() => {});
          } else if (response.status === 201) {
            swal({
              title: "Invalid Password",
              text: "Please check your existing password",
              icon: "error",
              button: "OK",
            });
          } else {
            swal({
              icon: "error",
              title: "Something went wrong",
              text: "Please contact our support",
            });
          }
        } catch (err) {
          console.error(err);
          swal({
            icon: "error",
            title: "Something went wrong",
            text: "Please contact our support",
          });
        }
      } else {
        swal({
          title: "Cancelled",
          text: "Information was not updated",
          icon: "warning",
        });
      }
    });
  };

  const handleUpdatePassword = async () => {
    swal({
      title: "Are you sure?",
      text: "You are about to update your information. You will be logged out after some changes",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (yes) => {
      if (yes) {
        try {
          const passwordValidationRegex =
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{8,}$/;

          // Assuming newPass contains the password
          const isValidPassword = passwordValidationRegex.test(newPass);

          if (!isValidPassword) {
            swal({
              title: "Weak Password",
              text: "Your password must be strong: 8+ characters, uppercase, lowercase, and at least one digit.",
              icon: "error",
              buttons: true,
              dangerMode: true,
            });
          } else if (newPass != newPass2) {
            swal({
              title: "Password not matched",
              text: "",
              icon: "error",
              buttons: true,
              dangerMode: true,
            });
          } else {
            const response = await axios.put(
              BASE_URL + `/userProfile/updatePassword`,
              {
                // Set headers for multipart/form-data requests
                newPass,
                userID: userId,
              }
            );

            if (response.status === 200) {
              swal({
                title: "Information successfully updated",
                text: "You will be force to logout",
                icon: "success",
                button: "OK",
              }).then(() => {
                localStorage.removeItem("accessToken");
                axios
                  .post(`${BASE_URL}/masterList/logout`, {
                    userId,
                  })
                  .then((res) => {
                    if (res.status === 200) {
                      swal({
                        text: "Logged Out!",
                        icon: "success",
                        button: "OK",
                      }).then(() => {});
                      navigate("/");
                    }
                  })
                  .catch((error) => {
                    console.error(error.response.data);
                    swal({
                      title: "Something Went Wrong",
                      text: "Please contact our support team",
                      icon: "error",
                    }).then(() => {});
                  });
              });
            } else if (response.status === 201) {
              swal({
                title: "Invalid Password",
                text: "Please check your existing password",
                icon: "error",
                button: "OK",
              });
            } else {
              swal({
                icon: "error",
                title: "Something went wrong",
                text: "Please contact our support",
              });
            }
          }
        } catch (err) {
          console.error(err);
          swal({
            icon: "error",
            title: "Something went wrong",
            text: "Please contact our support",
          });
        }
      } else {
        swal({
          title: "Cancelled",
          text: "Information was not updated",
          icon: "warning",
        });
      }
    });
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const [isValidPass, setIsValidPass] = useState(false);
  const handleVerify = async () => {
    if (currentPass === "") {
      swal({
        title: "Password missing",
        text: "Please input your current password",
        icon: "warning",
      });
    } else {
      await axios
        .post(`${BASE_URL}/userProfile/verifyPassword`, {
          userId,
          currentPass,
        })
        .then((res) => {
          if (res.status === 200) {
            setIsValidPass(true);
          } else if (res.status === 201) {
            swal({
              text: "Invalid Password",
              icon: "error",
              button: "OK",
            }).then(() => {
              // navigate('/');
            });
          }
        })
        .catch((error) => {
          console.error(error.response.data);
          swal({
            title: "Something Went Wrong",
            text: "Please contact our support team",
            icon: "error",
          }).then(() => {});
        });
    }
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
    setIsValidPass(false);
    setCurrentPass("");
    setNewPass("");
    setNewPass2("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
        <div className="right-body-contentss">
          <h1>Profile Settings</h1>

          <div
            className="gen-info"
            style={{
              fontSize: "20px",
              position: "relative",
              marginTop: "10px",
            }}
          >
            Profile Info
            <span
              style={{
                position: "absolute",
                height: "0.5px",
                width: "-webkit-fill-available",
                background: "#FFA500",
                top: "81%",
                left: "10rem",
                transform: "translateY(-50%)",
              }}
            ></span>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <Form.Group className="mb-4">
                <Form.Label style={{ fontSize: "20px" }}>
                  Full Name:{" "}
                </Form.Label>
                <Form.Control
                  type="text"
                  style={{ height: "40px", fontSize: "15px" }}
                  readOnly={!isEditMode}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label style={{ fontSize: "20px" }}>UserName: </Form.Label>
                <Form.Control
                  type="text"
                  style={{ height: "40px", fontSize: "15px" }}
                  readOnly={!isEditMode}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label style={{ fontSize: "20px" }}>Address: </Form.Label>
                <Form.Control
                  type="text"
                  style={{ height: "40px", fontSize: "15px" }}
                  readOnly={!isEditMode}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Form.Group>
            </div>

            <div className="col-6 d-flex align-items-center justify-content-center">
              <div
                className="col-6 d-flex align-items-center justify-content-center"
                style={{
                  width: "270px",
                  height: "270px",
                }}
              >
                <Image
                  className=""
                  style={{
                    width: "90%",
                    height: "90%",
                  }}
                  src={`data:image/png;base64,${productImages}`}
                  roundedCircle
                />
              </div>

              {isEditMode ? (
                <input
                  name="file"
                  type="file"
                  className="file"
                  ref={fileInputRef}
                  onChange={(e) => onFileSelect(e)}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="row mt-3">
            {/* <div className="col-6">
               
              </div> */}
          </div>
          <div className="row mt-3">
            <div className="col-4">
              <Form.Group>
                <Form.Label style={{ fontSize: "20px" }}>
                  Contact Number:{" "}
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Contact Number..."
                  style={{ height: "40px", fontSize: "15px" }}
                  readOnly={!isEditMode}
                  value={cnum}
                  onChange={(e) => setCnum(e.target.value)}
                  onKeyDown={(e) => {
                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
                  }}
                />
              </Form.Group>
            </div>
            <div className="col-4">
              <Form.Group>
                <Form.Label style={{ fontSize: "20px" }}>Email: </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Email..."
                  style={{ height: "40px", fontSize: "15px" }}
                  readOnly={!isEditMode}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className="col-4">
              <Form.Group>
                <Form.Label style={{ fontSize: "20px" }}>
                  User Role:{" "}
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="User Role..."
                  style={{ height: "40px", fontSize: "15px" }}
                  readOnly
                  value={role}
                />
              </Form.Group>
            </div>
          </div>
          <div className="save-cancel">
            {!isEditMode ? (
              <>
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
                  type="button"
                  className="btn btn-primary"
                  size="md"
                  style={{ fontSize: "20px", margin: "0px 5px" }}
                  onClick={handleEditClick}
                >
                  Edit
                </Button>
              </>
            ) : (
              // need validation sa password, dapat maka update kahit d mag change n
              <div className="up-container">
                <div className="up-button">
                  <Button
                    type="button"
                    className="btn btn-secondary btn-md"
                    size="md"
                    style={{ fontSize: "20px", margin: "0px 5px" }}
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="btn btn-warning"
                    size="md"
                    style={{ fontSize: "20px", margin: "0px 5px" }}
                    onClick={handleUpdate}
                  >
                    Update
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div
            className="gen-info"
            style={{
              fontSize: "20px",
              position: "relative",
              marginTop: "10px",
            }}
          >
            Change Password
            <span
              style={{
                position: "absolute",
                height: "0.5px",
                width: "-webkit-fill-available",
                background: "#FFA500",
                top: "81%",
                left: "16rem",
                transform: "translateY(-50%)",
              }}
            ></span>
          </div>
          <div className="row">
            <div className="col-6">
              <Form.Group>
                <Form.Label style={{ fontSize: "20px" }}>
                  Current Password:{" "}
                </Form.Label>
                <Form.Control
                  type={showCurrentPassword ? "text" : "password"}
                  required
                  name="cpass"
                  placeholder="Enter your password"
                  style={{ height: "40px", fontSize: "15px" }}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  value={currentPass}
                />
                <div className="show">
                  {showCurrentPassword ? (
                    <FaEyeSlash
                      className="eye"
                      onClick={toggleCurrentPasswordVisibility}
                    />
                  ) : (
                    <FaEye
                      className="eye"
                      onClick={toggleCurrentPasswordVisibility}
                    />
                  )}
                </div>
              </Form.Group>
            </div>
            <div className="col-6 d-flex align-items-center">
              {!isValidPass ? (
                <Button
                  type="button"
                  className="btn btn-warning btn-md"
                  size="md"
                  style={{ fontSize: "20px" }}
                  onClick={handleVerify}
                >
                  Verify
                </Button>
              ) : (
                <></>
              )}
            </div>
          </div>
          {isValidPass ? (
            <div className="row">
              <div className="col-6">
                <Form.Group>
                  <Form.Label style={{ fontSize: "20px" }}>
                    Password:{" "}
                  </Form.Label>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    required
                    name="cpass"
                    placeholder="Enter your password"
                    style={{ height: "40px", fontSize: "15px" }}
                    onChange={(e) => setNewPass(e.target.value)}
                    value={newPass}
                  />
                  <div className="show">
                    {showPassword ? (
                      <FaEyeSlash
                        className="eye"
                        onClick={togglePasswordVisibility}
                      />
                    ) : (
                      <FaEye
                        className="eye"
                        onClick={togglePasswordVisibility}
                      />
                    )}
                  </div>
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group>
                  <Form.Label style={{ fontSize: "20px" }}>
                    Confirm Password:{" "}
                  </Form.Label>
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    name="cpass2"
                    placeholder="Confirm your password"
                    style={{ height: "40px", fontSize: "15px" }}
                    readOnly={!newPass}
                    onChange={(e) => setNewPass2(e.target.value)}
                    value={newPass2}
                  />
                  <div className="show">
                    {showConfirmPassword ? (
                      <FaEyeSlash
                        className="eye"
                        onClick={toggleConfirmPasswordVisibility}
                      />
                    ) : (
                      <FaEye
                        className="eye"
                        onClick={toggleConfirmPasswordVisibility}
                      />
                    )}
                  </div>
                </Form.Group>
              </div>
            </div>
          ) : (
            <></>
          )}

          <div className="save-cancel">
            {!isValidPass ? (
              <></>
            ) : (
              // need validation sa password, dapat maka update kahit d mag change n
              <div className="up-container">
                <div className="reminder">
                  You will be asked to log in again with your new password after
                  you save your changes.
                </div>
                <div className="up-button">
                  <Button
                    type="button"
                    className="btn btn-secondary btn-md"
                    size="md"
                    style={{ fontSize: "20px", margin: "0px 5px" }}
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="btn btn-warning"
                    size="md"
                    style={{ fontSize: "20px", margin: "0px 5px" }}
                    onClick={handleUpdatePassword}
                  >
                    Update Password
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;

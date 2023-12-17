import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function ProfileSettings() {
  const [image, setImage] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);


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

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
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
          <Form>
          <div
            className="gen-info"
            style={{ fontSize: '20px', position: 'relative', marginTop: '10px' }}
          >
            Profile Info
            <span
              style={{
                position: 'absolute',
                height: '0.5px',
                width: '-webkit-fill-available',
                background: '#FFA500',
                top: '81%',
                left: '10rem',
                transform: 'translateY(-50%)',
              }}
            ></span>
          </div>
            <div className="row mt-3">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: '20px' }}>First Name: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter First Name..."
                    style={{ height: '40px', fontSize: '15px' }}
                    disabled={!isEditMode}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: '20px' }}>Last Name: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Last Name..."
                    style={{ height: '40px', fontSize: '15px' }}
                    disabled={!isEditMode}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: '20px' }}>Contact Number: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Contact Number..."
                    style={{ height: '40px', fontSize: '15px' }}
                    disabled={!isEditMode}
                  />
                </Form.Group>
              </div>
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: '20px' }}>Email: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Email..."
                    style={{ height: '40px', fontSize: '15px' }}
                    disabled={!isEditMode}
                  />
                </Form.Group>
              </div>
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: '20px' }}>User Role: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="User Role..."
                    style={{ height: '40px', fontSize: '15px' }}
                    disabled={!isEditMode}
                  />
                </Form.Group>
              </div>
            </div>
          <div
            className="gen-info"
            style={{ fontSize: '20px', position: 'relative', marginTop: '10px' }}
          >
            Change Password
            <span
              style={{
                position: 'absolute',
                height: '0.5px',
                width: '-webkit-fill-available',
                background: '#FFA500',
                top: '81%',
                left: '16rem',
                transform: 'translateY(-50%)',
              }}
            ></span>
          </div>
              <div className="row">
                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: "20px" }}>
                    Current Password:{" "}
                    </Form.Label>
                    <Form.Control
                      type={showCurrentPassword ? "text" : "password"}
                      required
                      name="cpass"
                      placeholder="Enter your password"
                      style={{ height: "40px", fontSize: "15px" }}
                      disabled={!isEditMode}
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
              </div>
              <div className="row">
                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Password:{" "}
                    </Form.Label>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      required
                      name="cpass"
                      placeholder="Enter your password"
                      style={{ height: "40px", fontSize: "15px" }}
                      disabled={!isEditMode}
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
                  <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Confirm Password:{" "}
                    </Form.Label>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      name="cpass2"
                      placeholder="Confirm your password"
                      style={{ height: "40px", fontSize: "15px" }}
                    disabled={!isEditMode}
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

            <div className="save-cancel">
          {!isEditMode ? (
            <>
            <Link
                to='/dashboard'
                type="button"
                className="btn btn-secondary btn-md"
                size="md"
                style={{ fontSize: '20px', margin: '0px 5px' }}
              >
                Cancel</Link>
            <Button
              type="button"
              className="btn btn-primary"
              size="md"
              style={{ fontSize: '20px', margin: '0px 5px' }}
              onClick={handleEditClick}
            >
              Edit
            </Button>
            </>
          ) : (
            <div className='up-container'>
              <div className="reminder">You will be asked to log in again with your new password after you save your changes.</div>
              <div className="up-button">
              <Button
                type="button"
                className="btn btn-secondary btn-md"
                size="md"
                style={{ fontSize: '20px', margin: '0px 5px' }}
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="btn btn-warning"
                size="md"
                style={{ fontSize: '20px', margin: '0px 5px' }}
              >
                Update
              </Button>
              </div>
            </div>
          )}
        </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;



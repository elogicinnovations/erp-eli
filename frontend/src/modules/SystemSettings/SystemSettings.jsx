import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function SystemSettings() {
  const [image, setImage] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

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
    // You may want to reset form values or handle other cleanup tasks here
  };
  
  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
        <div className="right-body-contentss">
          <h1>Settings</h1>
          <div
            className="gen-info"
            style={{ fontSize: '20px', position: 'relative', marginTop: '10px' }}
          >
            Company Profile
            <span
              style={{
                position: 'absolute',
                height: '0.5px',
                width: '-webkit-fill-available',
                background: '#FFA500',
                top: '81%',
                left: '15rem',
                transform: 'translateY(-50%)',
              }}
            ></span>
          </div>
          <Form>
            <div className="row mt-3">
              <div className="col-9">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: '20px' }}>Company: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    style={{ height: '40px', fontSize: '15px' }}
                    disabled={!isEditMode}
                  />
                </Form.Group>
              </div>
              <div className="col-3">
                <Form.Group className='logo'>
                  <Form.Label style={{ fontSize: '15px', position: 'absolute', left:'10px' }}>Company Logo: </Form.Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="logoInput"
                    disabled={!isEditMode}
                  />
                  <label htmlFor="logoInput" style={{ cursor: 'pointer' }}>
                    <div
                      style={{
                        marginTop: '20px',
                        width: '200px',
                        height: '200px',
                        border: 'solid 1px gray',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        position: 'relative',
                        backgroundColor: '#eee',
                      }}
                    >
                      {image ? (
                        <img
                          src={image}
                          alt="Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            color: '#555',
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
            style={{ fontSize: '20px', position: 'relative', marginTop: '10px' }}
          >
            Contact and Location
            <span
              style={{
                position: 'absolute',
                height: '0.5px',
                width: '-webkit-fill-available',
                background: '#FFA500',
                top: '81%',
                left: '19rem',
                transform: 'translateY(-50%)',
              }}
            ></span>
          </div>
            <div className="row mt-3">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: '20px' }}>Phone Number: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Phone Number..."
                    style={{ height: '40px', fontSize: '15px' }}
                    disabled={!isEditMode}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
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
            </div>
            <div className="row mt-3">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: '20px' }}>Building / Street: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Building or Street..."
                    style={{ height: '40px', fontSize: '15px' }}
                    disabled={!isEditMode}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: '20px' }}>Barangay: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Barangay..."
                    style={{ height: '40px', fontSize: '15px' }}
                    disabled={!isEditMode}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: '20px' }}>City: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter City..."
                    style={{ height: '40px', fontSize: '15px' }}
                    disabled={!isEditMode}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: '20px' }}>Zipcode: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Zipcode..."
                    style={{ height: '40px', fontSize: '15px' }}
                    disabled={!isEditMode}
                  />
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
            <>
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
            </>
          )}
        </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SystemSettings;



import React, { useEffect, useState, useRef } from "react";
import ReactLoading from "react-loading";
import "../styles/react-style.css";
import "../../assets/global/style.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import NoData from "../../assets/image/NoData.png";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../assets/global/url";
import { jwtDecode } from "jwt-decode";
import DatePicker from "react-datepicker";
import usePagination from "@mui/material/usePagination";
import swal from "sweetalert";
import Carousel from "react-bootstrap/Carousel";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import CameraComponent from "./../../assets/components/camera.jsx";

import {
  Plus,
  MagnifyingGlass,
  UserPlus,
  Envelope,
  ArrowBendUpLeft,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import Modal from "react-bootstrap/Modal";

function WhiteBoard() {
  const [userId, setuserId] = useState("");
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

  const [show, setShow] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [masterlist, setMasterlist] = useState([]);
  const [post, setPost] = useState([]);
  const [originalPost, setOriginalPost] = useState([]);
  const [replyPost, setReplyPost] = useState([]);
  const [selectedtoSend, setSelectedtoSend] = useState([]);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [updateSubject, setUpdateSubject] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [reply, setReply] = useState("");
  const [board_idReply, setBoard_idReply] = useState("");
  const [validated, setValidated] = useState(false);
  const [productImages, setproductImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReply, setIsLoadingReply] = useState(true);

  const handleClose = () => {
    setShow(false);
    reloadMaster();
    setSelectedtoSend([]);
    setValidated(false);
    setproductImages([]);
    setShowReply(false);
    setShowEdit(false);
  };
  const handleShow = () => setShow(true);

  const reloadMaster = () => {
    axios
      .get(BASE_URL + "/board/fetchmasterlist") //users only
      .then((res) => {
        setMasterlist(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const reloadPost = () => {
    const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/board/fetchPost")
        .then((res) => {
          setPost(res.data);
          setOriginalPost(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
        });
    }, 1000);

    return () => clearTimeout(delay);
  };

  const reloadReply = (post_id) => {
    setIsLoadingReply(true);
    const delay = setTimeout(() => {
      const board_id = post_id;
      setBoard_idReply(board_id);
      setShowReply(true);
      axios
        .get(BASE_URL + "/board/fetchPostReply", {
          params: {
            board_id,
          },
        })
        .then((res) => {
          setReplyPost(res.data);
          setIsLoadingReply(false);
        })
        .catch((err) => {
          console.error(err);
        });
    }, 1000);

    return () => clearTimeout(delay);
  };

  useEffect(() => {
    reloadMaster();

    reloadPost();
  }, []);

  console.log(post);

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
      swal({
        title: "Are you sure?",
        text: "You want to post this message",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (yes) => {
        if (yes) {
          try {
            axios
              .post(BASE_URL + "/board/post", {
                selectedtoSend,
                message,
                subject,
                userId,
                productImages,
              })
              .then((res) => {
                if (res.status === 200) {
                  swal({
                    icon: "success",
                    title: "Posted",
                    text: "Your Message has successfully posted",
                  }).then(() => {
                    handleClose();
                    reloadPost();
                  });
                }
                // setMasterlist(res.data);
              })
              .catch((err) => {
                console.error(err);
              });
          } catch (error) {
            console.error(error);
          }
        }
      });
    }

    setValidated(true); // for validations
  };

  const replySubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      swal({
        icon: "error",
        title: "Field is required",
        text: "Please fill the red text field",
      });
    } else {
      swal({
        title: "Are you sure?",
        text: "You want to reply this post",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (yes) => {
        if (yes) {
          try {
            axios
              .post(BASE_URL + "/board/post_reply", {
                reply,
                userId,
                board_idReply,
              })
              .then((res) => {
                if (res.status === 200) {
                  swal({
                    icon: "success",
                    title: "Posted",
                    text: "You Successfully replied this post",
                  }).then(() => {
                    setReply("");
                    reloadPost();
                    handleClose();
                  });
                }
                // setMasterlist(res.data);
              })
              .catch((err) => {
                console.error(err);
              });
          } catch (error) {
            console.error(error);
          }
        }
      });
    }

    setValidated(true); // for validations
  };

  const postUpdate = async (e) => {
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
      swal({
        title: "Are you sure?",
        text: "You want to update this post",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (yes) => {
        if (yes) {
          try {
            axios
              .post(BASE_URL + "/board/updatePost", {
                updateMessage,
                updateSubject,
                board_idReply,
              })
              .then((res) => {
                if (res.status === 200) {
                  swal({
                    icon: "success",
                    title: "Post Updated",
                    text: "You Successfully updated this post",
                  }).then(() => {
                    setBoard_idReply("");
                    reloadPost();
                    handleClose();
                  });
                }
                // setMasterlist(res.data);
              })
              .catch((err) => {
                console.error(err);
              });
          } catch (error) {
            console.error(error);
          }
        }
      });
    }

    setValidated(true); // for validations
  };

  const handleCheckClick = (data) => {
    setSelectedtoSend((prevSelectedItems) => [
      ...prevSelectedItems,
      { col_id: data.col_id, col_Fname: data.col_Fname },
    ]);

    setMasterlist((prevMasterlist) =>
      prevMasterlist.filter((item) => item.col_id !== data.col_id)
    );
  };

  const handleDelete = (id) => {
    const board_id = id;

    swal({
      title: "Delete this post?",
      text: "Post cannot be retrieved",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (yes) => {
      if (yes) {
        try {
          axios
            .post(BASE_URL + "/board/deletePost", {
              board_id,
            })
            .then((res) => {
              if (res.status === 200) {
                swal({
                  icon: "success",
                  title: "Post Deleted",
                  text: "You Successfully deleted this post",
                }).then(() => {
                  reloadPost();
                });
              }
              // setMasterlist(res.data);
            })
            .catch((err) => {
              console.error(err);
            });
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  const handleEdit = (id) => {
    setShowEdit(true);
    const board_id = id;
    setBoard_idReply(board_id);
    axios
      .get(BASE_URL + "/board/fetchPostEdit", {
        params: {
          board_id,
        },
      })
      .then((res) => {
        setUpdateSubject(res.data[0].subject);
        setUpdateMessage(res.data[0].message);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    // async handle don't delete
    console.log("Selected to Send:", selectedtoSend);
    console.log("Master List:", masterlist);
  }, [selectedtoSend, masterlist]);

  const selectedNames = selectedtoSend.map((item) => item.col_Fname).join(", "); // put the value of array selectedtoSend to To input

  const fileInputRef = useRef(null);

  function selectFiles() {
    fileInputRef.current.click();
  }

  function onFileSelect(event) {
    const files = Array.from(event.target.files);
    handleFiles(files);
  }

  function onDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }

  function onDragLeave(event) {
    event.preventDefault();
  }

  function onDropImages(event) {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    handleFiles(files);
  }

  function handleFiles(files) {
    if (files.length + productImages.length > 5) {
      swal({
        icon: "error",
        title: "File Limit Exceeded",
        text: "You can upload up to 5 images only.",
      });
      return;
    }

    const allowedFileTypes = ["image/jpeg", "image/png", "image/webp"];

    files.forEach((file) => {
      if (!productImages.some((e) => e.name === file.name)) {
        if (!allowedFileTypes.includes(file.type)) {
          swal({
            icon: "error",
            title: "Invalid File Type",
            text: "Only JPEG, PNG, and WebP file types are allowed.",
          });
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          swal({
            icon: "error",
            title: "File Size Exceeded",
            text: "Maximum file size is 5MB.",
          });
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          setproductImages((prevImages) => [
            ...prevImages,
            {
              name: file.name,
              image: e.target.result.split(",")[1],
            },
          ]);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  function deleteImage(index) {
    const updatedImages = [...productImages];
    updatedImages.splice(index, 1);
    setproductImages(updatedImages);
  }

  const handleCapture = (imageData) => {
    if (productImages.length >= 5) {
      swal({
        icon: "error",
        title: "File Limit Exceeded",
        text: "You can upload up to 5 images only.",
      });
      return;
    }
    setproductImages((prevImages) => [...prevImages, imageData]);
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    if (!searchTerm) {
      setPost(originalPost);
      return;
    }

    const filteredData = originalPost.filter((data) => {
      return (
        (data?.postby?.col_Fname?.toLowerCase() || "").includes(searchTerm) ||
        (data?.subject?.toLowerCase() || "").includes(searchTerm) ||
        (data?.message?.toLowerCase() || "").includes(searchTerm) ||
        (formatDatetime(data?.createdAt)?.toLowerCase() || "").includes(
          searchTerm
        )
      );
    });

    setPost(filteredData);
  };

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

  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
        {isLoading ? (
          <div className="loading-container">
            <ReactLoading className="react-loading" type={"bubbles"} />
            Loading Data...
          </div>
        ) : (
          <div className="right-body-contents">
            <div className="row justify-content-center p-3 mb-5">
              <div className="col-4">
                <p className="h1">Messages</p>
              </div>

              <div className="col-4 ">
                <div className="input-group w-100">
                  <input
                    type="text"
                    className="form-control"
                    aria-label="Amount (to the nearest dollar)"
                    onChange={(e) => handleSearch(e)}
                  />
                  <span className="input-group-text">
                    <Button
                      className="float-end pl-2 pr-2"
                      variant="light border border-body"
                    >
                      <MagnifyingGlass size={22} />
                      Search
                    </Button>
                  </span>
                </div>
              </div>
              <div className="col-4">
                <Button
                  className="float-end "
                  size="lg"
                  variant="light border border-body"
                  onClick={handleShow}
                >
                  <Plus size={25} />
                  <span className="h2">New</span>
                </Button>
              </div>
            </div>
            <React.Fragment>
              {post && post.length > 0 ? (
                post.map((data) =>
                  data.tos.length > 0 &&
                  data.tos.some(
                    (to) => to.user_to === userId || data.postBy === userId
                  ) ? (
                    <div key={data.id} className="card mb-5 bg-light">
                      <div className="d-flex flex-direction-row  w-100 p-0 align-items-center">
                        <div className="w-75 ">
                          <div className="d-flex flex-direction-row align-items-center w-100 p-0">
                            <div className="mr-5">
                              <Envelope size={82} color="#1815ac" />
                            </div>

                            <div className="d-flex flex-column">
                              <span className="h3 text-muted">
                                {data.postby.col_Fname}
                              </span>
                              <span className="h3 text-muted">
                                {formatDatetime(data.createdAt)}
                              </span>
                              <span className="h3 text-muted">{`SUBJECT: ${data.subject}`}</span>
                            </div>
                          </div>
                        </div>

                        <div className="w-25 ">
                          {data.postBy === userId && (
                            <DropdownButton
                              className="float-end"
                              variant="link"
                              id="dropdown-basic-button"
                              title="Action"
                            >
                              <Dropdown.Item
                                style={{ fontSize: "20px" }}
                                onClick={(e) => handleEdit(data.id)}
                              >
                                Edit
                              </Dropdown.Item>
                              <Dropdown.Item
                                style={{ fontSize: "20px" }}
                                onClick={(e) => handleDelete(data.id)}
                              >
                                Delete
                              </Dropdown.Item>
                            </DropdownButton>
                          )}
                        </div>
                      </div>

                      {/* message text */}

                      <span className="h2">{data.message}</span>
                      {data.pictures.length > 0 && (
                        <div className="card">
                          <div className="card-body">
                            <Carousel
                              data-bs-theme="dark"
                              interval={3000}
                              wrap={true}
                              className="custom-carousel"
                            >
                              {data.pictures.map((pic, index) => (
                                <Carousel.Item key={index}>
                                  <img
                                    className=""
                                    style={{
                                      width: "auto",
                                      height: "auto",
                                      margin: "auto",
                                      display: "block",
                                      maxHeight: "250px",
                                      minHeight: "250px",
                                    }}
                                    src={`data:image/png;base64,${pic.image}`}
                                    alt={`subpart-img-${pic.id}`}
                                  />
                                  <Carousel.Caption>
                                    {/* Caption content */}
                                  </Carousel.Caption>
                                </Carousel.Item>
                              ))}
                            </Carousel>
                          </div>
                        </div>
                      )}
                      <div className="card-footer">
                        <Button
                          variant="link"
                          onClick={(e) => reloadReply(data.id)}
                          className="float-end mr-3"
                        >
                          <span className="h3">Reply</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="no-data">
                      <img src={NoData} alt="NoData" className="no-data-img" />
                      <h3>No Data Found</h3>
                    </div>
                  )
                )
              ) : (
                <div className="no-data">
                  <img src={NoData} alt="NoData" className="no-data-img" />
                  <h3>No Data Found</h3>
                </div>
              )}
            </React.Fragment>

            <Modal
              show={show}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
              size="xl"
            >
              <Modal.Header closeButton>
                <Modal.Title>New Message</Modal.Title>
              </Modal.Header>
              <Form noValidate validated={validated} onSubmit={add}>
                <Modal.Body>
                  <div className="row">
                    <div className="col-5  mb-5 h-100">
                      <p className="h2">User List:</p>
                      <div className="input-group w-100 mb-3">
                        <span className="input-group-text">
                          <UserPlus size={22} />
                        </span>
                        <Form.Control
                          type="text"
                          required
                          value={selectedNames}
                          placeholder="To: "
                        />
                      </div>

                      <div
                        className="container-sm bg-body border border-light overflow-y-scroll bg-primary"
                        style={{ height: 400, maxHeight: 400 }}
                      >
                        {masterlist.map((data) => (
                          <React.Fragment>
                            <div
                              key={data.col_id}
                              className="d-flex w-100 border-bottom justify-content-center align-items-center"
                            >
                              <div className="w-50">
                                <div
                                  className="d-flex flex-column float-start"
                                  style={{ maxWidth: "100%" }}
                                >
                                  <span
                                    className="h3 w-100"
                                    style={{
                                      wordWrap: "break-word",
                                      overflowWrap: "break-word",
                                    }}
                                  >
                                    {data.col_Fname}
                                  </span>
                                </div>
                              </div>

                              <div className="w-50">
                                <Button
                                  className="float-end"
                                  onClick={() => handleCheckClick(data)}
                                  variant="light"
                                >
                                  <Plus size={20} color="#bb2a2a" />
                                </Button>
                              </div>
                            </div>
                            <br />
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <div className="col-7 bg-light p-4 h-100">
                      <div className="mb-5">
                        <p className="h2">Subject</p>
                        <Form.Control
                          required
                          placeholder="Subject..."
                          type="text"
                          onChange={(e) => setSubject(e.target.value)}
                        />
                      </div>

                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label
                          style={{
                            fontSize: "20px",
                            fontFamily: "Poppins, Source Sans Pro",
                          }}
                        >
                          New Message{" "}
                        </Form.Label>
                        <Form.Control
                          // onChange={(e) => setRemarks(e.target.value)}
                          placeholder="Leave a message here"
                          as="textarea"
                          rows={3}
                          required
                          onChange={(e) => setMessage(e.target.value)}
                          style={{
                            fontFamily: "Poppins, Source Sans Pro",
                            fontSize: "16px",
                            height: "225px",
                            maxHeight: "225px",
                            resize: "none",
                            overflowY: "auto",
                          }}
                        />
                      </Form.Group>
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <div
                          className="card"
                          style={{ border: "none", alignItems: "center" }}
                        >
                          <div
                            className="drag-area"
                            style={{ width: "70%" }}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDropImages}
                          >
                            <p style={{ fontSize: 11 }}>
                              Drag & Drop image here or{" "}
                              <span
                                className="select"
                                role="button"
                                onClick={selectFiles}
                              >
                                <p style={{ fontSize: 11 }}>Browse</p>
                              </span>
                            </p>
                            <input
                              name="file"
                              type="file"
                              className="file"
                              multiple
                              ref={fileInputRef}
                              onChange={onFileSelect}
                            />
                          </div>
                          <CameraComponent onCapture={handleCapture} />
                          <div
                            className="ccontainerss"
                            style={{
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {productImages.map((image, index) => (
                              <div key={index} className="mt-2">
                                <span
                                  className="fs-3"
                                  style={{ marginLeft: 20 }}
                                  onClick={() => deleteImage(index)}
                                >
                                  &times;
                                </span>
                                <img
                                  style={{
                                    width: 60,
                                    height: 60,
                                    marginLeft: 10,
                                  }}
                                  src={`data:image/png;base64,${image.image}`}
                                  alt={`Sub Part ${image.product_id}`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    size="lg"
                    type="button"
                    variant="secondary fs-5"
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                  <Button type="submit" size="lg" variant="primary fs-5">
                    Post
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>

            <Modal
              show={showReply}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
              size="xl"
            >
              <Form noValidate validated={validated} onSubmit={replySubmit}>
                <Modal.Header closeButton>
                  <Modal.Title style={{ fontSize: "24px" }}>
                    Reply Thread
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {isLoadingReply ? (
                    <div className="loading-container">
                      <ReactLoading
                        className="react-loading"
                        type={"bubbles"}
                      />
                      Loading Data...
                    </div>
                  ) : (
                    <React.Fragment>
                      {replyPost && replyPost.length > 0 ? (
                        replyPost.map((data) => (
                          <React.Fragment>
                            {/* <span className="h2">{`${data.source} `}</span> */}
                            <div className="d-flex w-100 border-bottom justify-content-center align-items-center">
                              <ArrowBendUpLeft
                                size={55}
                                className="mr-3"
                                color="#066ff9"
                              />
                              <div className="w-50">
                                <div
                                  className="d-flex flex-column float-start"
                                  style={{ maxWidth: "100%" }}
                                >
                                  <span
                                    className="h3 w-100"
                                    style={{
                                      wordWrap: "break-word",
                                      overflowWrap: "break-word",
                                    }}
                                  >{`"${data.message}"`}</span>
                                  <span className="h4 text-muted">{`BY: ${data.replyfrom.col_Fname}}`}</span>
                                </div>
                              </div>

                              <div className="w-50">
                                <div className="d-flex flex-column float-end">
                                  <span className="h3">
                                    {formatDatetime(data.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <br />
                          </React.Fragment>
                        ))
                      ) : (
                        <React.Fragment>
                          <div className="no-data">
                            <img
                              src={NoData}
                              alt="NoData"
                              className="no-data-img"
                            />
                            <h3>No Data Found</h3>
                          </div>
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <div className="input-group w-100 border-bottom-secondary">
                    <Form.Control
                      type="text"
                      as="textarea"
                      style={{ fontSize: "2em" }}
                      onChange={(e) => setReply(e.target.value)}
                      required
                    />
                    <span className="input-group-text border border-body">
                      <Button
                        className="float-end pl-2 pr-2"
                        variant="light border border-body"
                        type="submit"
                      >
                        <PaperPlaneTilt size={30} color="#066ff9" />
                      </Button>
                    </span>
                  </div>
                </Modal.Footer>
              </Form>
            </Modal>

            <Modal
              show={showEdit}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
              size="xl"
            >
              <Form noValidate validated={validated} onSubmit={postUpdate}>
                <Modal.Header closeButton>
                  <Modal.Title style={{ fontSize: "24px" }}>
                    Update Post
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group
                    controlId="exampleForm.ControlInput1"
                    className="w-50"
                  >
                    <Form.Label className="h2">Subject: </Form.Label>

                    <Form.Control
                      onChange={(e) => setUpdateSubject(e.target.value)}
                      placeholder="Enter details"
                      style={{ fontSize: "20px" }}
                      value={updateSubject}
                    />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label className="h2">Message: </Form.Label>

                    <Form.Control
                      as="textarea"
                      onChange={(e) => setUpdateMessage(e.target.value)}
                      placeholder="Enter details"
                      style={{ fontSize: "20px" }}
                      value={updateMessage}
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button type="submit" variant="warning">
                    Update Post
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>
          </div>
        )}
      </div>
    </div>
  );
}

export default WhiteBoard;

import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import NoData from "../../assets/image/NoData.png";
import NoAccess from "../../assets/image/NoAccess.png";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar/sidebar";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import BASE_URL from "../../assets/global/url";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Form from "react-bootstrap/Form";
import swal from "sweetalert";
import Button from "react-bootstrap/Button";
import { jwtDecode } from "jwt-decode";
import { Plus } from "@phosphor-icons/react";
import { IconButton, TextField } from "@mui/material";
import SBFLOGO from "../../../src/assets/image/SBFLogo.jpg";
import Header from "../../partials/header";
import Table from "react-bootstrap/Table";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Inventory = ({ activeTab, onSelect, authrztn }) => {
  const navigate = useNavigate();
  const [issuance, setIssuance] = useState([]);
  const [searchIssuance, setSearchIssuance] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [inventoryFilter, setInventoryFilter] = useState("All");
  const [searchInventory, setSearchInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setuserId] = useState("");
  const [isPrintDisabled, setIsPrintDisabled] = useState(true);
  const [issuanceExpirationStatus, setIssuanceExpirationStatus] = useState({});
  const [showPreview, setshowPreview] = useState(false);
  const [ApprovedIssue, setApprovedIssue] = useState([]);
  const [IssuedBy, setIssuedBy] = useState("");
  const [ReceivedBy, setReceivedBy] = useState("");
  const [ApprovedBy, setApprovedBy] = useState("");
  const [currentPageissuance, setCurrentPageIssuance] = useState(1);
  const pageIssuanceSize = 10;

  const totalPagesIssuance = Math.ceil(
    searchIssuance.length / pageIssuanceSize
  );
  const startIndexIssuance = (currentPageissuance - 1) * pageIssuanceSize;
  const endIndexIssuance = Math.min(
    startIndexIssuance + pageIssuanceSize,
    searchIssuance.length
  );
  const currentItemsIssuance = searchIssuance.slice(
    startIndexIssuance,
    endIndexIssuance
  );
  const MAX_PAGES_ISSUANCE = 5;

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPagesInventory = Math.ceil(searchInventory.length / pageSize);
  const startIndexInventory = (currentPage - 1) * pageSize;
  const endIndexInventory = Math.min(
    startIndexInventory + pageSize,
    searchInventory.length
  );
  const currentItemsInventory = searchInventory.slice(
    startIndexInventory,
    endIndexInventory
  );

  const maxTotalPages = Math.max(totalPagesInventory);
  const MAX_PAGES = 5;

  //inventory pagination
  const generatePages = () => {
    const pages = [];
    let startPage = 1;
    let endPage = maxTotalPages;

    if (maxTotalPages > MAX_PAGES) {
      const half = Math.floor(MAX_PAGES / 2);
      if (currentPage <= half + 1) {
        endPage = MAX_PAGES;
      } else if (currentPage >= maxTotalPages - half) {
        startPage = maxTotalPages - MAX_PAGES + 1;
      } else {
        startPage = currentPage - half;
        endPage = currentPage + half;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (startPage > 1) {
      pages.unshift("...");
    }
    if (endPage < maxTotalPages) {
      pages.push("...");
    }

    return pages;
  };

  const handlePageClick = (page) => {
    if (page === "...") return;
    setCurrentPage(page);
  };

  //Issuance Pagination
  const generatePagesIssuance = () => {
    const pages = [];
    let startPageIssuance = 1;
    let endPageIssuance = totalPagesIssuance;

    if (totalPagesIssuance > MAX_PAGES_ISSUANCE) {
      const half = Math.floor(MAX_PAGES_ISSUANCE / 2);
      if (currentPageissuance <= half + 1) {
        endPageIssuance = MAX_PAGES_ISSUANCE;
      } else if (currentPageissuance >= totalPagesIssuance - half) {
        startPageIssuance = totalPagesIssuance - MAX_PAGES_ISSUANCE + 1;
      } else {
        startPageIssuance = currentPageissuance - half;
        endPageIssuance = currentPageissuance + half;
      }
    }

    for (let i = startPageIssuance; i <= endPageIssuance; i++) {
      pages.push(i);
    }

    if (startPageIssuance > 1) {
      pages.unshift("...");
    }
    if (endPageIssuance < totalPagesIssuance) {
      pages.push("...");
    }

    return pages;
  };

  const handlePageClickIssuance = (page) => {
    if (page === "...") return;
    setCurrentPageIssuance(page);
  };

  useEffect(() => {
    // Fetch issuances and calculate expiration status
    axios
      .get(BASE_URL + "/issuance/getIssuance")
      .then((res) => {
        const now = new Date();
        const expirationStatus = {};
        res.data.forEach((issuance) => {
          const createdAt = new Date(issuance.createdAt);
          const threeDaysAgo = new Date(now);
          threeDaysAgo.setDate(now.getDate() - 3);
          expirationStatus[issuance.issuance_id] = createdAt < threeDaysAgo;
        });
        setIssuanceExpirationStatus(expirationStatus);
        setIssuance(res.data);

        const hasApproved = res.data.some((item) => item.status === "Approved");
        setIsPrintDisabled(!hasApproved);
      })
      .catch((err) => console.log(err));
  }, []);

  const reloadTable_inventory = () => {
    const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/inventory/fetchInventory_group")
        .then((res) => {
          setInventory(res.data.product);
          setSearchInventory(res.data.product);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }, 1000);

    return () => clearTimeout(delay);
  };

  useEffect(() => {
    reloadTable_inventory();
  }, []);

  const handleSearch = (event) => {
    setCurrentPage(1);
    const searchTerm = event.target.value.toLowerCase();
  
    if (searchTerm === '') {
      setSearchInventory(inventory); // Reset to the original data when the search term is empty
    } else {
      const filtered = inventory.filter((data) => {
        return (
          (data.product_code?.toString().toLowerCase() || "").includes(searchTerm) ||
          (data.product_name?.toString().toLowerCase() || "").includes(searchTerm) ||
          (data.UOM?.toString().toLowerCase() || "").includes(searchTerm) ||
          (data.Category?.toString().toLowerCase() || "").includes(searchTerm) ||
          (data.totalQuantity?.toString().toLowerCase() || "").includes(searchTerm)
        );
      });
      setSearchInventory(filtered);
    }
  };
  

  const handleSearchIssuance = (event) => {
    setCurrentPageIssuance(1);
    const searchTermIssuance = event.target.value.toLowerCase();
    const filteredDataIssuance = searchIssuance.filter((data) => {
      return (
        data.cost_center.name.toLowerCase().includes(searchTermIssuance) ||
        data.from_site.toLowerCase().includes(searchTermIssuance) ||
        formatDatetime(data.createdAt)
          .toLowerCase()
          .includes(searchTermIssuance) ||
        data.masterlist.col_Fname.toLowerCase().includes(searchTermIssuance) ||
        data.mrs.toLowerCase().includes(searchTermIssuance)
      );
    });

    setIssuance(filteredDataIssuance);
  };

  const isReturnButtonDisabled = (createdAt) => {
    const currentDate = new Date();
    const createdDate = new Date(createdAt);

    const differenceInTime = currentDate - createdDate;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    return differenceInDays >= 5;
  };

  // Get Issuance
  useEffect(() => {
    axios
      .get(BASE_URL + "/issuance/getIssuance")
      .then((res) => {
        setIssuance(res.data);
        setSearchIssuance(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const { id } = useParams();
  const [returned_prd, setReturned_prd] = useState([]);
  const [searchReturnPrd, setSearchReturnprd] = useState([]);
  const [returned_asm, setReturned_asm] = useState([]);
  const [searchReturnasm, setSearchReturnasm] = useState([]);
  const [returned_spare, setReturned_spare] = useState([]);
  const [searchReturnspare, setSearchReturnspare] = useState([]);
  const [returned_subpart, setReturned_subpart] = useState([]);
  const [searchReturnsubpart, setSearchReturnsubpart] = useState([]);
  const [currentPageReturn, setCurrentPageReturn] = useState(1);
  const pageSizeReturn = 10;

  const totalPagesReturnProd = Math.ceil(
    searchReturnPrd.length / pageSizeReturn
  );
  const startIndexReturnProd = (currentPageReturn - 1) * pageSizeReturn;
  const endIndexReturnProd = Math.min(
    startIndexReturnProd + pageSizeReturn,
    searchReturnPrd.length
  );
  const currentItemsReturnProd = searchReturnPrd.slice(
    startIndexReturnProd,
    endIndexReturnProd
  );

  const totalPagesReturnAsm = Math.ceil(
    searchReturnasm.length / pageSizeReturn
  );
  const startIndexReturnAsm = (currentPageReturn - 1) * pageSizeReturn;
  const endIndexReturnAsm = Math.min(
    startIndexReturnAsm + pageSizeReturn,
    searchReturnasm.length
  );
  const currentItemsReturnAsm = searchReturnasm.slice(
    startIndexReturnAsm,
    endIndexReturnAsm
  );

  const totalPagesReturnSpare = Math.ceil(
    searchReturnspare.length / pageSizeReturn
  );
  const startIndexReturnSpare = (currentPageReturn - 1) * pageSizeReturn;
  const endIndexReturnSpare = Math.min(
    startIndexReturnSpare + pageSizeReturn,
    searchReturnspare.length
  );
  const currentItemsReturnSpare = searchReturnspare.slice(
    startIndexReturnSpare,
    endIndexReturnSpare
  );

  const totalPagesReturnSubpart = Math.ceil(
    searchReturnsubpart.length / pageSizeReturn
  );
  const startIndexReturnSubpart = (currentPageReturn - 1) * pageSizeReturn;
  const endIndexReturnSubpart = Math.min(
    startIndexReturnSubpart + pageSizeReturn,
    searchReturnsubpart.length
  );
  const currentItemsReturnSubpart = searchReturnsubpart.slice(
    startIndexReturnSubpart,
    endIndexReturnSubpart
  );

  const maxReturnTotalPages = Math.max(
    totalPagesReturnProd,
    totalPagesReturnAsm,
    totalPagesReturnSpare,
    totalPagesReturnSubpart
  );
  const MAX_PAGES_RETURN = 5;

  const generatePagesReturn = () => {
    const pages = [];
    let startPageReturn = 1;
    let endPageReturn = maxReturnTotalPages;

    if (maxReturnTotalPages > MAX_PAGES_RETURN) {
      const half = Math.floor(MAX_PAGES_RETURN / 2);
      if (currentPageReturn <= half + 1) {
        endPageReturn = MAX_PAGES_RETURN;
      } else if (currentPageReturn >= maxReturnTotalPages - half) {
        startPageReturn = maxReturnTotalPages - MAX_PAGES_RETURN + 1;
      } else {
        startPageReturn = currentPageReturn - half;
        endPageReturn = currentPageReturn + half;
      }
    }

    for (let i = startPageReturn; i <= endPageReturn; i++) {
      pages.push(i);
    }

    if (startPageReturn > 1) {
      pages.unshift("...");
    }
    if (endPageReturn < maxReturnTotalPages) {
      pages.push("...");
    }

    return pages;
  };

  const handlePageClickReturn = (page) => {
    if (page === "...") return;
    setCurrentPageReturn(page);
  };

  const reloadTable_return = () => {
    axios
      .get(BASE_URL + "/issuedReturn/fetchReturn")
      .then((res) => {
        setReturned_prd(res.data.product);
        setSearchReturnprd(res.data.product);
        setReturned_asm(res.data.assembly);
        setSearchReturnasm(res.data.assembly);
        setReturned_spare(res.data.spare);
        setSearchReturnspare(res.data.spare);
        setReturned_subpart(res.data.subpart);
        setSearchReturnsubpart(res.data.subpart);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    reloadTable_return();
  }, [id]);

  const handleSearchReturn = (event) => {
    setCurrentPageReturn(1);
    const searchTermReturn = event.target.value.toLowerCase();

    const filteredReturnProd = searchReturnPrd.filter(
      (data) =>
        data.inventory_prd.product_tag_supplier.product.product_code
          .toLowerCase()
          .includes(searchTermReturn) ||
        data.inventory_prd.product_tag_supplier.product.product_name
          .toLowerCase()
          .includes(searchTermReturn) ||
        formatDatetime(data.createdAt)
          .toLowerCase()
          .includes(searchTermReturn) ||
        data.status.toLowerCase().includes(searchTermReturn)
    );
    setReturned_prd(filteredReturnProd);

    const filteredReturnAsm = searchReturnasm.filter(
      (data) =>
        data.inventory_assembly.assembly_supplier.assembly.assembly_code
          .toLowerCase()
          .includes(searchTermReturn) ||
        data.inventory_assembly.assembly_supplier.assembly.assembly_name
          .toLowerCase()
          .includes(searchTermReturn) ||
        formatDatetime(data.createdAt)
          .toLowerCase()
          .includes(searchTermReturn) ||
        data.status.toLowerCase().includes(searchTermReturn)
    );
    setReturned_asm(filteredReturnAsm);

    const filteredReturnSpare = searchReturnspare.filter(
      (data) =>
        data.inventory_spare.sparepart_supplier.sparePart.spareParts_code
          .toLowerCase()
          .includes(searchTermReturn) ||
        data.inventory_spare.sparepart_supplier.sparePart.spareParts_name
          .toLowerCase()
          .includes(searchTermReturn) ||
        formatDatetime(data.createdAt)
          .toLowerCase()
          .includes(searchTermReturn) ||
        data.status.toLowerCase().includes(searchTermReturn)
    );
    setReturned_spare(filteredReturnSpare);

    const filteredReturnSubpart = searchReturnsubpart.filter(
      (data) =>
        data.inventory_subpart.subpart_supplier.subPart.subPart_code
          .toLowerCase()
          .includes(searchTermReturn) ||
        data.inventory_subpart.subpart_supplier.subPart.subPart_name
          .toLowerCase()
          .includes(searchTermReturn) ||
        formatDatetime(data.createdAt)
          .toLowerCase()
          .includes(searchTermReturn) ||
        data.status.toLowerCase().includes(searchTermReturn)
    );
    setReturned_subpart(filteredReturnSubpart);
  };

  const handleMoveToInventory = (prmy_id, inventoryID, quantity, type) => {
    swal({
      title: "Are you sure?",
      text: "This will move the item to inventory!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((confirmed) => {
      if (confirmed) {
        console.log(type);
        const types = type;
        const invetory_id = inventoryID;
        const table_quantity = quantity;
        const primary_id = prmy_id;
        axios
          .post(BASE_URL + "/issuedReturn/moveToInventory", {
            invetory_id,
            table_quantity,
            primary_id,
            types,
          })
          .then(() => {
            swal(
              "Success!",
              "Item moved to inventory successfully!",
              "success"
            ).then(() => {
              reloadTable_return(); // Reload only the table for the specific type
              reloadTable_inventory(); // Reload the entire inventory table
            });
          })
          .catch((err) => {
            console.log(err);
            swal(
              "Error!",
              "Failed to move item to inventory. Please try again.",
              "error"
            );
          });
      }
    });
  };

  const handleRetain = (returnId, type) => {
    const currentDate = new Date().toISOString();
    // Show confirmation SweetAlert
    swal({
      title: "Are you sure?",
      text: "This will set the status to Retained!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((confirmed) => {
      if (confirmed) {
        const primaryID = returnId;
        const types = type;
        axios
          .post(BASE_URL + `/issuedReturn/retain`, {
            primaryID,
            types,
            userId,
            date_retained: currentDate,
          })
          .then(() => {
            // Show success SweetAlert
            swal(
              "Success!",
              "Status set to Retained successfully!",
              "success"
            ).then(() => {
              reloadTable_return();
              reloadTable_inventory();
            });
          })
          .catch((err) => {
            console.log(err);
            // Show error SweetAlert if the API call fails
            swal(
              "Error!",
              "Failed to update status to Retained. Please try again.",
              "error"
            );
          });
      }
    });
  };
  const handleFilter = (e) => {
    setIsLoading(true);

    const value = e.target.value;

    setInventoryFilter(value);

    if (value === "All") {
      reloadTable_inventory();
    } else {
      const delay = setTimeout(() => {
        axios
          .get(BASE_URL + "/inventory/fetchInventory_group_filter", {
            params: {
              value,
            },
          })
          .then((res) => {
            setInventory(res.data);
            setSearchInventory(res.data);
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setIsLoading(false);
          });
      }, 1000);

      return () => clearTimeout(delay);
    }
  };

  // useEffect(() => {
  //   // Initialize DataTable when role data is available
  //   if ($('#order-listing').length > 0 && inventory.length > 0) {
  //     $('#order-listing').DataTable();
  //   }
  // }, [inventory]);

  // useEffect(() => {
  //   // Initialize DataTable when role data is available
  //   if ($('#order1-listing').length > 0 && issuance.length > 0) {
  //     $('#order1-listing').DataTable();
  //   }
  // }, [issuance]);

  // useEffect(() => {
  //   // Initialize DataTable when role data is available
  //   if ($('#order2-listing').length > 0 && returned_prd.length > 0) {
  //     $('#order2-listing').DataTable();
  //   }
  // }, [returned_prd]);

  const handlePreviewShow = async (issuance_id) => {
    axios
      .get(`${BASE_URL}/issuance/fetchPreview`, { params: { issuance_id } })
      .then((res) => {
        setApprovedIssue(res.data);
        setIssuedBy(res.data[0].issuance.issuer.col_Fname);
        setReceivedBy(res.data[0].issuance.receiver.col_Fname);
        setApprovedBy(res.data[0].issuance.approvers.col_Fname);
        setshowPreview(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClosePreview = () => {
    setshowPreview(false);
  };

  const handleExportPDF = () => {
    const input = document.getElementById("content-to-pdf");
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgWidth = 210; // A4 size width in mm
        const pageHeight = 297; // A4 size height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save("ApprovedIssuance.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF: ", error);
      });
  };

  const tabStyle = {
    padding: "10px 15px",
    margin: "0 10px",
    color: "#333",
    transition: "color 0.3s",
  };

  //date format
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

  const [csvFile, setCsvFile] = useState(null);
  // const [csvData, setCsvData] = useState([]);
  const [warehouseID, setWarehouseID] = useState("");
  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const readCsvFile = async () => {
    if (warehouseID === "" || csvFile === null) {
      swal(
        "Error!",
        "Please fill the empty fields for CSV and warehouse ID",
        "error"
      );
    } else {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("csvFile", csvFile);
      formData.append("warehouseID", warehouseID);
  
      try {
        const response = await axios.post(
          `${BASE_URL}/inventory/read_csv`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
  
        if (response.status === 200) {
          swal(
            "Success",
            "Uploaded Successfully",
            "success"
          );
          setIsLoading(false);
        } else if (response.status === 500) {
          const errorMessage = response.data.error;
          if (errorMessage === 'Connection acquisition timeout') {
            swal(
              "Error!",
              "Connection timeout. Please try again later.",
              "error"
            );
          } else {
            swal(
              "Error!",
              "Upload Data Stop. Please Try Again",
              "error"
            );
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error reading CSV file:", error);
        swal(
          "Error!",
          "An unexpected error occurred. Please try again later.",
          "error"
        );
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
        {isLoading ? (
          <div className="loading-container">
            <ReactLoading className="react-loading" type={"bubbles"} />
            Loading Data...
          </div>
        ) : authrztn.includes("Inventory - View") ? (
          <div className="right-body-contentss">
            <div className="tabbutton-sides">
              <Tabs
                activeKey={activeTab}
                onSelect={onSelect}
                defaultActiveKey="inventory"
                transition={false}
                id="noanim-tab-example"
                style={{ border: "none" }}
              >
                <Tab
                  eventKey="inventory"
                  title={
                    <span
                      style={{
                        ...tabStyle,
                        // fontSize: "20px",
                        overflowY: "auto",
                      }}
                      className="inv-tab-btn"
                    >
                      Inventory
                    </span>
                  }
                >
                  <div className="tab-titles">
                    <h1>Inventory</h1>


                    {userId === 1 && (
                      <div className="row">
                        <div className="col-4">
                          <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                          />
                        </div>
                        <div className="col-4">
                          <input
                            type="number"
                            placeholder="input thhe warehouse ID"
                            className="border border-secondary fs-5 text-center"
                            onChange={(e) => setWarehouseID(e.target.value)}
                          />
                        </div>
                        <div className="col-4">
                          <Button variant="primary" onClick={readCsvFile}><span className="h3">Upload CSV</span></Button>
                        </div>
                      </div>
                    )}
                    
                  </div>
                  <div className="row">
                    <div className="col-6 d-flex justify-content-md-start justify-content-sm-center justify-content-center inv-div-sel">
                      <Form.Select
                        aria-label="item status"
                        className="select-inv"
                        onChange={(e) => handleFilter(e)}
                        style={{
                          width: "274px",
                          height: "45px",
                          fontSize: "15px",
                          marginBottom: "15px",
                          fontFamily: "Poppins, Source Sans Pro",
                        }}
                        value={inventoryFilter}
                      >
                        <option value={"All"}>All</option>
                        <option value={"LS"}>Low Stock</option>
                        <option value={"OTS"}>Out of Stock</option>
                      </Form.Select>
                    </div>

                    <div className="col-6 d-flex justify-content-md-end justify-content-center justify-content-sm-center form-inv-search">
                      <TextField
                        label="Search"
                        variant="outlined"
                        style={{ marginBottom: "10px", float: "right" }}
                        InputLabelProps={{
                          style: { fontSize: "14px" },
                        }}
                        InputProps={{
                          style: {
                            fontSize: "14px",
                            width: "250px",
                            height: "50px",
                          },
                        }}
                        onChange={handleSearch}
                      />
                    </div>
                  </div>
                  <div className="table-containss">
                    <div className="main-of-all-tables">
                      <table className="table-hover" id="order-listing">
                        <thead>
                          <tr>
                            <th className="tableh">Product Code</th>
                            <th className="tableh">Product Name</th>
                            <th className="tableh">UOM</th>
                            <th className="tableh">Category</th>
                            <th className="tableh">Quantity</th>
                          </tr>
                        </thead>
                        {inventory.length > 0 ? (
                          <tbody>
                            {currentItemsInventory.map((data, i) => (
                              <tr
                                key={i}
                                className="clickable_Table_row"
                                title="View Information"
                                onClick={() =>
                                  navigate(`/viewInventory/${data.productID}`)
                                }
                              >
                                <td>{data.product_code}</td>
                                <td>{data.product_name}</td>
                                <td>{data.UOM}</td>
                                <td>{data.Category}</td>
                                <td>{data.totalQuantity}</td>
                              </tr>
                            ))}
                          </tbody>
                        ) : (
                          <div className="no-data">
                            <img
                              src={NoData}
                              alt="NoData"
                              className="no-data-img"
                            />
                            <h3>No Data Found</h3>
                          </div>
                        )}
                      </table>
                      <nav style={{ marginTop: "15px" }}>
                        <ul className="pagination" style={{ float: "right" }}>
                          <li
                            className={`page-item ${
                              currentPage === 1 ? "disabled" : ""
                            }`}
                          >
                            <button
                              type="button"
                              style={{
                                fontSize: "14px",
                                cursor: "pointer",
                                color: "#000000",
                                textTransform: "capitalize",
                              }}
                              className="page-link"
                              onClick={() =>
                                setCurrentPage((prevPage) => prevPage - 1)
                              }
                            >
                              Previous
                            </button>
                          </li>
                          {generatePages().map((page, index) => (
                            <li
                              key={index}
                              className={`page-item ${
                                currentPage === page ? "active" : ""
                              }`}
                            >
                              <button
                                style={{
                                  fontSize: "14px",
                                  width: "25px",
                                  background:
                                    currentPage === page ? "#FFA500" : "white",
                                  color:
                                    currentPage === page
                                      ? "#FFFFFF"
                                      : "#000000",
                                  border: "none",
                                  height: "28px",
                                }}
                                className={`page-link ${
                                  currentPage === page ? "gold-bg" : ""
                                }`}
                                onClick={() => handlePageClick(page)}
                              >
                                {page}
                              </button>
                            </li>
                          ))}
                          <li
                            className={`page-item ${
                              currentPage === maxTotalPages ? "disabled" : ""
                            }`}
                          >
                            <button
                              style={{
                                fontSize: "14px",
                                cursor: "pointer",
                                color: "#000000",
                                textTransform: "capitalize",
                              }}
                              className="page-link"
                              onClick={() =>
                                setCurrentPage((prevPage) => prevPage + 1)
                              }
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                </Tab>
                <Tab
                  eventKey="issuance"
                  title={
                    <span
                      style={{ ...tabStyle, fontSize: "20px" }}
                      className="inv-tab-btn"
                    >
                      Issuance
                    </span>
                  }
                >
                  <div className="tab-titles iss-tab">
                    <h1>Issuance</h1>
                    <div>
                      {authrztn.includes("Inventory - Add") && (
                        <Link to={"/createIssuance"} className="issuance-btn">
                          <span style={{}}>
                            <Plus size={20} />
                          </span>
                          Add Issuance
                        </Link>
                      )}
                    </div>
                  </div>
                  {/* <div className="btn-and-search">
                    {authrztn.includes("Inventory - Add") && (
                      <div className="button-create-side">
                        <div className="Buttonmodal-new">
                          <Link to={"/createIssuance"} className="issuance-btn">
                            <span style={{}}>
                              <Plus size={20} />
                            </span>
                            Add Issuance
                          </Link>
                        </div>
                      </div>
                    )}

                    <div className="main-table-search">
                      <TextField
                        label="Search"
                        variant="outlined"
                        className="main-search act-search cus-btm"
                        style={{ marginBottom: "10px", float: "right" }}
                        InputLabelProps={{
                          style: { fontSize: "14px" },
                        }}
                        InputProps={{
                          style: {
                            fontSize: "14px",
                            // width: "250px",
                            height: "50px",
                          },
                        }}
                        onChange={handleSearchIssuance}
                      />
                    </div>
                  </div> */}
                  <div className="table-containss">
                    <div className="main-of-all-tables">
                      <div className="main-table-search">
                        <TextField
                          label="Search"
                          variant="outlined"
                          style={{ marginBottom: "10px", float: "right" }}
                          InputLabelProps={{
                            style: { fontSize: "14px" },
                          }}
                          InputProps={{
                            style: {
                              fontSize: "14px",
                              width: "250px",
                              height: "50px",
                            },
                          }}
                          onChange={handleSearchIssuance}
                        />
                      </div>
                      <table className="table-hover" title="View Information">
                        <thead>
                          <tr>
                            <th className="tableh">BIS #</th>
                            <th className="tableh">Issued To</th>
                            <th className="tableh">Origin Site</th>
                            <th className="tableh">MRS #</th>
                            <th className="tableh">Received By</th>
                            <th className="tableh">Date Created</th>
                            <th className="tableh">Action</th>
                            <th className="tableh">Print</th>
                          </tr>
                        </thead>
                        {issuance.length > 0 ? (
                          <tbody>
                            {currentItemsIssuance.map((data, i) => (
                              <tr key={i}>
                                <td
                                  onClick={() =>
                                    navigate(
                                      `/approvalIssuance/${data.issuance_id}`
                                    )
                                  }
                                >
                                  {data.issuance_id}
                                </td>
                                <td
                                  onClick={() =>
                                    navigate(
                                      `/approvalIssuance/${data.issuance_id}`
                                    )
                                  }
                                >
                                  {data.cost_center.name}
                                </td>
                                <td
                                  onClick={() =>
                                    navigate(
                                      `/approvalIssuance/${data.issuance_id}`
                                    )
                                  }
                                >
                                  {data.warehouse.warehouse_name}
                                </td>
                                <td
                                  onClick={() =>
                                    navigate(
                                      `/approvalIssuance/${data.issuance_id}`
                                    )
                                  }
                                >
                                  {data.mrs}
                                </td>
                                <td
                                  onClick={() =>
                                    navigate(
                                      `/approvalIssuance/${data.issuance_id}`
                                    )
                                  }
                                >
                                  {data.receiver.col_Fname}
                                </td>
                                <td
                                  onClick={() =>
                                    navigate(
                                      `/approvalIssuance/${data.issuance_id}`
                                    )
                                  }
                                >
                                  {formatDatetime(data.createdAt)}
                                </td>
                                <td>
                                  <Button
                                    onClick={() => {
                                      if (data.status === "Approved") {
                                        navigate(
                                          `/returnForm/${data.issuance_id}`
                                        );
                                      }
                                    }}
                                    style={{
                                      fontSize: "12px",
                                      color: "black",
                                      cursor:
                                        data.status !== "Approved" ||
                                        isReturnButtonDisabled(
                                          data.date_approved
                                        )
                                          ? "not-allowed"
                                          : "pointer",
                                    }}
                                    variant="outline-secondary"
                                    disabled={isReturnButtonDisabled(
                                      data.date_approved
                                    )}
                                  >
                                    Return
                                  </Button>
                                </td>
                                <td>
                                  <Button
                                    onClick={() =>
                                      handlePreviewShow(data.issuance_id)
                                    }
                                  >
                                    Preview
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        ) : (
                          <div className="no-data">
                            <img
                              src={NoData}
                              alt="NoData"
                              className="no-data-img"
                            />
                            <h3>No Data Found</h3>
                          </div>
                        )}
                      </table>
                    </div>
                    <nav style={{ marginTop: "15px" }}>
                      <ul className="pagination" style={{ float: "right" }}>
                        <li
                          className={`page-item ${
                            currentPageissuance === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            type="button"
                            style={{
                              fontSize: "14px",
                              cursor: "pointer",
                              color: "#000000",
                              textTransform: "capitalize",
                            }}
                            className="page-link"
                            onClick={() =>
                              setCurrentPageIssuance((prevPage) => prevPage - 1)
                            }
                          >
                            Previous
                          </button>
                        </li>

                        {generatePagesIssuance().map((pageissuance, index) => (
                          <li
                            key={index}
                            className={`page-item ${
                              currentPageissuance === pageissuance
                                ? "active"
                                : ""
                            }`}
                          >
                            <button
                              style={{
                                fontSize: "14px",
                                width: "25px",
                                background:
                                  currentPageissuance === pageissuance
                                    ? "#FFA500"
                                    : "white",
                                color:
                                  currentPageissuance === pageissuance
                                    ? "#FFFFFF"
                                    : "#000000",
                                border: "none",
                                height: "28px",
                              }}
                              className={`page-link ${
                                currentPageissuance === pageissuance
                                  ? "gold-bg"
                                  : ""
                              }`}
                              onClick={() =>
                                handlePageClickIssuance(pageissuance)
                              }
                            >
                              {pageissuance}
                            </button>
                          </li>
                        ))}
                        <li
                          className={`page-item ${
                            currentPageissuance === totalPagesIssuance
                              ? "disabled"
                              : ""
                          }`}
                        >
                          <button
                            style={{
                              fontSize: "14px",
                              cursor: "pointer",
                              color: "#000000",
                              textTransform: "capitalize",
                            }}
                            className="page-link"
                            onClick={() =>
                              setCurrentPageIssuance((prevPage) => prevPage + 1)
                            }
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Tab>
                <Tab
                  eventKey="return"
                  title={
                    <span
                      style={{ ...tabStyle, fontSize: "20px" }}
                      className="inv-tab-btn"
                    >
                      Return
                    </span>
                  }
                >
                  <div className="tab-titles">
                    <h1>Return</h1>
                  </div>
                  <div className="table-containss">
                    <div className="main-of-all-tables">
                      <div className="main-table-search">
                        <TextField
                          label="Search"
                          variant="outlined"
                          style={{ marginBottom: "10px", float: "right" }}
                          InputLabelProps={{
                            style: { fontSize: "14px" },
                          }}
                          InputProps={{
                            style: {
                              fontSize: "14px",
                              width: "250px",
                              height: "50px",
                            },
                          }}
                          onChange={handleSearchReturn}
                        />
                      </div>
                      <table id="order2-listing" className="table-responsive">
                        <thead>
                          <tr>
                            <th className="tableh">BIS #</th>
                            <th className="tableh">Product Code</th>
                            <th className="tableh">Product Name</th>
                            <th className="tableh">Return By</th>
                            <th className="tableh">Accountability Refcode:</th>
                            <th className="tableh">MRS no.</th>
                            <th className="tableh">Return Quantity</th>
                            <th className="tableh">Date Return</th>
                            <th className="tableh">Date Approved</th>
                            <th className="tableh">Status</th>
                            <th className="tableh text-center">Action</th>
                          </tr>
                        </thead>
                        {returned_prd.length > 0 ||
                        returned_asm.length > 0 ||
                        returned_spare.length > 0 ||
                        returned_subpart.length > 0 ? (
                          <tbody>
                            {currentItemsReturnProd.map((data, i) => (
                              <tr key={i}>
                                <td>{data.issuance.issuance_id}</td>
                                <td>
                                  {
                                    data.inventory_prd.product_tag_supplier
                                      .product.product_code
                                  }
                                </td>
                                <td>
                                  {
                                    data.inventory_prd.product_tag_supplier
                                      .product.product_name
                                  }
                                </td>
                                <td>{data.returnedBy.col_Fname}</td>
                                <td>{data.issuance.accountability_refcode}</td>
                                <td>{data.issuance.mrs}</td>
                                <td>{data.quantity}</td>
                                <td>{formatDatetime(data.createdAt)}</td>
                                <td>
                                  {formatDatetime(data.issuance.date_approved)}
                                </td>
                                <td>{data.status}</td>
                                <td>
                                  <div className="">
                                    <div className="text-center">
                                      <Button
                                        style={{
                                          fontSize: "12px",
                                          width: "130px",
                                          marginBottom: "2px",
                                        }}
                                        className="btn "
                                        onClick={() =>
                                          handleMoveToInventory(
                                            data.id,
                                            data.inventory_prd.inventory_id,
                                            data.quantity,
                                            "product"
                                          )
                                        }
                                        disabled={
                                          data.status === "Retained" ||
                                          data.status === "Returned"
                                        }
                                      >
                                        move to inventory
                                      </Button>
                                    </div>
                                    <div className="text-center">
                                      <Button
                                        variant="secondary"
                                        style={{
                                          fontSize: "12px",
                                          width: "130px",
                                        }}
                                        className="btn"
                                        onClick={() =>
                                          handleRetain(data.id, "product")
                                        }
                                        disabled={
                                          data.status === "Retained" ||
                                          data.status === "Returned"
                                        }
                                      >
                                        Retain
                                      </Button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}

                            {currentItemsReturnAsm.map((data, i) => (
                              <tr key={i}>
                                <td>
                                  {
                                    data.inventory_assembly.assembly_supplier
                                      .assembly.assembly_code
                                  }
                                </td>
                                <td>
                                  {
                                    data.inventory_assembly.assembly_supplier
                                      .assembly.assembly_name
                                  }
                                </td>
                                <td>{data.return_by}</td>
                                <td>{data.quantity}</td>
                                <td>{formatDatetime(data.createdAt)}</td>
                                <td>
                                  {formatDatetime(data.issuance.updatedAt)}
                                </td>
                                <td>{data.status}</td>
                                <td>
                                  <button
                                    style={{ fontSize: "12px" }}
                                    className="btn"
                                    onClick={() =>
                                      handleMoveToInventory(
                                        data.id,
                                        data.inventory_assembly.inventory_id,
                                        data.quantity,
                                        "assembly"
                                      )
                                    }
                                    disabled={
                                      data.status === "Retained" ||
                                      data.status === "Returned"
                                    }
                                  >
                                    move to inventory
                                  </button>
                                  <button
                                    style={{ fontSize: "12px" }}
                                    className="btn"
                                    onClick={() =>
                                      handleRetain(data.id, "assembly")
                                    }
                                    disabled={
                                      data.status === "Retained" ||
                                      data.status === "Returned"
                                    }
                                  >
                                    Retain
                                  </button>
                                </td>
                              </tr>
                            ))}

                            {currentItemsReturnSpare.map((data, i) => (
                              <tr key={i}>
                                <td>
                                  {
                                    data.inventory_spare.sparepart_supplier
                                      .sparePart.spareParts_code
                                  }
                                </td>
                                <td>
                                  {
                                    data.inventory_spare.sparepart_supplier
                                      .sparePart.spareParts_name
                                  }
                                </td>
                                <td>{data.return_by}</td>
                                <td>{data.quantity}</td>
                                <td>{formatDatetime(data.createdAt)}</td>
                                <td>
                                  {formatDatetime(data.issuance.updatedAt)}
                                </td>
                                <td>{data.status}</td>
                                <td>
                                  <button
                                    style={{ fontSize: "12px" }}
                                    className="btn"
                                    onClick={() =>
                                      handleMoveToInventory(
                                        data.id,
                                        data.inventory_spare.inventory_id,
                                        data.quantity,
                                        "spare"
                                      )
                                    }
                                    disabled={
                                      data.status === "Retained" ||
                                      data.status === "Returned"
                                    }
                                  >
                                    move to inventory
                                  </button>
                                  <button
                                    style={{ fontSize: "12px" }}
                                    className="btn"
                                    onClick={() =>
                                      handleRetain(data.id, "spare")
                                    }
                                    disabled={
                                      data.status === "Retained" ||
                                      data.status === "Returned"
                                    }
                                  >
                                    Retain
                                  </button>
                                </td>
                              </tr>
                            ))}

                            {currentItemsReturnSubpart.map((data, i) => (
                              <tr key={i}>
                                <td>
                                  {
                                    data.inventory_subpart.subpart_supplier
                                      .subPart.subPart_code
                                  }
                                </td>
                                <td>
                                  {
                                    data.inventory_subpart.subpart_supplier
                                      .subPart.subPart_name
                                  }
                                </td>
                                <td>{data.return_by}</td>
                                <td>{data.quantity}</td>
                                <td>{formatDatetime(data.createdAt)}</td>
                                <td>
                                  {formatDatetime(data.issuance.updatedAt)}
                                </td>
                                <td>{data.status}</td>
                                <td>
                                  <button
                                    style={{ fontSize: "12px" }}
                                    className="btn"
                                    onClick={() =>
                                      handleMoveToInventory(
                                        data.id,
                                        data.inventory_subpart.inventory_id,
                                        data.quantity,
                                        "subpart"
                                      )
                                    }
                                    disabled={
                                      data.status === "Retained" ||
                                      data.status === "Returned"
                                    }
                                  >
                                    move to inventory
                                  </button>
                                  <button
                                    style={{ fontSize: "12px" }}
                                    className="btn"
                                    onClick={() =>
                                      handleRetain(data.id, "subpart")
                                    }
                                    disabled={
                                      data.status === "Retained" ||
                                      data.status === "Returned"
                                    }
                                  >
                                    Retain
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        ) : (
                          <div className="no-data">
                            <img
                              src={NoData}
                              alt="NoData"
                              className="no-data-img"
                            />
                            <h3>No Data Found</h3>
                          </div>
                        )}
                      </table>
                    </div>
                    <nav style={{ marginTop: "15px" }}>
                      <ul className="pagination" style={{ float: "right" }}>
                        <li
                          className={`page-item ${
                            currentPageReturn === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            type="button"
                            style={{
                              fontSize: "14px",
                              cursor: "pointer",
                              color: "#000000",
                              textTransform: "capitalize",
                            }}
                            className="page-link"
                            onClick={() =>
                              setCurrentPageReturn((prevPage) => prevPage - 1)
                            }
                          >
                            Previous
                          </button>
                        </li>

                        {generatePagesIssuance().map((pageReturn, index) => (
                          <li
                            key={index}
                            className={`page-item ${
                              currentPageReturn === pageReturn ? "active" : ""
                            }`}
                          >
                            <button
                              style={{
                                fontSize: "14px",
                                width: "25px",
                                background:
                                  currentPageReturn === pageReturn
                                    ? "#FFA500"
                                    : "white",
                                color:
                                  currentPageReturn === pageReturn
                                    ? "#FFFFFF"
                                    : "#000000",
                                border: "none",
                                height: "28px",
                              }}
                              className={`page-link ${
                                currentPageReturn === pageReturn
                                  ? "gold-bg"
                                  : ""
                              }`}
                              onClick={() => handlePageClickReturn(pageReturn)}
                            >
                              {pageReturn}
                            </button>
                          </li>
                        ))}
                        <li
                          className={`page-item ${
                            currentPageReturn === maxReturnTotalPages
                              ? "disabled"
                              : ""
                          }`}
                        >
                          <button
                            style={{
                              fontSize: "14px",
                              cursor: "pointer",
                              color: "#000000",
                              textTransform: "capitalize",
                            }}
                            className="page-link"
                            onClick={() =>
                              setCurrentPageReturn((prevPage) => prevPage + 1)
                            }
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        ) : (
          <div className="no-access">
            <img src={NoAccess} alt="NoAccess" className="no-access-img" />
            <h3>You don't have access to this function.</h3>
          </div>
        )}
      </div>

      <Modal
        show={showPreview}
        onHide={handleClosePreview}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body id="content-to-pdf">
          <div className="canvassing-templates-container">
            <div className="canvassing-content-templates">
              <div className="templates-header">
                <div className="template-logoes">
                  <img src={SBFLOGO} alt="" />
                </div>
                <div className="SBFtextslogo">
                  <span>SBF PHILIPPINES DRILLING RESOURCES CORP.</span>
                  <span>Padiguan, Sta. Cruz, Rosario, Agusan Del Sur</span>
                </div>
              </div>

              <div className="templates-middle">
                <div className="Quotationdiv">
                  <span>ISSUANCE</span>
                </div>
              </div>

              <div className="templates-table-section">
                <div className="templatestable-content">
                  <Table>
                    <thead>
                      <tr>
                        <th className="canvassth">PRODUCT CODE</th>
                        <th>PRODUCT NAME</th>
                        <th>QUANTITY</th>
                        <th>UOM</th>
                        <th>LANDED COST</th>
                        <th>TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ApprovedIssue.map((data, i) => {
                        const landedCost =
                          (data.inventory_prd.freight_cost || 0) +
                          (data.inventory_prd.custom_cost || 0) +
                          data.inventory_prd.price;

                        const TotalPrice = data.quantity + landedCost;

                        return (
                          <tr key={i}>
                            <td>
                              {
                                data.inventory_prd.product_tag_supplier.product
                                  .product_code
                              }
                            </td>
                            <td>
                              {
                                data.inventory_prd.product_tag_supplier.product
                                  .product_name
                              }
                            </td>
                            <td>{data.quantity}</td>
                            <td>
                              {
                                data.inventory_prd.product_tag_supplier.product
                                  .product_unitMeasurement
                              }
                            </td>
                            <td>
                              {landedCost.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td>
                              {TotalPrice.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </div>

              <div className="printed-signature-containers">
                <div className="name-signature-sections">
                  <div className="labelofSignature">
                    <p>Issued By:</p>
                    <p>Received By:</p>
                    <p>Approved By:</p>
                  </div>

                  <div className="signaturefield">
                    <p>{IssuedBy}</p>
                    <p>{ReceivedBy}</p>
                    <p>{ApprovedBy}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <Button
              type="button"
              className="btn btn-warning"
              size="md"
              style={{
                fontSize: "20px",
                margin: "0px 5px",
                fontFamily: "Poppins, Source Sans Pro",
              }}
              onClick={handleExportPDF}
            >
              Export
            </Button>
            <Button
              variant="seconday"
              size="md"
              style={{
                fontSize: "20px",
                margin: "0px 5px",
                fontFamily: "Poppins, Source Sans Pro",
              }}
              onClick={handleClosePreview}
            >
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Inventory;

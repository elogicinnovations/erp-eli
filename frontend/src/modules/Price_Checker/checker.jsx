import React, { useEffect, useState, useRef } from "react";
import ReactLoading from "react-loading";
import "../styles/react-style.css";
import "../../assets/global/style.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import NoData from "../../assets/image/NoData.png";
import NoAccess from "../../assets/image/NoAccess.png";
import axios from "axios";
import BASE_URL from "../../assets/global/url";
import { jsPDF } from "jspdf";
import { MultiSelect } from "primereact/multiselect";
import Select from "react-select";
const Checker = ({ authrztn }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchAccountability, setFetchAccountability] = useState([]);
  const [fetchIssuedProduct, setFetchIssuedProduct] = useState([]);
  const [showAccountabilityModal, setShowAccountabilityModal] = useState(false);
  const [fetchCloneData, setFetchCloneDate] = useState([]);

  //filter useState
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selecteduser, setselecteduser] = useState("");

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [fetchTable, setFetchTable] = useState([]);

  //export button
  const [exportOptionsVisible, setExportOptionsVisible] = useState(false);
  const exportOptionsRef = useRef(null);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(fetchAccountability.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, fetchAccountability.length);
  const currentItems = fetchAccountability.slice(startIndex, endIndex);
  const MAX_PAGES = 5;

  const generatePages = () => {
    const pages = [];
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > MAX_PAGES) {
      const half = Math.floor(MAX_PAGES / 2);
      if (currentPage <= half + 1) {
        endPage = MAX_PAGES;
      } else if (currentPage >= totalPages - half) {
        startPage = totalPages - MAX_PAGES + 1;
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
    if (endPage < totalPages) {
      pages.push("...");
    }

    return pages;
  };

  const handlePageClick = (page) => {
    if (page === "...") return;
    setCurrentPage(page);
  };

  // const CloseAccountabilityModal = () => setShowAccountabilityModal(false);

  // const handleModalAccountability = (masterListId) => {
  //   setShowAccountabilityModal(true);
  //   const ApprovedId = masterListId;
  //   axios
  //     .get(BASE_URL + "/accountability/fetchSpecificProduct", {
  //       params: {
  //         ApprovedId,
  //       },
  //     })
  //     .then((res) => {
  //       setFetchIssuedProduct(res.data);
  //     })
  //     .catch((err) => console.log(err));
  // };

  //search section
  // const handleSearch = (event) => {
  //   setCurrentPage(1);
  //   const searchTerm = event.target.value.toLowerCase();
  //   const filteredData = fetchCloneData.filter((data) => {
  //     return (
  //       data.issued_approve_prd.issuance.receiver.col_Fname
  //         .toLowerCase()
  //         .includes(searchTerm) ||
  //       data.issued_approve_prd.issuance.receiver.department.department_name
  //         .toLowerCase()
  //         .includes(searchTerm) ||
  //       formatDate(data.createdAt).toLowerCase().includes(searchTerm)
  //     );
  //   });

  //   setFetchAccountability(filteredData);
  // };

  const clearFilters = () => {
    setSelectedProducts([]);
    setFetchTable([]);

    reloadTable();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        exportOptionsRef.current &&
        !exportOptionsRef.current.contains(event.target)
      ) {
        setExportOptionsVisible(false);
      }
    };

    if (exportOptionsVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [exportOptionsVisible]);

  const handleExportButtonClick = () => {
    setExportOptionsVisible(!exportOptionsVisible);
  };

  const reloadTable = () => {
    const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/product/fetchTable")
        .then((res) => {
          setProducts(res.data);
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
    reloadTable();
  }, []);

  function formatDate(datetime) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(datetime).toLocaleString("en-US", options);
  }

  const handleExportCSV = async () => {
    try {
      let res;
      let dataForExport;

      if (startDate || endDate || selecteduser) {
        // Filtered export
        res = await axios.get(BASE_URL + "/accountability/fetchDataForExport");
        dataForExport = res.data.filter((data) => {
          const createdAt = new Date(data.createdAt);
          const isWithinDateRange =
            (!startDate || createdAt >= startDate.setHours(0, 0, 0, 0)) &&
            (!endDate || createdAt <= endDate.setHours(23, 59, 59, 999));
          const isMatchingUser =
            !selecteduser ||
            selecteduser === "All User" ||
            data.issued_approve_prd.issuance.receiver.col_Fname ===
              selecteduser;
          return isWithinDateRange && isMatchingUser;
        });
      } else {
        // Export all data
        res = await axios.get(BASE_URL + "/accountability/fetchDataForExport");
        dataForExport = res.data;
      }

      if (dataForExport.length > 0) {
        const headers = [
          "Name",
          "Department",
          "Product Name",
          "UOM",
          "QUANTITY",
          "SUB-UNIT",
          "DATE ISSUED",
        ];
        const csvContent =
          "data:text/csv;charset=utf-8," +
          headers.join(",") +
          "\n" +
          dataForExport
            .map((data) => {
              const subUnit = data.issued_approve_prd.inventory_prd
                .product_tag_supplier.product.UOM_set
                ? "Sub-Unit(Applicable)"
                : "Sub-Unit(Not-Applicable)";
              return `${data.issued_approve_prd.issuance.receiver.col_Fname},${
                data.issued_approve_prd.issuance.receiver.department
                  .department_name
              },${
                data.issued_approve_prd.inventory_prd.product_tag_supplier
                  .product.product_name
              },${
                data.issued_approve_prd.inventory_prd.product_tag_supplier
                  .product.product_unitMeasurement
              },${data.issued_approve_prd.quantity},${subUnit},${formatDate(
                data.createdAt
              )}`;
            })
            .join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "accountability.csv");
        document.body.appendChild(link);
        link.click();
      } else {
        console.log("No data available for export.");
      }
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  const handleExportPDF = async () => {
    // setIsLoading(true);
    try {
      const doc = new jsPDF();
      let res;
      let dataForExportPDF;

      // Check if any filter is applied
      if (startDate || endDate || selecteduser) {
        // Filtered export
        res = await axios.get(BASE_URL + "/accountability/fetchDataForExport");
        dataForExportPDF = res.data.filter((data) => {
          const createdAt = new Date(data.createdAt);
          const isWithinDateRange =
            (!startDate || createdAt >= startDate.setHours(0, 0, 0, 0)) &&
            (!endDate || createdAt <= endDate.setHours(23, 59, 59, 999));
          const isMatchingUser =
            !selecteduser ||
            selecteduser === "All User" ||
            data.issued_approve_prd.issuance.receiver.col_Fname ===
              selecteduser;
          return isWithinDateRange && isMatchingUser;
        });
      } else {
        res = await axios.get(BASE_URL + "/accountability/fetchDataForExport");
        dataForExportPDF = res.data;
        console.log(dataForExportPDF);
      }

      if (dataForExportPDF.length > 0) {
        const headers = [
          "Name",
          "Department",
          "Product Name",
          "UOM",
          "Quantity",
          "Sub-unit",
          "Date issued",
        ];
        const data = dataForExportPDF.map((account) => {
          const col_Fname =
            account.issued_approve_prd.issuance.receiver.col_Fname;
          const department =
            account.issued_approve_prd.issuance.receiver.department
              .department_name;
          const productName =
            account.issued_approve_prd.inventory_prd.product_tag_supplier
              .product.product_name;
          const UOM =
            account.issued_approve_prd.inventory_prd.product_tag_supplier
              .product.product_unitMeasurement;
          const subUnit = account.issued_approve_prd.inventory_prd
            .product_tag_supplier.product.UOM_set
            ? "Sub-Unit(Applicable)"
            : "Sub-Unit(Not-Applicable)";
          const qty = account.issued_approve_prd.quantity;

          return [
            col_Fname,
            department,
            productName,
            UOM,
            qty,
            subUnit,
            formatDate(account.createdAt),
          ];
        });

        doc.autoTable({
          head: [headers],
          body: data,
          startY: 10,
          styles: { fontSize: 12, cellPadding: 2 },
          headStyles: { fillColor: [255, 200, 0] },
          columnStyles: {
            0: { cellWidth: 18 },
            1: { cellWidth: 30 },
            2: { cellWidth: 38 },
            3: { cellWidth: 15 },
            4: { cellWidth: 30 },
            5: { cellWidth: 30 },
            6: { cellWidth: 30 },
          },
          margin: { horizontal: 10 },
        });

        doc.save("accountability.pdf");
      } else {
        console.log("No data available for export.");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const [searchInput, setSearchInput] = useState("");
  const handleInputChange = (inputValue) => {
    setSearchInput(inputValue);
  };

  const filteredOptions = products
    .map((data) => ({
      value: data.product_id,
      label: `(${data.product_code}) - ${data.product_name}`,
      code: data.product_code,
      name: data.product_name,
    }))
    .filter((option) => {
      const searchString = `${option.code.toLowerCase()} ${option.name.toLowerCase()}`;
      return searchString.includes(searchInput.toLowerCase());
    })
    .slice(0, 5);

  const handleSubmitProduct = () => {
    console.log(selectedProducts);
    axios
      .get(BASE_URL + "/checker/checkProduct", {
        params: {
          selectedValues: selectedProducts.map((product) => product.value),
        },
      })
      .then((res) => {
        setFetchTable(res.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
        {isLoading ? (
          <div className="loading-container">
            <ReactLoading className="react-loading" type={"bubbles"} />
            Loading Data...
          </div>
        ) : authrztn.includes("Price Checker - View") ? (
          <div className="right-body-contents">
            <div className="Employeetext-button">
              <div className="employee-and-button">
                <div className="emp-text-side">
                  <p>Price Checker</p>
                </div>

                <div className="button-create-side">
                  {exportOptionsVisible && (
                    <div className="export-options" ref={exportOptionsRef}>
                      <Button
                        variant="outline-success"
                        onClick={handleExportCSV}
                      >
                        EXCEL
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={handleExportPDF}
                      >
                        PDF
                      </Button>
                    </div>
                  )}
                  <Select
                    aria-label="item user"
                    isMulti
                    value={selectedProducts}
                    options={filteredOptions}
                    onInputChange={handleInputChange}
                    className="w-50 fs-5 fw-bold"
                    required
                    placeholder="Select Product"
                    onChange={(selectedOptions) =>
                      setSelectedProducts(selectedOptions)
                    }
                  />

                  <div className="pur-filt-container">
                    <button
                      className="goesButton"
                      onClick={handleSubmitProduct}
                    >
                      Search
                    </button>
                    <button className="Filterclear" onClick={clearFilters}>
                      Clear
                    </button>
                  </div>

                  <div className="Buttonmodal-new"></div>
                </div>
              </div>
            </div>

            <div className="table-containss">
              <div className="main-of-all-tables">
                <div className="searchandexport">
                  {/* <div className="exportfield">
                    <button
                      className="export"
                      onClick={handleExportButtonClick}
                    >
                      <Export size={20} weight="bold" /> <span>Export</span>
                    </button>
                  </div> */}
                  {/* <div className="searchfield">
                    <TextField
                      label="Search"
                      variant="outlined"
                      className="act-search"
                      style={{
                        float: "right",
                      }}
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
                      onChange={handleSearch}
                    />
                  </div> */}
                </div>
                <table className="table-hover" id="order-listing">
                  <thead>
                    <tr>
                      {Object.keys(fetchTable).length > 0 && (
                        <th>Product Name</th>
                      )}

                      {Object.keys(fetchTable).map((productName) => (
                        <th key={productName}>{productName}</th>
                      ))}
                    </tr>
                  </thead>
                  {Object.keys(fetchTable).length > 0 ? (
                    <tbody>
                      {Object.keys(fetchTable[Object.keys(fetchTable)[0]]).map(
                        (supplierName, i) => (
                          <tr key={i}>
                            <td>{supplierName}</td>
                            {Object.keys(fetchTable).map((productName) => (
                              <td key={`${productName}-${supplierName}`}>
                                {fetchTable[productName][supplierName]
                                  ? `${fetchTable[productName][
                                      supplierName
                                    ].toFixed(2)}`
                                  : "-"}
                              </td>
                            ))}
                          </tr>
                        )
                      )}
                    </tbody>
                  ) : (
                    <div className="no-data">
                      <img src={NoData} alt="NoData" className="no-data-img" />
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
                            color: currentPage === page ? "#FFFFFF" : "#000000",
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
                        currentPage === totalPages ? "disabled" : ""
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
          </div>
        ) : (
          <div className="no-access">
            <img src={NoAccess} alt="NoAccess" className="no-access-img" />
            <h3>You don't have access to this function.</h3>
          </div>
        )}
      </div>

      {/* <Modal
        show={showAccountabilityModal}
        onHide={CloseAccountabilityModal}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <Modal.Header closeButton>
          <h1>Issued Product</h1>
        </Modal.Header>
        <Modal.Body>
          <div className="main-of-all-tables">
            <table className="hover" id="order-listing">
              <thead>
                <tr>
                  <th>PRODUCT NAME</th>
                  <th>UOM</th>
                  <th>QUANTITY</th>
                  <th>SUB-UNIT</th>
                  <th>DATE ISSUED</th>
                </tr>
              </thead>
              <tbody>
                {fetchIssuedProduct.map((data, i) => (
                  <tr key={i}>
                    <td>
                      {
                        data.issued_approve_prd.inventory_prd
                          .product_tag_supplier.product.product_name
                      }
                    </td>
                    <td>
                      {
                        data.issued_approve_prd.inventory_prd
                          .product_tag_supplier.product.product_unitMeasurement
                      }
                    </td>
                    <td>{data.issued_approve_prd.quantity}</td>
                    <td>
                      Sub-Unit (
                      {data.issued_approve_prd.inventory_prd
                        .product_tag_supplier.product.UOM_set
                        ? "Applicable"
                        : "Not Applicable"}
                      )
                    </td>
                    <td>{formatDate(data.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal> */}
    </div>
  );
};

export default Checker;

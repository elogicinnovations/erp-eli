import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../../Sidebar/sidebar";
import "../../../assets/global/style.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactLoading from "react-loading";
import NoData from "../../../assets/image/NoData.png";
import SBFLOGO from "../../../assets/image/sbflogo-noback.png";
import NoAccess from "../../../assets/image/NoAccess.png";
import "../../styles/react-style.css";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import warehouse from "../../../assets/global/warehouse";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { CSVLink } from "react-csv";
import {
  ArrowCircleLeft,
  Upload,
  Circle,
  ArrowUUpLeft,
} from "@phosphor-icons/react";
import * as $ from "jquery";
import axios from "axios";
import BASE_URL from "../../../assets/global/url";
import swal from "sweetalert";
import { pink } from "@mui/material/colors";
import Checkbox from "@mui/material/Checkbox";
import { fontStyle } from "@mui/system";
import Carousel from "react-bootstrap/Carousel";
import { jwtDecode } from "jwt-decode";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function ReceivingPreview({ authrztn }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();
  const [prNumber, setPrNumber] = useState();
  const [receivingID, setReceivingID] = useState();
  const [usedFor, setUsedFor] = useState();
  const [department, setDepartment] = useState();
  const [requestedBy, setRequestedBy] = useState();
  const [remarks, setRemarks] = useState();
  const [status, setStatus] = useState();
  const [dateCreated, setDateCreated] = useState();
  const [poNum, setPoNum] = useState();
  const [refnum, setRefnum] = useState();
  const [supplierName, setSupplierName] = useState();
  const [supplierCode, setSupplierCode] = useState();
  const [supplierTerms, setSupplierTerms] = useState();
  const [requestPr, setRequestPr] = useState();
  const [date_received, setDate_received] = useState();
  const [date_receivedTOedit, setDate_receivedTOedit] = useState(); // para if wala pa anf date received pwede nila ma setan ng date received
  const [approvedPRDate, setApproveddate] = useState();
  const [isPOComplete, setIsPOComplete] = useState();
  const [products, setproducts] = useState([]);
  const [assembly, setassembly] = useState([]);
  const [spare, setspare] = useState([]);
  const [subpart, setsubpart] = useState([]);

  const [userId, setuserId] = useState("");

  const [SI, setSI] = useState("");
  const [DR, setDR] = useState("");

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };

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

  const exportToPDF = () => {
    const input = document.getElementById("modal-body");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20; // 10mm margins on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10; // Start 10mm from the top

      // Add header
      pdf.setFontSize(18);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Receiving Report", pageWidth / 2, 10, { align: "center" });

      // Add image
      pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;

      // Add more pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 10, 10, imgWidth, imgHeight);
        heightLeft -= pageHeight - 20;
      }

      // Add footer with page numbers
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(150);
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, {
          align: "center",
        });
      }

      pdf.save("receivingReport.pdf");
    });
  };

  // const exportToExcel = () => {
  //   const table = document.getElementById('order-listings');
  //   const wb = XLSX.utils.table_to_book(table, { sheet: 'Sheet1' });
  //   const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  //   saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'products.xlsx');
  // };

  const exportToExcel = () => {
    const table = document.getElementById("order-listings");
    const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });

    // Get worksheet
    const ws = wb.Sheets["Sheet1"];

    // Define styles
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12, name: "Arial" },
      fill: { fgColor: { rgb: "4472C4" } },
      border: {
        top: { style: "medium", color: { rgb: "000000" } },
        bottom: { style: "medium", color: { rgb: "000000" } },
        left: { style: "medium", color: { rgb: "000000" } },
        right: { style: "medium", color: { rgb: "000000" } },
      },
      alignment: { vertical: "center", horizontal: "center", wrapText: true },
    };

    const bodyStyle = {
      font: { color: { rgb: "000000" }, sz: 11, name: "Arial" },
      border: {
        top: { style: "thin", color: { rgb: "D9D9D9" } },
        bottom: { style: "thin", color: { rgb: "D9D9D9" } },
        left: { style: "thin", color: { rgb: "D9D9D9" } },
        right: { style: "thin", color: { rgb: "D9D9D9" } },
      },
      alignment: { vertical: "center", horizontal: "center", wrapText: true },
    };

    const alternateRowStyle = {
      ...bodyStyle,
      fill: { fgColor: { rgb: "F2F2F2" } },
    };

    // Apply styles to cells
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ c: C, r: R });
        if (!ws[address]) continue;

        if (R === 0) {
          // Header row
          ws[address].s = headerStyle;
        } else {
          // Body rows
          ws[address].s = R % 2 === 0 ? bodyStyle : alternateRowStyle;
        }
      }
    }

    // Auto-size columns
    const colWidths = range.e.c - range.s.c + 1;
    ws["!cols"] = [];
    for (let i = 0; i < colWidths; i++) {
      ws["!cols"].push({ wch: 15 }); // Set a default width, adjust as needed
    }

    // Add a title row
    XLSX.utils.sheet_add_aoa(ws, [["Receiving Report"]], { origin: "A1" });
    ws["A1"].s = {
      font: { bold: true, color: { rgb: "000000" }, sz: 16, name: "Arial" },
      alignment: { vertical: "center", horizontal: "center" },
    };
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: range.e.c } }];

    // Shift all existing content down by one row
    for (let R = range.e.r; R >= 0; --R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ c: C, r: R });
        const newAddress = XLSX.utils.encode_cell({ c: C, r: R + 1 });
        if (ws[address]) {
          ws[newAddress] = ws[address];
          if (R === 0) ws[newAddress].s = headerStyle;
        }
      }
    }

    // Update the range to include the new title row
    ws["!ref"] = XLSX.utils.encode_range({
      s: { c: range.s.c, r: 0 },
      e: { c: range.e.c, r: range.e.r + 1 },
    });

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      `${poNum}_${refnum}.xlsx`
    );
  };

  // const prepareCsvData = () => {
  //   // Add JSX content data
  //   const jsxContentData = [
  //     ["SBF PHILIPPINES DRILLING RESOURCES CORPORATION"],
  //     ["Padigusan, Sta.Cruz, Rosario, Agusan del sur"],
  //     [`Date: ${formattedDate}`],
  //     [`Request Date: ${formatDatetime(requestPr)}`],
  //     [`PR Number: ${prNumber} => PO Number: ${poNum}`],
  //     [`Reference Number: ${refnum}`],
  //     [`PO Date: ${formatDatetime(approvedPRDate)}`],
  //     [`Vendor Code: ${supplierCode} `],
  //     [`Vendor: ${supplierName} `],
  //     [`Terms: ${supplierTerms}`],
  //     [""],
  //     [""],
  //     [""],
  //   ];

  //   // Initialize CSV data with header row
  //   const formattedData = [
  //     [
  //       "Code",
  //       "Product",
  //       "UOM",
  //       "Initial Received",
  //       "Received",
  //       "Set",
  //       "Purchased Price (UOM)",
  //       "Unit Price (/qty)",
  //       "Freight Cost (/qty)",
  //       "Duties & Customs Cost (/qty)",
  //       "Total",
  //     ],
  //   ];

  //   // Populate data rows for products
  //   products.forEach((data) => {
  //     formattedData.push([
  //       data.purchase_req_canvassed_prd.product_tag_supplier.product
  //         .product_code,
  //       data.purchase_req_canvassed_prd.product_tag_supplier.product
  //         .product_name,
  //       data.purchase_req_canvassed_prd.product_tag_supplier.product
  //         .product_unitMeasurement,
  //       data.transfered_quantity === null ? "N/A" : data.transfered_quantity,
  //       data.received_quantity,
  //       data.set_quantity === 1 ? "N/A" : data.set_quantity,
  //       data.purchase_req_canvassed_prd.purchase_price,
  //       data.purchase_req_canvassed_prd.product_tag_supplier.product.UOM_set ===
  //       true
  //         ? (data.received_quantity * data.set_quantity) /
  //           data.purchase_req_canvassed_prd.purchase_price
  //         : data.purchase_req_canvassed_prd.purchase_price,
  //       data.receiving_po.freight_cost,
  //       data.receiving_po.customFee === null ? 0 : data.receiving_po.customFee,
  //       data.purchase_req_canvassed_prd.product_tag_supplier.product.UOM_set ===
  //       true
  //         ? data.received_quantity *
  //           data.set_quantity *
  //           ((data.received_quantity * data.set_quantity) /
  //             data.purchase_req_canvassed_prd.purchase_price +
  //             (data.receiving_po.customFee === null
  //               ? 0
  //               : data.receiving_po.customFee) +
  //             data.receiving_po.freight_cost)
  //         : data.received_quantity *
  //           data.set_quantity *
  //           (data.purchase_req_canvassed_prd.purchase_price +
  //             (data.receiving_po.customFee === null
  //               ? 0
  //               : data.receiving_po.customFee) +
  //             data.receiving_po.freight_cost),
  //     ]);
  //   });

  //   // Add totals row after processing all data
  //   const totalsRow = [
  //     "Overall Total:",
  //     "",
  //     "",
  //     // totalTransferProducts,
  //     // totalReceivedProducts,
  //     // Settotal,
  //     // totalPriceProducts,
  //     // totalPrice_qty,
  //     // totalFRProducts,
  //     // totalDCProducts,
  //     // total,
  //   ];
  //   formattedData.push(totalsRow);

  //   // Merge JSX content data with formatted data
  //   const mergedData = jsxContentData.concat(formattedData);

  //   // Convert data to CSV format
  //   const csvContent = mergedData.map((row) => row.join(",")).join("\n");

  //   // Create a Blob object with CSV data
  //   const blob = new Blob([csvContent], { type: "text/csv" });

  //   // Create a temporary link element
  //   const link = document.createElement("a");
  //   link.href = window.URL.createObjectURL(blob);
  //   link.download = `Receiving Report (PR: ${prNumber} / PO: ${poNum})`;

  //   // Trigger the download
  //   link.click();
  // };

  // -------------------- fetch data value --------------------- //
  useEffect(() => {
    const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/receiving/primaryData", {
          params: {
            id: id,
          },
        })
        .then((res) => {
          setReceivingID(res.data.primary.id);
          setPrNumber(res.data.primary.purchase_req.pr_num);
          setUsedFor(res.data.primary.purchase_req.used_for);
          setRemarks(res.data.primary.purchase_req.remarks);
          setDepartment(
            res.data.primary.purchase_req.masterlist.department.department_name
          );
          setRequestedBy(res.data.primary.purchase_req.masterlist.col_Fname);
          setStatus(res.data.primary.status);
          setDateCreated(res.data.primary.createdAt);
          setPoNum(res.data.primary.po_id);
          setRefnum(res.data.primary.ref_code);
          setRequestPr(res.data.primary.purchase_req.createdAt);
          setDate_received(res.data.primary.date_received);
          setApproveddate(res.data.primary.purchase_req.date_approved);
          setSI(res.data.primary.SI);
          setDR(res.data.primary.DR);
          setIsPOComplete(res.data.primary.initialReceive);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }, 1000);

    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      // console.log(`receivingID ${receivingID}`)
      axios
        .get(BASE_URL + "/receiving/secondaryData", {
          params: {
            receivingParent_id: id,
          },
        })
        .then((res) => {
          setproducts(res.data.product);
          setSupplierCode(
            res.data.product[0].purchase_req_canvassed_prd.product_tag_supplier
              .supplier.supplier_code
          );
          setSupplierName(
            res.data.product[0].purchase_req_canvassed_prd.product_tag_supplier
              .supplier.supplier_name
          );
          setSupplierTerms(
            res.data.product[0].purchase_req_canvassed_prd.product_tag_supplier
              .supplier.supplier_terms
          );
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }, 1000);

    return () => clearTimeout(delay);
  }, []);

  const handleApprove = () => {
    swal({
      title: "Are you sure?",
      text: "You are attempting to approve this receiving report",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (approve) => {
      if (approve) {
        const response = await axios.post(
          BASE_URL + "/receiving/approval",
          null,
          {
            params: {
              id: id,
              prod: products.map((data) => {
                let purchase_price =
                  parseFloat(data.purchase_req_canvassed_prd.purchase_price) *
                  (parseFloat(
                    data.purchase_req_canvassed_prd.product_tag_supplier
                      .supplier.supplier_vat
                  ) /
                    100 +
                    1);
                let Base_quantity = data.received_quantity;
                let set_quantity = data.set_quantity;
                let product_tag_id =
                  data.purchase_req_canvassed_prd.product_tag_supplier.id;
                let ref_code = data.receiving_po.ref_code;
                let freight_cost = data.receiving_po.freight_cost;
                let customFee = data.receiving_po.customFee;

                let totalPurchasePrice = purchase_price * Base_quantity;
                let perPiece_price =
                  totalPurchasePrice / (Base_quantity * set_quantity);
                return {
                  product_tag_supp_id: product_tag_id,
                  quantity: Base_quantity * set_quantity,
                  set_quantity: set_quantity,
                  perPiece_price: perPiece_price.toFixed(2),
                  ref_code: ref_code,
                  freight_cost: freight_cost,
                  customFee: customFee,
                };
              }),
            },
          }
        );

        if (response.status === 200) {
          swal({
            title: "Success",
            text: "Receiving report approved successfully",
            icon: "success",
          }).then(() => {
            navigate("/receivingManagement");
          });
        } else {
          swal({
            title: "Something went wrong",
            text: "Please contact your support immediately",
            icon: "error",
            dangerMode: true,
          });
        }
      }
    });
  };

  const handleReject = () => {
    swal({
      title: "Reject this receiving report?",
      text: "Once rejected, you cannot undo this action.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (approve) => {
      if (approve) {
        try {
          await axios
            .post(BASE_URL + "/receiving/rejection", null, {
              params: {
                id: id,
                refnum: refnum,
                prod: products.map((data) => {
                  let canvassed_id = data.purchase_req_canvassed_prd.id;
                  let quantity = data.received_quantity;

                  return {
                    canvassed_id: canvassed_id,
                    quantityTOReject: quantity,
                  };
                }),
              },
            })
            .then((res) => {
              if (res.status === 200) {
                swal({
                  title: "Success",
                  text: "Receiving report rejected successfully",
                  icon: "success",
                }).then(() => {
                  navigate("/receivingManagement");
                });
              } else {
                swal({
                  title: "Something went wrong",
                  text: "Please contact your support immediately",
                  icon: "error",
                  dangerMode: true,
                });
              }
            });
        } catch (error) {
          swal({
            title: "Something went wrong",
            text: "Please contact your support immediately",
            icon: "error",
            dangerMode: true,
          });
          console.log(error);
        }
      }
    });
  };
//wag paki alaman paki usap -chester
  // const handleRetrack = () => {
  //   swal({
  //     title: "Are you sure?",
  //     text: "You are attempting to retack the inventory price",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then(async (approve) => {
  //     if (approve) {
  //       try {
  //         await axios
  //           .post(BASE_URL + "/receiving/retrack")

  //           .then((res) => {
  //             if (res.status === 200) {
  //               swal({
  //                 title: "Success",
  //                 text: "Inventory price retacked successfully",
  //                 icon: "success",
  //               });
  //             } else {
  //               swal({
  //                 title: "Something went wrong",
  //                 text: "Please contact your support immediately",
  //                 icon: "error",
  //                 dangerMode: true,
  //               });
  //             }
  //           });
  //       } catch (error) {
  //         swal({
  //           title: "Something went wrong",
  //           text: "Please contact your support immediately",
  //           icon: "error",
  //           dangerMode: true,
  //         });
  //         console.log(error);
  //       }
  //     }
  //   });
  // };

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

  // currentDAte
  const currentDate = new Date();

  // Options for formatting the date and time
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Manila", // Set time zone to Manila, Philippines
  };

  // Format the date and time according to the options
  const formattedDate = currentDate.toLocaleDateString("en-PH", options);

  const handleSetDate = () => {
    if (date_receivedTOedit) {
      swal({
        title: "Are you sure?",
        text: "Changes cannot be undone",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (approve) => {
        if (approve) {
          try {
            await axios
              .post(BASE_URL + "/receiving/setDate", null, {
                params: {
                  id,
                  date_received: date_receivedTOedit,
                },
              })
              .then((res) => {
                if (res.status === 200) {
                  swal({
                    title: "Success",
                    text: "Date received successfully updated",
                    icon: "success",
                  }).then(() => {
                    setDate_received(date_receivedTOedit);
                    // window.location.reload();
                  });
                } else {
                  swal({
                    title: "Something went wrong",
                    text: "Please contact your support immediately",
                    icon: "error",
                    dangerMode: true,
                  });
                }
              });
          } catch (error) {
            console.log(error);
            swal({
              title: "Something went wrong",
              text: "Please contact your support immediately",
              icon: "error",
              dangerMode: true,
            });
          }
        }
      });
    } else {
      swal({
        title: "Oppss",
        text: "Please input receiving date first",
        icon: "error",
        buttons: true,
        dangerMode: true,
      });
    }
  };

  // useEffect(() => {
  //   // Initialize DataTable when role data is available
  //   if ($("#order-listing").length > 0 && Transaction_prd.length > 0) {
  //     $("#order-listing").DataTable();
  //   }
  // }, [Transaction_prd]);
  // For Total initial Received in agusan del sur
  // const totalTransferProducts = products.reduce(
  //   (total, data) => total + data.transfered_quantity,
  //   0
  // );
  // const totalTransfer = totalTransferProducts;

  // // For Total Purchased Price (UOM)
  // const totalPriceProducts = products.reduce(
  //   (total, data) => total + data.purchase_req_canvassed_prd.purchase_price,
  //   0
  // );
  // const totalPrice = totalPriceProducts;

  // // For Total Purchased Price (/qty)
  // const totalPriceProducts_qty = products.reduce(
  //   (total, data) => {
  //     if (
  //       data.purchase_req_canvassed_prd.product_tag_supplier.product.UOM_set ===
  //       true
  //     ) {
  //       return (
  //         total +
  //         (data.received_quantity * data.set_quantity) /
  //           data.purchase_req_canvassed_prd.purchase_price
  //       );
  //     } else {
  //       return total + data.purchase_req_canvassed_prd.purchase_price;
  //     }
  //   },
  //   0 // Initial value of total
  // );

  // const totalPrice_qty = totalPriceProducts_qty;

  // // For Total Received in agusan del sur
  // const totalReceivedProducts = products.reduce(
  //   (total, data) => total + data.received_quantity,
  //   0
  // );
  // // Calculate total received for products + assembly
  // const totalReceived = totalReceivedProducts;

  // // FOr Total Freight Cost

  // const totalFRProducts = products.reduce(
  //   (total, data) => total + data.receiving_po.freight_cost,
  //   0
  // );
  // // Calculate total received for products + assembly
  // const totalFR = totalFRProducts;

  // // FOr Total Duties Cost

  // const totalDCProducts = products.reduce(
  //   (total, data) =>
  //     total +
  //     (data.receiving_po.customFee === null ? 0 : data.receiving_po.customFee),
  //   0
  // );

  // // Calculate total received for products + assembly
  // const totalDC = totalDCProducts;

  // const totalSetProducts = products.reduce(
  //   (total, data) => total + data.set_quantity,
  //   0
  // );

  // // Calculate total received for products + assembly
  // const Settotal = totalSetProducts;

  // // FOr Total total quantity andprice

  // const totalProducts = products.reduce(
  //   (total, data) =>
  //     total +
  //     data.purchase_req_canvassed_prd.purchase_price *
  //       data.received_quantity *
  //       data.set_quantity +
  //     ((data.receiving_po.customFee === null
  //       ? 0
  //       : data.receiving_po.customFee) +
  //       data.receiving_po.freight_cost),
  //   0
  // );

  // // Calculate total received for products + assembly
  // const total = totalProducts;

  return (
    <div className="main-of-containers">
      {/* <div className="left-of-main-containers">
            <Sidebar/>
        </div> */}
      <div className="right-of-main-containers">
        {isLoading ? (
          <div className="loading-container">
            <ReactLoading className="react-loading" type={"bubbles"} />
            Loading Data...
          </div>
        ) : authrztn.includes("Receiving - View") ? (
          <div className="right-body-contents-a">
            <Row>
              <Col>
                <div
                  className="create-head-back"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Link
                    style={{ fontSize: "1.5rem" }}
                    to="/receivingManagement"
                  >
                    <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                  </Link>
                  <h1>Receiving Management Preview</h1>
                </div>
              </Col>
            </Row>

            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "20px",
                fontFamily: "Poppins, Source Sans Pro",
              }}
            >
              Purchase Request Details
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "81%",
                  left: "26rem",
                  transform: "translateY(-50%)",
                }}
              ></span>
            </div>
            {/* wag pakialaman -chester */}
            {/* {userId === 1 && (
              <Button variant="warning" onClick={handleRetrack}>
                Retrack
              </Button> // this is for retracting the inventory price. it must wiith vat added already
            )} */}

            <div className="row">
              <div className="col-sm">
                <Form.Label
                  style={{
                    fontSize: "20px",
                    fontFamily: "Poppins, Source Sans Pro",
                  }}
                >
                  Information{" "}
                </Form.Label>
                <div className="receive-container">
                  <div className="row">
                    <div className="col-6">
                      <div className="receiving_list d-flex flex-direction-column">
                        <ul>
                          <li>
                            <p>{`PR #: ${prNumber}`}</p>
                          </li>
                          <li>{`Requested by: ${requestedBy}`}</li>
                          <li>{`Department: ${department}`}</li>
                          <li>{`To be used for: ${usedFor}`}</li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="receiving_list_right d-flex flex-direction-column">
                        <ul>
                          <li>
                            <p className="h4">{`Received date: ${date_received}`}</p>
                          </li>
                          <li>
                            <p className="h4">{`PO products: ${isPOComplete}`}</p>
                          </li>

                          <li>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Circle
                                weight="fill"
                                size={20}
                                color="green"
                                style={{ margin: "10px" }}
                              />
                              <p style={{ margin: "10px", fontSize: 24 }}>
                                {status}
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label
                    style={{
                      fontSize: "20px",
                      fontFamily: "Poppins, Source Sans Pro",
                    }}
                  >
                    Remarks{" "}
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter details name"
                    value={remarks}
                    as="textarea"
                    readOnly
                    rows={3}
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
              </div> */}
            </div>

            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "20px",
                fontFamily: "Poppins, Source Sans Pro",
              }}
            >
              Purchase Order No. {poNum}
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "81%",
                  left: "30rem",
                  transform: "translateY(-50%)",
                }}
              ></span>
            </div>

            <div className="table-containss">
              <div className="main-of-all-tables">
                <table className="table-hover" id="order-listing">
                  <thead>
                    <tr>
                      <th className="tableh">Product Code</th>
                      <th className="tableh">Product Name</th>
                      <th className="tableh">Unit of Measurement</th>
                      <th className="tableh">Quantity Received</th>
                      <th className="tableh">Price</th>
                      <th className="tableh">Freight Cost</th>
                      <th className="tableh">Duties & Customs Cost </th>
                    </tr>
                  </thead>
                  {products && products.length > 0 ? (
                    <tbody>
                      {products.map((data, i) => (
                        <tr key={i}>
                          <td>
                            {
                              data.purchase_req_canvassed_prd
                                .product_tag_supplier.product.product_code
                            }
                          </td>
                          <td>
                            {
                              data.purchase_req_canvassed_prd
                                .product_tag_supplier.product.product_name
                            }
                          </td>
                          <td>
                            {
                              data.purchase_req_canvassed_prd
                                .product_tag_supplier.product
                                .product_unitMeasurement
                            }
                          </td>
                          <td>{data.received_quantity}</td>

                          <td>
                            {(
                              data.purchase_req_canvassed_prd
                                .product_tag_supplier.product_price *
                              (data.purchase_req_canvassed_prd
                                .product_tag_supplier.supplier.supplier_vat /
                                100 +
                                1)
                            ).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td>
                            {data.receiving_po.freight_cost === null
                              ? "Pending Cost"
                              : data.receiving_po.freight_cost.toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                          </td>
                          <td>
                            {data.receiving_po.customFee === null
                              ? "Pending Cost"
                              : data.receiving_po.customFee.toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <div className="no-data">
                      <img src={NoData} alt="NoData" className="no-data-img" />
                      <h3>No Data Found</h3>
                    </div>
                  )}
                </table>
              </div>

              <Button
                variant="warning"
                type="submit"
                size="lg"
                className="fs-5 lg mt-3"
                onClick={(e) => setShow(true)}
              >
                Preview
              </Button>
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
        show={show}
        onHide={handleClose}
        backdrop="static"
        dialogClassName="custom-modal_ReceivingPreview"
      >
        <Modal.Header closeButton>
          <Modal.Title>Generation of report</Modal.Title>
        </Modal.Header>
        <Modal.Body id="modal-body">
          {/* receipt-content */}
          <div className="">
            <div className="row">
              <div className="col-9">
                <div className="receipt-header">
                  <div className="sbflogoes rcv-logoes">
                    <img src={SBFLOGO} alt="" />
                  </div>
                  <div className="sbftexts">
                    <span>SBF PHILIPPINES DRILLING </span>
                    <span>RESOURCES CORPORATION</span>
                    <span className="po-loc">
                      Padigusan, Sta.Cruz, Rosario, Agusan del sur
                    </span>
                    <span className="po-loc">Landline No. 0920-949-3373</span>
                    <span className="po-loc">
                      Email Address: sbfpdrc@gmail.com
                    </span>
                  </div>
                  <div className="spacesbf"></div>
                </div>
              </div>

              <div className="col-3 rcv-date">
                {date_received === null ? (
                  <>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label className="fs-3">
                        Please input actual date received :
                      </Form.Label>

                      <div className="d-flex flex-row p-0">
                        <Form.Control
                          onChange={(e) =>
                            setDate_receivedTOedit(e.target.value)
                          }
                          type="date"
                          value={date_receivedTOedit}
                          style={{
                            fontFamily: "Poppins, Source Sans Pro",
                            fontSize: "16px",
                          }}
                        />
                        <Button onClick={handleSetDate} className="mx-2 fs-3">
                          Set
                        </Button>
                      </div>
                    </Form.Group>
                  </>
                ) : (
                  <>
                    <li className="fs-3">
                      {`Date Received: ${date_received}`}{" "}
                    </li>
                  </>
                )}

                <li className="fs-3">
                  {`Request Date: ${formatDatetime(requestPr)}`}{" "}
                </li>
              </div>
            </div>

            <div className="reportBody">
              <div
                className="bodyHead  w-100"
                style={{
                  textAlign: "center",
                  fontSize: "22px",
                  fontFamily: "Poppins, Source Sans Pro",
                  letterSpacing: "3px",
                }}
              >
                <li>PO Receiving Report</li>
                <li>{`PO Number: ${poNum}`} </li>
                <li>{`Reference Number: ${refnum}`} </li>
                <li>Receipts shown are the total for this Purchase Order.</li>
              </div>
              <div className="row mt-5">
                <div
                  className="col-6"
                  style={{
                    fontFamily: "Poppins, Source Sans Pro",
                    fontSize: "13px",
                    letterSpacing: "2px",
                    fontWeight: "600",
                  }}
                >
                  <li>{`Vendor Code: ${supplierCode}`} </li>
                  <li>{`Vendor: ${supplierName}`}</li>
                  <li>{`Terms: ${supplierTerms}`}</li>
                </div>
                <div
                  className="col-6"
                  style={{
                    fontFamily: "Poppins, Source Sans Pro",
                    fontSize: "13px",
                    letterSpacing: "2px",
                    fontWeight: "600",
                  }}
                >
                  <div className="right" style={{ float: "right" }}>
                    <li>{`PR Number: ${prNumber}`}</li>
                    <li>{`SI No. : ${SI === null ? "--" : SI}`} </li>
                    <li>{`DR No. : ${DR === null ? "--" : DR}`} </li>
                  </div>
                </div>
              </div>

              <div className="content mt-5">
                <div className="table-containss">
                  <div className="main-of-all-tables">
                    <table className="table-hover" id="order-listings">
                      <thead>
                        <tr>
                          <th className="tableh">Code</th>
                          <th className="tableh">Product</th>
                          <th className="tableh">UOM</th>
                          <th className="tableh">Initial Received</th>
                          <th className="tableh">Received</th>
                          <th className="tableh">Set</th>
                          <th className="tableh">Purchased Price (UOM)</th>
                          <th className="tableh">Total Price (UOM)</th>
                          <th className="tableh">Freight Cost (/qty)</th>
                          <th className="tableh">
                            Duties & Customs Cost (/qty)
                          </th>
                          <th className="tableh">Landed Cost (/qty)</th>
                          <th className="tableh">Total Landed Cost</th>
                          {/* <th className="tableh">VAT</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          // Initialize totals
                          let totalInitialReceived = 0;
                          let totalReceived = 0;
                          let totalSet = 0;
                          let totalPurchasedPrice = 0;
                          let totalTotalPrice = 0;
                          let totalFreightCost = 0;
                          let totalCustomFee = 0;
                          let totalLandedCostOverAll = 0;
                          let totalTotalLandedCost = 0;
                          let totalVat = 0;

                          // Map through products and calculate totals
                          const rows = products.map((data, i) => {
                            const {
                              purchase_req_canvassed_prd: {
                                product_tag_supplier: { product },
                                purchase_price,
                              },
                              purchase_req_canvassed_prd: {
                                product_tag_supplier: { supplier },
                              },
                              transfered_quantity,
                              received_quantity,
                              set_quantity,
                              receiving_po: { freight_cost, customFee },
                            } = data;

                            const VAT = supplier.supplier_vat || 0;
                            const purchasePriceWithVAT = (
                              purchase_price *
                              (VAT / 100 + 1)
                            ).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            });

                            const customFeeValue = customFee || 0;
                            const freight_cost_value = freight_cost || 0;

                            const unitCost = product.UOM_set
                              ? parseFloat(purchasePriceWithVAT) /
                                  set_quantity +
                                freight_cost_value +
                                customFeeValue
                              : parseFloat(purchasePriceWithVAT) +
                                freight_cost_value +
                                customFeeValue;

                            const totalLandedCost = product.UOM_set
                              ? unitCost * set_quantity * received_quantity
                              : unitCost * received_quantity;

                            const vatPrice = totalLandedCost;

                            // Update totals
                            totalInitialReceived += transfered_quantity || 0;
                            totalReceived += received_quantity || 0;
                            totalSet += set_quantity === 1 ? 0 : set_quantity;
                            totalPurchasedPrice +=
                              parseFloat(purchasePriceWithVAT) || 0;
                            totalTotalPrice +=
                              received_quantity * purchasePriceWithVAT || 0;
                            totalFreightCost += freight_cost_value || 0;
                            totalCustomFee += customFeeValue || 0;
                            totalLandedCostOverAll += unitCost || 0;
                            totalTotalLandedCost += totalLandedCost || 0;
                            totalVat += vatPrice;

                            return (
                              <tr key={i}>
                                <td>{product.product_code}</td>
                                <td>{product.product_name}</td>
                                <td>{product.product_unitMeasurement}</td>
                                <td>
                                  {transfered_quantity === null
                                    ? "N/A"
                                    : transfered_quantity}
                                </td>
                                <td>{received_quantity}</td>
                                <td>
                                  {set_quantity === 1 ? "N/A" : set_quantity}
                                </td>
                                <td>{purchasePriceWithVAT}</td>
                                <td>
                                  {(
                                    purchasePriceWithVAT * received_quantity
                                  ).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </td>
                                <td>
                                  {freight_cost_value.toLocaleString(
                                    undefined,
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </td>
                                <td>
                                  {customFeeValue.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </td>
                                <td>
                                  {unitCost.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </td>
                                <td>
                                  {totalLandedCost.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </td>
                                {/* <td>
                                  {vatPrice.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </td> */}
                              </tr>
                            );
                          });

                          // Add the totals row
                          rows.push(
                            <tr key="totals" className="bg-body-secondary">
                              <td colSpan="3">Overall Total:</td>
                              <td>{totalInitialReceived}</td>
                              <td>{totalReceived}</td>
                              <td>{totalSet}</td>
                              <td>
                                {totalPurchasedPrice.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                              <td>
                                {totalTotalPrice.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                              <td>
                                {totalFreightCost.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                              <td>
                                {totalCustomFee.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                              <td>
                                {totalLandedCostOverAll.toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </td>
                              <td>
                                {totalTotalLandedCost.toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </td>
                              {/* <td>
                                {totalVat.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td> */}
                            </tr>
                          );

                          return rows;
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between align-items-center">
          <div>
            <Button
              onClick={exportToPDF}
              className="btn btn-primary me-2"
              style={{ fontSize: "16px", padding: "10px 20px" }}
            >
              <i className="fas fa-file-pdf me-2"></i>Export to PDF
            </Button>
            <Button
              onClick={exportToExcel}
              className="btn btn-success"
              style={{ fontSize: "16px", padding: "10px 20px" }}
            >
              <i className="fas fa-file-excel me-2"></i>Download Excel
            </Button>
          </div>

          {status !== "Delivered" && (
            <div>
              <Button
                onClick={handleApprove}
                className="btn btn-warning me-2"
                style={{ fontSize: "16px", padding: "10px 20px" }}
              >
                Approve
              </Button>
              <Button
                onClick={handleReject}
                className="btn btn-danger"
                style={{ fontSize: "16px", padding: "10px 20px" }}
              >
                Reject
              </Button>
            </div>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ReceivingPreview;

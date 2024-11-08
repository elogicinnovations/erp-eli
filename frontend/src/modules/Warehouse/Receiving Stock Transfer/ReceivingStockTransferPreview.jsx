import React, { useEffect, useState } from "react";
import Sidebar from "../../Sidebar/sidebar";
import ReactLoading from "react-loading";
import NoData from "../../../assets/image/NoData.png";
import NoAccess from "../../../assets/image/NoAccess.png";
import "../../../assets/global/style.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../styles/react-style.css";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  ArrowCircleLeft,
  Plus,
  Paperclip,
  DotsThreeCircle,
  CalendarBlank,
  PlusCircle,
  Circle,
  ArrowUUpLeft,
} from "@phosphor-icons/react";
import axios from "axios";
import BASE_URL from "../../../assets/global/url";
import swal from "sweetalert";

import * as $ from "jquery";
import { jwtDecode } from "jwt-decode";

function ReceivingStockTransferPreview({ authrztn }) {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);

  const { id } = useParams();
  const [source, setSource] = useState();
  const [source_id, setSource_id] = useState();
  const [destination, setDestination] = useState();
  const [destination_id, setDestination_id] = useState();
  const [referenceCode, setReferenceCode] = useState();
  const [users, setUsers] = useState();
  const [remarks, setRemarks] = useState();
  const [status, setStatus] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [dateCreated, setDateCreated] = useState();
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

  // -------------------- fetch data value --------------------- //
  useEffect(() => {
    const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/StockTransfer/viewToReceiveStockTransfer", {
          params: {
            id: id,
          },
        })
        .then((res) => {
          setSource(res.data[0].SourceWarehouse.warehouse_name);
          setSource_id(res.data[0].SourceWarehouse.id);
          setDestination(res.data[0].DestinationWarehouse.warehouse_name);
          setDestination_id(res.data[0].DestinationWarehouse.id);
          setReferenceCode(res.data[0].reference_code);
          setUsers(res.data[0].approver.col_Fname);
          setRemarks(res.data[0].remarks);
          setStatus(res.data[0].status);
          setDateCreated(res.data[0].date_approved);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }, 1000);

    return () => clearTimeout(delay);
  }, []);
  // -------------------- end fetch data value --------------------- //

  const [products, setProducts] = useState([]);
  const [assembly, setAssembly] = useState([]);
  const [sparePart, setSparePart] = useState([]);
  const [subPart, setSubPart] = useState([]);
  const [qualityAssurancePRD, setQualityAssurancePRD] = useState("false");
  const [qualityAssuranceASM, setQualityAssuranceASM] = useState("false");
  const [qualityAssuranceSpare, setQualityAssuranceSpare] = useState("false");
  const [qualityAssuranceSub, setQualityAssuranceSub] = useState("false");

  const [checkPRD, setCheckPRD] = useState(false);
  const [checkASM, setCheckASM] = useState(false);
  const [checkSpare, setCheckSpare] = useState(false);
  const [checkSub, setCheckSub] = useState(false);

  const reloadTable_prod = () => {
    // axios.get(BASE_URL + '/PR_PO/fetchView_product',{
    //   params:{
    //     id: id
    //   }
    // })
    //   .then(res => {
    //     setProducts(res.data);
    //   })
    //   .catch(err => console.log(err));
  };

  const reloadTable_asm = () => {
    // axios.get(BASE_URL + '/StockTransfer_assembly/fetchStockTransferAssembly',{
    //   params:{
    //     id: id
    //   }
    // })
    //   .then(res => setAssembly(res.data))
    //   .catch(err => console.log(err));
  };

  const reloadTable_spare = () => {
    // axios.get(BASE_URL + '/PR_PO/fetchView_spare',{
    //   params:{
    //     id: id
    //   }
    // })
    //   .then(res => setSparePart(res.data))
    //   .catch(err => console.log(err));
  };

  const reloadTable_subPart = () => {
    // axios.get(BASE_URL + '/PR_PO/fetchView_subpart',{
    //   params:{
    //     id: id
    //   }
    // })
    //   .then(res => setSubPart(res.data))
    //   .catch(err => console.log(err));
  };

  //fetch tables
  useEffect(() => {
    // reloadTable_prod()
    // reloadTable_asm()
    // reloadTable_spare()
    // reloadTable_subPart()
  }, []);

  // const [showModal, setShowModal] = useState(false);

  // const handleShow = () => setShowModal(true);

  // const handleClose = () => {
  //   setShowModal(false);
  // };

  // useEffect(() => {
  //   if ($('#order-listing').length > 0) {
  //     $('#order-listing').DataTable();
  //   }
  // }, []);

  // useEffect(() => {
  //   if ($('#order2-listing').length > 0) {
  //     $('#order2-listing').DataTable();
  //   }
  // }, []);

  const [prodFetch, setProdFetch] = useState([]);
  const [asmFetch, setAsmFetch] = useState([]);
  const [spareFetch, setSpareFetch] = useState([]);
  const [subpartFetch, setSubpartFetch] = useState([]);
  useEffect(() => {
    axios
      .get(BASE_URL + "/StockTransfer/fetchProdutsPreview", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        const data = res.data;
        setProdFetch(data.product_db);
        setAsmFetch(data.asm_db);
        setSpareFetch(data.spare_db);
        setSubpartFetch(data.subpart_db);

        // console.log(`ss ${data}`);
        // setvaluePRassembly(selectedPRAssembly);
      })
      .catch((err) => console.log(err));
  }, [id]);

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

  const add = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      // if required fields has NO value
      swal({
        icon: "error",
        title: "Fields are required",
        text: "Please fill the red text fields",
      });
    } else {
      axios
        .post(`${BASE_URL}/stockTransfer/receivingProducts`, null, {
          params: {
            toWarehouse_id: destination_id,
            fromWarehouse_id: source_id,
            addProductbackend,
            addAsmbackend,
            addSparebackend,
            addSubpartbackend,
            id,
            userId,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            swal({
              title: "Stock Transfered Successfully",
              text: "The stock has been transferred",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate("/receivingStockTransfer");
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

  // //-----------------------------------Start of Received Product----------------------------------------//
  // const handleQuantityChange = (value, id, quantityReceived, quantityDelivered, prd_supplierID) => {

  //   const totalReceived = (quantityDelivered + value);

  //   if (parseInt(totalReceived) > parseInt(quantityReceived))
  //   {
  //     swal({
  //         icon: 'error',
  //         title: 'Something went wrong',
  //         text: 'Quantity received is not more than ordered quantity and quantity delivered',
  //     });
  //   }
  //   else
  //   {
  //     const totalValue = value + quantityDelivered;
  //     axios.post(BASE_URL + '/PR_PO/receivedPRD',
  //     {
  //       totalValue, id, quantityReceived, prd_supplierID
  //     })
  //     .then((res) => {
  //       if (res.status === 200) {
  //         swal({
  //           title: 'Received Successfully',
  //           text: 'The item has been added to inventory.',
  //           icon: 'success',
  //           button: 'OK'
  //         }).then(() => {
  //           // window.location.reload();
  //           reloadTable_prod()
  //           reloadTable_asm()
  //           reloadTable_spare()
  //           reloadTable_subPart()
  //         });
  //       } else {
  //       swal({
  //         icon: 'error',
  //         title: 'Something went wrong',
  //         text: 'Please contact our support'
  //       });
  //     }
  //     })
  //   }
  //   };

  //   const onChangeProd= (id) =>
  //   {
  //     if (qualityAssurancePRD === 'false')
  //     {
  //       setQualityAssurancePRD('true')
  //       setCheckPRD(true)
  //     } else {
  //       setQualityAssurancePRD('false')
  //       setCheckPRD(false)
  //     }
  //     axios.post(BASE_URL + '/PR_PO/receivedPRDQA',
  //       {
  //          id, qualityAssurancePRD
  //       })
  //       .then((res) => {
  //         if (res.status === 200) {
  //           swal({
  //             title: 'Received Successfully',
  //             text: 'The item has been added to inventory.',
  //             icon: 'success',
  //             button: 'OK'
  //           }).then(() => {
  //             // window.location.reload();
  //             reloadTable_prod()
  //             reloadTable_asm()
  //             reloadTable_spare()
  //             reloadTable_subPart()
  //           });
  //         } else {
  //         swal({
  //           icon: 'error',
  //           title: 'Something went wrong',
  //           text: 'Please contact our support'
  //         });
  //       }
  //       });
  //   }
  // //-----------------------------------End of Received Product----------------------------------------//

  // //-----------------------------------Start of Received Assembly----------------------------------------//
  const handleQuantityChangeAssembly = (
    value,
    id,
    quantityReceived,
    quantityDelivered
  ) => {
    // console.log(asm_suppID)
    const totalReceived = quantityDelivered + value;

    if (parseInt(totalReceived) > parseInt(quantityReceived)) {
      swal({
        icon: "error",
        title: "Something went wrong",
        text: "Quantity received is not more than ordered quantity and quantity delivered",
      });
    } else {
      const totalValue = value + quantityDelivered;
      axios
        .post(BASE_URL + "/StockTransfer/receivedAssembly", {
          totalValue,
          id,
          quantityReceived,
        })
        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Received Successfully",
              text: "The item has been added to inventory.",
              icon: "success",
              button: "OK",
            }).then(() => {
              // window.location.reload();
              reloadTable_prod();
              reloadTable_asm();
              reloadTable_spare();
              reloadTable_subPart();
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
  };

  const handleActiveStatusAssembly = (id) => {
    if (qualityAssuranceASM == "false") {
      setQualityAssuranceASM("true");
      setCheckASM(true);
    } else {
      setQualityAssuranceASM("false");
      setCheckASM(false);
    }

    axios
      .post(BASE_URL + "/PR_PO/receivedAssembly", {
        id,
        qualityAssuranceASM,
      })
      .then((res) => {
        if (res.status === 200) {
          swal({
            title: "Received Successfully",
            text: "The item has been added to inventory.",
            icon: "success",
            button: "OK",
          }).then(() => {
            // window.location.reload();
            reloadTable_prod();
            reloadTable_asm();
            reloadTable_spare();
            reloadTable_subPart();
          });
        } else {
          swal({
            icon: "error",
            title: "Something went wrong",
            text: "Please contact our support",
          });
        }
      });
  };
  // //-----------------------------------End of Received Assembly----------------------------------------//
  // //-----------------------------------Start of Received Spare Part----------------------------------------//
  // const handleQuantityChangeSparePart = (value, id, quantityReceived, quantityDelivered, spare_suppID) => {

  //   const totalReceived = (quantityDelivered + value);

  //   if (parseInt(totalReceived) > parseInt(quantityReceived))
  //   {
  //     swal({
  //         icon: 'error',
  //         title: 'Something went wrong',
  //         text: 'Quantity received is not more than ordered quantity and quantity delivered',
  //     });
  //   }
  //   else
  //   {
  //     const totalValue = value + quantityDelivered;
  //     axios.post(BASE_URL + '/PR_PO/receivedSparePart',
  //     {
  //       totalValue, id, quantityReceived, spare_suppID
  //     })
  //     .then((res) => {
  //       if (res.status === 200) {
  //         swal({
  //           title: 'Received Successfully',
  //           text: 'The item has been added to inventory.',
  //           icon: 'success',
  //           button: 'OK'
  //         }).then(() => {
  //           // window.location.reload();
  //           reloadTable_prod()
  //           reloadTable_asm()
  //           reloadTable_spare()
  //           reloadTable_subPart()
  //         });
  //       } else {
  //       swal({
  //         icon: 'error',
  //         title: 'Something went wrong',
  //         text: 'Please contact our support'
  //       });
  //     }
  //     })
  //   }
  //   };

  //   const handleActiveStatusSparePart= (id) =>
  //   {

  //     if (qualityAssuranceSpare === 'false')
  //     {
  //       setQualityAssuranceSpare('true')
  //       setCheckSpare(true)
  //     } else {
  //       setQualityAssuranceSpare('false')
  //       setCheckSpare(false)
  //     }

  //       axios.post(BASE_URL + '/PR_PO/receivedSparePart',
  //       {
  //         id, qualityAssuranceSpare
  //       })
  //       .then((res) => {
  //         if (res.status === 200) {
  //           swal({
  //             title: 'Received Successfully',
  //             text: 'The item has been added to inventory.',
  //             icon: 'success',
  //             button: 'OK'
  //           }).then(() => {
  //             // window.location.reload();
  //             reloadTable_prod()
  //             reloadTable_asm()
  //             reloadTable_spare()
  //             reloadTable_subPart()
  //           });
  //         } else {
  //         swal({
  //           icon: 'error',
  //           title: 'Something went wrong',
  //           text: 'Please contact our support'
  //         });
  //       }
  //       });
  //   }
  // //-----------------------------------End of Received Spare Part----------------------------------------//
  // //-----------------------------------Start of Received Sub Part----------------------------------------//
  // const handleQuantityChangeSubPart = (value, id, quantityReceived, quantityDelivered, subpart_suppID) => {

  //   const totalReceived = (quantityDelivered + value);
  //   if (parseInt(totalReceived) > parseInt(quantityReceived))
  //   {
  //     swal({
  //         icon: 'error',
  //         title: 'Something went wrong',
  //         text: 'Quantity received is not more than ordered quantity and quantity delivered',
  //     });
  //   }
  //   else
  //   {
  //     const totalValue = value + quantityDelivered;
  //     axios.post(BASE_URL + '/PR_PO/receivedSubPart',
  //     {
  //       totalValue, id, quantityReceived, subpart_suppID
  //     })
  //     .then((res) => {
  //       if (res.status === 200) {
  //         swal({
  //           title: 'Received Successfully',
  //           text: 'The item has been added to inventory.',
  //           icon: 'success',
  //           button: 'OK'
  //         }).then(() => {
  //           // window.location.reload();
  //           reloadTable_prod()
  //           reloadTable_asm()
  //           reloadTable_spare()
  //           reloadTable_subPart()
  //         });
  //       } else {
  //       swal({
  //         icon: 'error',
  //         title: 'Something went wrong',
  //         text: 'Please contact our support'
  //       });
  //     }
  //     })
  //   }
  //   };

  //   const handleActiveStatusSubPart= (id) =>
  //   {
  //     if (qualityAssuranceSub === 'false')
  //     {
  //       setQualityAssuranceSub('true')
  //       setCheckSub(true)
  //     } else {
  //       setQualityAssuranceSub('false')
  //       setCheckSub(false)
  //     }

  //       axios.post(BASE_URL + '/PR_PO/receivedSubPart',
  //       {
  //         id, qualityAssuranceSub
  //       })
  //       .then((res) => {
  //         if (res.status === 200) {
  //           swal({
  //             title: 'Received Successfully',
  //             text: 'The item has been added to inventory.',
  //             icon: 'success',
  //             button: 'OK'
  //           }).then(() => {
  //             // window.location.reload();
  //             reloadTable_prod()
  //             reloadTable_asm()
  //             reloadTable_spare()
  //             reloadTable_subPart()
  //           });
  //         } else {
  //         swal({
  //           icon: 'error',
  //           title: 'Something went wrong',
  //           text: 'Please contact our support'
  //         });
  //       }
  //       });
  //   }
  // //-----------------------------------End of Received Sub Part----------------------------------------//

  const handleDoneReceived = () => {
    axios
      .post(BASE_URL + "/PR_PO/transactionDelivered", null, {
        params: {
          id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          swal({
            title: "Update Succesful",
            text: "The Purchase Transaction has successfull tagged as delivered",
            icon: "success",
            button: "OK",
          }).then(() => {
            navigate("/receivingManagement");
          });
        } else {
          swal({
            icon: "error",
            title: "Something went wrong",
            text: "Please contact our support",
          });
        }
      });
  };

  const [addProductbackend, setAddProductbackend] = useState([]); // para sa pag ng product na e issue sa backend
  const [quantityInputs, setQuantityInputs] = useState({});

  const handleQuantityChange = (
    inputValue,
    productValue,
    product_quantity_available
  ) => {
    // Remove non-numeric characters and limit length to 10
    const cleanedValue = inputValue.replace(/\D/g, "").substring(0, 10);

    // Convert cleanedValue to a number
    const numericValue = parseInt(cleanedValue, 10);

    // Create a variable to store the corrected value
    let correctedValue = cleanedValue;

    // Check if the numericValue is greater than the available quantity
    if (numericValue > product_quantity_available) {
      // If greater, set the correctedValue to the maximum available quantity
      correctedValue = product_quantity_available.toString();

      swal({
        icon: "error",
        title: "Input value exceed",
        text: "Please enter a quantity within the available limit.",
      });
    }

    setQuantityInputs((prevInputs) => {
      const updatedInputs = {
        ...prevInputs,
        [productValue]: correctedValue,
      };

      // Use the updatedInputs directly to create the serializedProducts array
      const serializedProducts = prodFetch.map((product) => ({
        quantity: updatedInputs[product.id] || "",
        product_id: product.product_id,
        // prodsuppId: product.inventory_prd.product_tag_supplier.id,
        // type: product.type,
        // inventory_id: product.inventory_id,
        // code: product.code,
        // name: product.name,
        // quantity_available: product.quantity_available,
        // desc: product.desc,
      }));

      setAddProductbackend(serializedProducts);
      console.log("Selected Products:", serializedProducts);

      // Return the updatedInputs to be used as the new state
      return updatedInputs;
    });
  };
  // console.log("PRODUCTS" + prodFetch);

  const [addAsmbackend, setAddAsmbackend] = useState([]); // para sa pag ng product na e issue sa backend
  const [quantityInputs_asm, setQuantityInputs_asm] = useState({});

  const handleQuantityChange_asm = (
    inputValue,
    productValue,
    product_quantity_available
  ) => {
    // Remove non-numeric characters and limit length to 10
    const cleanedValue = inputValue.replace(/\D/g, "").substring(0, 10);

    // Convert cleanedValue to a number
    const numericValue = parseInt(cleanedValue, 10);

    // Create a variable to store the corrected value
    let correctedValue = cleanedValue;

    // Check if the numericValue is greater than the available quantity
    if (numericValue > product_quantity_available) {
      // If greater, set the correctedValue to the maximum available quantity
      correctedValue = product_quantity_available.toString();

      swal({
        icon: "error",
        title: "Input value exceed",
        text: "Please enter a quantity within the available limit.",
      });
    }

    setQuantityInputs_asm((prevInputs) => {
      const updatedInputs = {
        ...prevInputs,
        [productValue]: correctedValue,
      };

      // Use the updatedInputs directly to create the serializedProducts array
      const serializedProducts = asmFetch.map((product) => ({
        quantity: updatedInputs[product.id] || "",
        product_id: product.product_id,
        // assemblysuppId: product.inventory_assembly.assembly_supplier.id,

        // type: product.type,
        // inventory_id: product.inventory_id,
        // code: product.code,
        // name: product.name,
        // quantity_available: product.quantity_available,
        // desc: product.desc,
      }));

      setAddAsmbackend(serializedProducts);
      console.log("Selected Assembly:", serializedProducts);

      // Return the updatedInputs to be used as the new state
      return updatedInputs;
    });
  };

  const [addSparebackend, setAddSparebackend] = useState([]); // para sa pag ng product na e issue sa backend
  const [quantityInputs_spare, setQuantityInputs_spare] = useState({});

  const handleQuantityChange_spare = (
    inputValue,
    productValue,
    product_quantity_available
  ) => {
    // Remove non-numeric characters and limit length to 10
    const cleanedValue = inputValue.replace(/\D/g, "").substring(0, 10);

    // Convert cleanedValue to a number
    const numericValue = parseInt(cleanedValue, 10);

    // Create a variable to store the corrected value
    let correctedValue = cleanedValue;

    // Check if the numericValue is greater than the available quantity
    if (numericValue > product_quantity_available) {
      // If greater, set the correctedValue to the maximum available quantity
      correctedValue = product_quantity_available.toString();

      swal({
        icon: "error",
        title: "Input value exceed",
        text: "Please enter a quantity within the available limit.",
      });
    }

    setQuantityInputs_spare((prevInputs) => {
      const updatedInputs = {
        ...prevInputs,
        [productValue]: correctedValue,
      };

      // Use the updatedInputs directly to create the serializedProducts array
      const serializedProducts = spareFetch.map((product) => ({
        quantity: updatedInputs[product.id] || "",
        product_id: product.product_id,
        // sparesuppId: product.inventory_spare.sparepart_supplier.id,
        // type: product.type,
        // inventory_id: product.inventory_id,
        // code: product.code,
        // name: product.name,
        // quantity_available: product.quantity_available,
        // desc: product.desc,
      }));

      setAddSparebackend(serializedProducts);
      console.log("Selected Spare:", serializedProducts);

      // Return the updatedInputs to be used as the new state
      return updatedInputs;
    });
  };

  const [addSubpartbackend, setAddSubpartbackend] = useState([]); // para sa pag ng product na e issue sa backend
  const [quantityInputs_subpart, setQuantityInputs_subpart] = useState({});

  const handleQuantityChange_subpart = (
    inputValue,
    productValue,
    product_quantity_available
  ) => {
    // Remove non-numeric characters and limit length to 10
    const cleanedValue = inputValue.replace(/\D/g, "").substring(0, 10);

    // Convert cleanedValue to a number
    const numericValue = parseInt(cleanedValue, 10);

    // Create a variable to store the corrected value
    let correctedValue = cleanedValue;

    // Check if the numericValue is greater than the available quantity
    if (numericValue > product_quantity_available) {
      // If greater, set the correctedValue to the maximum available quantity
      correctedValue = product_quantity_available.toString();

      swal({
        icon: "error",
        title: "Input value exceed",
        text: "Please enter a quantity within the available limit.",
      });
    }

    setQuantityInputs_subpart((prevInputs) => {
      const updatedInputs = {
        ...prevInputs,
        [productValue]: correctedValue,
      };

      // Use the updatedInputs directly to create the serializedProducts array
      const serializedProducts = subpartFetch.map((product) => ({
        quantity: updatedInputs[product.id] || "",
        product_id: product.product_id,
        // subsuppId: product.inventory_subpart.subpart_supplier.id,
        // type: product.type,
        // inventory_id: product.inventory_id,
        // code: product.code,
        // name: product.name,
        // quantity_available: product.quantity_available,
        // desc: product.desc,
      }));

      setAddSubpartbackend(serializedProducts);
      console.log("Selected Subpart:", serializedProducts);

      // Return the updatedInputs to be used as the new state
      return updatedInputs;
    });
  };

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
                    to="/receivingStockTransfer"
                  >
                    <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                  </Link>
                  <h1>Receiving Stock Transfer Preview</h1>
                </div>
              </Col>
            </Row>
            <Form noValidate validated={validated} onSubmit={add}>
              <div
                className="gen-info"
                style={{
                  fontSize: "20px",
                  position: "relative",
                  paddingTop: "20px",
                  fontFamily: "Poppins, Source Sans Pro",
                }}
              >
                Stock Transfer Details
                <span
                  style={{
                    position: "absolute",
                    height: "0.5px",
                    width: "-webkit-fill-available",
                    background: "#FFA500",
                    top: "81%",
                    left: "22.3rem",
                    transform: "translateY(-50%)",
                  }}
                ></span>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="stockmain-section">
                    <div className="locationandtransferby">
                      <div className="locationtransfer">
                        <span>Transfer Location</span>
                        <span>
                          From: {source} --------- To: {destination}
                        </span>
                      </div>

                      <div className="transferby">
                        <span>Approved By</span>
                        <span>
                          <strong>{users}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="dateandtoreceive">
                      <div className="datefields">
                        <span>Date Approved</span>
                        <span>{formatDatetime(dateCreated)}</span>
                      </div>
                      <div className="toreceive">
                        <span>Status</span>
                        <span>
                          <Circle weight="fill" size={17} color="green" />
                          {status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      onChange={(e) => setRemarks(e.target.value)}
                      value={remarks}
                      readOnly
                      as="textarea"
                      rows={3}
                      style={{
                        fontFamily: "Poppins, Source Sans Pro",
                        fontSize: "16px",
                        height: "150px",
                        maxHeight: "150px",
                        resize: "none",
                        overflowY: "auto",
                      }}
                    />
                  </Form.Group>
                </div>
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
                Item List
                <span
                  style={{
                    position: "absolute",
                    height: "0.5px",
                    width: "-webkit-fill-available",
                    background: "#FFA500",
                    top: "81%",
                    left: "9rem",
                    transform: "translateY(-50%)",
                  }}
                ></span>
              </div>

              <div className="table-containss">
                <div className="main-of-all-tables">
                  <table id="order-listing">
                    <thead>
                      <tr>
                        <th className="tableh">Code</th>
                        <th className="tableh">Product Name</th>
                        <th className="tableh">UOM</th>
                        <th className="tableh">Quantity Transfer</th>
                        <th className="tableh">Quantity Received</th>
                        {/* <th className="tableh">Quality</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {prodFetch.map((data, i) => (
                        <tr key={data.id}>
                          <td>{data.product.product_code}</td>
                          <td>{data.product.product_name}</td>
                          <td>{data.product.product_unitMeasurement}</td>
                          <td>{data.quantity}</td>
                          <td>
                            <Form.Control
                              type="number"
                              value={quantityInputs[data.id] || ""}
                              onInput={(e) =>
                                handleQuantityChange(
                                  e.target.value,
                                  data.id,
                                  data.quantity
                                )
                              }
                              required
                              placeholder="Input quantity"
                              style={{
                                height: "30px",
                                width: "120px",
                                fontSize: "15px",
                              }}
                            />
                          </td>
                          {/* <td>
                          <div className="tab_checkbox">
                            <input
                              type="checkbox"
                              // onChange={(e) => onChangeProd(data.id)}
                              checked={
                                data.quality_assurance === "true" ? true : false
                              }
                            />
                          </div>
                        </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="save-cancel">
                <Button
                  type="submit"
                  // onClick={() => navigate(`/receivingManagement`)}
                  variant="warning"
                  size="md"
                  style={{ fontSize: "20px", margin: "0px 5px" }}
                >
                  Done
                </Button>
              </div>
            </Form>
          </div>
        ) : (
          <div className="no-access">
            <img src={NoAccess} alt="NoAccess" className="no-access-img" />
            <h3>You don't have access to this function.</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReceivingStockTransferPreview;

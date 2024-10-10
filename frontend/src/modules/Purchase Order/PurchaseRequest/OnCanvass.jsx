import React, { useEffect, useState } from "react";
import Sidebar from "../../Sidebar/sidebar";
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
import InputGroup from "react-bootstrap/InputGroup";
import SBFLOGO from "../../../assets/image/sbf_logoo_final.jpg";
import {
  ArrowCircleLeft,
  ShoppingCart,
  PlusCircle,
  NotePencil,
  XCircle,
  CalendarBlank,
  PencilSimple,
  Check,
} from "@phosphor-icons/react";
import axios from "axios";
import BASE_URL from "../../../assets/global/url";
import swal from "sweetalert";
import * as $ from "jquery";
import { jwtDecode } from "jwt-decode";

function PurchaseOrderListPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editRemarks, setEditRemarks] = useState(false);
  const [editUsedFor, setEditUsedFor] = useState(false);
  const [dateNeeded, setDateNeeded] = useState(null);
  const [prNum, setPRnum] = useState("");
  const [useFor, setUseFor] = useState("");
  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState("");
  const [selected_PR_Prod, setSelected_PR_Prod] = useState(""); // mag hold ng primary id ng na select na profduct sa table na purchase req product
  const [selected_PR_Prod_array, setSelected_PR_Prod_array] = useState([]); // mag hold ng primary id pag naka select na ng supplier para pang check if maynakaligtaan na product wala pa na PO e insert ito sa table na purchase req product
  const [validated, setValidated] = useState(false);
  const [editMode, setEditMode] = useState({});
  const [userId, setuserId] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
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

  const onInputFloat = (e) => {
    e.target.value = e.target.value.replace(/[^0-9.]/g, "");
  };

  //para sa assembly data na e canvass

  // for PRoduct canvassing
  //for adding the data from table canvass to table PO
  const [products, setProducts] = useState([]);
  const [suppProducts, setSuppProducts] = useState([]);
  const [selectedProductname, setSelectedProductname] = useState(""); //para sa pag display ng name sa header of product if mag canvass

  // for Assembly canvassing
  const [assembly, setAssembly] = useState([]);
  const [suppAssembly, setSuppAssembly] = useState([]);

  //for Spare canvassing
  const [spare, setSpare] = useState([]);
  const [suppSpare, setSuppSpare] = useState([]);

  //for Subpart canvassing
  const [subpart, setSubpart] = useState([]);
  const [suppSubpart, setSuppSubpart] = useState([]);

  const [showModal, setShowModal] = useState(false); //for product modal
  const [showModalAs, setShowModalAS] = useState(false); //for assembly modal
  const [showModalSpare, setShowModalspare] = useState(false); //for spare modal
  const [showModalSubpart, setShowModalSubpart] = useState(false); //for assembly modal

  const [showPreview, setShowPreview] = useState(false); //for assembly modal

  const handleClose = () => {
    setShowModal(false);
    setShowModalAS(false);
    setShowModalspare(false);
    setShowModalSubpart(false);
    setEditMode(false);
    setShowPreview(false);
  };

  const handleShowPreview = () => {
    setShowPreview(true);
  };

  useEffect(() => {
    axios
      .get(BASE_URL + "/PR_product/fetchPrProduct", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setProducts(res.data);
        const modifiedData = res.data.map((row) => ({
          id: row.id,
          isPO: row.isPO === null ? false : row.isPO,
        }));
        setSelected_PR_Prod_array(modifiedData);
        console.log(modifiedData);
      })
      .catch((err) => console.log(err));
  }, []);
  //   console.log(`selected_PR_Prod_array`)
  //  console.log(selected_PR_Prod_array)

  useEffect(() => {
    axios
      .get(BASE_URL + "/PR_assembly/fetchViewAssembly", {
        params: {
          id: id,
        },
      })
      .then((res) => setAssembly(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/PR_spare/fetchViewSpare", {
        params: { id: id },
      })
      .then((res) => setSpare(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/PR_subpart/fetchViewSubpart", {
        params: { id: id },
      })
      .then((res) => setSubpart(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/PR/fetchView", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        // console.log('Response data:', res.data); // Log the entire response data
        setPRnum(res.data.pr_num);
        // Update this line to parse the date string correctly
        const parsedDate = new Date(res.data.date_needed);
        setDateNeeded(parsedDate);
        setUseFor(res.data.used_for);
        setRemarks(res.data.remarks);
        setStatus(res.data.status);
        setDepartmentName(res.data.masterlist.department.department_name);
        setRequestedBy(res.data.masterlist.col_Fname);
      })
      .catch((err) => {
        console.error(err);
        // Handle error state or show an error message to the user
      });
  }, [id]);

  // const handleShow = () => setShowModal(true);

  const [productArrays, setProductArrays] = useState({});

  const [isArray, setIsArray] = useState(false);

  const [latestCount, setLatestCount] = useState("");
  useEffect(() => {
    axios
      .get(BASE_URL + "/invoice/lastPONumber")
      .then((res) => {
        setLatestCount(res.data.nextPoId);
      })
      .catch((err) => console.log(err));
  }, []);

  console.log(latestCount);

  const [parentArray, setParentArray] = useState([]);
  const [titleCounter, setTitleCounter] = useState(0);
  const [addPObackend, setAddPObackend] = useState([]);
  const [quantityInputs, setQuantityInputs] = useState({});
  const [daysInputs, setDaysInputs] = useState({});
  // const [isSend, setIsSend] = useState({});
  const [toBeUsedFor, setToBeUsedFor] = useState({});

  // const handleQuantityChange = (title, type, supplier_prod_id, value) => {
  //   setQuantityInputs((prevInputs) => {
  //     const updatedInputs = {
  //       ...prevInputs,
  //       [`${title}_${type}_${supplier_prod_id}`]: value,
  //     };

  //     // Use the updatedInputs directly to create the serializedParent array
  //     const serializedParent = parentArray.map(
  //       ({ title, supplierCode, array }) => {
  //         return {
  //           title,
  //           supplierCode,
  //           serializedArray: array.map((item) => ({
  //             quantity:
  //               updatedInputs[`${title}_${item.type}_${item.product.id}`] || "",
  //             type: item.type,
  //             prod_supplier: item.product.id,
  //           })),
  //         };
  //       }
  //     );
  //     setAddPObackend(serializedParent);
  //     // console.log(`supplier ${type}_${supplier_prod_id}`);
  //     console.log("Selected Products:", serializedParent);

  //     // Return the updatedInputs to be used as the new state
  //     return updatedInputs;
  //   });
  // };

  // const handleDaysChange = (title, value) => {
  //   setDaysInputs((prevInputs) => {
  //     const updatedInputs = {
  //       ...prevInputs,
  //       [`${title}`]: value,
  //     };

  //     // Use the updatedInputs directly to create the serializedParent array
  //     const serializedParent = parentArray.map(
  //       ({ title, supplierCode, array }) => {
  //         return {
  //           title,
  //           supplierCode,
  //           serializedArray: array.map((item) => ({
  //             daysfrom:
  //               updatedInputs[`${title}`]?.DaysFrom || "",
  //           })),
  //         };
  //       }
  //     );
  //     // setAddPObackend(serializedParent);
  //     // console.log(`supplier ${type}_${supplier_prod_id}`);
  //     console.log("Selected DAYS:", serializedParent);

  //     // Return the updatedInputs to be used as the new state
  //     return updatedInputs;
  //   });
  // };

  const handleQuantityChange = (title, type, supplier_prod_id, value) => {
    setQuantityInputs((prevInputs) => {
      const updatedInputs = {
        ...prevInputs,
        [`${title}_${type}_${supplier_prod_id}`]: value,
      };
      // console.log("Updated quantity inputs:", updatedInputs);
      updateAddPOBackend(title);
      return updatedInputs;
    });
  };

  const handleDaysFromChange = (title, value) => {
    setDaysInputs((prevInputs) => {
      const updatedInputs = {
        ...prevInputs,
        [`${title}`]: {
          ...prevInputs[`${title}`],
          DaysFrom: value,
        },
      };
      updateAddPOBackend(title);
      return updatedInputs;
    });
  };

  const handleDaysToChange = (title, value) => {
    setDaysInputs((prevInputs) => {
      const updatedInputs = {
        ...prevInputs,
        [`${title}`]: {
          ...prevInputs[`${title}`],
          DaysTo: value,
        },
      };
      updateAddPOBackend(title);
      return updatedInputs;
    });
  };

  const handleUsedForChange = (title, value) => {
    setToBeUsedFor((prevInputs) => {
      const updatedInputs = {
        ...prevInputs,
        [`${title}`]: {
          ...prevInputs[`${title}`],
          toBeUsedFor: value,
        },
      };
      updateAddPOBackend(title);
      // console.log(updatedInputs);
      return updatedInputs;
    });
  };

  // const handleClickISSend = (title, value) => {
  //   setIsSend((prevInputs) => {
  //     const updatedInputs = {
  //       ...prevInputs,
  //       [`${title}`]: {
  //         ...prevInputs[`${title}`],
  //         isSendEmail: value,
  //       },
  //     };
  //     updateAddPOBackend(title);
  //     return updatedInputs;
  //   });
  // };

  const updateAddPOBackend = (supplierTitle) => {
    const serializedParent = parentArray.map(
      ({ title, supplierCode, array }) => {
        return {
          title,
          supplierCode,
          serializedArray: array.map((item) => ({
            quantity:
              quantityInputs[`${title}_${item.type}_${item.product.id}`] || "",
            type: item.type,
            prod_supplier: item.product.id,
            prod_supplier_price: item.product.product_price,
            daysfrom: daysInputs[`${title}`]?.DaysFrom || "",
            daysto: daysInputs[`${title}`]?.DaysTo || "",
            usedFor: toBeUsedFor[`${title}`]?.toBeUsedFor || "",
            code: item.code,
            name: item.name,
            supp_email: item.supp_email,
            supplierName: item.supplierName,
            // product_data: item.product,
            uom: item.product.product.product_unitMeasurement,
            part_number:
              item.product.product.part_number === ""
                ? "--"
                : item.product.product.part_number,
            supplier_vat: item.product.supplier.supplier_vat,
            supplier_terms: item.product.supplier.supplier_terms,
            supplier_currency: item.product.supplier.supplier_currency,
          })),
        };
      }
    );
    setAddPObackend(serializedParent);
    console.log("Products:", parentArray);
    console.log("Selected Products:", serializedParent);
    // return serializedParent;
  };

  useEffect(() => {
    updateAddPOBackend();
  }, [quantityInputs, daysInputs, selected_PR_Prod_array, toBeUsedFor]);

  const handleAddToTable = (
    product,
    type,
    code,
    name,
    supp_email,
    product_price
  ) => {
    if (
      product_price === "" ||
      product_price === null ||
      parseFloat(product_price) === 0
    ) {
      swal({
        title: "Oppss!",
        text: "Please input price first",
        icon: "error",
      });
    } else {
      setSelected_PR_Prod_array((prevArray) =>
        prevArray.map((item) =>
          item.id === selected_PR_Prod ? { ...item, isPO: true } : item
        )
      );

      setProductArrays((prevArrays) => {
        const supplierCode = product.supplier.supplier_code;
        const supplierName = product.supplier.supplier_name;

        const newArray = (prevArrays[supplierCode] || []).slice();
        const isProductAlreadyAdded = newArray.some(
          (item) => item.product.id === product.id && item.type === type
        );

        if (!isProductAlreadyAdded) {
          setIsArray(true);

          newArray.push({
            type: type,
            product: product,
            code: code,
            name: name,
            supp_email: supp_email,
            supplierName: supplierName,
          });

          newArray.sort((a, b) => {
            const codeA = a.product.product_code || "";
            const codeB = b.product.product_code || "";
            return codeA.localeCompare(codeB);
          });

          // Check if there is an existing container for the supplier
          const existingContainerIndex = parentArray.findIndex(
            (container) => container.supplierCode === supplierCode
          );

          if (existingContainerIndex !== -1) {
            // If the container exists, update it
            const updatedParentArray = [...parentArray];
            updatedParentArray[existingContainerIndex].array = newArray;

            setParentArray(updatedParentArray);
          } else {
            // If the container doesn't exist, create a new one
            const newTitle = (parseInt(latestCount, 10) + titleCounter)
              // const newTitle = (parseInt(latestCount, 10))
              .toString()
              .padStart(8, "0");
            const newParentArray = [
              ...parentArray,
              {
                title: newTitle,
                supplierCode: supplierCode,
                array: newArray,
              },
            ];

            // Increment the title counter
            setTitleCounter(titleCounter + 1);

            // Update the state with the new parent array and supplier array
            setParentArray(newParentArray);
          }

          console.log("Parent Array:", parentArray);
          return { ...prevArrays, [supplierCode]: newArray };
        } else {
          swal({
            title: "Duplicate Product",
            text: "This product is already in the array.",
            icon: "error",
          });
          return prevArrays;
        }
      });
    }
  };

  // useEffect(() => {
  //   // console.log(`selected_PR_Prod_array`)
  //   // console.log(selected_PR_Prod_array)
  // }, [selected_PR_Prod_array]);

  const handleEditPrice = (index) => {
    setEditMode((prev) => ({ ...prev, [index]: true }));
  };

  const handleCancelEditPrice = (index) => {
    setEditMode((prev) => ({ ...prev, [index]: false }));
  };

  const handleUpdatePrice = (
    updatedPrice,
    id,
    index,
    product_id,
    supplier_code
  ) => {
    const updatedPriced = updatedPrice;
    const productSupplier_id = id;
    const product_ID = product_id;
    const supp_code = supplier_code;

    swal({
      allowEscapeKey: false,
      title: "Are you sure?",
      text: "Do you really want to update the supplier price?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((confirmed) => {
      if (confirmed) {
        axios
          .post(BASE_URL + "/canvass/updatePrice", {
            productSupplier_id,
            updatedPriced,
            supp_code,
            product_ID,
          })
          .then((res) => {
            if (res.status === 200) {
              swal({
                title: "Successfully Updated",
                text: "Supplier Price is updated to its new price",
                icon: "success",
              });

              setEditMode((prev) => ({ ...prev, [index]: false }));
              axios
                .get(BASE_URL + "/productTAGsupplier/fetchCanvass", {
                  params: {
                    id: product_ID,
                  },
                })
                .then((res) => {
                  setSuppProducts(res.data);
                })
                .catch((err) => console.log(err));
            }
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        // If the user cancels or closes the confirmation dialog
        swal("Update Canceled", "Supplier price remains unchanged.", "info");
        setEditMode((prev) => ({ ...prev, [index]: false }));
      }
    });
  };

  const handleUpdatePrice_asm = (
    updatedPrice,
    id,
    index,
    product_id,
    supplier_code
  ) => {
    const updatedPriced = updatedPrice;
    const productSupplier_id = id;
    const product_ID = product_id;
    const supp_code = supplier_code;

    swal({
      allowEscapeKey: false,
      title: "Are you sure?",
      text: "Do you really want to update the supplier price?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((confirmed) => {
      if (confirmed) {
        axios
          .post(BASE_URL + "/canvass/updatePrice_asm", {
            productSupplier_id,
            updatedPriced,
            product_ID,
            supp_code,
          })
          .then((res) => {
            if (res.status === 200) {
              swal({
                title: "Successfully Updated",
                text: "Supplier Price is updated to it's new price",
                icon: "success",
              });

              setEditMode((prev) => ({ ...prev, [index]: false }));
              axios
                .get(BASE_URL + "/supplier_assembly/fetchCanvass", {
                  params: {
                    id: product_ID,
                  },
                })
                .then((res) => {
                  setSuppAssembly(res.data);
                })
                .catch((err) => console.log(err));
            }
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        // If the user cancels or closes the confirmation dialog
        swal("Update Canceled", "Supplier price remains unchanged.", "info");
        setEditMode((prev) => ({ ...prev, [index]: false }));
      }
    });
  };

  const handleUpdatePrice_spare = (
    updatedPrice,
    id,
    index,
    product_id,
    supplier_code
  ) => {
    const updatedPriced = updatedPrice;
    const productSupplier_id = id;
    const product_ID = product_id;
    const supp_code = supplier_code;

    swal({
      allowEscapeKey: false,
      title: "Are you sure?",
      text: "Do you really want to update the supplier price?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((confirmed) => {
      // If the user confirms, proceed with the update
      if (confirmed) {
        axios
          .post(BASE_URL + "/canvass/updatePrice_spare", {
            productSupplier_id,
            updatedPriced,
            supp_code,
            product_ID,
          })
          .then((res) => {
            if (res.status === 200) {
              swal({
                title: "Successfully Updated",
                text: "Supplier Price is updated to it's new price",
                icon: "success",
              });

              setEditMode((prev) => ({ ...prev, [index]: false }));
              axios
                .get(BASE_URL + "/supp_SparePart/fetchCanvass", {
                  params: {
                    spare_ID: product_ID,
                  },
                })
                .then((res) => {
                  setSuppSpare(res.data);
                })
                .catch((err) => console.log(err));
            }
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        // If the user cancels or closes the confirmation dialog
        swal("Update Canceled", "Supplier price remains unchanged.", "info");
        setEditMode((prev) => ({ ...prev, [index]: false }));
      }
    });
  };

  const handleUpdatePrice_subpart = (
    updatedPrice,
    id,
    index,
    product_id,
    supplier_code
  ) => {
    const updatedPriced = updatedPrice;
    const productSupplier_id = id;
    const product_ID = product_id;
    const supp_code = supplier_code;

    swal({
      allowEscapeKey: false,
      title: "Are you sure?",
      text: "Do you really want to update the supplier price?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((confirmed) => {
      if (confirmed) {
        axios
          .post(BASE_URL + "/canvass/updatePrice_subpart", {
            productSupplier_id,
            updatedPriced,
            supp_code,
            product_ID,
          })
          .then((res) => {
            if (res.status === 200) {
              swal({
                title: "Successfully Updated",
                text: "Supplier Price is updated to it's new price",
                icon: "success",
              });

              setEditMode((prev) => ({ ...prev, [index]: false }));
              axios
                .get(BASE_URL + "/subpartSupplier/fetchCanvass", {
                  params: {
                    id: product_ID,
                  },
                })
                .then((res) => {
                  console.log("Axios Response", res.data);
                  setSuppSubpart(res.data);
                })
                .catch((err) => console.log(err));
            }
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        // If the user cancels or closes the confirmation dialog
        swal("Update Canceled", "Supplier price remains unchanged.", "info");
        setEditMode((prev) => ({ ...prev, [index]: false }));
      }
    });
  };

  //------------------------------------------------Product rendering data ------------------------------------------------//

  const handleCanvass = (primary_id, product_id, prd_code, prd_name) => {
    setSelected_PR_Prod(primary_id);
    setShowModal(true);
    setSelectedProductname(`${prd_code} - ${prd_name}`);
    axios
      .get(BASE_URL + "/productTAGsupplier/fetchCanvass", {
        params: {
          id: product_id,
        },
      })

      .then((res) => {
        setSuppProducts(res.data);
      })
      .catch((err) => console.log(err));

    // console.log(product_id)
  };
  const handleAddToTablePO = (
    productId,
    code,
    name,
    supp_email,
    product_price
  ) => {
    const product = suppProducts.find((data) => data.id === productId);
    handleAddToTable(product, "product", code, name, supp_email, product_price);
  };

  //------------------------------------------------Assembly rendering data ------------------------------------------------//

  const handleCanvassAssembly = (id) => {
    setShowModalAS(true);

    axios
      .get(BASE_URL + "/supplier_assembly/fetchCanvass", {
        params: {
          id: id,
        },
      })

      .then((res) => {
        setSuppAssembly(res.data);
      })
      .catch((err) => console.log(err));

    // console.log(product_id)
  };

  const handleAddToTablePO_Assembly = (assemblyId, code, name, supp_email) => {
    const assembly = suppAssembly.find((data) => data.id === assemblyId);
    handleAddToTable(assembly, "assembly", code, name, supp_email);
  };
  //------------------------------------------------Spare rendering data ------------------------------------------------//

  const handleCanvassSpare = (id) => {
    setShowModalspare(true);

    // console.log(id)

    axios
      .get(BASE_URL + "/supp_SparePart/fetchCanvass", {
        params: {
          spare_ID: id,
        },
      })
      .then((res) => {
        setSuppSpare(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleAddToTablePO_Spare = (spareId, code, name, supp_email) => {
    const spare = suppSpare.find((data) => data.id === spareId);
    handleAddToTable(spare, "spare", code, name, supp_email);
  };

  //------------------------------------------------SubPart rendering data ------------------------------------------------//

  const handleCanvassSubpart = (sub_partID) => {
    setShowModalSubpart(true);

    // console.log("subpart ID" + sub_partID)
    axios
      .get(BASE_URL + "/subpartSupplier/fetchCanvass", {
        params: {
          id: sub_partID,
        },
      })

      .then((res) => {
        console.log("Axios Response", res.data);
        setSuppSubpart(res.data);
      })
      .catch((err) => console.log(err));

    // console.log(product_id)
  };
  const handleAddToTablePO_Subpart = (subpartId, code, name, supp_email) => {
    const subpart = suppSubpart.find((data) => data.id === subpartId);
    handleAddToTable(subpart, "subpart", code, name, supp_email);
  };

  const handleCancel = async (status, id) => {
    swal({
      title: "Are you sure?",
      text: "You are about to cancel the request",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (cancel) => {
      if (cancel) {
        try {
          const response = await axios.put(BASE_URL + `/PR/cancel_PO`, {
            row_id: id,
          });

          if (response.status === 200) {
            swal({
              title: "Cancelled Successfully",
              text: "The Request is cancelled successfully",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate("/purchaseOrderList");
            });
          } else {
            swal({
              icon: "error",
              title: "Something went wrong",
              text: "Please contact our support",
            });
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        swal({
          title: "Cancelled Successfully",
          text: "Request not Cancelled!",
          icon: "warning",
        });
      }
    });
  };

  const handleSaveEditUsedFOr = () => {
    swal({
      title: `Are you sure?`,
      text: "You want to change details of 'To be Used For'",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (approve) => {
      if (approve) {
        axios
          .post(`${BASE_URL}/invoice/editUsedFor`, {
            pr_id: id,
            useFor,
          })
          .then((res) => {
            // console.log(res);
            if (res.status === 200) {
              swal({
                title: "Success",
                text: "You successfully edit the of 'To be Used For'",
                icon: "success",
                button: "OK",
              }).then(() => {
                setEditUsedFor(false);
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
    });
  };
  const handleSaveEditRemarks = () => {
    swal({
      title: `Are you sure?`,
      text: "You want to change details of 'Remarks'",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (approve) => {
      if (approve) {
        axios
          .post(`${BASE_URL}/invoice/editRemarks`, {
            pr_id: id,
            remarks,
          })
          .then((res) => {
            // console.log(res);
            if (res.status === 200) {
              swal({
                title: "Success",
                text: "You successfully edit the of 'Remarks'",
                icon: "success",
                button: "OK",
              }).then(() => {
                setEditRemarks(false);
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
    });
  };

  const handlePreview = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      // if required fields has NO value
      //    console.log('requried')
      swal({
        icon: "error",
        title: "Fields are required",
        text: "Please fill the red text fields",
      });
    } else {
      handleShowPreview();
    }

    setValidated(true); //for validations
  };

  const add = async (e) => {
    swal({
      title: `Are you sure want to save this new purchase Order?`,
      text: "This action cannot be undo.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (approve) => {
      if (approve) {
        axios
          .post(`${BASE_URL}/invoice/save`, {
            arrayPO: addPObackend,
            pr_id: id,
            userId,
            selected_PR_Prod_array,
          })
          .then((res) => {
            // console.log(res);
            if (res.status === 200) {
              swal({
                title: "The Purchase sucessfully request!",
                text: "The Purchase Request has been added successfully.",
                icon: "success",
                button: "OK",
              }).then(() => {
                navigate("/purchaseOrderList");
              });
            } else if (res.status === 202) {
              swal({
                title: "PO number already registered",
                text: "Please reload the browser to fetch the available po number",
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
          });
      }
    });
  };

  console.log(`parentArray`);
  console.log(parentArray);

  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
        <div className="right-body-contents-a">
          <Row>
            <Col>
              <div
                className="create-head-back"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Link style={{ fontSize: "1.5rem" }} to="/purchaseRequest">
                  <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                </Link>
                <h1>Purchase Order List Preview</h1>
              </div>
            </Col>
          </Row>
          <Form noValidate validated={validated} onSubmit={handlePreview}>
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
            <div className="row mt-3">
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>PR. #: </Form.Label>
                  <Form.Control
                    type="text"
                    value={prNum}
                    readOnly
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-4">
                <Form.Group
                  controlId="exampleForm.ControlInput2"
                  className="datepick"
                >
                  <Form.Label style={{ fontSize: "20px" }}>
                    Date Needed:{" "}
                  </Form.Label>
                  <DatePicker
                    readOnly
                    selected={dateNeeded}
                    onChange={(date) => setDateNeeded(date)}
                    dateFormat="MM/dd/yyyy"
                    placeholderText="Start Date"
                    className="form-control"
                  />
                  <CalendarBlank
                    size={20}
                    style={{
                      position: "absolute",
                      left: "440px",
                      top: "73%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  />
                </Form.Group>
              </div>
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    To be used for:{" "}
                  </Form.Label>

                  <InputGroup className="mb-3">
                    <Form.Control
                      readOnly={!editUsedFor}
                      value={useFor}
                      onChange={(e) => setUseFor(e.target.value)}
                      type="text"
                      style={{ height: "40px", fontSize: "15px" }}
                    />
                    {userId === 11 ||
                      (userId === 3 && (
                        <InputGroup.Text id="basic-addon1">
                          {editUsedFor === true ? (
                            <Button
                              onClick={() => handleSaveEditUsedFOr()}
                              variant={"success"}
                            >
                              <Check size={20} />
                            </Button>
                          ) : (
                            <Button
                              onClick={() => setEditUsedFor(true)}
                              variant={"success"}
                            >
                              <PencilSimple size={20} />
                            </Button>
                          )}
                        </InputGroup.Text>
                      ))}
                  </InputGroup>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Remarks:{" "}
                  </Form.Label>

                  <InputGroup className="mb-3">
                    <Form.Control
                      readOnly={!editRemarks}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
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
                    {userId === 11 ||
                      (userId === 3 && (
                        <InputGroup.Text id="basic-addon1">
                          {editRemarks === true ? (
                            <Button
                              onClick={() => handleSaveEditRemarks()}
                              variant={"success"}
                            >
                              <Check size={20} />
                            </Button>
                          ) : (
                            <Button
                              onClick={() => setEditRemarks(true)}
                              variant={"success"}
                            >
                              <PencilSimple size={20} />
                            </Button>
                          )}
                        </InputGroup.Text>
                      ))}
                  </InputGroup>
                </Form.Group>
              </div>
              <div className="col-6"></div>
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
              Product List
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "81%",
                  left: "12rem",
                  transform: "translateY(-50%)",
                }}
              ></span>
            </div>
            <div className="table-containss">
              <div className="main-of-all-tables">
                <table id="">
                  <thead>
                    <tr>
                      <th className="tableh">Product Code</th>
                      <th className="tableh">Quantity</th>
                      <th className="tableh">Product Name</th>
                      <th className="tableh">Description</th>
                      <th className="tableh">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((data, i) => (
                      <tr key={i}>
                        <td>{data.product.product_code}</td>
                        <td>{data.quantity}</td>
                        <td>{data.product.product_name}</td>
                        <td>{data.description}</td>
                        <td>
                          {data.isPO === true ? (
                            <React.Fragment>
                              <button
                                type="button"
                                onClick={() =>
                                  handleCanvass(
                                    data.id,
                                    data.product_id,
                                    data.product.product_code,
                                    data.product.product_name
                                  )
                                }
                                className="btn canvas"
                                disabled
                              >
                                <ShoppingCart size={20} />
                                Purchase Ordered
                              </button>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <button
                                type="button"
                                onClick={() =>
                                  handleCanvass(
                                    data.id,
                                    data.product_id,
                                    data.product.product_code,
                                    data.product.product_name
                                  )
                                }
                                className="btn canvas"
                              >
                                <ShoppingCart size={20} />
                                Canvas
                              </button>
                            </React.Fragment>
                          )}
                        </td>
                      </tr>
                    ))}

                    {assembly.map((data, i) => (
                      <tr key={i}>
                        <td>{data.assembly.assembly_code}</td>
                        <td>{data.quantity}</td>
                        <td>{data.assembly.assembly_name}</td>
                        <td>{data.description}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() =>
                              handleCanvassAssembly(data.assembly_id)
                            }
                            className="btn canvas"
                          >
                            <ShoppingCart size={20} />
                            Canvas
                          </button>
                        </td>
                      </tr>
                    ))}

                    {spare.map((data, i) => (
                      <tr key={i}>
                        <td>{data.sparePart.spareParts_code}</td>
                        <td>{data.quantity}</td>
                        <td>{data.sparePart.spareParts_name}</td>
                        <td>{data.description}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleCanvassSpare(data.spare_id)}
                            className="btn canvas"
                          >
                            <ShoppingCart size={20} />
                            Canvas
                          </button>
                        </td>
                      </tr>
                    ))}

                    {subpart.map((data, i) => (
                      <tr key={i}>
                        <td>{data.subPart.subPart_code}</td>
                        <td>{data.quantity}</td>
                        <td>{data.subPart.subPart_name}</td>
                        <td>{data.description}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() =>
                              handleCanvassSubpart(data.subPart.id)
                            }
                            className="btn canvas"
                          >
                            <ShoppingCart size={20} />
                            Canvas
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {isArray && (
              <>
                <div
                  className="gen-info"
                  style={{
                    fontSize: "20px",
                    position: "relative",
                    paddingTop: "20px",
                    fontFamily: "Poppins, Source Sans Pro",
                  }}
                >
                  Canvassing Supplier
                  <span
                    style={{
                      position: "absolute",
                      height: "0.5px",
                      width: "-webkit-fill-available",
                      background: "#FFA500",
                      top: "81%",
                      left: "21rem",
                      transform: "translateY(-50%)",
                    }}
                  ></span>
                </div>
                <div className="canvass-main-container">
                  {parentArray.map(({ title, supplierCode, array }) => (
                    <div
                      className="canvass-supplier-container"
                      key={supplierCode}
                    >
                      <div className="canvass-supplier-content">
                        <div className="d-flex flex-row p-0 align-items-center "></div>
                        <div className="POand-daysDeliver">
                          <div className="PO-nums">
                            <p>{`PO #: ${title}`}</p>
                          </div>
                          <div className="numberofday-deliver">
                            <p>Estimated day(s) to deliver:</p>
                            <div className="inputdays">
                              <Form.Control
                                type="number"
                                required
                                onKeyDown={(e) => {
                                  ["e", "E", "+", "-"].includes(e.key) &&
                                    e.preventDefault();
                                }}
                                value={daysInputs[`${title}`]?.DaysFrom || ""}
                                onChange={(e) => {
                                  handleDaysFromChange(title, e.target.value);
                                }}
                                onInput={(e) => {
                                  e.preventDefault();
                                  const validInput = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                  ); // Replace non-numeric characters
                                  e.target.value = validInput;
                                }}
                                style={{
                                  height: "25px",
                                  width: "50px",
                                  fontSize: "14px",
                                  fontFamily: "Poppins, Source Sans Pro",
                                  marginTop: "2px",
                                  fontSize: "12px",
                                }}
                              ></Form.Control>
                              <p>To</p>
                              <Form.Control
                                type="number"
                                required
                                onKeyDown={(e) => {
                                  ["e", "E", "+", "-"].includes(e.key) &&
                                    e.preventDefault();
                                }}
                                value={daysInputs[`${title}`]?.DaysTo || ""}
                                onInput={(e) => {
                                  e.preventDefault();
                                  const validInput = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                  ); // Replace non-numeric characters
                                  e.target.value = validInput;
                                }}
                                onChange={(e) => {
                                  handleDaysToChange(title, e.target.value);
                                }}
                                style={{
                                  height: "25px",
                                  width: "50px",
                                  fontSize: "14px",
                                  fontFamily: "Poppins, Source Sans Pro",
                                  marginTop: "2px",
                                  fontSize: "12px",
                                }}
                              ></Form.Control>
                            </div>
                          </div>
                        </div>

                        {array.length > 0 && (
                          <div className="canvass-title">
                            <div className="supplier-info">
                              <p>{`Supplier : ${supplierCode} - ${array[0].supplierName}`}</p>
                            </div>
                            <div className="desc">
                              <Form.Control
                                type="text"
                                required
                                placeholder="To be used for"
                                value={
                                  toBeUsedFor[`${title}`]?.toBeUsedFor || ""
                                }
                                onChange={(e) => {
                                  handleUsedForChange(title, e.target.value);
                                }}
                                style={{
                                  height: "30px",
                                  width: "150px",
                                  fontSize: "14px",
                                  fontFamily: "Poppins, Source Sans Pro",
                                  marginTop: "2px",
                                  fontSize: "12px",
                                }}
                              />
                            </div>
                          </div>
                        )}
                        {array.map((item, index) => (
                          <div className="canvass-data-container" key={index}>
                            <div className="content-of-data-canvass">
                              <div className="prodcode">
                                {`Product Code: `}
                                <strong>{item.code}</strong>
                              </div>
                              <div className="prodnames">
                                {`Product Name: `}
                                <strong>{item.name}</strong>
                              </div>
                              <div className="prodinputs">
                                <Form.Control
                                  type="text"
                                  placeholder="Quantity"
                                  value={
                                    quantityInputs[
                                      `${title}_${item.type}_${item.product.id}`
                                    ] || ""
                                  }
                                  onChange={(e) => {
                                    handleQuantityChange(
                                      title,
                                      item.type,
                                      item.product.id,
                                      e.target.value
                                    );
                                  }}
                                  onInput={(e) => {
                                    // e.preventDefault();
                                    // const validInput = e.target.value.replace(
                                    //   /[^0-9.]/g,
                                    //   ""
                                    // ); // Replace non-numeric characters
                                    // e.target.value = validInput;
                                    onInputFloat(e);
                                  }}
                                  required
                                  onKeyDown={(e) => {
                                    ["e", "E", "+", "-"].includes(e.key) &&
                                      e.preventDefault();
                                  }}
                                  style={{
                                    height: "35px",
                                    width: "100px",
                                    fontSize: "14px",
                                    fontFamily: "Poppins, Source Sans Pro",
                                    marginTop: "3%",
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {addPObackend.length > 0 && (
              <div className="save-cancel">
                <Button
                  type="submit"
                  className="btn btn-warning"
                  // onClick={handleShowPreview}
                  size="md"
                  style={{ fontSize: "20px", margin: "0px 5px" }}
                >
                  Preview PO
                </Button>
              </div>
            )}

            <Modal
              show={showPreview}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
              size="xl"
            >
              <Modal.Header closeButton>
                <Modal.Title style={{ fontSize: "25px" }}>
                  DEPARTMENT: <strong>{departmentName}</strong>
                </Modal.Title>
              </Modal.Header>

              {addPObackend.map((data, index) => {
                let vat = data.serializedArray[0].supplier_vat;

                let vat_decimal = vat / 100 + 1;
                let overallTotal = 0;
                let amountWOvat = 0;
                let vatAmount = 0;

                data.serializedArray.forEach((item, index) => {
                  overallTotal +=
                    (item.prod_supplier_price * vat_decimal).toFixed(2) *
                    item.quantity;
                });

                amountWOvat = overallTotal / vat_decimal;
                vatAmount = overallTotal - amountWOvat;
                return (
                  <Modal.Body
                    // id={`content-to-capture-${group.title}`}
                    className="po-rece-modal"
                  >
                    <div
                      // id={`content-to-capture-${group.title}`}
                      // key={group.title}
                      className="receipt-main-container"
                    >
                      <div className="receipt-content">
                        <div className="receipt-header">
                          <div className="sbflogoes">
                            <img src={SBFLOGO} alt="" />
                          </div>
                          <div className="sbftexts">
                            <span>SBF PHILIPPINES DRILLING </span>
                            <span>RESOURCES CORPORATION</span>
                            <span>
                              Padigusan, Sta.Cruz, Rosario, Agusan del sur
                            </span>
                            <span>Landline No. 0920-949-3373</span>
                            <span>Email Address: sbfpdrc@gmail.com</span>
                          </div>
                          <div className="spacesbf"></div>
                        </div>

                        <div className="po-orders">
                          <div className="po-header">
                            <div className="vendor-info"></div>
                            <div className="plain-info">
                              <div className="text-center p-2 fw-bold fs-4 border-bottom border-white">
                                <span className="hideText">.</span>
                              </div>
                              <div className="p-1 border-bottom border-dark fs-6 d-flex flex-row">
                                <div className="text-center w-50">
                                  <span className="fs-5 fw-normal hideText">
                                    .
                                  </span>
                                </div>
                              </div>
                              <div className="p-1 fs-6 text-center border-bottom border-dark">
                                <span className="fs-5 fw-normal">Vendor</span>
                              </div>
                              <div className="p-1 fs-6 text-center">
                                <span className="fs-5 fw-normal">
                                  {data.serializedArray[0].supplierName}
                                </span>
                              </div>
                            </div>

                            <div className="order-info">
                              <div className="text-center p-2 fw-bold fs-4 border-bottom border-dark">
                                PURCHASE ORDER
                              </div>
                              <div className="p-1 border-bottom border-dark fs-6 d-flex flex-row">
                                <div className="text-center w-50">
                                  <span className="fs-5 fw-normal">P.O NO</span>
                                </div>
                                <div className="w-50">
                                  <span className="highlights">
                                    {data.title}
                                  </span>
                                </div>
                              </div>
                              <div className="p-1 border-bottom border-dark fs-6 d-flex flex-row">
                                <div className="text-center w-50">
                                  <span className="fs-5 fw-normal">
                                    P.R. NO
                                  </span>
                                </div>
                                <div className="w-50">
                                  <span className="highlights">{prNum}</span>
                                </div>
                              </div>
                              <div className="p-1 fs-6 d-flex flex-row">
                                <div className="text-center w-50">
                                  <span className="fs-5 fw-normal">
                                    DATE PREPARED:
                                  </span>
                                </div>
                                <div className="w-50">
                                  <span className="highlights">
                                    {new Date().toLocaleDateString("en-PH", {
                                      timeZone: "Asia/Manila",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <ul className="order-list">
                            <li className="order-header">
                              <div className="firstgroup">
                                <div className="text-center fw-bold">
                                  <span className="fs-5">ITEM NO.</span>
                                </div>
                                <div className="text-center fw-bold">
                                  <span className="fs-5">QTY</span>
                                </div>
                                <div className="text-center fw-bold">
                                  <span className="fs-5">UNIT</span>
                                </div>
                              </div>
                              <div className="secondgroup">
                                <div className="fw-bold">
                                  <span className="fs-5">DESCRIPTION</span>
                                </div>
                                <div className="fw-bold">
                                  <span className="fs-5">Part Number</span>
                                </div>
                              </div>
                              <div className="thirdgroup">
                                <div className="text-center fw-bold">
                                  <span className="fs-5">UNIT PRICE</span>
                                </div>
                                <div className="text-center fw-bold">
                                  <span className="fs-5">TOTAL</span>
                                </div>
                              </div>
                            </li>
                            <div className="po-thirdline p-0">
                              <li className="order-header-item">
                                <div className="item-firstgroup">
                                  <div className="text-center">
                                    {data.serializedArray.map((item, index) => (
                                      <span
                                        key={index}
                                        className="fs-5 fw-bold"
                                      >{`${item.code}`}</span>
                                    ))}
                                  </div>

                                  {/* for product quantity */}
                                  <div className="text-center">
                                    {data.serializedArray.map((item, index) => (
                                      <span
                                        key={index}
                                        className="fs-5 fw-bold"
                                      >{`${item.quantity}`}</span>
                                    ))}
                                  </div>
                                  {/* for product unit of measurement */}
                                  <div className="text-center">
                                    {data.serializedArray.map((item, index) => (
                                      <span
                                        key={index}
                                        className="fs-5 fw-bold"
                                      >{`${item.uom}`}</span>
                                    ))}
                                  </div>
                                </div>

                                <div className="item-secondgroup">
                                  {/* for product name */}
                                  <div className=" d-flex flex-column">
                                    {data.serializedArray.map((item, index) => (
                                      <span
                                        key={index}
                                        className="fs-5 fw-bold"
                                      >{`${item.name}`}</span>
                                    ))}
                                  </div>

                                  <div className="d-flex flex-column">
                                    {data.serializedArray.map((item, index) => (
                                      <span
                                        key={index}
                                        className="fs-5 fw-bold"
                                      >{`${item.part_number}`}</span>
                                    ))}
                                  </div>
                                </div>

                                <div className="item-thirdgroup">
                                  <div className="text-center fw-bold d-flex flex-column">
                                    {data.serializedArray.map((item, index) => (
                                      <span
                                        key={index}
                                        className="fs-5 fw-bold"
                                      >{`${(
                                        item.prod_supplier_price * vat_decimal
                                      ).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}`}</span>
                                    ))}
                                  </div>
                                  <div className="text-center fw-bold d-flex flex-column">
                                    {data.serializedArray.map((item, index) => (
                                      <span
                                        key={index}
                                        className="fs-5 fw-bold"
                                      >{`${(
                                        (
                                          item.prod_supplier_price * vat_decimal
                                        ).toFixed(2) * item.quantity
                                      ).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}`}</span>
                                    ))}
                                  </div>
                                </div>
                              </li>
                            </div>
                            <div className="po-calculation">
                              <div className="po-received-by">
                                <div className="p-3 d-flex flex-column border-bottom border-dark">
                                  <span className="fs-4 fw-bold">
                                    P.O Received By: N/A
                                  </span>
                                  <span className="fs-4 fw-normal"></span>
                                </div>
                                <div className="p-3 d-flex flex-column border-bottom border-dark">
                                  <span className="fs-4 fw-bold">
                                    Delivery Date: N/A
                                  </span>
                                  <span className="fs-4 fw-normal"></span>
                                </div>
                                <div className="p-3 d-flex flex-column">
                                  <span className="fs-4 fw-bold">Terms:</span>
                                  <span className="fs-4 fw-normal">
                                    <span
                                      key={index}
                                      className="fs-5 fw-bold"
                                    >{`${data.serializedArray[0].supplier_terms}`}</span>
                                  </span>
                                </div>
                              </div>
                              <div className="po-terms-condition">
                                <div className="p-3 d-flex flex-column">
                                  <span className="fs-4 fw-bold">
                                    Used For:{" "}
                                  </span>
                                  {`${data.serializedArray[0].usedFor}`}
                                </div>
                                <div className="p-3 d-flex flex-column">
                                  <span className="fs-4 fw-bold">
                                    Terms and Condition:
                                  </span>
                                  <span className="fs-5 fw-normal">
                                    1. Acceptance of this order is an acceptance
                                    of all conditions herein.
                                  </span>
                                  <span className="fs-5 fw-normal">
                                    2. Make all deliveries to receiving, However
                                    subject to count, weight and specification
                                    approval of SBF Philippines Drilling
                                    Resources Corporation.
                                  </span>
                                  <span className="fs-5 fw-normal">
                                    3. The original purchase order copy and
                                    suppliers original invoice must accompany
                                    delivery.
                                  </span>
                                  <span className="fs-5 fw-normal">
                                    4. In case the supplier fails to deliver
                                    goods on delivery date specified herein, SBF
                                    Philippines Drilling Resources Corporation
                                    has the right to cancel this order or demand
                                    penalty charged as stated.
                                  </span>
                                  <span className="fs-5 fw-normal">
                                    5. Problems encountered related to your
                                    supply should immediately brought to the
                                    attention of the purchasing manager.
                                  </span>
                                </div>
                              </div>

                              <div className="po-overall-total">
                                <div className="p-3 d-flex flex-column border-bottom border-dark">
                                  <span className="fs-4 fw-normal">
                                    Total (w/o VAT):
                                  </span>
                                  <span className="fs-4 fw-bold">
                                    {`${amountWOvat.toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}`}
                                  </span>
                                </div>
                                <div className="p-3 d-flex flex-column border-bottom border-dark">
                                  <span className="fs-4 fw-normal">
                                    VAT({`${vat}%`})
                                  </span>
                                  <span className="fs-4 fw-bold">
                                    {`${vatAmount.toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}`}
                                  </span>
                                </div>
                                <div className="p-3 d-flex flex-column border-bottom border-dark">
                                  <span className="fs-4 fw-normal">
                                    Overall Total:
                                  </span>
                                  <span className="fs-4 fw-bold">
                                    {`${
                                      data.serializedArray[0].supplier_currency
                                    } ${overallTotal.toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}`}
                                  </span>
                                </div>
                                <div className="p-3 d-flex flex-column">
                                  <span className="fs-4 fw-normal">
                                    {/* Date Approved: */}
                                  </span>
                                  <span className="fs-4 fw-bold">
                                    {/* {dateApproved.toLocaleDateString("en-PH")} */}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="po-footer">
                              <div className="po-prepared-by">
                                <div className="p-5 d-flex flex-column">
                                  <span className="fs-4 fw-bold">
                                    Requested By:
                                  </span>
                                  <span className="fs-4 fw-normal">
                                    {requestedBy}
                                  </span>
                                </div>
                              </div>
                              <div className="po-checked-by">
                                <div className="p-5 d-flex flex-column"></div>
                              </div>

                              <div className="po-approved-by">
                                <div className="p-5 d-flex flex-column"></div>
                              </div>
                            </div>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                );
              })}

              <Modal.Footer>
                <div className="save-cancel">
                  <Button
                    type="button"
                    onClick={add}
                    className="btn btn-warning"
                    size="md"
                    style={{ fontSize: "20px", margin: "0px 5px" }}
                  >
                    Save
                  </Button>
                </div>
              </Modal.Footer>
            </Modal>
          </Form>
          <Modal show={showModal} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
              <Modal.Title style={{ fontSize: "24px" }}>
                {selectedProductname}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="table-containss">
                <div className="main-of-all-tables">
                  <table id="order2-listing">
                    <thead>
                      <tr>
                        <th className="tableh">Supplier Code</th>
                        <th className="tableh">Supplier Name</th>
                        <th className="tableh">Contact</th>
                        <th className="tableh">Email</th>
                        <th className="tableh">Price</th>
                        <th className="tableh">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suppProducts.map((data, i) => (
                        <tr key={i}>
                          <td>{data.supplier.supplier_code}</td>
                          <td>{data.supplier.supplier_name}</td>
                          <td>{data.supplier.supplier_number}</td>
                          <td>{data.supplier.supplier_email}</td>
                          <td>
                            {!editMode[i] && (
                              <Form.Control
                                readOnly
                                value={data.product_price}
                                style={{
                                  height: "35px",
                                  width: "100px",
                                  fontSize: "14px",
                                  fontFamily: "Poppins, Source Sans Pro",
                                }}
                              />
                            )}
                            {editMode[i] && (
                              <Form.Control
                                type="number"
                                placeholder="New Price"
                                onBlur={(e) => {
                                  handleUpdatePrice(
                                    e.target.value,
                                    data.id,
                                    i,
                                    data.product.product_id,
                                    data.supplier.supplier_code
                                  );
                                }}
                                onKeyDown={(e) => {
                                  ["e", "E", "+", "-"].includes(e.key) &&
                                    e.preventDefault();
                                }}
                                style={{
                                  height: "35px",
                                  width: "100px",
                                  fontSize: "14px",
                                  fontFamily: "Poppins, Source Sans Pro",
                                }}
                              />
                            )}
                          </td>
                          <td>
                            <div className="d-flex flex-direction-row">
                              {!editMode[i] && (
                                <>
                                  <button
                                    type="button"
                                    className="btn canvas"
                                    onClick={() => handleEditPrice(i)}
                                  >
                                    <NotePencil
                                      size={22}
                                      color="#0d0d0d"
                                      weight="light"
                                    />
                                  </button>

                                  <button
                                    type="button"
                                    className="btn canvas"
                                    onClick={() =>
                                      handleAddToTablePO(
                                        data.id,
                                        data.product.product_code,
                                        data.product.product_name,
                                        data.supplier.supplier_email,
                                        data.product_price
                                      )
                                    }
                                  >
                                    <PlusCircle
                                      size={22}
                                      color="#0d0d0d"
                                      weight="light"
                                    />
                                  </button>
                                </>
                              )}
                              {editMode[i] && (
                                <>
                                  <button
                                    type="button"
                                    className="btn canvas"
                                    onClick={() => handleCancelEditPrice(i)}
                                  >
                                    <XCircle
                                      size={22}
                                      color="#0d0d0d"
                                      weight="light"
                                    />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                size="md"
                onClick={handleClose}
                style={{ fontSize: "20px" }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          {/* ------------------ END Product Modal ---------------- */}
          {/* ------------------------------------------- BREAK ----------------------------------------------- */}
          {/* ------------------ Start Assembly Modal ---------------- */}

          <Modal show={showModalAs} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
              <Modal.Title style={{ fontSize: "24px" }}>
                Product Assembly List
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="table-containss">
                <div className="main-of-all-tables">
                  <table id="order2-listing">
                    <thead>
                      <tr>
                        <th className="tableh">Supplier Code</th>
                        <th className="tableh">Supplier Name</th>
                        <th className="tableh">Contact</th>
                        <th className="tableh">Email</th>
                        <th className="tableh">Price</th>
                        <th className="tableh">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suppAssembly.map((data, i) => (
                        <tr key={i}>
                          <td>{data.supplier.supplier_code}</td>
                          <td>{data.supplier.supplier_name}</td>
                          <td>{data.supplier.supplier_number}</td>
                          <td>{data.supplier.supplier_email}</td>
                          <td>
                            {!editMode[i] && (
                              <Form.Control
                                readOnly
                                value={data.supplier_price}
                                style={{
                                  height: "35px",
                                  width: "100px",
                                  fontSize: "14px",
                                  fontFamily: "Poppins, Source Sans Pro",
                                }}
                              />
                            )}
                            {editMode[i] && (
                              <Form.Control
                                type="number"
                                placeholder="New Price"
                                onBlur={(e) => {
                                  handleUpdatePrice_asm(
                                    e.target.value,
                                    data.id,
                                    i,
                                    data.assembly.id,
                                    data.supplier.supplier_code
                                  );
                                }}
                                onKeyDown={(e) => {
                                  ["e", "E", "+", "-"].includes(e.key) &&
                                    e.preventDefault();
                                }}
                                style={{
                                  height: "35px",
                                  width: "100px",
                                  fontSize: "14px",
                                  fontFamily: "Poppins, Source Sans Pro",
                                }}
                              />
                            )}
                          </td>
                          <td>
                            <div className="d-flex flex-direction-row">
                              {!editMode[i] && (
                                <>
                                  <button
                                    type="button"
                                    className="btn canvas"
                                    onClick={() => handleEditPrice(i)}
                                  >
                                    <NotePencil
                                      size={22}
                                      color="#0d0d0d"
                                      weight="light"
                                    />
                                  </button>

                                  <button
                                    type="button"
                                    className="btn canvas"
                                    onClick={() =>
                                      handleAddToTablePO_Assembly(
                                        data.id,
                                        data.assembly.assembly_code,
                                        data.assembly.assembly_name,
                                        data.supplier.supplier_email
                                      )
                                    }
                                  >
                                    <PlusCircle
                                      size={22}
                                      color="#0d0d0d"
                                      weight="light"
                                    />
                                  </button>
                                </>
                              )}
                              {editMode[i] && (
                                <>
                                  <button
                                    type="button"
                                    className="btn canvas"
                                    onClick={() => handleCancelEditPrice(i)}
                                  >
                                    <XCircle
                                      size={22}
                                      color="#0d0d0d"
                                      weight="light"
                                    />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                size="md"
                onClick={handleClose}
                style={{ fontSize: "20px" }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          {/* ------------------ END Assembly Modal ---------------- */}
          {/* ------------------------------------------- BREAK ----------------------------------------------- */}
          {/* ------------------ Start SparePart Modal ---------------- */}

          <Modal show={showModalSpare} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
              <Modal.Title style={{ fontSize: "24px" }}>
                Product Parts List
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="table-containss">
                <div className="main-of-all-tables">
                  <table id="order2-listing">
                    <thead>
                      <tr>
                        <th className="tableh">Supplier Code</th>
                        <th className="tableh">Supplier Name</th>
                        <th className="tableh">Contact</th>
                        <th className="tableh">Email</th>
                        <th className="tableh">Price</th>
                        <th className="tableh">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suppSpare.map((data, i) => (
                        <tr key={i}>
                          <td>{data.supplier.supplier_code}</td>
                          <td>{data.supplier.supplier_name}</td>
                          <td>{data.supplier.supplier_number}</td>
                          <td>{data.supplier.supplier_email}</td>
                          <td>
                            {!editMode[i] && (
                              <Form.Control
                                readOnly
                                value={data.supplier_price}
                                style={{
                                  height: "35px",
                                  width: "100px",
                                  fontSize: "14px",
                                  fontFamily: "Poppins, Source Sans Pro",
                                }}
                              />
                            )}
                            {editMode[i] && (
                              <Form.Control
                                type="number"
                                placeholder="New Price"
                                onBlur={(e) => {
                                  handleUpdatePrice_spare(
                                    e.target.value,
                                    data.id,
                                    i,
                                    data.sparePart.id,
                                    data.supplier.supplier_code
                                  );
                                }}
                                onKeyDown={(e) => {
                                  ["e", "E", "+", "-"].includes(e.key) &&
                                    e.preventDefault();
                                }}
                                style={{
                                  height: "35px",
                                  width: "100px",
                                  fontSize: "14px",
                                  fontFamily: "Poppins, Source Sans Pro",
                                }}
                              />
                            )}
                          </td>
                          <td>
                            <div className="d-flex flex-direction-row">
                              {!editMode[i] && (
                                <>
                                  <button
                                    type="button"
                                    className="btn canvas"
                                    onClick={() => handleEditPrice(i)}
                                  >
                                    <NotePencil
                                      size={22}
                                      color="#0d0d0d"
                                      weight="light"
                                    />
                                  </button>
                                  <button
                                    type="button"
                                    className="btn canvas"
                                    onClick={() =>
                                      handleAddToTablePO_Spare(
                                        data.id,
                                        data.sparePart.spareParts_code,
                                        data.sparePart.spareParts_name,
                                        data.supplier.supplier_email
                                      )
                                    }
                                  >
                                    <PlusCircle
                                      size={22}
                                      color="#0d0d0d"
                                      weight="light"
                                    />
                                  </button>
                                </>
                              )}
                              {editMode[i] && (
                                <>
                                  <button
                                    type="button"
                                    className="btn canvas"
                                    onClick={() => handleCancelEditPrice(i)}
                                  >
                                    <XCircle
                                      size={22}
                                      color="#0d0d0d"
                                      weight="light"
                                    />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                size="md"
                onClick={handleClose}
                style={{ fontSize: "20px" }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* ------------------ END SparePArt Modal ---------------- */}
          {/* ------------------------------------------- BREAK ----------------------------------------------- */}
          {/* ------------------ Start SubPart Modal ---------------- */}

          <Modal show={showModalSubpart} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
              <Modal.Title style={{ fontSize: "24px" }}>
                Product Sub-Parts List
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="table-containss">
                <div className="main-of-all-tables">
                  <table id="order2-listing">
                    <thead>
                      <tr>
                        <th className="tableh">Supplier Code</th>
                        <th className="tableh">Supplier Name</th>
                        <th className="tableh">Contact</th>
                        <th className="tableh">Email</th>
                        <th className="tableh">Price</th>
                        <th className="tableh">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suppSubpart.map((data, i) => (
                        <tr key={i}>
                          <td>{data.supplier.supplier_code}</td>
                          <td>{data.supplier.supplier_name}</td>
                          <td>{data.supplier.supplier_number}</td>
                          <td>{data.supplier.supplier_email}</td>
                          <td>
                            {!editMode[i] && (
                              <Form.Control
                                readOnly
                                value={data.supplier_price}
                                style={{
                                  height: "35px",
                                  width: "100px",
                                  fontSize: "14px",
                                  fontFamily: "Poppins, Source Sans Pro",
                                }}
                              />
                            )}
                            {editMode[i] && (
                              <Form.Control
                                type="number"
                                placeholder="New Price"
                                onBlur={(e) => {
                                  handleUpdatePrice_subpart(
                                    e.target.value,
                                    data.id,
                                    i,
                                    data.subPart.id,
                                    data.supplier.supplier_code
                                  );
                                }}
                                onKeyDown={(e) => {
                                  ["e", "E", "+", "-"].includes(e.key) &&
                                    e.preventDefault();
                                }}
                                style={{
                                  height: "35px",
                                  width: "100px",
                                  fontSize: "14px",
                                  fontFamily: "Poppins, Source Sans Pro",
                                }}
                              />
                            )}
                          </td>
                          <td>
                            <div className="d-flex flex-direction-row">
                              {!editMode[i] && (
                                <>
                                  <button
                                    type="button"
                                    className="btn canvas"
                                    onClick={() => handleEditPrice(i)}
                                  >
                                    <NotePencil
                                      size={22}
                                      color="#0d0d0d"
                                      weight="light"
                                    />
                                  </button>

                                  <button
                                    type="button"
                                    className="btn canvas"
                                    onClick={() =>
                                      handleAddToTablePO_Subpart(
                                        data.id,
                                        data.subPart.subPart_code,
                                        data.subPart.subPart_name,
                                        data.supplier.supplier_email
                                      )
                                    }
                                  >
                                    <PlusCircle
                                      size={22}
                                      color="#0d0d0d"
                                      weight="light"
                                    />
                                  </button>
                                </>
                              )}
                              {editMode[i] && (
                                <>
                                  <button
                                    type="button"
                                    className="btn canvas"
                                    onClick={() => handleCancelEditPrice(i)}
                                  >
                                    <XCircle
                                      size={22}
                                      color="#0d0d0d"
                                      weight="light"
                                    />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                size="md"
                onClick={handleClose}
                style={{ fontSize: "20px" }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default PurchaseOrderListPreview;

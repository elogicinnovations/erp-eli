import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../../../Sidebar/sidebar";
import axios from "axios";
import BASE_URL from "../../../../assets/global/url";
import ReactLoading from 'react-loading';
import NoData from '../../../../assets/image/NoData.png';
import NoAccess from '../../../../assets/image/NoAccess.png';
import swal from "sweetalert";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import "../../../styles/react-style.css";
import warehouse from "../../../../assets/global/warehouse";
import { ArrowCircleLeft } from "@phosphor-icons/react";
import { width } from "@mui/system";

function CreateSupplier({authrztn}) {
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [suppName, setsuppName] = useState("");
  const [suppCurr, setsuppCurr] = useState("");
  const [suppCode, setsuppCode] = useState("");
  const [suppTin, setsuppTin] = useState("");
  const [suppEmail, setsuppEmail] = useState("");
  const [suppAdd, setsuppAdd] = useState("");
  const [suppCity, setsuppCity] = useState("");
  const [suppPcode, setsuppPcode] = useState("");
  const [suppCperson, setsuppCperson] = useState("");
  const [suppCnum, setsuppCnum] = useState("");
  const [suppTelNum, setsuppTelNum] = useState("");
  const [suppTerms, setsuppTerms] = useState("");
  const [suppVat, setsuppVat] = useState("12");
  const [suppReceving, setsuppReceving] = useState("");
  const [suppStatus, setsuppStatus] = useState("Active");
  const [supplier, setSupplier] = useState([]);
  const [suppliers, setsuppliers] = useState([]);
  const [errorcode, setErrorcode] = useState("");
  const [isCodeExist, setIsCodeExist] = useState(false);
  // Handle the checkbox change event for toggle button VAtable textbox
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  // para sa pag fetch ng last supplier code
  useEffect(() => {
    const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/supplier/lastCode")
      .then((res) => {
        const code =
          res.data !== null ? res.data.toString().padStart(4, "0") : "0001";

        // Increment the value by 1
        setsuppCode(code);
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
    axios
      .get(BASE_URL + "/supplier/fetchTable")
      .then((res) => {
        setSupplier(res.data)
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
    }, 1000);

return () => clearTimeout(delay);
}, []);

  //function for existing code and name
  const checkexistingCode = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/supplier/fetchTable`);
      const existingSuppliers = response.data;

      const isNameExist = existingSuppliers.some(
        (supplier) => supplier.supplier_name === suppName
      );

      const isCodeExist = existingSuppliers.some(
        (supplier) => supplier.supplier_code === suppCode
      );

      if (isCodeExist && isNameExist) {
        setErrorcode("Name and Code are already in use");
        setIsCodeExist(true);
      } else if (isCodeExist) {
        setErrorcode("Code is already in use");
        setIsCodeExist(true);
      } else {
        setErrorcode("");
        setIsCodeExist(false);
      }
    } catch (error) {
      console.error("Error checking existing code:", error);
    }
  }, [suppCode, suppName]);

  useEffect(() => {
    checkexistingCode();
  }, [suppCode, suppName, checkexistingCode]);

  const navigate = useNavigate();

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("PH");

  const [maxTinLength, setMaxTinLength] = useState(15);

  const handleTinChange = (e) => {
    const inputValue = e.target.value.replace(/[^0-9-]/g, ""); // Remove non-numeric and non-dash characters

    if (inputValue.length <= maxTinLength) {
      setsuppTin(inputValue);
    }
    // Allow backspace key
    if (e.key === "Backspace") {
      return;
    }

    // Allow only numeric input
    if (e.key === "e" || isNaN(e.key)) {
      e.preventDefault();
      return;
    }
  };

  useEffect(() => {
    // Fetch the list of countries from the API
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        const countryData = response.data.map((country) => ({
          value: country.cca2,
          label: country.name.common,
        }));

        // Sort the country list in ascending order by label (country name)
        countryData.sort((a, b) => a.label.localeCompare(b.label));

        setCountries(countryData);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  // for country on change function
  const handleChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  // for Receiving on change function
  const handleChangeReceiving = (event) => {
    setsuppReceving(event.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      swal({
        icon: "error",
        title: "Fields are required",
        text: "Please fill the Required text fields",
      });
    } else {
      console.log(suppName, suppCode);

      axios
        .post(BASE_URL + "/supplier/create", {
          suppName,
          suppCurr,
          suppCode,
          suppTin,
          suppEmail,
          suppAdd,
          suppCity,
          suppPcode,
          suppCperson,
          suppCnum,
          suppTelNum,
          suppTerms,
          suppVat,
          selectedCountry,
          suppStatus,
          suppReceving,
        })
        .then((response) => {
          if (response.status === 200) {
            swal({
              title: "Suppliers Add Successful!",
              text: "The Suppliers has been Added Successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate("/Supplier");
            });
          } else if (response.status === 201) {
            swal({
              title: "Suppliers is Already Exist",
              text: "Please Input a New Suppliers ",
              icon: "error",
            });
          }
        });
    }

    setValidated(true); //for validations
  };
  const handleActiveStatus = (e) => {
    if (suppStatus === "Active") {
      setsuppStatus("Inactive");
    } else {
      setsuppStatus("Active");
    }
  };

  return (
    <div className="main-of-containers">
      {/* <div className="left-of-main-containers">
            <Sidebar />
        </div> */}
      <div className="right-of-main-containers">
              {isLoading ? (
                <div className="loading-container">
                  <ReactLoading className="react-loading" type={'bubbles'}/>
                  Loading Data...
                </div>
              ) : (
        authrztn.includes('Supplier - Add') ? (
        <div className="right-body-contentss">
          <div
            className="create-head-back"
            style={{
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #5A5D5A",
              padding: 15,
            }}>
            <Link style={{ fontSize: "1.5rem" }} to="/Supplier">
              <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
            </Link>
            <h1>Supplier</h1>
          </div>

          <Container className="mt-5">
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
              <Row>
                <Col>
                  <label style={{ fontSize: 30, fontWeight: "bold" }}>
                    Details
                  </label>
                </Col>

                <Col>
                  <div className="form-group d-flex flex-row justify-content-center align-items-center">
                    <React.Fragment>
                      <label
                        className="userstatus"
                        style={{ fontSize: 15, marginRight: 10 }}>
                        Supplier Status
                      </label>
                      <input
                        type="checkbox"
                        name="cstatus"
                        className="toggle-switch"
                        onChange={handleActiveStatus}
                        defaultChecked={suppStatus}
                      />
                    </React.Fragment>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Label style={{ fontSize: 20 }}>
                    Supplier Name:{" "}
                  </Form.Label>
                  <Form.Control
                    className="p-3  fs-3"
                    placeholder="Supplier Name"
                    maxLength={80}
                    onChange={(e) => setsuppName(e.target.value)}
                    required
                  />
                  {errorcode && (
                    <div
                      style={{
                        color: "red",
                        marginTop: "5px",
                        fontFamily: "Poppins, Source Sans Pro",
                        fontSize: "13px",
                      }}>
                      {errorcode}
                    </div>
                  )}
                </Col>
                <Col>
                  <label
                    htmlFor=""
                    className="label-head"
                    style={{ fontSize: 20 }}>
                    Code:{" "}
                  </label>
                  <Form.Control
                    className="p-3 fs-3"
                    readOnly
                    value={suppCode}
                    // onChange={(e) => setsuppCode(e.target.value)}
                    required
                    maxLength={10}
                    placeholder="Supplier Code"
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <label
                    htmlFor=""
                    className="label-head"
                    style={{ fontSize: 20 }}>
                    Currency:{" "}
                  </label>
                  <Form.Select
                    className="p-3 fs-3"
                    onChange={(e) => setsuppCurr(e.target.value)}
                    required
                    defaultValue=""
                  >
                    <option disabled value="">Select currency...</option>
                    <option value="₱">PHP (₱)</option>
                    <option value="$">USD ($)</option>
                  </Form.Select>
                </Col>
                <Col></Col>
              </Row>

              <Row>
                <Col>
                  <label
                    htmlFor=""
                    className="label-head"
                    style={{ fontSize: 20 }}>
                    TIN:{" "}
                  </label>
                  <Form.Control
                    className="p-3 fs-3"
                    type="text"
                    value={suppTin}
                    onChange={handleTinChange}
                    pattern="^[0-9-]+$"
                    placeholder="000–123–456–001"
                    maxLength={setMaxTinLength}
                  />
                </Col>
                <Col>
                  <label
                    htmlFor=""
                    className="label-head"
                    style={{ fontSize: 20 }}>
                    Terms:{" "}
                  </label>
                  <Form.Control
                    className="p-3 fs-3"
                    type="text"
                    pattern="[0-9.]*"
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/[^\d.]/g, ""))
                    }
                    maxLength={4}
                    onChange={(e) => setsuppTerms(e.target.value)}
                    placeholder="0"
                  />
                </Col>
              </Row>

              <label style={{ fontSize: 30, fontWeight: "bold" }}>
                Location Info
              </label>

              <Row>
                <Col>
                  <label
                    htmlFor=""
                    className="label-head"
                    style={{ fontSize: 20 }}>
                    Country:{" "}
                  </label>
                  <Form.Select
                    aria-label=""
                    required
                    value={selectedCountry}
                    onChange={handleChange}
                    style={{ fontSize: 15 }}>
                    {countries.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col>
                  <label
                    htmlFor=""
                    className="label-head"
                    style={{ fontSize: 20 }}>
                    Address:{" "}
                  </label>
                  <Form.Control
                    className="p-3  fs-3"
                    onChange={(e) => setsuppAdd(e.target.value)}
                    required
                    placeholder="Enter Address..."
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <label
                    htmlFor=""
                    className="label-head"
                    style={{ fontSize: 20 }}>
                    City:{" "}
                  </label>
                  <Form.Control
                    className="p-3 fs-3"
                    maxLength={80}
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(
                        /[^A-Za-z.'\-,\s]/g,
                        ""
                      ))
                    }
                    onChange={(e) => setsuppCity(e.target.value)}
                    required
                    placeholder="City"
                  />
                </Col>
                <Col>
                  <label
                    htmlFor=""
                    className="label-head"
                    style={{ fontSize: 20 }}>
                    Zipcode/Postcode:{" "}
                  </label>
                  <Form.Control
                    className="p-3 fs-3"
                    type="text"
                    maxLength={4}
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/\D/, ""))
                    }
                    onChange={(e) => setsuppPcode(e.target.value)}
                    required
                    placeholder="0000"
                  />
                </Col>
              </Row>

              <label style={{ fontSize: 30, fontWeight: "bold" }}>
                Contact Details
              </label>

              <Row>
                <Col>
                  <label
                    htmlFor=""
                    className="label-head"
                    style={{ fontSize: 20 }}>
                    Contact Person:{" "}
                  </label>
                  <Form.Control
                    className="p-3  fs-3"
                    maxLength={80}
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(
                        /[^A-Za-z.'\-,\s]/g,
                        ""
                      ))
                    }
                    onChange={(e) => setsuppCperson(e.target.value)}
                    required
                    placeholder="Contact Person"
                  />
                </Col>
                <Col>
                  <label
                    htmlFor=""
                    className="label-head"
                    style={{ fontSize: 20 }}>
                    Mobile Number:{" "}
                  </label>
                  <Form.Control
                    className="p-3 fs-3"
                    type="text"
                    maxLength={15}
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/\D/, ""))
                    }
                    onChange={(e) => setsuppCnum(e.target.value)}
                    required
                    placeholder="09xxxxxxxx"
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <label
                    htmlFor=""
                    className="label-head"
                    style={{ fontSize: 20 }}>
                    Tel. #{" "}
                  </label>
                  <Form.Control
                    className="p-3  fs-3"
                    type="text"
                    maxLength={15}
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/\D/, ""))
                    }
                    onChange={(e) => setsuppTelNum(e.target.value)}
                    placeholder="xxxxxxxxx"
                  />
                </Col>
                <Col>
                  <label
                    htmlFor=""
                    className="label-head"
                    style={{ fontSize: 20 }}>
                    Email:{" "}
                  </label>
                  <Form.Control
                    className="p-3 fs-3"
                    type="email"
                    onChange={(e) => setsuppEmail(e.target.value)}
                    required
                    placeholder="Enter your email..."
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <div className="d-flex flex-direction-row">
                    <label
                      htmlFor=""
                      className="label-head"
                      style={{ fontSize: 20 }}>
                      Vatable
                    </label>
                    <Form.Control
                      className="p-3  fs-3"
                      style={{ width: "20%", marginLeft: 50 }}
                      required
                      type="text"

                      maxLength={3}
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(/\D/, ""))
                      }
                      onChange={(e) => setsuppVat(e.target.value)}
                      value={suppVat}
                    />
                    <div className="percnts">%</div>
                  </div>
                </Col>
                <Col>
                  <div className="d-flex flex-direction-row">
                    <label
                      className="label-head"
                      style={{ fontSize: 20, marginRight: 10 }}>
                      Select a Receiving Area:{" "}
                    </label>
                    <div class="cl-toggle-switch mt-2">
                      <Form.Select
                        aria-label=""
                        required
                        style={{ fontSize: 13, width: "350%" }}
                        defaultValue=""
                        onChange={handleChangeReceiving}>
                        <option disabled value="">
                          Select City ...
                        </option>
                        {warehouse.map((city, index) => (
                          <option key={index} value={city}>
                            {city}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Remarks:{" "}
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      // onChange={(e) => setDetails(e.target.value)}
                      placeholder="Enter item name"
                      style={{ height: "100px", fontSize: "15px" }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    type="submit"
                    variant="success"
                    size="lg"
                    className="fs-5"
                    disabled={isCodeExist}>
                    Save
                  </Button>
                </Col>
              </Row>
            </Form>
          </Container>
        </div>
        ) : (
          <div className="no-access">
            <img src={NoAccess} alt="NoAccess" className="no-access-img"/>
            <h3>
              You don't have access to this function.
            </h3>
          </div>
        )
              )}
      </div>
    </div>
  );
}

export default CreateSupplier;

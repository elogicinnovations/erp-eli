import React, { useEffect, useState } from "react";
// import Sidebar from "../../../Sidebar/sidebar";
// import NoData from '../../../../assets/image/NoData.png';
import axios from "axios";
import BASE_URL from "../../../../assets/global/url";
import swal from "sweetalert";
import Container from "react-bootstrap/Container";
import ReactLoading from "react-loading";
import NoAccess from "../../../../assets/image/NoAccess.png";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../../styles/react-style.css";
import warehouse from "../../../../assets/global/warehouse";
import { ArrowCircleLeft } from "@phosphor-icons/react";
import { jwtDecode } from "jwt-decode";

function EditSupplier({ authrztn }) {
  const [validated, setValidated] = useState(false);

  const [suppName, setsuppName] = useState("");
  const [suppCode, setsuppCode] = useState("");
  const [suppTin, setsuppTin] = useState("");
  const [suppEmail, setsuppEmail] = useState("");
  const [suppAdd, setsuppAdd] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [suppCity, setsuppCity] = useState("");
  const [suppPcode, setsuppPcode] = useState("");
  const [suppCperson, setsuppCperson] = useState("");
  const [suppCnum, setsuppCnum] = useState("");
  const [suppTelNum, setsuppTelNum] = useState("");
  const [suppTerms, setsuppTerms] = useState("");
  const [suppVat, setsuppVat] = useState("");
  const [suppReceving, setsuppReceving] = useState("");
  const [suppStatus, setsuppStatus] = useState("Active");
  const [checkedStatus, setcheckedStatus] = useState();

  const [isChecked, setIsChecked] = useState(false);
  const [Fname, setFname] = useState("");
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setuserId] = useState("");

  const decodeToken = () => {
    var token = localStorage.getItem("accessToken");
    if (typeof token === "string") {
      var decoded = jwtDecode(token);
      setUsername(decoded.username);
      setFname(decoded.Fname);
      setUserRole(decoded.userrole);
      setuserId(decoded.id);
    }
  };

  useEffect(() => {
    decodeToken();
  }, []);

  // Handle the checkbox change event
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const navigate = useNavigate();
  const { id } = useParams();

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("PH");

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

  useEffect(() => {
    const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/supplier/fetchTableEdit", {
          params: {
            id: id,
          },
        })
        //   .then(res => setsupplier(res.data))
        .then((res) => {
          setsuppName(res.data[0].supplier_name);
          setsuppCode(res.data[0].supplier_code);
          setsuppTin(res.data[0].supplier_tin);
          setSelectedCountry(res.data[0].supplier_country);
          setsuppEmail(res.data[0].supplier_email);
          setsuppAdd(res.data[0].supplier_address);
          setsuppCity(res.data[0].supplier_city);
          setsuppPcode(res.data[0].supplier_postcode);
          setsuppCperson(res.data[0].supplier_contactPerson);
          setsuppCnum(res.data[0].supplier_number);
          setsuppTelNum(res.data[0].supplier_Telnumber);
          setsuppTerms(res.data[0].supplier_terms);
          setsuppVat(res.data[0].supplier_vat);
          setsuppReceving(res.data[0].supplier_receiving);
          setIsLoading(false);
          // setsuppStatus(res.data[0].supplier_status);

          // Check if the status is "Active" and set suppStatus accordingly
          if (res.data[0].supplier_status === "Active") {
            setcheckedStatus(true);
            setsuppStatus("Active"); // Check the checkbox
          } else if (res.data[0].supplier_status === "Inactive") {
            setcheckedStatus(false);
            setsuppStatus("Inactive"); // Uncheck the checkbox
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }, 1000);

    return () => clearTimeout(delay);
  }, []);

  const handleFormSubmit = async (e) => {
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
      // if required fields has value (GOOD)
      //   console.log(suppCperson)

      axios
        .put(
          BASE_URL + "/supplier/update",

          {
            suppName,
            suppTin,
            suppEmail,
            suppCode,
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
            userId,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            swal({
              title: "Suppliers Update Successful!",
              text: "The Suppliers has been Updated Successfully.",
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
      //   console.log('Changing status to Inactive');
      setsuppStatus("Inactive");
    } else {
      //   console.log('Changing status to Active');
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
            <ReactLoading className="react-loading" type={"bubbles"} />
            Loading Data...
          </div>
        ) : authrztn.includes("Supplier - Edit") ? (
          <div className="right-body-contentss">
            <div
              className="create-head-back"
              style={{
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid #5A5D5A",
                padding: 15,
              }}
            >
              <Link style={{ fontSize: "1.5rem" }} to="/Supplier">
                <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
              </Link>
              <h1>Supplier</h1>
            </div>

            <Container className="mt-5">
              <Form
                noValidate
                validated={validated}
                onSubmit={handleFormSubmit}
              >
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
                          style={{ fontSize: 15, marginRight: 10 }}
                        >
                          Supplier Status
                        </label>
                        <input
                          type="checkbox"
                          name="cstatus"
                          className="toggle-switch"
                          style={{ fontSize: 20 }}
                          onClick={handleActiveStatus}
                          defaultChecked={checkedStatus}
                          // checked={checkedStatus}
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
                      value={suppName}
                      onChange={(e) => setsuppName(e.target.value)}
                      required
                    />
                  </Col>
                  <Col>
                    <label
                      htmlFor=""
                      className="label-head"
                      style={{ fontSize: 20 }}
                    >
                      Code:{" "}
                    </label>
                    <Form.Control
                      className="p-3 fs-3"
                      onChange={(e) => setsuppCode(e.target.value)}
                      maxLength={10}
                      value={suppCode}
                      readOnly
                      placeholder="Supplier Code"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <label
                      htmlFor=""
                      className="label-head"
                      style={{ fontSize: 20 }}
                    >
                      TIN:{" "}
                    </label>
                    <Form.Control
                      className="p-3  fs-3"
                      type="text"
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(/\D/, ""))
                      }
                      maxLength={30}
                      onChange={(e) => setsuppTin(e.target.value)}
                      value={suppTin}
                      placeholder="TIN"
                    />
                  </Col>
                  <Col>
                    <label
                      htmlFor=""
                      className="label-head"
                      style={{ fontSize: 20 }}
                    >
                      Terms: (no. of days)
                    </label>
                    <Form.Control
                      className="p-3 fs-3"
                      type="text"
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(/\D/, ""))
                      }
                      maxLength={4}
                      onChange={(e) => setsuppTerms(e.target.value)}
                      value={suppTerms}
                      placeholder="0"
                    />
                  </Col>
                </Row>

                <label style={{ fontSize: 30, fontWeight: "bold" }}>
                  Location Info
                </label>

                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label style={{ fontSize: "20px" }}>
                        Country:{" "}
                      </Form.Label>

                      <Form.Select
                        aria-label=""
                        required
                        value={selectedCountry}
                        onChange={handleChange}
                        style={{ fontSize: 15, padding: 8 }}
                      >
                        {countries.map((country) => (
                          <option key={country.value} value={country.value}>
                            {country.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <label
                      htmlFor=""
                      className="label-head"
                      style={{ fontSize: 20 }}
                    >
                      Address:{" "}
                    </label>
                    <Form.Control
                      className="p-3  fs-3"
                      onChange={(e) => setsuppAdd(e.target.value)}
                      required
                      placeholder="Enter Address..."
                      value={suppAdd}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <label
                      htmlFor=""
                      className="label-head"
                      style={{ fontSize: 20 }}
                    >
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
                      value={suppCity}
                      required
                      placeholder="City"
                    />
                  </Col>
                  <Col>
                    <label
                      htmlFor=""
                      className="label-head"
                      style={{ fontSize: 20 }}
                    >
                      Zipcode/Postcode:{" "}
                    </label>
                    <Form.Control
                      className="p-3 fs-3"
                      type="text"
                      maxLength={10}
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(/\D/, ""))
                      }
                      onChange={(e) => setsuppPcode(e.target.value)}
                      required
                      value={suppPcode}
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
                      style={{ fontSize: 20 }}
                    >
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
                      value={suppCperson}
                      placeholder="Contact Person"
                    />
                  </Col>
                  <Col>
                    <label
                      htmlFor=""
                      className="label-head"
                      style={{ fontSize: 20 }}
                    >
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
                      value={suppCnum}
                      placeholder="09xxxxxxxx"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <label
                      htmlFor=""
                      className="label-head"
                      style={{ fontSize: 20 }}
                    >
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
                      value={suppTelNum}
                    />
                  </Col>
                  <Col>
                    <label
                      htmlFor=""
                      className="label-head"
                      style={{ fontSize: 20 }}
                    >
                      Email:{" "}
                    </label>
                    <Form.Control
                      className="p-3 fs-3"
                      type="email"
                      onChange={(e) => setsuppEmail(e.target.value)}
                      required
                      placeholder="Enter your email..."
                      value={suppEmail}
                    />
                  </Col>

                  <Row>
                    <Col>
                      <div className="d-flex flex-direction-row">
                        <label
                          htmlFor=""
                          className="label-head"
                          style={{ fontSize: 20 }}
                        >
                          Vatable (%)
                        </label>
                        <Form.Control
                          className="p-3  fs-3"
                          value={suppVat}
                          style={{ width: "20%", marginLeft: 50 }}
                          type="text"
                          maxLength={3}
                          onInput={(e) =>
                            (e.target.value = e.target.value.replace(/\D/, ""))
                          }
                          onChange={(e) => setsuppVat(e.target.value)}
                          placeholder="0%"
                        />
                      </div>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label style={{ fontSize: "20px" }}>
                          Receiving Area:{" "}
                        </Form.Label>
                        <Form.Select
                          aria-label=""
                          required
                          style={{ fontSize: 15, padding: 8, marginLeft: 10 }}
                          maxLength={15}
                          value={suppReceving}
                          onChange={handleChangeReceiving}
                        >
                          <option disabled value="">
                            Select City ...
                          </option>
                          {warehouse.map((city, index) => (
                            <option key={index} value={city}>
                              {city}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Col>
                    <Button
                      type="submit"
                      variant="success"
                      size="lg"
                      className="fs-5"
                    >
                      Update
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Container>
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

export default EditSupplier;

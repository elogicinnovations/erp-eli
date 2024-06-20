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
  const [suppCurr, setsuppCurr] = useState("");

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

  // const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("PH");

  // useEffect(() => {
  //   // Fetch the list of countries from the API
  //   axios
  //     .get("https://restcountries.com/v3.1/all")
  //     .then((response) => {
  //       const countryData = response.data.map((country) => ({
  //         value: country.cca2,
  //         label: country.name.common,
  //       }));

  //       // Sort the country list in ascending order by label (country name)
  //       countryData.sort((a, b) => a.label.localeCompare(b.label));

  //       setCountries(countryData);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching countries:", error);
  //     });
  // }, []);

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
          setsuppCurr(res.data[0].supplier_currency);
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
            suppCurr,
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
              title: "Supplier Update Successful!",
              text: "The Supplier has been Updated Successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate("/Supplier");
            });
          } else if (response.status === 201) {
            swal({
              title: "Supplier is Already Exist",
              text: "Please Input a New Supplier",
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
                      Currency:{" "}
                    </label>
                    <Form.Select
                      style={{ fontSize: 15, padding: 8 }}
                      onChange={(e) => setsuppCurr(e.target.value)}
                      required
                      defaultValue={suppCurr}
                    >
                      <option disabled value="">
                        Select currency...
                      </option>
                      <option value="" disabled selected></option>
                      <option value="PHP">PHP (₱)</option>
                      <option value="USD">USD ($)</option>
                    </Form.Select>
                  </Col>
                  <Col></Col>
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
                      required
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
                        <option value="" disabled>
                          Select Country
                        </option>
                        <option value="Afghanistan">Afghanistan</option>
                        <option value="Åland Islands">Åland Islands</option>
                        <option value="Albania">Albania</option>
                        <option value="Algeria">Algeria</option>
                        <option value="American Samoa">American Samoa</option>
                        <option value="Andorra">Andorra</option>
                        <option value="Angola">Angola</option>
                        <option value="Anguilla">Anguilla</option>
                        <option value="Antarctica">Antarctica</option>
                        <option value="Antigua and Barbuda">
                          Antigua and Barbuda
                        </option>
                        <option value="Argentina">Argentina</option>
                        <option value="Armenia">Armenia</option>
                        <option value="Aruba">Aruba</option>
                        <option value="Australia">Australia</option>
                        <option value="Austria">Austria</option>
                        <option value="Azerbaijan">Azerbaijan</option>
                        <option value="Bahamas">Bahamas</option>
                        <option value="Bahrain">Bahrain</option>
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="Barbados">Barbados</option>
                        <option value="Belarus">Belarus</option>
                        <option value="Belgium">Belgium</option>
                        <option value="Belize">Belize</option>
                        <option value="Benin">Benin</option>
                        <option value="Bermuda">Bermuda</option>
                        <option value="Bhutan">Bhutan</option>
                        <option value="Bolivia">Bolivia</option>
                        <option value="Bosnia and Herzegovina">
                          Bosnia and Herzegovina
                        </option>
                        <option value="Botswana">Botswana</option>
                        <option value="Bouvet Island">Bouvet Island</option>
                        <option value="Brazil">Brazil</option>
                        <option value="British Indian Ocean Territory">
                          British Indian Ocean Territory
                        </option>
                        <option value="Brunei Darussalam">
                          Brunei Darussalam
                        </option>
                        <option value="Bulgaria">Bulgaria</option>
                        <option value="Burkina Faso">Burkina Faso</option>
                        <option value="Burundi">Burundi</option>
                        <option value="Cambodia">Cambodia</option>
                        <option value="Cameroon">Cameroon</option>
                        <option value="Canada">Canada</option>
                        <option value="Cape Verde">Cape Verde</option>
                        <option value="Cayman Islands">Cayman Islands</option>
                        <option value="Central African Republic">
                          Central African Republic
                        </option>
                        <option value="Chad">Chad</option>
                        <option value="Chile">Chile</option>
                        <option value="China">China</option>
                        <option value="Christmas Island">
                          Christmas Island
                        </option>
                        <option value="Cocos (Keeling) Islands">
                          Cocos (Keeling) Islands
                        </option>
                        <option value="Colombia">Colombia</option>
                        <option value="Comoros">Comoros</option>
                        <option value="Congo">Congo</option>
                        <option value="Congo, The Democratic Republic of The">
                          Congo, The Democratic Republic of The
                        </option>
                        <option value="Cook Islands">Cook Islands</option>
                        <option value="Costa Rica">Costa Rica</option>
                        <option value="Cote D'ivoire">Cote D'ivoire</option>
                        <option value="Croatia">Croatia</option>
                        <option value="Cuba">Cuba</option>
                        <option value="Cyprus">Cyprus</option>
                        <option value="Czech Republic">Czech Republic</option>
                        <option value="Denmark">Denmark</option>
                        <option value="Djibouti">Djibouti</option>
                        <option value="Dominica">Dominica</option>
                        <option value="Dominican Republic">
                          Dominican Republic
                        </option>
                        <option value="Ecuador">Ecuador</option>
                        <option value="Egypt">Egypt</option>
                        <option value="El Salvador">El Salvador</option>
                        <option value="Equatorial Guinea">
                          Equatorial Guinea
                        </option>
                        <option value="Eritrea">Eritrea</option>
                        <option value="Estonia">Estonia</option>
                        <option value="Ethiopia">Ethiopia</option>
                        <option value="Falkland Islands (Malvinas)">
                          Falkland Islands (Malvinas)
                        </option>
                        <option value="Faroe Islands">Faroe Islands</option>
                        <option value="Fiji">Fiji</option>
                        <option value="Finland">Finland</option>
                        <option value="France">France</option>
                        <option value="French Guiana">French Guiana</option>
                        <option value="French Polynesia">
                          French Polynesia
                        </option>
                        <option value="French Southern Territories">
                          French Southern Territories
                        </option>
                        <option value="Gabon">Gabon</option>
                        <option value="Gambia">Gambia</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Germany">Germany</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Gibraltar">Gibraltar</option>
                        <option value="Greece">Greece</option>
                        <option value="Greenland">Greenland</option>
                        <option value="Grenada">Grenada</option>
                        <option value="Guadeloupe">Guadeloupe</option>
                        <option value="Guam">Guam</option>
                        <option value="Guatemala">Guatemala</option>
                        <option value="Guernsey">Guernsey</option>
                        <option value="Guinea">Guinea</option>
                        <option value="Guinea-bissau">Guinea-bissau</option>
                        <option value="Guyana">Guyana</option>
                        <option value="Haiti">Haiti</option>
                        <option value="Heard Island and Mcdonald Islands">
                          Heard Island and Mcdonald Islands
                        </option>
                        <option value="Holy See (Vatican City State)">
                          Holy See (Vatican City State)
                        </option>
                        <option value="Honduras">Honduras</option>
                        <option value="Hong Kong">Hong Kong</option>
                        <option value="Hungary">Hungary</option>
                        <option value="Iceland">Iceland</option>
                        <option value="India">India</option>
                        <option value="Indonesia">Indonesia</option>
                        <option value="Iran, Islamic Republic of">
                          Iran, Islamic Republic of
                        </option>
                        <option value="Iraq">Iraq</option>
                        <option value="Ireland">Ireland</option>
                        <option value="Isle of Man">Isle of Man</option>
                        <option value="Israel">Israel</option>
                        <option value="Italy">Italy</option>
                        <option value="Jamaica">Jamaica</option>
                        <option value="Japan">Japan</option>
                        <option value="Jersey">Jersey</option>
                        <option value="Jordan">Jordan</option>
                        <option value="Kazakhstan">Kazakhstan</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Kiribati">Kiribati</option>
                        <option value="Korea, Democratic People's Republic of">
                          Korea, Democratic People's Republic of
                        </option>
                        <option value="Korea, Republic of">
                          Korea, Republic of
                        </option>
                        <option value="Kuwait">Kuwait</option>
                        <option value="Kyrgyzstan">Kyrgyzstan</option>
                        <option value="Lao People's Democratic Republic">
                          Lao People's Democratic Republic
                        </option>
                        <option value="Latvia">Latvia</option>
                        <option value="Lebanon">Lebanon</option>
                        <option value="Lesotho">Lesotho</option>
                        <option value="Liberia">Liberia</option>
                        <option value="Libyan Arab Jamahiriya">
                          Libyan Arab Jamahiriya
                        </option>
                        <option value="Liechtenstein">Liechtenstein</option>
                        <option value="Lithuania">Lithuania</option>
                        <option value="Luxembourg">Luxembourg</option>
                        <option value="Macao">Macao</option>
                        <option value="Macedonia, The Former Yugoslav Republic of">
                          Macedonia, The Former Yugoslav Republic of
                        </option>
                        <option value="Madagascar">Madagascar</option>
                        <option value="Malawi">Malawi</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Maldives">Maldives</option>
                        <option value="Mali">Mali</option>
                        <option value="Malta">Malta</option>
                        <option value="Marshall Islands">
                          Marshall Islands
                        </option>
                        <option value="Martinique">Martinique</option>
                        <option value="Mauritania">Mauritania</option>
                        <option value="Mauritius">Mauritius</option>
                        <option value="Mayotte">Mayotte</option>
                        <option value="Mexico">Mexico</option>
                        <option value="Micronesia, Federated States of">
                          Micronesia, Federated States of
                        </option>
                        <option value="Moldova, Republic of">
                          Moldova, Republic of
                        </option>
                        <option value="Monaco">Monaco</option>
                        <option value="Mongolia">Mongolia</option>
                        <option value="Montenegro">Montenegro</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Morocco">Morocco</option>
                        <option value="Mozambique">Mozambique</option>
                        <option value="Myanmar">Myanmar</option>
                        <option value="Namibia">Namibia</option>
                        <option value="Nauru">Nauru</option>
                        <option value="Nepal">Nepal</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="Netherlands Antilles">
                          Netherlands Antilles
                        </option>
                        <option value="New Caledonia">New Caledonia</option>
                        <option value="New Zealand">New Zealand</option>
                        <option value="Nicaragua">Nicaragua</option>
                        <option value="Niger">Niger</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="Niue">Niue</option>
                        <option value="Norfolk Island">Norfolk Island</option>
                        <option value="Northern Mariana Islands">
                          Northern Mariana Islands
                        </option>
                        <option value="Norway">Norway</option>
                        <option value="Oman">Oman</option>
                        <option value="Pakistan">Pakistan</option>
                        <option value="Palau">Palau</option>
                        <option value="Palestinian Territory, Occupied">
                          Palestinian Territory, Occupied
                        </option>
                        <option value="Panama">Panama</option>
                        <option value="Papua New Guinea">
                          Papua New Guinea
                        </option>
                        <option value="Paraguay">Paraguay</option>
                        <option value="Peru">Peru</option>
                        <option value="PH">Philippines</option>
                        <option value="Pitcairn">Pitcairn</option>
                        <option value="Poland">Poland</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Puerto Rico">Puerto Rico</option>
                        <option value="Qatar">Qatar</option>
                        <option value="Reunion">Reunion</option>
                        <option value="Romania">Romania</option>
                        <option value="Russian Federation">
                          Russian Federation
                        </option>
                        <option value="Rwanda">Rwanda</option>
                        <option value="Saint Helena">Saint Helena</option>
                        <option value="Saint Kitts and Nevis">
                          Saint Kitts and Nevis
                        </option>
                        <option value="Saint Lucia">Saint Lucia</option>
                        <option value="Saint Pierre and Miquelon">
                          Saint Pierre and Miquelon
                        </option>
                        <option value="Saint Vincent and The Grenadines">
                          Saint Vincent and The Grenadines
                        </option>
                        <option value="Samoa">Samoa</option>
                        <option value="San Marino">San Marino</option>
                        <option value="Sao Tome and Principe">
                          Sao Tome and Principe
                        </option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Senegal">Senegal</option>
                        <option value="Serbia">Serbia</option>
                        <option value="Seychelles">Seychelles</option>
                        <option value="Sierra Leone">Sierra Leone</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Slovakia">Slovakia</option>
                        <option value="Slovenia">Slovenia</option>
                        <option value="Solomon Islands">Solomon Islands</option>
                        <option value="Somalia">Somalia</option>
                        <option value="South Africa">South Africa</option>
                        <option value="South Georgia and The South Sandwich Islands">
                          South Georgia and The South Sandwich Islands
                        </option>
                        <option value="Spain">Spain</option>
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="Sudan">Sudan</option>
                        <option value="Suriname">Suriname</option>
                        <option value="Svalbard and Jan Mayen">
                          Svalbard and Jan Mayen
                        </option>
                        <option value="Swaziland">Swaziland</option>
                        <option value="Sweden">Sweden</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="Syrian Arab Republic">
                          Syrian Arab Republic
                        </option>
                        <option value="Taiwan">Taiwan</option>
                        <option value="Tajikistan">Tajikistan</option>
                        <option value="Tanzania, United Republic of">
                          Tanzania, United Republic of
                        </option>
                        <option value="Thailand">Thailand</option>
                        <option value="Timor-leste">Timor-leste</option>
                        <option value="Togo">Togo</option>
                        <option value="Tokelau">Tokelau</option>
                        <option value="Tonga">Tonga</option>
                        <option value="Trinidad and Tobago">
                          Trinidad and Tobago
                        </option>
                        <option value="Tunisia">Tunisia</option>
                        <option value="Turkey">Turkey</option>
                        <option value="Turkmenistan">Turkmenistan</option>
                        <option value="Turks and Caicos Islands">
                          Turks and Caicos Islands
                        </option>
                        <option value="Tuvalu">Tuvalu</option>
                        <option value="Uganda">Uganda</option>
                        <option value="Ukraine">Ukraine</option>
                        <option value="United Arab Emirates">
                          United Arab Emirates
                        </option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="United States Minor Outlying Islands">
                          United States Minor Outlying Islands
                        </option>
                        <option value="Uruguay">Uruguay</option>
                        <option value="Uzbekistan">Uzbekistan</option>
                        <option value="Vanuatu">Vanuatu</option>
                        <option value="Venezuela">Venezuela</option>
                        <option value="Viet Nam">Viet Nam</option>
                        <option value="Virgin Islands, British">
                          Virgin Islands, British
                        </option>
                        <option value="Virgin Islands, U.S.">
                          Virgin Islands, U.S.
                        </option>
                        <option value="Wallis and Futuna">
                          Wallis and Futuna
                        </option>
                        <option value="Western Sahara">Western Sahara</option>
                        <option value="Yemen">Yemen</option>
                        <option value="Zambia">Zambia</option>
                        <option value="Zimbabwe">Zimbabwe</option>
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

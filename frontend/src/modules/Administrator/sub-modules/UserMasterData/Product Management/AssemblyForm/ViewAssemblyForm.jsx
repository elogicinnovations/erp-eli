import React, { useEffect, useState } from "react";
import Sidebar from "../../../../../Sidebar/sidebar";
import "../../../../../../assets/global/style.css";
import "../../../../styles/react-style.css";
import ReactLoading from 'react-loading';
import NoData from '../../../../../../assets/image/NoData.png';
import NoAccess from '../../../../../../assets/image/NoAccess.png';
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import axios from "axios";
import BASE_URL from "../../../../../../assets/global/url";
import { ArrowCircleLeft } from "@phosphor-icons/react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "../../../../../../assets/skydash/vendors/feather/feather.css";
import "../../../../../../assets/skydash/vendors/css/vendor.bundle.base.css";
import "../../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css";
import "../../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
import "../../../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css";
import "../../../../../../assets/skydash/css/vertical-layout-light/style.css";
import "../../../../../../assets/skydash/vendors/js/vendor.bundle.base";
import "../../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
import "../../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4";
import "../../../../../../assets/skydash/js/off-canvas";
import * as $ from "jquery";

function ViewAssembly({authrztn}) {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Subparts");
  const [Subparts, setSubParts] = useState([]);
  const [Spareparts, setSpareparts] = useState([]);
  const [viewSupplier, setviewSupplier] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const tabStyle = {
    padding: "10px 15px",
    margin: "0 10px",
    color: "#333",
    transition: "color 0.3s",
  };

  //for sub parts
  useEffect(() => {
  const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/assembly_subparts/fetchinTable", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setSubParts(res.data)
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, 1000);

  return () => clearTimeout(delay);
  }, [id]);

  //for spare parts
  useEffect(() => {
  const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/spare_assembly/fetchinTable", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setSpareparts(res.data)
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, 1000);

  return () => clearTimeout(delay);
  }, [id]);


  //for supplier
  useEffect(() => {
  const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/supplier_assembly/fetchAssigned", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setviewSupplier(res.data)
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, 1000);

  return () => clearTimeout(delay);
  }, [id]);

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
                authrztn.includes('Assembly - View') ? (
        <div className="right-body-contentss">
          <div className="headers-text">
            <div className="arrowandtitle">
              <Link to="/assemblyForm">
                <ArrowCircleLeft size={50} color="#60646c" weight="fill" />
              </Link>
              <div className="titletext">
                <h1>Assembly Summary</h1>
              </div>
            </div>
          </div>

          <div className="searches-sidebars"></div>

          <div className="tabbutton-sides">
            <Tabs
              activeKey={activeTab}
              onSelect={(key) => setActiveTab(key)}
              transition={false}
              id="noanim-tab-example">
              <Tab
                eventKey="Subparts"
                title={
                  <span style={{ ...tabStyle, fontSize: "20px" }}>
                    Sub Parts
                  </span>
                }>
                <div className="productandprint">
                  <div className="printbtns"></div>
                </div>
                <div className="main-of-all-tables">
                  <table id="order-listing">
                    <thead>
                      <tr>
                        <th>Sub-Part Code</th>
                        <th>Sub-Part Name</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Subparts.map((sparts, i) => (
                        <tr key={i}>
                          <td>{sparts.subPart.subPart_code}</td>
                          <td>{sparts.subPart.subPart_name}</td>
                          <td>{sparts.subPart.subPart_desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Tab>
              <Tab
                eventKey="ordered list"
                title={
                  <span style={{ ...tabStyle, fontSize: "20px" }}>
                    Spare Parts
                  </span>
                }>
                <div className="orderhistory-side">
                  <div className="printersbtn"></div>
                </div>
                <div className="main-of-all-tables">
                  <table id="ordered-listing">
                    <thead>
                      <tr>
                        <th>Spare-Parts Code</th>
                        <th>Spare-Parts Name</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Spareparts.map((spares, i) => (
                        <tr key={i}>
                          <td>{spares.sparePart.spareParts_code}</td>
                          <td>{spares.sparePart.spareParts_name}</td>
                          <td>{spares.sparePart.spareParts_desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Tab>
              <Tab
                eventKey="Supplier"
                title={
                  <span style={{ ...tabStyle, fontSize: "20px" }}>
                    Supplier
                  </span>
                }>
                <div className="orderhistory-side">
                  <div className="printersbtn"></div>
                </div>
                <div className="main-of-all-tables">
                  <table id="ordered-listing">
                    <thead>
                      <tr>
                        <th>Supplier Code</th>
                        <th>Supplier Name</th>
                        <th>Price</th>
                        <th>Contact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewSupplier.map((supp, i) => (
                        <tr key={i}>
                          <td>{supp.supplier.supplier_code}</td>
                          <td>{supp.supplier.supplier_name}</td>
                          <td>{supp.supplier_price}</td>
                          <td>{supp.supplier.supplier_number}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Tab>
            </Tabs>
          </div>
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

export default ViewAssembly;

// ExportToPDF.js
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import BASE_URL from '../../../assets/global/url';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Export } from "@phosphor-icons/react";
import '../../styles/react-style.css';
import '../../../assets/global/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ExportToPDF = ({ tableId, tableData }) => {
  const tableRef = useRef(null);


  const handleExport = () => {
    const input = tableRef.current;
  
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 210; // A4 size
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  
        // Adjust column widths if needed
        // pdf.autoTable({ html: '#yourTableId' });
  
        pdf.save('table.pdf');
      });
    } else {
      console.error('Table element not found');
    }
  };
  
  
const [PO_prd, setPO_prd] = useState([]);
const [PO_assmbly, setPO_assmbly] = useState([]);
const [PO_spare, setPO_spare] = useState([]);
const [PO_subpart, setPO_subpart] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  Promise.all([
    axios.get(BASE_URL + '/report_PO/PO_PRD'),
    axios.get(BASE_URL + '/report_PO/PO_asmbly'),
    axios.get(BASE_URL + '/report_PO/PO_spare'),
    axios.get(BASE_URL + '/report_PO/PO_subpart'),
  ])
    .then(([prdRes, assmblyRes, spareRes, subpartRes]) => {
      setPO_prd(prdRes.data);
      setPO_assmbly(assmblyRes.data);
      setPO_spare(spareRes.data);
      setPO_subpart(subpartRes.data);
    })
    .catch((err) => console.error(err))
}, []);

// useEffect(() => {
//   if ($('#order-listing').length > 0 && !isLoading && PO_prd.length > 0) {
//     $('#order-listing').DataTable();
//   }
// }, [isLoading, PO_prd]);

// useEffect(() => { //fetch product for inventory
//   axios.get(BASE_URL + '/report_PO/PO_PRD')
//     .then(res => setPO_prd(res.data))
//     .catch(err => console.log(err));
// }, []);

// useEffect(() => { //fetch product for inventory
//   axios.get(BASE_URL + '/report_PO/PO_asmbly')
//     .then(res => setPO_assmbly(res.data))
//     .catch(err => console.log(err));
// }, []);


// useEffect(() => { //fetch product for inventory
//   axios.get(BASE_URL + '/report_PO/PO_spare')
//     .then(res => setPO_spare(res.data))
//     .catch(err => console.log(err));
// }, []);


// useEffect(() => { //fetch product for inventory
//   axios.get(BASE_URL + '/report_PO/PO_subpart')
//     .then(res => setPO_subpart(res.data))
//     .catch(err => console.log(err));
// }, []);


  return (
    <div>
        {/* <button onClick={handleExport}>Export to PDF</button> */}
        <div className='export-refresh' >
            <button onClick={handleExport} className='export'>
                <Export size={20} weight="bold" /> <p1>Export</p1>
            </button>
        </div>

        <div className="table-containss">
            <div className="main-of-all-tables">
                
                <table id={tableId} style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th className='tableh'>PO Number</th>
                            <th className='tableh'>PO Date</th>
                            <th className='tableh'>Product Code</th>
                            <th className='tableh'>Product</th>
                            <th className='tableh'>UOM</th>
                            <th className='tableh'>Supplier</th>
                            <th className='tableh'>Unit Cost</th>
                            <th className='tableh'>Quantity</th>
                            <th className='tableh'>Total</th>
                        </tr>
                    </thead>
                    <tbody>

                        
                        {PO_prd.map((data,i) =>(
                            <tr key={i}>
                            <td>{data.pr_id}</td>
                            <td>{data.purchase_req.updatedAt}</td>
                            <td>{data.product_tag_supplier.product.product_code}</td>
                            <td>{data.product_tag_supplier.product.product_name}</td>
                            <td>{data.product_tag_supplier.product.product_unitMeasurement}</td>
                            <td>{data.product_tag_supplier.supplier.supplier_name}</td>
                            <td>{data.product_tag_supplier.product_price}</td>
                            <td>{data.quantity}</td>
                            <td>{data.product_tag_supplier.product_price * data.quantity}</td>
                            </tr>
                        ))}

                        {PO_assmbly.map((data,i) =>(
                            <tr key={i}>
                            <td>{data.pr_id}</td>
                            <td>{data.purchase_req.updatedAt}</td>
                            <td>{data.assembly_supplier.assembly.assembly_code}</td>
                            <td>{data.assembly_supplier.assembly.assembly_name}</td>
                            <td>--</td>
                            <td>{data.assembly_supplier.supplier.supplier_name}</td>
                            <td>{data.assembly_supplier.supplier_price}</td>
                            <td>{data.quantity}</td>
                            <td>{data.assembly_supplier.supplier_price * data.quantity}</td>
                            </tr>
                        ))}

                        {PO_spare.map((data,i) =>(
                            <tr key={i}>
                            <td>{data.pr_id}</td>
                            <td>{data.purchase_req.updatedAt}</td>
                            <td>{data.sparepart_supplier.sparePart.spareParts_code}</td>
                            <td>{data.sparepart_supplier.sparePart.spareParts_name}</td>
                            <td>--</td>
                            <td>{data.sparepart_supplier.supplier.supplier_name}</td>
                            <td>{data.sparepart_supplier.supplier_price}</td>
                            <td>{data.quantity}</td>
                            <td>{data.sparepart_supplier.supplier_price * data.quantity}</td>
                            </tr>
                        ))}

                        {PO_subpart.map((data,i) =>(
                            <tr key={i}>
                            <td>{data.pr_id}</td>
                            <td>{data.purchase_req.updatedAt}</td>
                            <td>{data.subpart_supplier.subPart.subPart_code}</td>
                            <td>{data.subpart_supplier.subPart.subPart_name}</td>
                            <td>--</td>
                            <td>{data.subpart_supplier.supplier.supplier_name}</td>
                            <td>{data.subpart_supplier.supplier_price}</td>
                            <td>{data.quantity}</td>
                            <td>{data.subpart_supplier.supplier_price * data.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default ExportToPDF;

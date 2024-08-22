import React, { useState, useEffect, useRef } from "react";
import axios from "axios"; // Import axios
import { Container, Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow, Divider, TextField, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import MKBox from "components/MKBox";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import MKButton from "components/MKButton";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import { BASEURL } from "../../Api";

function InvoiceReportPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { totalTax = 0, convertedPrice = 0, invoiceDetails = {} } = location.state || {};
    const [productDetails, setProductDetails] = useState([]);
    const printRef = useRef();

    // Function to fetch product details based on the reference number
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`${BASEURL}/products?refNumber=${invoiceDetails.invoiceNumber}`);
                setProductDetails(response.data);
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };

        if (invoiceDetails.invoiceNumber) {
            fetchProductDetails();
        }
    }, [invoiceDetails.invoiceNumber]);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    const handleDownloadPDF = () => {
        const doc = new jsPDF("portrait", "px", "a4");
        doc.html(printRef.current, {
            callback: function (doc) {
                doc.save("ProformaInvoice.pdf");
            },
            margin: [10, 10, 10, 10],
            autoPaging: "text",
            x: 10,
            y: 10,
        });
    };

    return (
        <>
            <DefaultNavbar routes={routes} sticky />
            <MKBox minHeight="30vh" width="100%" />
            <Container>
                <div ref={printRef} style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
                    {/* Header Section */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <Box>
                            <img
                                src={invoiceDetails.companyLogo || "https://via.placeholder.com/150"}
                                alt="Company Logo"
                                style={{ width: '150px', height: 'auto' }}
                            />
                        </Box>
                        <Box>
                            <Typography variant="h5">
                                Determined to make a difference
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ marginY: 3 }} />

                    {/* Invoice Details */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">
                                Proforma Invoice
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} textAlign="right">
                            <Typography variant="h6">
                                Date: {invoiceDetails.date || "DD/MM/YYYY"}
                            </Typography>
                            <Typography variant="h6">
                                Reference Number: {invoiceDetails.invoiceNumber || "####"}
                            </Typography>
                        </Grid>
                        <Grid container spacing={2} margin='2px' >
                            <Grid item xs={12} md={6} textAlign="left">
                                <Typography variant="h6" >
                                    Diligence Technologies-One Member PLC
                                    <br />
                                    Gabon Street, Meskel Flower Road Aster Surafel Building
                                    <br />
                                    Office number: 429/305/2
                                    <br />
                                    <span>telephone: Tel: +251-911-224397, +251-911-04-49-72, +251-114-70-18-48</span>
                                    <br />
                                    email: tewodros@diligencetechnologies.et
                                    <br />
                                    website: www.diligencetechnologies.et
                                    <br />
                                    Addis Ababa, Ethiopia
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6} textAlign="left">
                            <TextField
                                label="BILL TO"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="To"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ marginY: 3 }} />

                    {/* Product Table Section */}
                    <Table sx={{ border: '3px solid black' }}>
                        <TableRow>
                            <TableCell><strong>Description</strong></TableCell>
                            <TableCell align="center"><strong>Quantity</strong></TableCell>
                            <TableCell align="center"><strong>Unit Price</strong></TableCell>
                            <TableCell align="center"><strong>Amount</strong></TableCell>
                        </TableRow>
                        <TableBody>
                            {productDetails.map((product, index) => (
                                <TableRow key={index}>
                                    <TableCell>{product.description}</TableCell>
                                    <TableCell align="center">{product.quantity}</TableCell>
                                    <TableCell align="center">{product.unitPrice.toFixed(2)}</TableCell>
                                    <TableCell align="center">{(product.quantity * product.unitPrice).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={3} align="right"><strong>Subtotal</strong></TableCell>
                                <TableCell align="center">
                                    {productDetails.reduce((acc, product) => acc + product.quantity * product.unitPrice, 0).toFixed(2)}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={3} align="right"><strong>Total Tax</strong></TableCell>
                                <TableCell align="center">{totalTax.toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={3} align="right"><strong>Grand Total</strong></TableCell>
                                <TableCell align="center">
                                    {(productDetails.reduce((acc, product) => acc + product.quantity * product.unitPrice, 0) + totalTax).toFixed(2)}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <Divider sx={{ marginY: 3 }} />

                    {/* Footer Section */}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="NOTE"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Amount in words"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Validity"
                                variant="outlined"
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Advance Payment"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={2}
                            />
                        </Grid>
                    </Grid>
                </div>
                <Grid container spacing={2} justifyContent="flex-end" marginTop={4}>
                    <Grid item xs={12} sm={3}>
                        <MKButton variant="contained" color="primary" onClick={handlePrint} fullWidth>
                            Print Proforma Invoice
                        </MKButton>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <MKButton variant="contained" color="primary" onClick={handleDownloadPDF} fullWidth>
                            Download as PDF
                        </MKButton>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export default InvoiceReportPage;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    Container,
    Grid,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Divider,
    TextField,
    Box,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from "@mui/material";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import MKButton from "components/MKButton";
import { BASEURL } from "../../Api";
import MKBox from "components/MKBox";

function InvoiceReportPage() {
    const [invoiceReferences, setInvoiceReferences] = useState([]);
    const [selectedReference, setSelectedReference] = useState("");
    const [productDetails, setProductDetails] = useState([]);
    const [invoiceDetails, setInvoiceDetails] = useState({});
    const [totalTax, setTotalTax] = useState(0);
    const [invoices, setInvoices] = useState([]);
    const printRef = useRef();

    // Method to fetch invoice references
    const fetchInvoiceReferences = async () => {
        try {
            const response = await axios.get(`${BASEURL}/invoiceReference`);
            console.log("Fetched References:", response.data); // Debugging line
            setInvoiceReferences(response.data || []);
        } catch (error) {
            console.error("Error fetching invoice references:", error);
        }
    };

    // Method to fetch invoice data based on reference
    const fetchInvoiceData = async (reference) => {
        if (reference) {
            try {
                const response = await axios.get(`${BASEURL}/invoice/${reference}`);
                console.log("Fetched Invoice Data:", response.data); // Debugging line

                // Assume response.data is an array of invoices
                const invoicesData = response.data;
                setInvoices(invoicesData);

                // Merge all product details and calculate total tax
                let allProductDetails = [];
                let totalTaxSum = 0;

                invoicesData.forEach(invoice => {
                    if (invoice.product_details) {
                        const productDetails = JSON.parse(invoice.product_details);
                        // Ensure that each product has a converted_price
                        productDetails.forEach(product => {
                            product.converted_price = parseFloat(invoice.converted_price) || 0; // Default to 0 if not available
                        });
                        allProductDetails = [...allProductDetails, ...productDetails];
                    }
                    if (invoice.total_tax) {
                        totalTaxSum += parseFloat(invoice.total_tax);
                    }
                });

                setProductDetails(allProductDetails);
                setTotalTax(totalTaxSum);

            } catch (error) {
                console.error("Error fetching invoice data:", error);
            }
        }
    };

    useEffect(() => {
        fetchInvoiceReferences(); // Fetch references when the component mounts
    }, []);

    useEffect(() => {
        fetchInvoiceData(selectedReference); // Fetch invoice data when reference changes
    }, [selectedReference]);

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
                                Date: {invoices[0]?.created_at?.split('T')[0] || "DD/MM/YYYY"}
                            </Typography>
                            <FormControl fullWidth>
                                <InputLabel>Select Invoice Reference</InputLabel>
                                <Select
                                    value={selectedReference}
                                    onChange={(e) => setSelectedReference(e.target.value)}
                                    label="Select Invoice Reference"
                                >
                                    {invoiceReferences.length > 0 ? (
                                        invoiceReferences.map((ref) => (
                                            <MenuItem key={ref} value={ref}>
                                                {ref}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>No References Available</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid container spacing={2} margin='2px'>
                            <Grid item xs={12} md={6} textAlign="left">
                                <Typography variant="h6">
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
                            <TableCell><strong>Product Name</strong></TableCell>
                            <TableCell align="center"><strong>Quantity</strong></TableCell>
                            <TableCell align="center"><strong>Unit Price (Converted)</strong></TableCell>
                            <TableCell align="center"><strong>Amount</strong></TableCell>
                        </TableRow>

                        <TableBody>
                            {productDetails.length > 0 ? (
                                productDetails.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell align="center">{product.quantity}</TableCell>
                                        <TableCell align="center">
                                            {product.converted_price !== undefined ? product.converted_price.toFixed(2) : 'N/A'}
                                        </TableCell>
                                        <TableCell align="center">
                                            {(product.quantity * product.converted_price).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">No Products Available</TableCell>
                                </TableRow>
                            )}
                            <TableRow>
                                <TableCell colSpan={3} align="right"><strong>Subtotal</strong></TableCell>
                                <TableCell align="center">
                                    {productDetails.reduce((acc, product) => acc + product.quantity * (product.converted_price || 0), 0).toFixed(2)}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={3} align="right"><strong>Total Tax</strong></TableCell>
                                <TableCell align="center">{totalTax.toFixed(2)}</TableCell>
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
                <MKBox mt={2} display="flex" justifyContent="space-between">
                    <MKButton onClick={handlePrint} color="primary">Print</MKButton>
                    <MKButton onClick={handleDownloadPDF} color="primary">Download PDF</MKButton>
                </MKBox>
            </Container>
        </>
    );
}

export default InvoiceReportPage;

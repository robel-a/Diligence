import React, { useState, useEffect } from "react";
import {
    Container, Grid, TextField, Typography, Modal, Box, MenuItem,
    Select,
    FormControl,
    InputLabel, IconButton
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from "react-router-dom";
import MKBox from "components/MKBox";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import MKButton from "components/MKButton";
import axios from 'axios';
import { BASEURL } from "../../Api";

function SellingPrice() {
    const location = useLocation();
    const navigate = useNavigate();
    const [referenceNumber, setReferenceNumber] = useState(""); // Use this for the selected or added reference number
    const [invoiceReferences, setInvoiceReferences] = useState([]);
    const [newReference, setNewReference] = useState(""); // State to manage new reference input
    const { totalTax = 0, convertedPrice = 0, productDetails = [], cif = 0, totalProductPrice = 0 } = location.state || {};
    const [margin, setMargin] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Calculate the base selling price (CIF + Total Tax)
    const baseSellingPrice = cif + totalTax;
    // Calculate the margin amount based on the base selling price and margin percentage
    const marginAmount = baseSellingPrice * (margin / 100);
    // Calculate the final selling price by adding the margin amount to the base selling price
    const sellingPrice = baseSellingPrice + marginAmount;

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const fetchInvoiceReferences = async () => {
        try {
            const response = await axios.get(`${BASEURL}/invoiceReference`);
            setInvoiceReferences(response.data || []);
        } catch (error) {
            console.error("Error fetching invoice references:", error);
        }
    };

    const handleAddReference = () => {
        if (newReference) {
            setInvoiceReferences((prevReferences) => [...prevReferences, newReference]);
            setReferenceNumber(newReference);
            setNewReference("");  // Clear the new reference input after adding
        }
    };

    const handleSubmit = async () => {
        if (!referenceNumber) {
            alert("Please select or add a reference number before submitting.");
            return;
        }

        try {
            setLoading(true);

            // Calculate the unit price and selling price for each product
            const updatedProductDetails = productDetails.map((product) => {
                const productSellingPrice = product.price + (product.price * margin / 100);
                const unitPrice = productSellingPrice / product.quantity;
                return {
                    ...product,
                    sellingPrice: productSellingPrice.toFixed(2),
                    unitPrice: unitPrice.toFixed(2),
                };
            });

            const payload = {
                referenceNumber,
                productDetails: updatedProductDetails,
                totalTax,
                convertedPrice,
                sellingPrice: sellingPrice.toFixed(2),
            };

            await axios.post(`${BASEURL}/invoices`, payload);
            navigate("/InvoiceReport", { state: { referenceNumber } });
        } catch (error) {
            console.error("Error submitting data:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoiceReferences();
    }, []);

    return (
        <>
            <DefaultNavbar routes={routes} sticky />
            <MKBox minHeight="30vh" width="100%" />
            <Container>
                <IconButton
                    onClick={() => navigate("/pages/CustomTax/BankRate")}
                    color="primary"
                    sx={{ marginBottom: 2 }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Grid container spacing={2} justifyContent="flex-start">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" textAlign="left" marginBottom={2}>
                            Product Details
                        </Typography>
                        <TextField
                            label="Total Product Price"
                            variant="outlined"
                            fullWidth
                            value={totalProductPrice.toFixed(2)}
                            InputProps={{ readOnly: true }}
                            margin="normal"
                        />
                        <TextField
                            label="CIF"
                            variant="outlined"
                            type="number"
                            fullWidth
                            value={convertedPrice.toFixed(2)}
                            InputProps={{ readOnly: true }}
                            margin="normal"
                        />
                        <TextField
                            label="Total Tax"
                            variant="outlined"
                            fullWidth
                            value={totalTax.toFixed(2)}
                            InputProps={{ readOnly: true }}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" textAlign="left" marginBottom={2}>
                            Additional Information
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Margin (%)"
                                    variant="outlined"
                                    type="number"
                                    fullWidth
                                    value={margin}
                                    onChange={(e) => setMargin(Number(e.target.value))}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Selling Price"
                                    variant="outlined"
                                    fullWidth
                                    value={sellingPrice.toFixed(2)}
                                    InputProps={{ readOnly: true }}
                                    margin="normal"
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <MKButton
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate("/pages/AddProduct")}
                                    sx={{ marginTop: 2 }}
                                >
                                    Add Product
                                </MKButton>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <MKButton
                                    variant="contained"
                                    color="primary"
                                    onClick={handleOpenModal}
                                    sx={{ marginTop: 2 }}
                                >
                                    View Product
                                </MKButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>

            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" component="h2" gutterBottom>
                        Product Information
                    </Typography>
                    {productDetails.map((product, index) => {
                        // Calculate the selling price including the margin
                        const productSellingPrice = (product.price + (product.price * margin / 100)).toFixed(2);
                        // Calculate the unit price as the selling price divided by quantity
                        const unitPrice = (sellingPrice / product.quantity).toFixed(2);

                        return (
                            <Box key={index} mb={2}>
                                <Typography>Name: {product.name}</Typography>
                                <Typography>Quantity: {product.quantity}</Typography>
                                <Typography>Unit Price: {unitPrice}</Typography>
                                <Typography>Selling Price: {sellingPrice}</Typography>
                            </Box>
                        );
                    })}
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Select Invoice Reference</InputLabel>
                        <Select
                            value={referenceNumber}  // Bind to referenceNumber
                            onChange={(e) => setReferenceNumber(e.target.value)}  // Update referenceNumber directly
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
                    <TextField
                        label="Add New Invoice Reference"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newReference}
                        onChange={(e) => setNewReference(e.target.value)}
                    />
                    <MKButton
                        variant="contained"
                        color="secondary"
                        onClick={handleAddReference}
                        sx={{ marginTop: 2 }}
                        disabled={!newReference.trim()} // Disable button if input is empty
                    >
                        Add Reference
                    </MKButton>
                    <MKButton
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{ marginTop: 2 }}
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </MKButton>
                </Box>
            </Modal>
        </>
    );
}

export default SellingPrice;

import React, { useState } from "react";
import { Container, Grid, TextField, Typography, Modal, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import MKBox from "components/MKBox";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import MKButton from "components/MKButton";
import axios from 'axios';
import { BASEURL } from "../../Api"; // Adjust the import path as needed

function SellingPrice() {
    const location = useLocation();
    const navigate = useNavigate();
    const { totalTax = 0, convertedPrice = 0, productDetails = [], cif = 0, totalProductPrice = 0 } = location.state || {};
    const [margin, setMargin] = useState(0);
    const sellingPrice = (cif + totalTax) + ((cif + totalTax) * margin / 100) + ((cif + totalTax) + ((cif + totalTax) * margin / 100)) * 0.15;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [referenceNumber, setReferenceNumber] = useState("");
    const [loading, setLoading] = useState(false); // To handle loading state

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleSubmit = async () => {
        try {
            setLoading(true); // Set loading to true while the request is in progress

            // Prepare the payload for the API request
            const payload = {
                referenceNumber,
                productDetails,
                totalTax,
                convertedPrice,
                sellingPrice,
            };

            // Post request to the backend
            await axios.post(`${BASEURL}/invoices`, payload); // Adjust the endpoint as necessary

            // Navigate to InvoiceReport page after successful submission
            // navigate("/InvoiceReport", { state: { referenceNumber } });
        } catch (error) {
            console.error("Error submitting data:", error.response?.data || error.message);
            // Handle error, potentially showing an error message to the user
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <>
            <DefaultNavbar routes={routes} sticky />
            <MKBox minHeight="30vh" width="100%" />
            <Container>
                <Grid container spacing={2} justifyContent="flex-start">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" textAlign="left" marginBottom={2}>
                            Product Details
                        </Typography>
                        <TextField
                            label="Total Product Price"
                            variant="outlined"
                            fullWidth
                            value={totalProductPrice.toFixed(2)} // Display totalProductPrice correctly
                            InputProps={{ readOnly: true }}
                            margin="normal"
                        />
                        <TextField
                            label="CIF"
                            variant="outlined"
                            type="number"
                            fullWidth
                            value={convertedPrice.toFixed(2)} // Display CIF value correctly
                            InputProps={{ readOnly: true }}
                            margin="normal"
                        />
                        <TextField
                            label="Total Tax"
                            variant="outlined"
                            fullWidth
                            value={totalTax.toFixed(2)} // Display totalTax correctly
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
                                    value={sellingPrice.toFixed(2)} // Display selling price correctly
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

            {/* Modal for viewing product details */}
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
                    {productDetails.map((product, index) => (
                        <Box key={index} mb={2}>
                            <Typography>Name: {product.name}</Typography>
                            <Typography>Quantity: {product.quantity}</Typography>
                            <Typography>Unit Price: {(product.price).toFixed(2)}</Typography>
                            <Typography>Selling Price: {((product.price * margin / 100) + product.price).toFixed(2)}</Typography>
                        </Box>
                    ))}
                    <TextField
                        label="Reference Number"
                        variant="outlined"
                        fullWidth
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        margin="normal"
                    />
                    <MKButton
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{ marginTop: 2 }}
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </MKButton>
                </Box>
            </Modal>
        </>
    );
}

export default SellingPrice;

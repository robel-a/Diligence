import React, { useState } from "react";
import { Container, Grid, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import axios from "axios";
import { BASEURL } from "../../Api"; // Ensure BASEURL is correctly configured

function AddProduct() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(""); // State to handle error messages
    const [errorDetails, setErrorDetails] = useState(""); // State to handle detailed error messages
    const navigate = useNavigate();

    const totalPrice = price * quantity;

    const handleAddProduct = () => {
        if (name && price > 0 && quantity > 0) {
            setProducts([...products, { name, price, quantity, total_price: totalPrice }]);
            setName("");
            setPrice(0);
            setQuantity(0);
            setError(""); // Clear error message on successful product addition
        } else {
            setError("Please provide valid product details.");
        }
    };

    const handleSendTotalPrice = async () => {
        try {
            // Send product data to backend
            await axios.post(`${BASEURL}/products`, { products });

            // Navigate to another page with state
            navigate("/pages/CustomTax/BlackRate", { state: { products } });
        } catch (error) {
            // Handle error and update the error state
            if (error.response && error.response.status === 422) {
                // Extract and display validation error messages from server
                setErrorDetails(error.response.data.errors);
            } else {
                setError("Failed to send product data. Please try again.");
            }
            console.error("Error sending product data:", error);
        }
    };

    return (
        <>
            <DefaultNavbar routes={routes} sticky />
            <MKBox minHeight="30vh" width="100%"></MKBox>
            <Container>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" textAlign="center" marginBottom={2}>
                            Add Product
                        </Typography>
                        {error && (
                            <Alert severity="error" style={{ marginBottom: '16px' }}>
                                {error}
                            </Alert>
                        )}
                        {errorDetails && Object.keys(errorDetails).map((key) => (
                            <Alert key={key} severity="error">
                                {`${key}: ${errorDetails[key].join(', ')}`}
                            </Alert>
                        ))}
                        <TextField
                            label="Product Name"
                            variant="outlined"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            label="Price"
                            variant="outlined"
                            type="number"
                            fullWidth
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            margin="normal"
                        />
                        <TextField
                            label="Quantity"
                            variant="outlined"
                            type="number"
                            fullWidth
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            margin="normal"
                        />
                        <TextField
                            label="Total Price"
                            variant="outlined"
                            fullWidth
                            value={totalPrice}
                            InputProps={{ readOnly: true }}
                            margin="normal"
                        />
                        <MKButton
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleAddProduct}
                            margin="normal"
                        >
                            Add Product
                        </MKButton>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" textAlign="center" marginBottom={2}>
                            Products List
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Total Price</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                                <TableBody>
                                    {products.map((product, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>{product.price}</TableCell>
                                            <TableCell>{product.quantity}</TableCell>
                                            <TableCell>{product.total_price}</TableCell>
                                            <TableCell>
                                                <MKButton
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleSendTotalPrice}
                                                    sx={{ color: 'white' }}
                                                >
                                                    Send Total
                                                </MKButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export default AddProduct;

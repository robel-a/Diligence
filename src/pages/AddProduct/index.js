import React, { useState } from "react";
import { Container, Grid, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Alert, IconButton, Card, CardContent, CardActions, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
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
    const [confirmOpen, setConfirmOpen] = useState(false); // State for confirmation dialog
    const [deleteIndex, setDeleteIndex] = useState(null); // Index of product to delete
    const [successMessage, setSuccessMessage] = useState(""); // State for success messages
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

            // Show success message
            setSuccessMessage("Product data sent successfully!");

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

    const handleDeleteProduct = (index) => {
        setDeleteIndex(index);
        setConfirmOpen(true);
    };

    const confirmDeleteProduct = () => {
        const newProducts = products.filter((_, i) => i !== deleteIndex);
        setProducts(newProducts);
        setConfirmOpen(false);
        setDeleteIndex(null);
    };

    const cancelDeleteProduct = () => {
        setConfirmOpen(false);
        setDeleteIndex(null);
    };

    return (
        <>
            <DefaultNavbar routes={routes} sticky />
            <MKBox minHeight="30vh" width="100%"></MKBox>
            <Container>
                <Card sx={{ padding: 3, marginTop: 2 }}>
                    <CardContent>
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
                                {successMessage && (
                                    <Alert severity="success" style={{ marginBottom: '16px' }}>
                                        {successMessage}
                                    </Alert>
                                )}
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
                                                        <IconButton
                                                            color="secondary"
                                                            onClick={() => handleDeleteProduct(index)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                        <MKButton
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={handleSendTotalPrice}
                                                            sx={{ color: 'white', ml: 1 }}
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
                    </CardContent>
                    <CardActions>
                        {/* Any additional actions or buttons can be placed here */}
                    </CardActions>
                </Card>
            </Container>
            <Dialog
                open={confirmOpen}
                onClose={cancelDeleteProduct}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this product?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDeleteProduct} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDeleteProduct} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AddProduct;

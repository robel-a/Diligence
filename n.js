import React, { useState, useEffect } from "react";
import {
    Container,
    Grid,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    Alert,
    IconButton,
    Card,
    CardContent,
    CardActions,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useLocation } from "react-router-dom";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import axios from "axios";
import { BASEURL } from "../../Api"; // Ensure BASEURL is correctly configured

function AddProduct() {
    const navigate = useNavigate();
    const location = useLocation(); // To receive data when navigating from ReportTable
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [errorDetails, setErrorDetails] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [editIndex, setEditIndex] = useState(null); // Track if editing a product
    const [editProductId, setEditProductId] = useState(null); // Track the ID of the product being edited

    useEffect(() => {
        // Check if we're editing an existing product
        if (location.state && location.state.productDetails) {
            const { productDetails, index } = location.state;
            setName(productDetails.name || "");
            setPrice(productDetails.price || 0);
            setQuantity(productDetails.quantity || 0);
            setEditIndex(index); // If coming from ReportTable, set the editIndex
            setEditProductId(productDetails.id); // Set the ID for the product to be edited
        }

        // Fetch existing products from the backend when the component mounts
        fetchProducts();
    }, [location.state]);

    // Function to fetch products from the backend
    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${BASEURL}/products`);
            setProducts(response.data); // Assume the response data contains a list of products
        } catch (error) {
            console.error("Error fetching products:", error);
            setError("Failed to fetch products. Please try again.");
        }
    };

    const totalPrice = price * quantity;

    const handleAddProduct = async () => {
        if (name && price > 0 && quantity > 0) {
            const newProduct = { name, price, quantity, total_price: totalPrice };

            try {
                if (editProductId) {
                    // Update existing product
                    await axios.put(`${BASEURL}/products/${editProductId}`, newProduct);

                    // Update the product list locally
                    const updatedProducts = products.map((product) =>
                        product.id === editProductId ? { ...product, ...newProduct } : product
                    );
                    setProducts(updatedProducts);
                    setEditProductId(null); // Clear editProductId after editing
                } else {
                    // Add new product
                    const response = await axios.post(`${BASEURL}/products`, newProduct);
                    setProducts([...products, response.data]); // Add new product returned by backend
                }

                // Clear form fields
                setName("");
                setPrice(0);
                setQuantity(0);
                setError(""); // Clear error message on successful product addition
                setSuccessMessage("Product saved successfully!");
            } catch (error) {
                console.error("Error saving product:", error);
                setError("Failed to save product. Please try again.");
            }
        } else {
            setError("Please provide valid product details.");
        }
    };

    const handleSendTotalPrice = async () => {
        try {
            // Send product data to the backend
            await axios.post(`${BASEURL}/products`, { products });

            // Show success message
            setSuccessMessage("Product data sent successfully!");

            // Navigate to another page with state, including both products and productDetails
            navigate("/pages/CustomTax/BlackRate", {
                state: {
                    products,
                    productDetails: products.map((product) => ({
                        name: product.name,
                        price: product.price,
                        quantity: product.quantity,
                    })), // Passing as productDetails
                },
            });

            console.log(products);
        } catch (error) {
            if (error.response && error.response.status === 422) {
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

    const confirmDeleteProduct = async () => {
        if (deleteIndex !== null) {
            const productToDelete = products[deleteIndex];

            try {
                // Send DELETE request to the backend
                await axios.delete(`${BASEURL}/products/${productToDelete.id}`);

                // Update product list locally
                const newProducts = products.filter((_, i) => i !== deleteIndex);
                setProducts(newProducts);
                setConfirmOpen(false);
                setDeleteIndex(null);
                setSuccessMessage("Product deleted successfully!");
            } catch (error) {
                console.error("Error deleting product:", error);
                setError("Failed to delete product. Please try again.");
            }
        }
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
                                    {editProductId ? "Edit Product" : "Add Product"}
                                </Typography>
                                {error && (
                                    <Alert severity="error" style={{ marginBottom: "16px" }}>
                                        {error}
                                    </Alert>
                                )}
                                {errorDetails &&
                                    Object.keys(errorDetails).map((key) => (
                                        <Alert key={key} severity="error">
                                            {`${key}: ${errorDetails[key].join(", ")}`}
                                        </Alert>
                                    ))}
                                {successMessage && (
                                    <Alert severity="success" style={{ marginBottom: "16px" }}>
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
                                    {editProductId ? "Update Product" : "Add Product"}
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
                                                <TableRow key={product.id}>
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
                                                            sx={{ color: "white", ml: 1 }}
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
            <Dialog open={confirmOpen} onClose={cancelDeleteProduct}>
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

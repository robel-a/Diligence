import React from "react";
import { Container, Grid, TextField, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import MKBox from "components/MKBox";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import MKButton from "components/MKButton";

function SellingPrice() {
    const location = useLocation();
    const navigate = useNavigate();
    const { totalTax = 0, convertedPrice = 0, productDetails = [], cif = 0, totalProductPrice = 0 } = location.state || {};
    const [margin, setmargin] = React.useState(0);
    const sellingPrice = (cif + totalTax) + ((cif + totalTax) * margin) + ((cif + totalTax) + ((cif + totalTax) * margin)) * .15;

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
                                    onChange={(e) => setmargin(Number(e.target.value))}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Selling Price"
                                    variant="outlined"
                                    fullWidth
                                    value={sellingPrice.toFixed(2)} // Display totalTax correctly
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
                                    onClick={() => navigate("/pages/CustomTax/BuyingPricePage")}
                                    sx={{ marginTop: 2 }}
                                >
                                    View Product
                                </MKButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export default SellingPrice;

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
    const { totalTax = 0, convertedPrice = 0, productDetails = [] } = location.state || {};

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
                            value={productDetails.map(p => p.totalPrice).reduce((acc, price) => acc + price, 0)}
                            InputProps={{ readOnly: true }}
                            margin="normal"
                        />
                        <TextField
                            label="CIF"
                            variant="outlined"
                            type="number"
                            fullWidth
                            value={convertedPrice}
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
                                    label="Total Tax"
                                    variant="outlined"
                                    fullWidth
                                    value={totalTax}
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
                                    onClick={() => navigate("/pages/CustomTax/BuyingPricePage")}
                                    sx={{ marginTop: 2 }}
                                >
                                    Go to Buying Price Page
                                </MKButton>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <MKButton
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate("/pages/CustomTax/BuyingPricePage")}
                                    sx={{ marginTop: 2 }}
                                >
                                    Go to Buying Price Page
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

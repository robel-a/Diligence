import React, { useState, useEffect } from "react";
import { Container, Grid, TextField, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import MKBox from "components/MKBox";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import MKButton from "components/MKButton";
import axios from 'axios'; // Import axios for API calls
import { BASEURL } from "../../../Api";

function BuyingPricePage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { products = [], productDetails = [] } = location.state || {};

    const totalProductPrice = products.reduce((acc, product) => acc + product.total_price, 0);

    const [freightOption, setFreightOption] = useState("percentage");
    const [insuranceOption, setInsuranceOption] = useState("percentage");
    const [freightValue, setFreightValue] = useState(0);
    const [insuranceValue, setInsuranceValue] = useState(0);
    const [exchangeRate, setExchangeRate] = useState(1);

    const [totalFreight, setTotalFreight] = useState(0);
    const [totalInsurance, setTotalInsurance] = useState(0);

    useEffect(() => {
        if (freightOption === "percentage") {
            setTotalFreight((freightValue) / 100);
        } else {
            setTotalFreight(freightValue);
        }
    }, [freightValue, freightOption, totalProductPrice]);

    useEffect(() => {
        if (insuranceOption === "percentage") {
            setTotalInsurance((insuranceValue) / 100);
        } else {
            setTotalInsurance(insuranceValue);
        }
    }, [insuranceValue, insuranceOption, totalProductPrice]);

    const convertedPrice = totalProductPrice * exchangeRate + totalFreight + totalInsurance;
    const amountInBirr = totalProductPrice * exchangeRate;
    const handleSendData = async () => {
        try {
            const response = await axios.post(`${BASEURL}/products/buying-price`, {
                products: products,
                productDetails: productDetails,
                totalProductPrice,
                freightValue,
                insuranceValue,
                convertedPrice,
                exchangeRate, amountInBirr,
            });

            // Navigate to another page
            navigate("/pages/CustomTax/BankRate", {
                state: {
                    products,
                    totalProductPrice,
                    freightValue,
                    insuranceValue,
                    productDetails: products.map(p => ({ name: p.name, total_price: p.total_price })),
                    convertedPrice,
                }
            });
        } catch (error) {
            console.error("Error sending data:", error);
            // Handle error (e.g., show a notification or message to the user)
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
                            label="Product Name"
                            variant="outlined"
                            fullWidth
                            value={productDetails.map(p => p.name).join(", ")}
                            InputProps={{ readOnly: true }}
                            margin="normal"
                        />
                        <TextField
                            label="Total Product Price"
                            variant="outlined"
                            fullWidth
                            value={totalProductPrice}
                            InputProps={{ readOnly: true }}
                            margin="normal"
                        />
                        <Typography variant="h6" marginTop={2}>Freight</Typography>
                        <TextField
                            label="Freight Value"
                            variant="outlined"
                            type="number"
                            fullWidth
                            value={freightValue}
                            onChange={(e) => setFreightValue(Number(e.target.value))}
                            margin="normal"
                        />
                        <TextField
                            select
                            label="Freight Option"
                            value={freightOption}
                            onChange={(e) => setFreightOption(e.target.value)}
                            variant="outlined"
                            SelectProps={{ native: true }}
                            fullWidth
                            margin="normal"
                        >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                        </TextField>
                        <Typography variant="h6" marginTop={2}>Insurance</Typography>
                        <TextField
                            label="Insurance Value"
                            variant="outlined"
                            type="number"
                            fullWidth
                            value={insuranceValue}
                            onChange={(e) => setInsuranceValue(Number(e.target.value))}
                            margin="normal"
                        />
                        <TextField
                            select
                            label="Insurance Option"
                            value={insuranceOption}
                            onChange={(e) => setInsuranceOption(e.target.value)}
                            variant="outlined"
                            SelectProps={{ native: true }}
                            fullWidth
                            margin="normal"
                        >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" textAlign="left" marginBottom={2}>
                            Black Exchange Rate
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Exchange Rate"
                                    variant="outlined"
                                    type="number"
                                    fullWidth
                                    value={exchangeRate}
                                    onChange={(e) => setExchangeRate(Number(e.target.value))}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="CIF"
                                    variant="outlined"
                                    fullWidth
                                    value={convertedPrice}
                                    InputProps={{ readOnly: true }}
                                    margin="normal"
                                />
                                <TextField
                                    label="Amount in Birr"
                                    variant="outlined"
                                    fullWidth
                                    value={amountInBirr}
                                    InputProps={{ readOnly: true }}
                                    margin="normal"
                                />
                            </Grid>
                        </Grid>
                        <MKButton
                            variant="contained"
                            color="primary"
                            onClick={handleSendData}
                            sx={{ marginTop: 2 }}
                        >
                            Submit and Go to Total Page
                        </MKButton>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export default BuyingPricePage;

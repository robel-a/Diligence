import React, { useState, useEffect } from "react";
import { Container, Grid, TextField, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from "react-router-dom";
import MKBox from "components/MKBox";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import MKButton from "components/MKButton";
import axios from 'axios';
import { BASEURL } from "../../../Api";

function BuyingPricePage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { products = [], productDetails = [] } = location.state || {};

    // Log to ensure that productDetails is correctly passed
    console.log("Received productDetails:", productDetails);

    // Ensure that productDetails is an array
    if (!Array.isArray(productDetails)) {
        console.error("productDetails is not an array:", productDetails);
    }

    // Calculate total product price
    const totalProductPrice = products.reduce((acc, product) => acc + product.total_price, 0);

    // State variables
    const [freightOption, setFreightOption] = useState("percentage");
    const [insuranceOption, setInsuranceOption] = useState("percentage");
    const [freightValue, setFreightValue] = useState(0);
    const [insuranceValue, setInsuranceValue] = useState(0);
    const [exchangeRate, setExchangeRate] = useState(1);

    const [totalFreight, setTotalFreight] = useState(0);
    const [totalInsurance, setTotalInsurance] = useState(0);

    // Calculate total freight based on the selected option
    useEffect(() => {
        if (freightOption === "percentage") {
            setTotalFreight((freightValue / 100 * totalProductPrice));
        } else {
            setTotalFreight(freightValue);
        }
    }, [freightValue, freightOption, totalProductPrice]);

    // Calculate total insurance based on the selected option
    useEffect(() => {
        if (insuranceOption === "percentage") {
            setTotalInsurance((insuranceValue / 100 * totalProductPrice));
        } else {
            setTotalInsurance(insuranceValue);
        }
    }, [insuranceValue, insuranceOption, totalProductPrice]);

    // Calculate converted price and amount in Birr
    const convertedPrice = (totalProductPrice + totalFreight + totalInsurance) * exchangeRate;
    const amountInBirr = totalProductPrice * exchangeRate;

    // Handle data submission
    const handleSendData = async () => {
        try {
            // Check and log productDetails
            if (!Array.isArray(productDetails) || productDetails.length === 0) {
                console.error("Product details are missing or not an array.");
                return; // Prevent the request from being sent if productDetails is invalid
            }

            // Prepare payload
            const payload = {
                products,
                productDetails, // Ensure this is correctly populated
                totalProductPrice,
                freightValue,
                insuranceValue,
                convertedPrice,
                exchangeRate,
                amountInBirr,
            };

            // Log payload for debugging
            console.log("Sending payload:", payload);

            // Post request
            const response = await axios.post(`${BASEURL}/products/buying-price`, payload);

            // Navigate to the next page upon success
            navigate("/pages/CustomTax/BankRate", {
                state: {
                    products,
                    totalProductPrice,
                    freightValue,
                    insuranceValue,
                    productDetails, // Pass correctly
                    convertedPrice,
                }
            });
        } catch (error) {
            console.error("Error sending data:", error.response?.data || error.message);
            // Handle error, potentially showing an error message to the user
        }
    };

    return (
        <>
            <DefaultNavbar routes={routes} sticky />
            <MKBox minHeight="30vh" width="100%" />
            <Container>
                <IconButton
                    onClick={() => navigate("/pages/AddProduct")}
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
                            label="Product Name"
                            variant="outlined"
                            fullWidth
                            value={products.map(p => p.name).join(", ")}
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

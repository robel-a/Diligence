import React, { useState, useEffect } from "react";
import { Container, Grid, TextField, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import MKBox from "components/MKBox";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import MKButton from "components/MKButton";

function BuyingPricePage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { products = [] } = location.state || {};

    const totalProductPrice = products.reduce((acc, product) => acc + product.totalPrice, 0);

    const [freightOption, setFreightOption] = useState("percentage");
    const [insuranceOption, setInsuranceOption] = useState("percentage");
    const [freightValue, setFreightValue] = useState(0);
    const [insuranceValue, setInsuranceValue] = useState(0);
    const [exchangeRate, setExchangeRate] = useState(1);

    const [totalFreight, setTotalFreight] = useState(0);
    const [totalInsurance, setTotalInsurance] = useState(0);

    useEffect(() => {
        if (freightOption === "percentage") {
            setTotalFreight((totalProductPrice * freightValue) / 100);
        } else {
            setTotalFreight(freightValue);
        }
    }, [freightValue, freightOption, totalProductPrice]);

    useEffect(() => {
        if (insuranceOption === "percentage") {
            setTotalInsurance((totalProductPrice * insuranceValue) / 100);
        } else {
            setTotalInsurance(insuranceValue);
        }
    }, [insuranceValue, insuranceOption, totalProductPrice]);

    const convertedPrice = totalProductPrice * exchangeRate + totalFreight + totalInsurance;

    const handleNavigate = () => {
        const productDetails = products.map(p => ({ name: p.name, totalPrice: p.totalPrice }));

        navigate("/pages/CustomTax/BankRate", {
            state: {
                totalProductPrice,
                freightValue,
                insuranceValue,
                productDetails,
                convertedPrice
            }
        });
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
                            Additional Information
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
                            </Grid>
                        </Grid>
                        <MKButton
                            variant="contained"
                            color="primary"
                            onClick={handleNavigate}
                            sx={{ marginTop: 2 }}
                        >
                            Go to Total Page
                        </MKButton>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export default BuyingPricePage;

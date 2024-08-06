import React, { useState, useEffect } from "react";
import { Container, Grid, TextField, Typography, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import MKBox from "components/MKBox";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";

function TotalPage() {
    const location = useLocation();
    const { products = [] } = location.state || {}; // Default to an empty array if products is undefined

    // Calculate total product price
    const totalProductPrice = products.reduce((acc, product) => acc + product.totalPrice, 0);

    const [freightOption, setFreightOption] = useState("percentage");
    const [insuranceOption, setInsuranceOption] = useState("percentage");
    const [freightValue, setFreightValue] = useState(0);
    const [insuranceValue, setInsuranceValue] = useState(0);
    const [dutyValue, setDutyValue] = useState(0);
    const [surValue, setSurValue] = useState(0);
    const [vatValue, setVatValue] = useState(0);
    const [exciseValue, setExciseValue] = useState(0);
    const [withholdingValue, setWithholdingValue] = useState(0);
    const [socialValue, setSocialValue] = useState(0);

    // Calculate totals based on options
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

    const totalDuties = totalProductPrice * dutyValue / 100;
    const totalSUR = totalProductPrice * surValue / 100;
    const totalVAT = totalProductPrice * vatValue / 100;
    const totalExcise = totalProductPrice * exciseValue / 100;
    const totalWithholding = totalProductPrice * withholdingValue / 100;
    const totalSocial = totalProductPrice * socialValue / 100;

    const totalPriceWithFreightAndInsurance =
        totalProductPrice + totalFreight + totalInsurance + totalDuties + totalSUR + totalVAT + totalExcise + totalWithholding + totalSocial;

    return (
        <>
            <DefaultNavbar
                routes={routes}
                sticky
            />
            <MKBox
                minHeight="30vh"
                width="100%"
            >
            </MKBox>
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
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant="h4" textAlign="left" marginBottom={2}>
                                Additional Information
                            </Typography>
                            <TextField
                                label="Duty (%)"
                                variant="outlined"
                                type="number"
                                sx={{ width: '100%' }}
                                value={dutyValue}
                                onChange={(e) => setDutyValue(Number(e.target.value))}
                                margin="normal"
                            />
                            <TextField
                                label="SUR (%)"
                                variant="outlined"
                                type="number"
                                sx={{ width: '100%' }}
                                value={surValue}
                                onChange={(e) => setSurValue(Number(e.target.value))}
                                margin="normal"
                            />
                            <TextField
                                label="VAT (%)"
                                variant="outlined"
                                type="number"
                                sx={{ width: '100%' }}
                                value={vatValue}
                                onChange={(e) => setVatValue(Number(e.target.value))}
                                margin="normal"
                            />
                            <TextField
                                label="Excise (%)"
                                variant="outlined"
                                type="number"
                                sx={{ width: '100%' }}
                                value={exciseValue}
                                onChange={(e) => setExciseValue(Number(e.target.value))}
                                margin="normal"
                            />
                            <TextField
                                label="Withholding (%)"
                                variant="outlined"
                                type="number"
                                sx={{ width: '100%' }}
                                value={withholdingValue}
                                onChange={(e) => setWithholdingValue(Number(e.target.value))}
                                margin="normal"
                            />
                            <TextField
                                label="Social (%)"
                                variant="outlined"
                                type="number"
                                sx={{ width: '100%' }}
                                value={socialValue}
                                onChange={(e) => setSocialValue(Number(e.target.value))}
                                margin="normal"
                            />
                            <TextField
                                label="Total Price with Freight and Insurance"
                                variant="outlined"
                                sx={{ width: '100%' }}
                                value={totalPriceWithFreightAndInsurance}
                                InputProps={{ readOnly: true }}
                                margin="normal"
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export default TotalPage;

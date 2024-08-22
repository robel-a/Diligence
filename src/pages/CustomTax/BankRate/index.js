import React from "react";
import { Container, Grid, TextField, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import MKBox from "components/MKBox";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import MKButton from "components/MKButton";
import axios from 'axios';
import { BASEURL } from "../../../Api";

function TotalPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        totalProductPrice = 0,
        freightValue = 0,
        insuranceValue = 0,
        convertedPrice = 0,
        productDetails = [],
        products = []
    } = location.state || {};

    const [exchangeRate, setExchangeRate] = React.useState(1);
    const [dutyValue, setDutyValue] = React.useState(0);
    const [surValue, setSurValue] = React.useState(0);
    const [vatValue, setVatValue] = React.useState(0);
    const [exciseValue, setExciseValue] = React.useState(0);
    const [withholdingValue, setWithholdingValue] = React.useState(0);
    const [socialValue, setSocialValue] = React.useState(0);

    const [totalFreight, setTotalFreight] = React.useState(0);
    const [totalInsurance, setTotalInsurance] = React.useState(0);

    React.useEffect(() => {
        setTotalFreight(freightValue);
        setTotalInsurance(insuranceValue);
    }, [freightValue, insuranceValue, totalProductPrice]);

    const cif = (Number(totalProductPrice) + totalFreight + totalInsurance) * Number(exchangeRate);

    const totalDuties = (cif * Number(dutyValue)) / 100;
    const totalExcise = ((cif + totalDuties) * Number(exciseValue)) / 100;
    const totalVAT = ((cif + totalDuties + totalExcise) * Number(vatValue)) / 100;
    const totalSUR = ((cif + totalDuties + totalExcise + totalVAT) * Number(surValue)) / 100;
    const totalWithholding = (cif * Number(withholdingValue)) / 100;
    const totalSocial = (cif * Number(socialValue)) / 100;
    const totalTax = totalDuties + totalExcise + totalVAT + totalSUR + totalWithholding + totalSocial;
    // const cif = (Number(totalProductPrice) + totalFreight + totalInsurance) * Number(exchangeRate);

    const handleSendData = async () => {
        try {
            const response = await axios.post(`${BASEURL}/custom-taxes`, {
                totalProductPrice,
                freightValue,
                insuranceValue,
                exchangeRate,
                dutyValue,
                surValue,
                vatValue,
                exciseValue,
                withholdingValue,
                socialValue,
                totalFreight,
                totalInsurance,
                totalDuties,
                totalExcise,
                totalVAT,
                totalSUR,
                totalWithholding,
                totalSocial,
                totalTax,
                cif,
                products,
                productDetails: productDetails
            });

            console.log('Data successfully sent:', response.data);

            navigate("/pages/CustomTax", {
                state: {
                    totalTax,
                    convertedPrice,
                    productDetails,
                    totalProductPrice, // Ensure this is passed correctly
                    cif
                }
            });
        } catch (error) {
            console.error("Error sending data:", error.response ? error.response.data : error.message);
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
                            value={products.map(p => p.name).join(", ")}
                            InputProps={{ readOnly: true }}
                            margin="normal"
                        />
                        <TextField
                            label="Total Product Price"
                            variant="outlined"
                            fullWidth
                            value={totalProductPrice.toFixed(2)} // Ensure totalProductPrice is formatted correctly
                            InputProps={{ readOnly: true }}
                            margin="normal"
                        />
                        <TextField
                            label="Customs"
                            variant="outlined"
                            fullWidth
                            value={convertedPrice.toFixed(2)} // Ensure totalProductPrice is formatted correctly
                            InputProps={{ readOnly: true }}
                            margin="normal"
                        />
                        <Typography variant="h6" marginTop={2}>Freight</Typography>
                        <TextField
                            label="Freight Value"
                            variant="outlined"
                            type="number"
                            fullWidth
                            value={totalFreight.toFixed(2)}
                            InputProps={{ readOnly: true }}
                            margin="normal"
                        />
                        <Typography variant="h6" marginTop={2}>Insurance</Typography>
                        <TextField
                            label="Insurance Value"
                            variant="outlined"
                            type="number"
                            fullWidth
                            value={totalInsurance.toFixed(2)}
                            InputProps={{ readOnly: true }}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" textAlign="left" marginBottom={2}>
                            TAX Rate
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
                                    value={cif.toFixed(2)}
                                    InputProps={{ readOnly: true }}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Duty (%)"
                                    variant="outlined"
                                    type="number"
                                    fullWidth
                                    value={dutyValue}
                                    onChange={(e) => setDutyValue(Number(e.target.value))}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="SUR (%)"
                                    variant="outlined"
                                    type="number"
                                    fullWidth
                                    value={surValue}
                                    onChange={(e) => setSurValue(Number(e.target.value))}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="VAT (%)"
                                    variant="outlined"
                                    type="number"
                                    fullWidth
                                    value={vatValue}
                                    onChange={(e) => setVatValue(Number(e.target.value))}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Excise (%)"
                                    variant="outlined"
                                    type="number"
                                    fullWidth
                                    value={exciseValue}
                                    onChange={(e) => setExciseValue(Number(e.target.value))}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Withholding (%)"
                                    variant="outlined"
                                    type="number"
                                    fullWidth
                                    value={withholdingValue}
                                    onChange={(e) => setWithholdingValue(Number(e.target.value))}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Social (%)"
                                    variant="outlined"
                                    type="number"
                                    fullWidth
                                    value={socialValue}
                                    onChange={(e) => setSocialValue(Number(e.target.value))}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Total Tax"
                                    variant="outlined"
                                    fullWidth
                                    value={totalTax.toFixed(2)}
                                    InputProps={{
                                        readOnly: true,
                                        sx: {
                                            borderColor: 'primary.main',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main',
                                            }
                                        }
                                    }}
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
                            Calculate
                        </MKButton>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export default TotalPage;

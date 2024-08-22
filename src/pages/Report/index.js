import React, { useState, useEffect } from "react";
import {
    Grid,
    Card,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Alert,
    TablePagination,
} from "@mui/material";
import MKBox from "components/MKBox";
import MKTypography from "../../components/MKTypography";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import axios from "axios";
import { BASEURL } from "Api";
import routes from "routes";

function ReportTable() {
    const [formList, setFormList] = useState([]);
    const [selectedType, setSelectedType] = useState("buying");
    const [error, setError] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get(`${BASEURL}/reports`, {
                    params: { type: selectedType },
                });
                if (response.data) {
                    setFormList(response.data);
                    setError("");
                }
            } catch (error) {
                setError("Error fetching reports: " + error.message);
            }
        };

        fetchReports();
    }, [selectedType]);

    const getColumns = () => {
        if (selectedType === "buying") {
            return [
                { header: "No", key: "no" },
                { header: "Items", key: "name" },
                { header: "Unit Price", key: "price" },
                { header: "Quantity", key: "quantity" },
                { header: "Total Product Price", key: "total_product_price" },
                { header: "Rate", key: "exchange_rate" },
                { header: "Amount/Birr", key: "amount_in_birr" },
                { header: "Freight", key: "freight_value" },
                { header: "Insurance", key: "insurance_value" },
                { header: "CIF", key: "converted_price" },
            ];
        } else if (selectedType === "customTax") {
            return [
                { header: "No", key: "no" },
                { header: "Items", key: "name" },
                { header: "Unit Price", key: "price" },
                { header: "Quantity", key: "quantity" },
                { header: "Total Product Price", key: "total_product_price" },
                { header: "Freight", key: "total_freight" },
                { header: "Insurance", key: "total_insurance" },
                { header: "CIF", key: "cif" },
                { header: "Exchange Rate", key: "exchange_rate" },
                { header: "Duty Tax", key: "duty_value" },
                { header: "Excise Tax", key: "excise_value" },
                { header: "VAT", key: "vat_value" },
                { header: "Sur Tax", key: "sur_value" },
                { header: "Withholding tax", key: "withholding_value" },
                { header: "Social Welfare", key: "social_value" },
                { header: "Total Duties", key: "total_duties" },
                { header: "Total Excise", key: "total_excise" },
                { header: "Total VAT", key: "total_vat" },
                { header: "Total Sur", key: "total_sur" },
                { header: "Total Withholding", key: "total_withholding" },
                { header: "Total Social Welfare", key: "total_social" },
                { header: "TOTAL TAX", key: "total_tax" },
            ];
        }
        return [];
    };

    const formatData = (item, key) => {
        return item[key] !== undefined && item[key] !== null ? item[key] : "-";
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset page to 0 when rows per page changes
    };

    // Calculate current page data
    const currentPageData = formList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <>
            <DefaultNavbar routes={routes} sticky />
            <MKBox minHeight="20vh" width="100%" />
            <MKBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <MKBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="primary"
                                borderRadius="lg"
                                coloredShadow="dark"
                                textAlign="center"
                            >
                                <MKTypography variant="h6" color="white">
                                    Report Table
                                </MKTypography>
                            </MKBox>

                            <MKBox pt={3} pb={3} px={2}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="type-select-label">Select Report Type</InputLabel>
                                    <Select
                                        labelId="type-select-label"
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        label="Select Report Type"
                                    >
                                        <MenuItem value="buying">Buying Report</MenuItem>
                                        <MenuItem value="customTax">Custom Tax Report</MenuItem>
                                    </Select>
                                </FormControl>

                                {error && (
                                    <Alert severity="error" style={{ marginBottom: "16px" }}>
                                        {error}
                                    </Alert>
                                )}

                                <TableContainer>
                                    <Table>
                                        <TableRow>
                                            {getColumns().map((col, index) => (
                                                <TableCell key={index}>
                                                    <MKTypography variant="caption" fontWeight="bold">
                                                        {col.header}
                                                    </MKTypography>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                        <TableBody>
                                            {currentPageData.length > 0 ? (
                                                currentPageData.map((item, index) => (
                                                    <TableRow key={index}>
                                                        {getColumns().map((col, colIndex) => (
                                                            <TableCell key={colIndex}>
                                                                <MKTypography variant="body2">
                                                                    {col.key === 'name' || col.key === 'price' || col.key === 'quantity'
                                                                        ? item.product_details && item.product_details.length > 0
                                                                            ? item.product_details
                                                                                .map((detail) => detail[col.key] || 'N/A')
                                                                                .join(", ") // Concatenate product details in the same cell
                                                                            : '-'
                                                                        : formatData(item, col.key)}
                                                                </MKTypography>
                                                            </TableCell>

                                                        ))}
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={getColumns().length} align="center">
                                                        <MKTypography>No data available</MKTypography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>


                                    </Table>
                                </TableContainer>

                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 50]}
                                    component="div"
                                    count={formList.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </MKBox>
                        </Card>
                    </Grid>
                </Grid>
            </MKBox>
        </>
    );
}

export default ReportTable;

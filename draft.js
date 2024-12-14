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
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Button
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MKBox from "components/MKBox";
import MKTypography from "../../components/MKTypography";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import axios from "axios";
import { BASEURL } from "Api";
import routes from "routes";
import { useNavigate } from "react-router-dom";

function ReportTable() {
    const [formList, setFormList] = useState([]);
    const [selectedType, setSelectedType] = useState("buying");
    const [error, setError] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [products, setProducts] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get(`${BASEURL}/reports`, {
                    params: { type: selectedType },
                });
                console.log('Fetched data:', response.data); // Debugging log
                if (Array.isArray(response.data)) {
                    setFormList(response.data);
                    setProducts(response.data);  // Assuming response data is directly used as products
                    setError("");
                } else {
                    console.error("Unexpected data format:", response.data);
                    setError("Unexpected data format.");
                }
            } catch (error) {
                console.error("Error fetching reports:", error);
                setError("Error fetching reports: " + error.message);
            }
        };

        fetchReports();
    }, [selectedType]);

    const getColumns = () => {
        return [
            { header: 'Name', key: 'name' },
            { header: 'Price', key: 'price' },
            { header: 'Quantity', key: 'quantity' },
            { header: 'Actions', key: 'actions' },
        ];
    };

    const formatData = (item, key) => {
        return item[key] !== undefined && item[key] !== null ? item[key] : "-";
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEdit = (item) => {
        // Your edit handling logic...
    };

    const handleDeleteProduct = (index) => {
        setDeleteIndex(index);
        setConfirmOpen(true);
    };

    const confirmDeleteProduct = async () => {
        if (deleteIndex !== null && products[deleteIndex]) {
            const productToDelete = products[deleteIndex];

            try {
                await axios.delete(`${BASEURL}/reports/${productToDelete.id}?type=${selectedType}`);

                const newProducts = products.filter((_, i) => i !== deleteIndex);
                setProducts(newProducts);
                setFormList(newProducts);
                setConfirmOpen(false);
                setDeleteIndex(null);
                setSuccessMessage("Product deleted successfully!");
            } catch (error) {
                console.error("Error deleting product:", error);
                setError("Failed to delete product. Please try again.");
            }
        } else {
            setError("Invalid delete index or products array.");
        }
    };

    const cancelDeleteProduct = () => {
        setConfirmOpen(false);
        setDeleteIndex(null);
    };

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
                                            {Array.isArray(currentPageData) && currentPageData.length > 0 ? (
                                                currentPageData.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                                        {getColumns().slice(1, -1).map((col, colIndex) => (
                                                            <TableCell key={colIndex}>
                                                                <MKTypography variant="body2">
                                                                    {col.key === 'name' || col.key === 'price' || col.key === 'quantity'
                                                                        ? item.product_details && item.product_details.length > 0
                                                                            ? item.product_details
                                                                                .map((detail) => detail[col.key] || 'N/A')
                                                                                .join(", ")
                                                                            : '-'
                                                                        : formatData(item, col.key)}
                                                                </MKTypography>
                                                            </TableCell>
                                                        ))}
                                                        <TableCell>
                                                            <IconButton
                                                                color="primary"
                                                                onClick={() => handleEdit(item)}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                color="primary"
                                                                onClick={() => handleDeleteProduct(index)}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </TableCell>
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

            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this product?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDeleteProduct}>Cancel</Button>
                    <Button onClick={confirmDeleteProduct} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ReportTable;

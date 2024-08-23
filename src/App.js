import { useEffect } from "react";

// React Router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// MUI components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Theme and layouts
import theme from "assets/theme";
import Presentation from "layouts/pages/presentation";
import AddProduct from "pages/AddProduct";
// App routes
import navroutes from "navigationRoute";
import routes from "routes";

export default function App() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Function to render routes
  const getRoutes = (allRoutes) =>
    allRoutes.flatMap((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      return route.route ? (
        <Route exact path={route.route} element={route.component} key={route.key} />
      ) : [];
    });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {getRoutes(navroutes)}
        {getRoutes(routes)}
        <Route path="/presentation" element={<Presentation />} />
        <Route path="*" element={<Navigate to="/presentation" />} />
        <Route path="/pages/AddProduct" element={<AddProduct />} />
      </Routes>
    </ThemeProvider>
  );
}

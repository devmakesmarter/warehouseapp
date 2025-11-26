import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import WarehousePage from "./pages/WarehousePage.tsx";
import WarehouseProductsPage from "./pages/WarehouseProductsPage.tsx";
import ProductDetailPage from "./pages/ProductDetailPage.tsx";

import './App.css';

function App() {
    return (
        <Layout>
            <Routes>
                {/* Liste aller Lagerhäuser */}
                <Route path="/" element={<WarehousePage />} />

                {/* Produkte eines bestimmten Lagerhauses */}
                <Route path="/warehouse/:warehouseId/products" element={<WarehouseProductsPage />} />

                {/* Produktdetails */}
                <Route path="/productdetails/:id" element={<ProductDetailPage />} />
            </Routes>
        </Layout>
    );
}

export default App;

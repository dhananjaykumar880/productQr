import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import NotFound from "./NotFound";
import AddProduct from "./product/AddProduct";
import Products from "./product/Products";
import ViewProduct from "./product/ViewProduct";

const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Layout />}>
        <Route path="/">
            <Route path="view/:productId" element={<ViewProduct />} />
            <Route path="add" element={<AddProduct />} />
            <Route path="edit/:productId" element={<AddProduct />} />
            <Route index element={<Products />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    )
);

export default function Routes() {
    return <RouterProvider router={router} />
}
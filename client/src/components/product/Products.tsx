import React, { useState } from 'react'
import QRCode from 'react-qr-code'
import { Link } from 'react-router-dom'
import { BE_BASE_URL, FE_BASE_URL } from '../../constant'
import { useDeleteProductMutation, useGetProductsQuery } from '../../redux/product/productApi'

export default function Products() {
    const [showQrForId, setShowQrForId] = useState<number>()
    const {isLoading, isError, isFetching, isSuccess, data: listRes, error} = useGetProductsQuery()
    const [deleteProduct, { data: delRes }] = useDeleteProductMutation()

    if(isLoading) {
        return <>Loading...</>
    } else if(isError) {
        return <>{(error as any).error}</>
    } else if(isSuccess) {
        return <>
            {delRes?.message ?? delRes?.error}
            <table>
                <thead>
                    <tr>
                        <th>Product Id</th>
                        <th></th>
                        <th>Product</th>
                        <th>quality</th>
                        <th>Materials</th>
                        <th>Action <Link to="/add" title="Add product">+</Link></th>
                    </tr>
                </thead>
                <tbody>
                    {listRes.products.map((product, key) => <React.Fragment key={key}>
                        <tr>
                            <td>{product.id}</td>
                            <td>
                                {product.image ? <img src={`${BE_BASE_URL}${product.image}`} 
                                    // onError={({ currentTarget }) => {
                                    //     currentTarget.onerror = null;
                                    //     currentTarget.src = "";
                                    // }} 
                                    alt={product.product} 
                                    width={100}
                                /> : null}
                            </td>
                            <td>{product.product}</td>
                            <td>{product.quality}</td>
                            <td>{product.materials}</td>
                            <td>
                                <Link to={`edit/${product.id}`}>Edit</Link>
                                <Link to="" onClick={() => {
                                    if(window.confirm("Are you sure, you want to delete?")) {
                                        deleteProduct(product.id)
                                    }
                                }}>
                                    Delete
                                </Link>
                                <Link to="" onClick={() => setShowQrForId(!showQrForId ? product.id : undefined)}>QR</Link>
                            </td>
                        </tr>
                        {showQrForId && showQrForId === product.id ? <tr>
                            <td colSpan={6}>
                                <QRCode
                                    size={250}
                                    style={{ height: "auto", maxWidth: "100%", width: "150px" }}
                                    value={`${FE_BASE_URL}view/${product.id}`}
                                    viewBox={`0 0 256 256`}
                                />
                            </td>
                        </tr> : null}
                    </React.Fragment>)}
                    {listRes.products.length < 1 && <tr>
                        <td colSpan={6}>Add a product first!</td>
                    </tr>}
                    {isFetching && <tr>
                        <td colSpan={6}>Updating...</td>
                    </tr>}
                </tbody>
            </table>
        </>
    }
    return <></>
}
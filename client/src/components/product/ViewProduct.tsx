import React from 'react'
import { useParams } from 'react-router-dom'
import { BE_BASE_URL } from '../../constant'
import { Product } from '../../interfaces/product'
import { useGetProductByIdQuery } from '../../redux/product/productApi'

export default function ViewProduct() {
    const params = useParams()
    const productId = Number(params.productId)
    const { data, isSuccess } = useGetProductByIdQuery(productId, { skip: !Boolean(productId)})
    return <>
        <h3>Product details</h3>
        <table>
            <tbody>
                {isSuccess && Object.keys(data).filter(key => !['createdAt', 'updatedAt'].includes(key)).map((key, index) => <tr key={index}>
                    <th>{key.toUpperCase()}</th>
                    <td>
                        {key === 'image' 
                            ? data[key as keyof Product] 
                                ? <img src={`${BE_BASE_URL}${data[key as keyof Product]}`} 
                                        alt={data.product} 
                                        width={100}
                                    /> 
                                : null 
                            : data[key as keyof Product]}
                    </td>
                </tr>)}
            </tbody>
        </table>
    </>
}
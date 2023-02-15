import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL } from '../../constant'
import { Product, ProductDeleteApi, ProductListApi } from '../../interfaces/product'

export const productApi = createApi({
    reducerPath: 'product',
    baseQuery: fetchBaseQuery({ baseUrl: `${API_BASE_URL}/product` }),
    tagTypes: ['Product'],
    endpoints: (builder) => ({
      getProducts: builder.query<ProductListApi, void>({
        query: () => `/list`,
        providesTags: (result) => [...(result?.products ?? []).map(({ id }) => ({ type: 'Product' as const, id })), { type: 'Product', id: 'list' }]
      }),
      getProductById: builder.query<Product, number>({
        query: (productId) => `/byProductId/${productId}`,
        providesTags: (result, error, id) => [{ type: 'Product', id }]
      }),
      createProduct: builder.mutation<Product, FormData>({
        query: (body) => ({
            url: `/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: [{ type: 'Product', id: 'list' }],
      }),
      updateProduct: builder.mutation<Product, { productId: number, body: FormData }>({
        query: ({ productId, body }) => ({
            url: `/update/${productId}`,
            method: 'POST',
            body,
        }),
        invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
      }),
      deleteProduct: builder.mutation<ProductDeleteApi, number>({
        query: (productId) => ({
            url: `/delete/${productId}`,
            method: 'PUT',
        }),
        invalidatesTags: (result, error, id) => [{ type: 'Product', id }],
      }),
    }),
})

export const { useGetProductsQuery, useGetProductByIdQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } = productApi
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import { Form, useNavigate, useParams } from 'react-router-dom'
import { useCreateProductMutation, useGetProductByIdQuery, useUpdateProductMutation } from '../../redux/product/productApi'

export default function AddProduct() {
    const params = useParams()
    const productId = Number(params.productId)
    const navigate = useNavigate()
    const { data } = useGetProductByIdQuery(productId, { skip: !Boolean(productId)})
    const [createProduct] = useCreateProductMutation()
    const [updateProduct] = useUpdateProductMutation()
    const [formValues, setFormValues] = useState({
        product: '',
        quality: '',
        design: '',
        color: '',
        scale: '',
        image: '',
        materials: '',
    })
    useEffect(() => {
        if(data) {
            setFormValues({
                product: data.product,
                quality: data.quality ?? '',
                design: data.design ?? '',
                color: data.color ?? '',
                scale: data.scale ?? '',
                image: data.image ?? '',
                materials: data.materials ?? '',
            })
        }
    }, [data])

    const handleChangeEvent = useCallback((event: ChangeEvent<HTMLInputElement>) => setFormValues({ ...formValues, [event.target.id]: event.target.files ? event.target.files?.[0] : event.target.value }), [formValues])
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        if(formValues.product) {
            const formObject = new FormData()
            Object.entries(formValues).forEach(([key, value]) => formObject.append(key, value))
            if(productId) {
                formObject.append('productId', String(productId))
                await updateProduct({productId, body: formObject})
            } else {
                await createProduct(formObject)
            }
            navigate('/', { replace: true })
        }
    }

    return <>
        <Form noValidate onSubmit={handleSubmit}>
            <div>
                <label htmlFor='product'>Product</label>
                <input id='product' type="text" value={formValues.product} onChange={handleChangeEvent} />
            </div>
            <div>
                <label htmlFor='quality'>Quality</label>
                <input id='quality' type="text" value={formValues.quality} onChange={handleChangeEvent} />
            </div>
            <div>
                <label htmlFor='design'>Design</label>
                <input id='design' type="text" value={formValues.design} onChange={handleChangeEvent} />
            </div>
            <div>
                <label htmlFor='color'>Color</label>
                <input id='color' type="text" value={formValues.color} onChange={handleChangeEvent} />
            </div>
            <div>
                <label htmlFor='scale'>Scale</label>
                <input id='scale' type="text" value={formValues.scale} onChange={handleChangeEvent} />
            </div>
            <div>
                <label htmlFor='materials'>Materials</label>
                <input id='materials' type="text" value={formValues.materials} onChange={handleChangeEvent} />
            </div>
            <div>
                <label htmlFor='image'>Image</label>
                <input id='image' type="file" onChange={handleChangeEvent} />
            </div>
            <button type='button' onClick={() => navigate('/')}>Cancel</button>
            <button type='submit'>Save</button>
        </Form>
    </>
}
import React, { useEffect, useState } from 'react'
import { Button, Layout, LegacyCard, Page } from '@shopify/polaris'
import { useNavigate } from 'react-router-dom'

export default function Products() {

    const [products, setProducts] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [updateId, setUpdateId] = useState("")
    const [isUpdating, setIsUpdating] = useState(false)
    const navigate = useNavigate()

    async function getProducts() {
        const request = await fetch('/api/choco/product')
        const response = await request.json()
        setProducts(response.products.data);
        console.log(response.products.data)
    }

    useEffect(() => {
        getProducts()
    }, [])

    async function productModifications(e) {
        e.preventDefault()
        let API = ''
        let METHOD = ''
        if (updateId) {
            API = `/api/choco/product/${updateId}`
            METHOD = 'PUT'
        }
        else {
            API = '/api/choco/product'
            METHOD = 'POST'
        }
        await fetch(API, {
            method: METHOD,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title })
        })
        navigate('/products')
        await getProducts()
        setTitle("")
        setIsModalOpen(false)
        setUpdateId("")
    }

    async function deleteProduct(id) {
        await fetch(`/api/choco/product/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })
        await getProducts()
    }

    async function productHandler(productId = '') {
        if (productId) {
            const searchProduct = products.find((product) => (product.id === productId))
            setTitle(searchProduct.title)
            setUpdateId(searchProduct.id)
            setIsUpdating(true)
            setIsModalOpen(true)
        }
        else {
            setIsUpdating(false)
            setIsModalOpen(true)
        }
    }


    return (
        <Page fullWidth>
            {!isModalOpen &&
                <Layout>
                    <Layout.Section>
                        <LegacyCard title='Fetched products' sectioned>
                            <div className='flex flex-col gap-5'>
                                <div>
                                    <Button onClick={() => productHandler()}>New Product</Button>
                                </div>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
                                    {
                                        products.map((product) => (
                                            <div className=''>
                                                <div key={product.id} onClick={() => productHandler(product?.id)} className='bg-black text-white rounded p-4'>
                                                    <img src={product?.image?.src} alt={product?.image?.src} width='200px' />
                                                    <h1>{product.title}</h1>
                                                    <h1>{product?.variants[0]?.price}</h1>
                                                </div>
                                                <div>
                                                    <Button onClick={() => deleteProduct(product.id)}>Delete</Button>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </LegacyCard>
                    </Layout.Section>
                </Layout>}
            {isModalOpen &&
                (
                    <form action="submit" onSubmit={productModifications}>
                        <div className='flex flex-col justify-center gap-3 py-5 text-center rounded-r bg-white shadow-sm border-gray-200 w-full items-center font-extrabold text-2xl'>
                            <div className='flex flex-col gap-3'>
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className='bg-red-500 text-white pl-2 rounded'
                                />
                            </div>
                            <div className='flex flex-wrap bg-yellow-200 p-3 rounded hover:bg-red-400'>
                                <button type="submit">{isUpdating ? "Update" : "Create"}</button>
                            </div>
                        </div>
                    </form>
                )
            }
        </Page>
    )

}

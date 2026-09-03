import React, { useEffect, useState } from 'react'
import { Layout, Page, LegacyCard } from '@shopify/polaris'

export default function Users() {
    const [users, setUsers] = useState([])
    const [errorRes, setErrorRes] = useState("")

    useEffect(() => {
        async function getUser() {
            try {
                const request = await fetch('/api/user/get')
                if (!request.ok) {
                    throw new Error("Failed to fetch users");
                }
                const response = await request.json()
                setUsers(response.users)
                console.log(response.users)
            } catch (error) {
                console.error("Error:", error)
                setErrorRes("Could not load users");
            }
        }
        getUser()
    }, [])


    return (
        <div>
            <Page>
                <Layout>
                    <Layout.Section>
                        <LegacyCard title="Existing Users!" sectioned>
                            {errorRes && <p>{errorRes}</p>}
                            <div className='flex gap-5 font-extrabold bg-black p-4 flex-col text-white rounded border-r '>
                                {users && users.map((user) => (
                                    <ul>
                                        <li key={user._id}>
                                            <div className='flex gap-4'>
                                                <h1>Username:</h1>
                                                <h1>{user.userName}</h1>
                                            </div>
                                            <div className='flex gap-11'>
                                                <h1>Email:</h1>
                                                <h1>{user.userEmail}</h1>
                                            </div>
                                        </li>
                                    </ul>
                                ))
                                }
                            </div>
                        </LegacyCard>
                    </Layout.Section>
                </Layout>
            </Page>
        </div>
    )
}

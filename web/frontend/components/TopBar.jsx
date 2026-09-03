import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function TopBar() {

    const [storeName, setStoreName] = useState('');

    async function fetchStoreName() {
        try {
            const request = await fetch('/api/store/info', {
                method: 'GET',
                headers: { "content-type": "application/json" }
            })
            const response = await request.json()
            setStoreName(response.data[0].name);
            // console.log(storeName);
            // console.log(response);
        }
        catch (error) {
            console.error('Error fetching store info:', error);
        }
    }

    useEffect(() => {
        fetchStoreName();
    }, [])

    return (
        <div className="topbar-section flex items-center justify-between h-16 w-full gap-4 font-serif text-xl bg-white border-b border-gray-200 px-3 shadow-sm">
            <div className="h-16 w-full gap-4 font-serif bg-white border-b border-gray-200 flex items-center px-3 shadow-sm">
                <img
                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHIN5CsPi6KILPU87il4h987brG1y4bQ0wTBQPgerSLyx_a9RVQmcq_PQ3-hp6ZB7HUpOt94L03L4HepAiiftJaZXfN2gT7DeNbCSci0cPKQ&s=10' alt="Hero"
                    className="h-10 w-auto"
                />
                <div>
                    {storeName}
                </div>

            </div>
            <div className='flex gap-5'>
                <NavLink className='hover:text-green-400' to="/">Sales</NavLink>
                <NavLink className='hover:text-green-400' to="/products">Products</NavLink>
            </div>
        </div>
    )
}

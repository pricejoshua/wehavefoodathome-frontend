import React from 'react'
import { Link } from 'react-router-dom'



// get house data from supabase (members, food)
function getHouseData(houseId: string) {
    return {
        name: 'House Name',
        members: ['John Doe', 'Jane Doe'],
        food: ['Apples', 'Oranges', 'Bananas']
    }
}

interface HousePageProps {
    id: string,
}

function HousePage({ id }: HousePageProps) {
    return (
        <div>
            <h1>House Page</h1>
            <h2>{id}</h2>
            <Link to="/main">Back to Main</Link>
        </div>
    )
}
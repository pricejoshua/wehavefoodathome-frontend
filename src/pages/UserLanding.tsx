import React from 'react'
import { Link } from 'react-router-dom'
import HouseCard from '../components/HouseCard'

const dummyData = {
    name: 'John Doe',
    // TODO: add house type
    houses: ["House 1", "House 2", "House 3"]
}

function UserLanding() {

    console.log("here")


    return (
        <div className="text-lg text-reseda_green">
            <h1>Welcome, {dummyData.name}</h1>
            <h2>Your Houses:</h2>
            <ul>
                {dummyData.houses.map(house => (
                    <li key={house}>
                        <HouseCard {...{ name: house, image: undefined }} />
                    </li>
                ))}
            </ul>
        </div>
    )

}

export default UserLanding
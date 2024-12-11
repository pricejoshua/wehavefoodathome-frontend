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
            <div className="flex flex-wrap">
                {dummyData.houses.map(house => (
                    <HouseCard {...{ name: house, image: undefined }} />
                ))}
                <HouseCard name="Add House" image={undefined} />
            </div>
        </div>
    )

}

export default UserLanding
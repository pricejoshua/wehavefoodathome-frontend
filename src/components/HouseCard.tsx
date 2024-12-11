import React from 'react'
import { Link } from 'react-router-dom'


interface HouseCardProps {
  name: string;
  image: string | undefined;
}

function HouseCard({ name, image }: HouseCardProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
        <Link to={`/house/${name}`} className="block text-center w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
          View House
        </Link>
      </div>
    </div>
  )
}

export default HouseCard
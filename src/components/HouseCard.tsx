import React from 'react'
import { Link } from 'react-router-dom'


interface HouseCardProps {
  name: string;
  image: string | undefined;
}

function HouseCard({ name, image }: HouseCardProps) {
  return (
    <div className="flex flex-col justify-center items-center bg-dun-600 shadow-lg rounded-lg overflow-hidden my-4 mx-2 min-w-72 min-h-36 transition-all hover:scale-110 hover:shadow-xl">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800 font-gummy">{name}</h1>
        <Link to={`/house/${name}`} className="block text-center w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
          View House
        </Link>
      </div>
    </div>
  )
}

export default HouseCard
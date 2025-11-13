import React from 'react'
import { Link } from 'react-router-dom'


function EmptyHouseCard() {
  return (
    <Link to={`/house/add`}   className="flex flex-col justify-center items-center bg-cornsilk-600 shadow-lg rounded-lg overflow-hidden my-4 mx-2 min-w-72 min-h-36 transition-all hover:scale-110 hover:shadow-xl">
      <div className="p-4">
        <h1 className="text-[3rem] font-bold text-gray-800 font-gummy">+</h1>
        <div className="block text-center w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
          Add House
        </div>
      </div>
    </Link>
  )
}

export default EmptyHouseCard
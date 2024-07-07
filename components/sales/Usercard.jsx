import React from 'react'

const Usercard = ({ user }) => {
  return (
    <div>
        <div className="flex items-center justify-between">
            <div className="flex items-center">
            <img src={user.image} alt="user" className="w-10 h-10 rounded-full" />
            <div className="ml-4">
                <h2 className="text-lg font-semibold">{user.name}</h2>
                <p className="text-sm font-light text-gray-400">{user.email}</p>
            </div>
            </div>
        </div>
    </div>
  )
}

export default Usercard
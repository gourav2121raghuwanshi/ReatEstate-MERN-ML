import React from 'react'
import { useSelector } from 'react-redux'
const Profile = () => {
  const {currentUser} = useSelector((state)=>state.user)
  return (
    <div className='p-3 max-w-xl mx-auto ' >
    <h1 className='sm:text-4xl text-2xl text-gray-700 font-bold text-center my-7 '>Profile</h1>
 <form className='flex flex-col   gap-6'>
  <img src = {currentUser.avatar} alt="profile image" className='rounded-full h-20 w-20  sm:h-40 sm:w-40 object-cover cursor-pointer mt-4 self-center'/> 
  <input type='text' placeholder='username' className='border ring-opacity-50 shadow-lg border-grey-200 sm:text-2xl p-1 sm:p-5 rounded-lg ' id='username' />
  <input type='text' placeholder='email' className='border border-grey-200 ring-opacity-50 shadow-lg sm:text-2xl p-1 sm:p-5 rounded-lg ' id='email' />
  <input type='password' placeholder='password' className='border border-grey-200  ring-opacity-50 shadow-lg sm:text-2xl p-1 sm:p-5 rounded-lg ' id='password' />
  <button className='bg-slate-700 text-white  sm:text-2xl text-xl font-semibold rounded-lg p-1 sm:p-5 uppercase hover:opacity-95 disabled:opacity-80'>
    update
  </button>
 </form>
<div className='flex justify-between mt-4'>
  <span className='text-red-500 text-2xl  font-semibold   cursor-pointer'>Delete Account</span>
  <span className='text-red-500 text-2xl font-semibold   cursor-pointer'>Sign Out</span>
</div>

 
    
    </div>
  )
}

export default Profile
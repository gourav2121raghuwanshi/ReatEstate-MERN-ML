import React from 'react'
import { Link } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import {  useSelector } from 'react-redux';

const Header = () => {
  const { currentUser } = useSelector(state => state.user);

  return (
    <header className='bg-slate-200 shadow-md '>
      <div className='flex justify-between items-center max-w-7xl  mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold hover:cursor-pointer text-sm sm:text-xl flex flex-wrap '>
            <span className='text-slate-500 font-bold md:text-2xl lg:text-4xl'>FindYour</span>
            <span className='text-slate-700 font-bold md:text-2xl lg:text-4xl'>Home</span>
          </h1>
        </Link>
        <form className='bg-slate-100  flex items-center justify-between p-3 rounded-lg '>
          <input
            type="text"
            placeholder='Search...'
            className='bg-transparent font-semibold md:text-lg lg:text-2xl hover:cursor-pointer focus:outline-none w-24 sm:w-64' // to mobile->24 and after mobile->64
          />
          <FaSearch className='text-slate-600 hover:cursor-pointer' />
        </form>
        <ul className='flex gap-4 text-sm sm:text-base md:text-lg lg:text-2xl'>
          <Link to='/'>
            <li className='hidden sm:inline font-semibold text-slate-700 hover:underline hover:cursor-pointer'>
              Home
            </li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline font-semibold text-slate-700 hover:underline hover:cursor-pointer'>
              About
            </li>
          </Link>
          <Link to='/profile'>
            {
              currentUser ? (
                <img src={currentUser.avatar} className='rounded-full h-10 w-10 object-contain' alt='profile'>
                </img>
              ) : (
                <li className='text-slate-700 font-semibold hover:underline hover:cursor-pointer'>
                  Sign in
                </li>

              )}
          </Link>
        </ul>
      </div>

    </header>
  )
}

export default Header
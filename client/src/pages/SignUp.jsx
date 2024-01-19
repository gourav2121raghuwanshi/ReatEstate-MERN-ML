import React from 'react'
import { Link } from 'react-router-dom';

const SignUp = () => {
  return (
    <div className='p-5 max-w-2xl mx-auto'>
      <h1 className='text-2xl sm:text-4xl text-slate-700 text-center font-semibold my-7 '>
        Sign Up
      </h1>
      <form className='flex flex-col gap-4 '>
        <input type="text" placeholder='username' className='sm:text-xl font-semibold border p-3 rounded-lg ' id='username' >
        </input>
        <input type="text" placeholder='email' className='sm:text-xl font-semibold border p-3 rounded-lg ' id='email' >
        </input>
        <input type="text" placeholder='password' className='sm:text-xl font-semibold border p-3 rounded-lg ' id='password' >
        </input>
        <button className='bg-slate-700 text-white p-3 sm:text-xl py-3  rounded-lg uppercase hover:opacity-95 disabled:opacity-80 transition-all  duration-200'>
        Sign up
      </button>
      </form>
     <div className='flex gap-3 mt-5 sm:text-xl font-semibold'>
      <p>Have an account? </p>
      <Link to={'/sign-in'}>
        <span className='text-blue-700 '>
          Sign in
        </span>
      </Link>
     </div>
    </div>
  )
}

export default SignUp;
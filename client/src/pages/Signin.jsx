import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

const Signin = () => {
  const [formdata, setFormdata] = useState({
    email: '',
    password: '',
  });
  const buri = import.meta.env.VITE_BACKEND_URI;
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormdata({
      ...formdata,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());

      const res = await axios.post(`${buri}/auth/signin`, formdata, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      const data = await res.data;

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      navigate('/');
    } catch (submitError) {
      dispatch(signInFailure(submitError.message));
    }
  };

  return (
    <div className='page-shell'>
      <div className='glass-panel-strong hero-mesh relative overflow-hidden p-4 sm:p-6 lg:p-8'>
        <div className='grid gap-6 lg:grid-cols-[0.95fr_1.05fr]'>
          <div className='rounded-[28px] bg-[linear-gradient(160deg,_#173729,_#214d3b)] p-8 text-white'>
            <span className='eyebrow !border-white/20 !bg-white/10 !text-white'>Welcome back</span>
            <h1 className='mt-6 font-[Fraunces] text-4xl leading-tight sm:text-5xl'>
              Return to your curated property dashboard.
            </h1>
            <p className='mt-5 max-w-lg text-sm leading-7 text-white/76 sm:text-base'>
              Pick up where you left off, manage listings, and continue exploring homes
              through a more refined real estate experience.
            </p>
          </div>

          <div className='glass-panel p-6 sm:p-8'>
            <h2 className='section-heading !text-3xl'>Sign In</h2>
            <p className='section-copy mt-2'>Access saved listings, profile tools, and review features.</p>
            <form onSubmit={handleSubmit} className='mt-8 flex flex-col gap-4'>
              <div>
                <label htmlFor='email' className='field-label'>
                  Email
                </label>
                <input
                  type='text'
                  placeholder='you@example.com'
                  value={formdata.email}
                  className='field-shell'
                  id='email'
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor='password' className='field-label'>
                  Password
                </label>
                <input
                  type='password'
                  placeholder='Enter your password'
                  value={formdata.password}
                  className='field-shell'
                  id='password'
                  onChange={handleChange}
                />
              </div>
              <button disabled={loading} className='btn-primary mt-2 w-full !rounded-[22px] !py-4 uppercase'>
                {loading ? 'Loading...' : 'Sign In'}
              </button>
              <OAuth />
            </form>
            <div className='mt-6 text-sm font-semibold text-[color:var(--muted)] sm:text-base'>
              Don&apos;t have an account?{' '}
              <Link to='/sign-up' className='text-[color:var(--accent)]'>
                Sign Up
              </Link>
            </div>
            {error && <p className='mt-5 text-sm font-semibold text-[#9f3f36] sm:text-base'>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;

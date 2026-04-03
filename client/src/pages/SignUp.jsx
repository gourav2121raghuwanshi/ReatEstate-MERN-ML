import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import OAuth from '../components/OAuth';
import { useDispatch } from 'react-redux';
import { signUpFailure, signUpStart, signUpSuccess } from '../redux/user/userSlice';

const SignUp = () => {
  const [formdata, setFormdata] = useState({
    username: '',
    email: '',
    password: '',
  });
  const buri = import.meta.env.VITE_BACKEND_URI;
  const [errorr, setError] = useState(null);
  const [loadingg, setLoading] = useState(false);
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
    setLoading(true);

    try {
      dispatch(signUpStart());
      const res = await axios.post(`${buri}/auth/signup`, formdata, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      const data = await res.data;

      if (data.success === false) {
        setLoading(false);
        dispatch(signUpFailure(data.message));
        setError(data.message);
        return;
      }

      setLoading(false);
      setError(null);
      dispatch(signUpSuccess(data));
      navigate('/');
    } catch (submitError) {
      setLoading(false);
      dispatch(signUpFailure(submitError.message));
      setError(submitError.message);
    }
  };

  return (
    <div className='page-shell'>
      <div className='glass-panel-strong hero-mesh relative overflow-hidden p-4 sm:p-6 lg:p-8'>
        <div className='grid gap-6 lg:grid-cols-[1.05fr_0.95fr]'>
          <div className='glass-panel order-2 p-6 sm:p-8 lg:order-1'>
            <h1 className='section-heading !text-3xl'>Create your account</h1>
            <p className='section-copy mt-2'>
              Join to save homes, list properties, and manage your real estate profile.
            </p>
            <form onSubmit={handleSubmit} className='mt-8 flex flex-col gap-4'>
              <div>
                <label htmlFor='username' className='field-label'>
                  Username
                </label>
                <input
                  type='text'
                  placeholder='Your name'
                  value={formdata.username}
                  className='field-shell'
                  id='username'
                  onChange={handleChange}
                />
              </div>
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
                  placeholder='Create a secure password'
                  value={formdata.password}
                  className='field-shell'
                  id='password'
                  onChange={handleChange}
                />
              </div>
              <button disabled={loadingg} className='btn-primary mt-2 w-full !rounded-[22px] !py-4 uppercase'>
                {loadingg ? 'Loading...' : 'Sign Up'}
              </button>
              <OAuth />
            </form>
            <div className='mt-6 text-sm font-semibold text-[color:var(--muted)] sm:text-base'>
              Have an account?{' '}
              <Link to='/sign-in' className='text-[color:var(--accent)]'>
                Sign In
              </Link>
            </div>
            {errorr && <p className='mt-5 text-sm font-semibold text-[#9f3f36] sm:text-base'>{errorr}</p>}
          </div>

          <div className='order-1 rounded-[28px] bg-[linear-gradient(160deg,_#efe1cb,_#d8e5db)] p-8 text-[color:var(--text)] lg:order-2'>
            <span className='eyebrow !bg-white/60'>A more elevated start</span>
            <h2 className='mt-6 font-[Fraunces] text-4xl leading-tight sm:text-5xl'>
              Begin your next home journey with a polished workspace.
            </h2>
            <p className='mt-5 max-w-lg text-sm leading-7 text-[color:var(--muted)] sm:text-base'>
              Whether you&apos;re buying, renting, or posting a new listing, your account is the
              control center for everything that matters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

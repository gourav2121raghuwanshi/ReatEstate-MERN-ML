import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaRegCompass, FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const navClass = (pathname) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      location.pathname === pathname
        ? 'bg-[color:var(--accent)] text-white shadow-lg'
        : 'text-[color:var(--text)] hover:bg-white/60'
    }`;

  return (
    <header className='sticky top-0 z-40 px-4 pb-2 pt-4 sm:px-6'>
      <div className='glass-panel mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between'>
        <div className='flex items-center justify-between gap-4'>
          <Link to='/' className='group flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,_#1f5a46,_#123829)] text-white shadow-lg'>
              <FaRegCompass className='text-lg' />
            </div>
            <div>
              <p className='font-[Fraunces] text-2xl font-semibold leading-none text-[color:var(--text)] sm:text-3xl'>
                FindYourHome
              </p>
              <p className='mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]'>
                Curated Real Estate
              </p>
            </div>
          </Link>
          <Link
            to='/profile'
            className='lg:hidden'
            aria-label={currentUser ? 'Open profile' : 'Sign in'}
          >
            {currentUser ? (
              <img
                src={
                  currentUser.avatar ||
                  'https://res.cloudinary.com/domheydkx/image/upload/v1705905528/gourav/uyb6ntwjcrxacztiw4iv.jpg'
                }
                className='h-12 w-12 rounded-2xl object-cover ring-2 ring-white/70'
                alt='profile'
              />
            ) : (
              <span className='btn-secondary px-4 py-2 text-xs'>Sign In</span>
            )}
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className='flex w-full items-center gap-3 rounded-full border border-[color:var(--line)] bg-white/70 px-4 py-2 lg:max-w-xl'
        >
          <FaSearch className='shrink-0 text-[color:var(--muted)]' />
          <input
            type='text'
            placeholder='Search by city, address, or vibe'
            className='w-full bg-transparent text-sm font-medium text-[color:var(--text)] outline-none placeholder:text-[color:var(--muted)] sm:text-base'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className='btn-primary px-4 py-2 text-xs sm:text-sm'>Search</button>
        </form>

        <div className='flex items-center justify-between gap-3 lg:flex-nowrap'>
          <nav className='flex items-center gap-2'>
            <Link to='/' className={navClass('/')}>
              Home
            </Link>
            <Link to='/about' className={navClass('/about')}>
              About
            </Link>
            <Link to='/search' className={navClass('/search')}>
              Explore
            </Link>
          </nav>
          <Link
            to='/profile'
            className='hidden lg:block lg:shrink-0'
            aria-label={currentUser ? 'Open profile' : 'Sign in'}
          >
            {currentUser ? (
              <img
                src={
                  currentUser.avatar ||
                  'https://res.cloudinary.com/domheydkx/image/upload/v1705905528/gourav/uyb6ntwjcrxacztiw4iv.jpg'
                }
                className='h-12 w-12 rounded-2xl object-cover ring-2 ring-white/70 transition duration-300 hover:scale-105'
                alt='profile'
              />
            ) : (
              <span className='btn-secondary'>Sign In</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

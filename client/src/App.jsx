import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import Home from './pages/Home';
import Signin from './pages/Signin';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';
import ReviewPage from './pages/ReviewPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className='app-shell min-h-screen'>
        <div className='pointer-events-none fixed inset-0 -z-10 overflow-hidden'>
          <div className='absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(200,143,82,0.22),_transparent_70%)]' />
          <div className='absolute right-[-7rem] top-40 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(31,90,70,0.18),_transparent_70%)]' />
          <div className='absolute bottom-[-10rem] left-1/3 h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(20,49,38,0.08),_transparent_70%)]' />
        </div>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/sign-in' element={<Signin />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/about' element={<About />} />
          <Route path='/search' element={<Search />} />
          <Route path='/listing/:listingId' element={<Listing />} />
          <Route element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
            <Route path='/create-listing' element={<CreateListing />} />
            <Route path='/rate' element={<ReviewPage />} />
            <Route
              path='/update-listing/:listingId'
              element={<UpdateListing />}
            />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

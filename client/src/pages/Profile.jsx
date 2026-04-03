import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutUserStart,
  signoutUserSuccess,
  signoutUserFailure,
} from '../redux/user/userSlice';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import axios from 'axios';

const FALLBACK_IMAGE =
  'https://cdn.pixabay.com/photo/2017/06/16/15/58/luxury-home-2409518_640.jpg';

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [listingsLoaded, setListingsLoaded] = useState(false);
  const [listingsLoading, setListingsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const buri = import.meta.env.VITE_BACKEND_URI;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    if (file) {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFilePerc(Math.round(progress));
        },
        () => {
          setFileUploadError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
            setFormData((prev) => ({ ...prev, avatar: downloadURL }))
          );
        }
      );
    }
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await axios.post(`${buri}/user/update/${currentUser._id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
        withCredentials: true,
      });
      const data = await res.data;

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess({ ...data, token: currentUser.token }));
      setUpdateSuccess(true);
    } catch (submitError) {
      dispatch(updateUserFailure(submitError.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await axios.delete(`${buri}/user/delete/${currentUser._id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
        withCredentials: true,
      });
      const data = await res.data;

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      navigate('/sign-up');
    } catch (deleteError) {
      dispatch(deleteUserFailure(deleteError.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await axios.get(`${buri}/auth/signout`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
        withCredentials: true,
      });
      const data = await res.data;
      if (data.success === false) {
        dispatch(signoutUserFailure(data.message));
        return;
      }
      dispatch(signoutUserSuccess(data));
    } catch (signOutError) {
      dispatch(signoutUserFailure(signOutError.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      setListingsLoading(true);
      const res = await fetch(`${buri}/user/listings/${currentUser._id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        setListingsLoading(false);
        return;
      }
      setUserListings(data);
      setListingsLoaded(true);
      setListingsLoading(false);
    } catch (err) {
      setShowListingError(true);
      setListingsLoading(false);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await axios.delete(`${buri}/listing/delete/${listingId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
        withCredentials: true,
      });
      const data = await res.data;
      if (data.success === false) {
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='page-shell'>
      <div className='grid gap-6 xl:grid-cols-[0.95fr_1.05fr]'>
        <section className='glass-panel-strong p-6 sm:p-8'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <span className='eyebrow'>Profile studio</span>
              <h1 className='section-heading mt-4'>Manage your account</h1>
            </div>
            <button onClick={handleSignOut} className='btn-secondary w-fit !text-[#9f3f36]'>
              Sign Out
            </button>
          </div>

          <form onSubmit={handleSubmit} className='mt-8 flex flex-col gap-5'>
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type='file'
              ref={fileRef}
              accept='image/*'
              hidden
            />
            <div className='flex flex-col items-center gap-4'>
              <img
                src={formData.avatar || currentUser.avatar}
                onClick={() => fileRef.current.click()}
                alt='profile'
                loading='lazy'
                className='h-28 w-28 cursor-pointer rounded-[28px] object-cover ring-4 ring-white/60 sm:h-36 sm:w-36'
              />
              <p className='text-center text-sm font-semibold text-[color:var(--muted)]'>
                {fileUploadError
                  ? 'Error uploading image (must be under 2MB).'
                  : filePerc > 0 && filePerc < 100
                    ? `Uploading ${filePerc}%`
                    : filePerc === 100
                      ? 'Image uploaded successfully'
                      : 'Tap your photo to update it.'}
              </p>
            </div>

            <div>
              <label htmlFor='username' className='field-label'>
                Username
              </label>
              <input
                type='text'
                placeholder='username'
                defaultValue={currentUser.username}
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
                placeholder='email'
                defaultValue={currentUser.email}
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
                placeholder='password'
                className='field-shell'
                id='password'
                onChange={handleChange}
              />
            </div>

            <button disabled={loading} className='btn-primary w-full !rounded-[22px] !py-4 uppercase'>
              {loading ? 'Loading...' : 'Update Profile'}
            </button>
            <Link to='/create-listing' className='btn-secondary w-full !rounded-[22px] !py-4 text-center uppercase'>
              Create Listing
            </Link>
          </form>

          <div className='mt-6 flex flex-wrap items-center justify-between gap-4 text-sm font-semibold sm:text-base'>
            <button onClick={handleDeleteUser} className='text-[#9f3f36]'>
              Delete Account
            </button>
            <button onClick={handleShowListings} className='text-[color:var(--accent)]'>
              Show Listings
            </button>
          </div>

          {error && <p className='mt-5 text-sm font-semibold text-[#9f3f36]'>{error}</p>}
          {updateSuccess && (
            <p className='mt-5 text-sm font-semibold text-[color:var(--accent)]'>
              User updated successfully.
            </p>
          )}
          {showListingError && (
            <p className='mt-5 text-sm font-semibold text-[#9f3f36]'>Error showing listings.</p>
          )}
        </section>

        <section className='glass-panel-strong p-6 sm:p-8'>
          <div className='flex items-end justify-between gap-4'>
            <div>
              <p className='text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--accent)]'>
                Listing management
              </p>
              <h2 className='section-heading mt-2 !text-3xl'>Your Listings</h2>
            </div>
            <span className='text-sm text-[color:var(--muted)]'>
              {listingsLoaded ? `${userListings.length} listings` : 'Waiting to load'}
            </span>
          </div>

          <div className='mt-6 space-y-4'>
            {!listingsLoaded && !listingsLoading && (
              <div className='glass-panel p-8 text-center text-sm font-semibold text-[color:var(--muted)]'>
                Click "Show Listings" to load the properties you created.
              </div>
            )}

            {listingsLoading && (
              <div className='glass-panel p-8 text-center text-sm font-semibold text-[color:var(--muted)]'>
                Loading your listings...
              </div>
            )}

            {listingsLoaded && !listingsLoading && userListings.length === 0 && (
              <div className='glass-panel p-8 text-center text-sm font-semibold text-[color:var(--muted)]'>
                You do not have any listings yet.
              </div>
            )}

            {listingsLoaded && userListings.map((listing) => (
              <div
                key={listing._id}
                className='glass-panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center'
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    loading='lazy'
                    src={listing?.imageUrls?.[0] || FALLBACK_IMAGE}
                    alt={listing.name}
                    className='h-28 w-full rounded-[22px] object-cover sm:w-36'
                  />
                </Link>
                <div className='min-w-0 flex-1'>
                  <Link
                    className='line-clamp-1 text-xl font-bold text-[color:var(--text)]'
                    to={`/listing/${listing._id}`}
                  >
                    {listing.name}
                  </Link>
                  <p className='mt-2 text-sm text-[color:var(--muted)]'>{listing.address}</p>
                </div>
                <div className='flex gap-3 sm:flex-col'>
                  <button onClick={() => handleListingDelete(listing._id)} className='btn-secondary !text-[#9f3f36]'>
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`} className='btn-primary text-center'>
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

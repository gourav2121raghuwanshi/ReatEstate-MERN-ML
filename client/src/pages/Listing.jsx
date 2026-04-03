import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { useSelector } from 'react-redux';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import { MdSquareFoot } from 'react-icons/md';
import Contact from '../components/Contact';

const FALLBACK_IMAGE =
  'https://cdn.pixabay.com/photo/2017/06/16/15/58/luxury-home-2409518_640.jpg';

const Listing = () => {
  SwiperCore.use([Navigation]);
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const buri = import.meta.env.VITE_BACKEND_URI;

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${buri}/listing/get/${params.listingId}`, {
          withCredentials: true,
        });
        const data = res.data;
        if (data.success === false) {
          setLoading(false);
          setError(true);
          return;
        }
        setLoading(false);
        setError(false);
        setListing(data);
      } catch (err) {
        console.log(err);
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [buri, params.listingId]);

  if (error) {
    return (
      <main className='page-shell'>
        <div className='glass-panel p-10 text-center text-lg font-semibold text-[color:var(--muted)]'>
          Something went wrong while loading this property.
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className='page-shell'>
        <div className='glass-panel p-10 text-center text-lg font-semibold text-[color:var(--muted)]'>
          Loading property details...
        </div>
      </main>
    );
  }

  return (
    <main className='page-shell space-y-6'>
      {listing && (
        <>
          <section className='glass-panel-strong overflow-hidden'>
            <div className='relative'>
              <Swiper navigation>
                {listing.imageUrls.map((url) => (
                  <SwiperSlide key={url}>
                    <div className='relative h-[280px] sm:h-[420px] lg:h-[620px]'>
                      <img src={url || FALLBACK_IMAGE} alt={listing.name} className='h-full w-full object-cover' />
                      <div className='absolute inset-0 bg-gradient-to-t from-[#0e241d]/80 via-[#0e241d]/15 to-transparent' />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <button
                className='absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-[color:var(--accent)] shadow-lg backdrop-blur transition hover:scale-105'
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                <FaShare />
              </button>
              {copied && (
                <p className='absolute right-4 top-20 z-10 rounded-full bg-white/85 px-4 py-2 text-sm font-semibold text-[color:var(--accent-strong)] shadow-lg'>
                  Link copied
                </p>
              )}
            </div>
          </section>

          <section className='grid gap-6 lg:grid-cols-[1.15fr_0.85fr]'>
            <div className='glass-panel-strong p-6 sm:p-8'>
              <div className='flex flex-wrap items-start justify-between gap-4'>
                <div>
                  <p className='text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--accent)]'>
                    {listing.type === 'rent' ? 'Rental residence' : 'Ownership residence'}
                  </p>
                  <h1 className='mt-3 font-[Fraunces] text-4xl leading-tight text-[color:var(--text)] sm:text-5xl'>
                    {listing.name}
                  </h1>
                </div>
                <div className='rounded-[24px] bg-[linear-gradient(135deg,_#1f5a46,_#123829)] px-5 py-4 text-white shadow-lg'>
                  <p className='text-3xl font-extrabold'>
                    Rs.{' '}
                    {(listing.offer ? listing.discountPrice : listing.regularPrice).toLocaleString('en-US')}
                  </p>
                  <p className='mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/75'>
                    {listing.type === 'rent' ? 'per month' : 'listed price'}
                  </p>
                </div>
              </div>

              <div className='mt-6 flex flex-wrap gap-3'>
                <span className='toggle-chip !cursor-default !bg-[color:var(--accent-soft)]'>
                  <FaMapMarkerAlt className='text-[color:var(--accent)]' /> {listing.address}
                </span>
                <span className='toggle-chip !cursor-default !bg-[color:var(--sand)]'>
                  <MdSquareFoot className='text-[color:var(--accent)]' /> {listing.area} sq ft
                </span>
                {listing.offer && (
                  <span className='toggle-chip !cursor-default !bg-[#fff0e2] !text-[#9a5d1f]'>
                    Save Rs. {+listing.regularPrice - +listing.discountPrice}
                  </span>
                )}
              </div>

              <p className='mt-6 text-base leading-8 text-[color:var(--muted)]'>{listing.description}</p>

              <div className='mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                <div className='stat-card'>
                  <FaBed className='mb-3 text-lg text-[color:var(--accent)]' />
                  <p className='text-xl font-bold text-[color:var(--text)]'>{listing.bedroom}</p>
                  <p className='text-sm text-[color:var(--muted)]'>
                    {listing.bedroom > 1 ? 'Bedrooms' : 'Bedroom'}
                  </p>
                </div>
                <div className='stat-card'>
                  <FaBath className='mb-3 text-lg text-[color:var(--accent)]' />
                  <p className='text-xl font-bold text-[color:var(--text)]'>{listing.bathroom}</p>
                  <p className='text-sm text-[color:var(--muted)]'>
                    {listing.bathroom > 1 ? 'Bathrooms' : 'Bathroom'}
                  </p>
                </div>
                <div className='stat-card'>
                  <FaParking className='mb-3 text-lg text-[color:var(--accent)]' />
                  <p className='text-xl font-bold text-[color:var(--text)]'>
                    {listing.parking ? 'Yes' : 'No'}
                  </p>
                  <p className='text-sm text-[color:var(--muted)]'>Parking</p>
                </div>
                <div className='stat-card'>
                  <FaChair className='mb-3 text-lg text-[color:var(--accent)]' />
                  <p className='text-xl font-bold text-[color:var(--text)]'>
                    {listing.furnished ? 'Ready' : 'Basic'}
                  </p>
                  <p className='text-sm text-[color:var(--muted)]'>Furnishing</p>
                </div>
              </div>
            </div>

            <div className='space-y-6'>
              <div className='glass-panel-strong p-6 sm:p-8'>
                <p className='field-label'>Pricing insight</p>
                <p className='font-[Fraunces] text-3xl text-[color:var(--text)]'>
                  Rs. {Math.ceil(listing.predictionPrice).toLocaleString('en-US')}
                </p>
                <p className='mt-3 text-sm leading-7 text-[color:var(--muted)]'>
                  Model predicted price {listing.type === 'rent' ? 'per month' : 'for sale'} based on
                  listing signals such as city, area, and property details.
                </p>
              </div>

              {currentUser && listing.userRef !== currentUser._id && !contact && (
                <button
                  onClick={() => setContact(true)}
                  className='btn-primary w-full !rounded-[24px] !py-4 uppercase'
                >
                  Contact Landlord
                </button>
              )}
              {contact && <Contact listing={listing} />}
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default Listing;

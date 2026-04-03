import React from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaBath, FaBed } from 'react-icons/fa';

const ListingItem = ({ listing }) => {
  const coverImage =
    listing?.imageUrls?.[0] ||
    'https://cdn.pixabay.com/photo/2017/06/16/15/58/luxury-home-2409518_640.jpg';

  const price = listing.offer
    ? listing.discountPrice.toLocaleString('en-US')
    : listing.regularPrice.toLocaleString('en-US');

  return (
    <Link
      to={`/listing/${listing._id}`}
      className='group block w-full overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(18,56,41,0.16)] sm:w-[calc(50%-0.75rem)] xl:w-[calc(33.333%-1rem)]'
    >
      <div className='glass-panel-strong relative h-full overflow-hidden'>
        <div className='relative h-64 overflow-hidden'>
        <img
          src={coverImage}
          className='h-full w-full object-cover transition duration-500 group-hover:scale-110'
          loading='lazy'
          alt={listing.name}
        />
        <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#10271f]/90 via-[#10271f]/20 to-transparent p-5'>
          <div className='flex items-center justify-between gap-3'>
            <span className='rounded-full bg-white/18 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white backdrop-blur'>
              {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
            {listing.offer && (
              <span className='rounded-full bg-[#c88f52] px-3 py-1 text-xs font-bold text-white'>
                Offer Live
              </span>
            )}
          </div>
        </div>
        </div>

        <div className='space-y-4 p-5'>
        <div className='space-y-2'>
          <p className='line-clamp-1 text-xl font-bold text-[color:var(--text)]'>
            {listing.name}
          </p>
          <div className='flex items-center gap-2 text-sm text-[color:var(--muted)]'>
            <MdLocationOn className='text-lg text-[color:var(--accent)]' />
            <p className='line-clamp-1'>{listing.address}</p>
          </div>
        </div>

        <p className='line-clamp-2 text-sm leading-6 text-[color:var(--muted)]'>
          {listing.description}
        </p>

        <div className='flex items-end justify-between gap-4'>
          <div>
            <p className='text-2xl font-extrabold text-[color:var(--accent-strong)]'>
              Rs. {price}
            </p>
            <p className='text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]'>
              {listing.type === 'rent' ? 'per month' : 'all inclusive'}
            </p>
          </div>
          <div className='flex items-center gap-3 text-sm font-semibold text-[color:var(--text)]'>
            <span className='flex items-center gap-1 rounded-full bg-[color:var(--accent-soft)] px-3 py-1'>
              <FaBed className='text-xs' /> {listing.bedroom}
            </span>
            <span className='flex items-center gap-1 rounded-full bg-[color:var(--accent-soft)] px-3 py-1'>
              <FaBath className='text-xs' /> {listing.bathroom}
            </span>
          </div>
        </div>
      </div>
      </div>
    </Link>
  );
};

export default ListingItem;

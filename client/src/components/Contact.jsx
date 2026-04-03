import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  const buri = import.meta.env.VITE_BACKEND_URI;

  useEffect(() => {
    const getLandlord = async () => {
      try {
        const res = await axios.get(`${buri}/user/${listing.userRef}`, {
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
        setLandlord(data);
      } catch (err) {
        console.log(err);
      }
    };

    getLandlord();
  }, [buri, currentUser.token, listing.userRef]);

  return (
    <div className='glass-panel mt-6 p-5 sm:p-6'>
      {landlord && (
        <div className='flex flex-col gap-4'>
          <p className='text-sm leading-7 text-[color:var(--muted)] sm:text-base'>
            Contact <span className='font-bold text-[color:var(--text)]'>{landlord.username}</span>{' '}
            about <span className='font-bold text-[color:var(--text)]'>{listing.name.toLowerCase()}</span>.
          </p>
          <textarea
            placeholder='Introduce yourself and mention your timeline or questions.'
            name='message'
            id='message'
            rows={4}
            className='field-shell resize-none'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className='btn-primary w-full !rounded-[22px] !py-4'
          >
            Send Message
          </Link>
        </div>
      )}
    </div>
  );
};

export default Contact;

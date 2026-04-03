import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';

const ReviewPage = () => {
  const [formData, setFormData] = useState({ rating: 0, review: '' });
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const buri = import.meta.env.VITE_BACKEND_URI;

  useEffect(() => {
    const getReview = async () => {
      try {
        const res = await axios.get(`${buri}/rateus/ReviewOfCurrentUser/${currentUser._id}`, {
          withCredentials: true,
        });
        const data = await res.data;
        const existingReview = data?.newReviewAndRating?.[0];
        if (existingReview) {
          setFormData({
            rating: existingReview.rating,
            review: existingReview.review,
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    getReview();
  }, [buri, currentUser._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${buri}/rateus/updateReview/${currentUser._id}`, formData, {
        withCredentials: true,
      });
      setFormData({ rating: 0, review: '' });
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='page-shell'>
      <div className='glass-panel-strong mx-auto max-w-3xl p-6 sm:p-8'>
        <span className='eyebrow'>Share your feedback</span>
        <h1 className='section-heading mt-5'>How does the new FindYourHome experience feel?</h1>
        <p className='section-copy mt-3 max-w-2xl'>
          Your review helps shape the product. Tell us what feels great and what should keep improving.
        </p>

        <form onSubmit={handleSubmit} className='mt-8 space-y-6'>
          <div className='glass-panel p-5'>
            <p className='field-label !mb-4'>Rating</p>
            <div className='flex flex-wrap gap-3'>
              {[...Array(5)].map((_, index) => (
                <button
                  key={index}
                  type='button'
                  onClick={() => setFormData((prev) => ({ ...prev, rating: index + 1 }))}
                  className='rounded-full border border-[color:var(--line)] bg-white/70 p-3 transition hover:-translate-y-0.5'
                >
                  <FaStar
                    color={formData.rating >= index + 1 ? '#c88f52' : '#b9b3a8'}
                    className='h-7 w-7 sm:h-9 sm:w-9'
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor='review' className='field-label'>
              Review
            </label>
            <textarea
              id='review'
              name='review'
              value={formData.review}
              className='field-shell min-h-[180px] resize-none'
              placeholder='Share your thoughts on the browsing flow, visuals, and overall experience.'
              onChange={(e) => setFormData((prev) => ({ ...prev, review: e.target.value }))}
            />
          </div>

          <button className='btn-primary w-full !rounded-[22px] !py-4 uppercase'>
            {formData.review === '' || formData.rating === 0 ? 'Rate Us' : 'Update Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewPage;

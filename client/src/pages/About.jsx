import React from 'react';

const values = [
  'Boutique guidance with a strong understanding of modern buyer and renter expectations.',
  'Thoughtful listings that prioritize clarity, trust, and high-quality presentation.',
  'A balanced approach to style and utility so every step feels polished without becoming complicated.',
];

const About = () => {
  return (
    <div className='page-shell'>
      <section className='hero-mesh glass-panel-strong relative overflow-hidden px-6 py-10 sm:px-8 lg:px-12'>
        <span className='eyebrow'>About FindYourHome</span>
        <div className='mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start'>
          <div className='space-y-5'>
            <h1 className='hero-title !text-4xl sm:!text-5xl lg:!text-6xl'>
              We make buying, renting, and exploring homes feel more intentional.
            </h1>
            <p className='max-w-2xl text-base leading-8 text-[color:var(--muted)] sm:text-lg'>
              FindYourHome is built for people who want clarity without sacrificing aspiration.
              We pair practical search functionality with a calmer, more editorial interface so
              every property journey feels a little more premium and a lot more usable.
            </p>
          </div>
          <div className='glass-panel space-y-5 p-6'>
            <p className='text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--accent)]'>
              What we believe
            </p>
            {values.map((value) => (
              <div key={value} className='rounded-[22px] border border-[color:var(--line)] bg-white/70 p-4'>
                <p className='text-sm leading-7 text-[color:var(--text)] sm:text-base'>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

import React from 'react'

const CreateListing = () => {
    return (
        <main className='p-5 max-w-6xl mx-auto'>
            <h1 className='sm:text-4xl text-2xl text-gray-700 font-bold text-center my-7 '>
                Create a Listing
            </h1>

            <form className='flex flex-col sm:flex-row gap-8'>
                {/*  first side*/}
                <div className='flex flex-col gap-6 flex-1 '>

                    <input className='border p-3 rounded-lg ' type="text" placeholder='Name' id='name' maxLength='62' minLength='10' required />
                    <input className='border p-3 rounded-lg ' type="text" placeholder='Description' id='description' required />
                    <input className='border p-3 rounded-lg ' type="text" placeholder='Address' id='address' required />
                    <div className='flex flex-wrap gap-5'>
                        <div className='flex gap-5 items-center'>
                            <input type='checkbox' id='sale' className='w-8 h-8' />
                            <span className='text-xl font-semibold  text-slate-700'>Sale</span>
                        </div>
                        <div className='flex gap-5 items-center'>
                            <input type='checkbox' id='rent' className='w-8 h-8' />
                            <span className='text-xl font-semibold  text-slate-700'>Rent</span>
                        </div>
                        <div className='flex gap-5 items-center'>
                            <input type='checkbox' id='parking' className='w-8 h-8' />
                            <span className='text-xl font-semibold  text-slate-700'>Parking Spot</span>
                        </div>
                        <div className='flex gap-5 items-center'>
                            <input type='checkbox' id='furnished' className='w-8 h-8' />
                            <span className='text-xl font-semibold  text-slate-700'>Furnished</span>
                        </div>
                        <div className='flex gap-5 items-center'>
                            <input type='checkbox' id='offer' className='w-8 h-8' />
                            <span className='text-xl font-semibold text-slate-700 '>Offer</span>
                        </div>
                    </div>


                    <div className='flex  gap-5 flex-wrap '>
                        <div className='flex gap-5 items-center '>
                            <input id="bedrooms"
                                type="number"
                                min='1'
                                max='10'
                                required
                                className='p-3 border border-gray-300 rounded-lg ' />
                            <p className='text-xl font-semibold  text-slate-700'>Beds</p>
                        </div>
                        <div className='flex gap-5 items-center '>
                            <input id="bathrooms"
                                type="number"
                                min='1'
                                max='10'
                                required
                                className='p-3 border border-gray-300 rounded-lg ' />
                            <p className='text-xl font-semibold  text-slate-700'>Baths</p>
                        </div>
                        <div className='flex gap-5 items-center '>
                            <input id="regularPrice"
                                type="number"
                                min='1'
                                max='10'
                                required
                                className='p-3 border border-gray-300 rounded-lg ' />

                            <div className='text-xl font-semibold text-slate-700 flex flex-col gap-1 items-center' >
                                <p >  Regular Price </p>

                                <p className='text-lg'>(₹ / Month)</p>
                            </div>

                        </div>
                        <div className='flex gap-5 items-center '>
                            <input id="discountPrice"
                                type="number"
                                min='1'
                                max='10'
                                required
                                className='p-3 border border-gray-300 rounded-lg ' />
                            <div className='text-xl font-semibold text-slate-700 flex flex-col items-center gap-1' >
                                <p >  Discount Price </p>
                                <p className='text-lg'>(₹ / Month)</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* second side */}
                <div className='flex flex-col items-center gap-6 flex-1'>
                    <p className='font-bold text-2xl '>
                        Images:
                        <span className='font-normal text-gray-600 ml-3 '>The first image will be the cover (max 6)</span>
                    </p>
                    <div className='flex gap-5 border p-2 border-gray-200 '>
                        <input type='file' id='images' accept='image/*' multiple className='p-4 pl-0  border-gray-300 rounded text-2xl  w-full' />
                        <button className='p-4 text-green-700 font-semibold text-xl  border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 '>Upload</button>
                    </div>
                    <button className='p-4 w-full text-2xl  bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 '>
                        Create List
                    </button>
                </div>

            </form>
        </main >
    )
}

export default CreateListing;
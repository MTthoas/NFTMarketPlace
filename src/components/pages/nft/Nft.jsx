import React from 'react'

import Breadcrumb from 'components/utils/breadcrumb'
import { Link } from "react-router-dom";


function Nft(props) {
  return (
    <div className='w-full px-10'>
        <div className='mt-5 mx-10'>
            <div className='mt-5 flex flex-wrap gap-5'>
                <div class="container mx-auto px-4">
                    <Breadcrumb/>
                    <div class="lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-2">

                        <div class="lg:col-span-3 lg:row-end-1">
                            <div class="lg:flex lg:items-end">
                                <div class="overflow-hidden rounded-lg">
                                    <video
                                        className="w-102 h-102 xl:w-114 xl:h-114  ml-2 xl:ml-24 rounded-lg"
                                        src="https://ipfs.pixura.io/ipfs/QmYNEyGrTa6LQJoNRZEnzA6cp285kyFHLqRpb9V1WSsLko/zolla_406_4k.mp4"
                                        type="video/mp4"
                                        autoPlay
                                        loop
                                        muted
                                    />
                          
                                </div>

                            </div>
                        </div>

                        <div class="lg:col-span-3 lg:row-span-2 lg:row-end-2">
                            <h1 class="sm: text-2xl font-bold text-white sm:text-3xl whitespace-pre">Clod 406</h1>

                            <div className="flex flex-row gap-12">

                                <div class="flex items-center space-x-4 mt-5">
                                    <img class="w-8 h-8 rounded-full" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
                                    <div class="font-medium dark:text-white">
                                        <div className='text-gray-500'>Artist</div>
                                        <div class="text-sm ">fabianoLerazi</div>
                                    </div>
                                </div>

                                <div class="flex items-center space-x-4 mt-5">
                                    <img class="w-8 h-8 rounded-full" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
                                    <div class="font-medium dark:text-white">
                                        <div className='text-gray-500'>Owner</div>
                                        <div class="text-sm ">fabianoLerazi</div>
                                    </div>
                                </div>
                            
                            </div>

                            <div class="mt-5 flex flex-col items-center justify-between w-96 space-y-4 border-t py-4 sm:flex-row sm:space-y-0 border-gray-500">
                            </div>

                            
                        </div>

                    <div class="lg:col-span-3 mt-12">
                        <div class="border-b border-gray-300">
                        <nav class="flex gap-4">
                            <a href="#" title="" class="border-b-2 border-gray-900 py-4 text-sm font-medium text-gray-900 hover:border-gray-400 hover:text-gray-800"> Description </a>

                            <a href="#" title="" class="inline-flex items-center border-b-2 border-transparent py-4 text-sm font-medium text-gray-600">
                            Reviews
                            <span class="ml-2 block rounded-full bg-gray-500 px-2 py-px text-xs font-bold text-gray-100"> 1,209 </span>
                            </a>
                        </nav>
                        </div>

                        <div class="mt-8 flow-root sm:mt-12">
                        <h1 class="text-3xl font-bold">Delivered To Your Door</h1>
                        <p class="mt-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia accusantium nesciunt fuga.</p>
                        <h1 class="mt-8 text-3xl font-bold">From the Fine Farms of Brazil</h1>
                        <p class="mt-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio numquam enim facere.</p>
                        <p class="mt-4">Amet consectetur adipisicing elit. Optio numquam enim facere. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolore rerum nostrum eius facere, ad neque.</p>
                        </div>
                    </div>
                    </div>
                </div>
              
            </div>
            
            

        </div>
    </div>
  )
}

export default Nft


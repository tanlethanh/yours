import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { ImFacebook, ImTwitter, ImYoutube } from 'react-icons/im';
import Link from 'next/link';
import logo from '../../public/logo.png';


const Narbar = () => {
    return (
        <header className="h-28 w-full fixed top-0">
            <div className=" w-full h-full flex flex-row text-center ">
                <div className="h-full w-[14%] rounded-br-3xl bg-black flex justify-center text-center">
                    <Image src={logo} alt="" className="h-16 w-[160px] object-cover px-4 rounded-2xl bg-white mt-8" />
                </div>
                <div className="flex shrink-1 bac w-[66%] bg-black ">
                    <div className="h-22 bg-white w-full mt-6 rounded-tl-3xl rounded-tr-3xl flex items-center ">
                        <div className="w-[600px] rounded-full h-12 px-16 ml-16 flex justify-between items-center border-solid border-2 border-gray-500">
                            <Link href={'/'}>Sevices</Link>
                            <Link href={'/'}>Pricing</Link>
                            <Link href={'/'}>About</Link>
                            <Link href={'/'}>Contact us</Link>
                        </div>
                    </div>
                </div>
                <div className=" h-full w-[20%] rounded-bl-3xl bg-black flex justify-center text-center ">
                    <div className="h-22 w-full mt-6 rounded-tl-3xl rounded-tr-3xl flex items-center justify-center  gap-8">
                        <div className=" rounded-full h-12 px-4  flex justify-between items-center border-solid border-[1.5px] border-gray-500">
                            <Link href={'/'} className="text-white">
                                English
                            </Link>
                        </div>
                        <div className=" rounded-full h-12 px-4  flex justify-between items-center border-solid border-2 border-white">
                            <Link href={'/'} className="text-white">
                                Let's conect
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Narbar;

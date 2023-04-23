import React from 'react';
import NotFoundElements from '../components/animatedElements/notFoundElement';
import Link from 'next/link';

export default function NotFoundPage() {
    return (
        <div className="h-screen w-screen flex flex-col items-center mt-20">
            <NotFoundElements width={500} height={500}></NotFoundElements>
            <Link href={'/'} className="w-fit px-8 py-3 border border-gray-300 rounded-md">
                {' '}
                Về trang chủ
            </Link>
        </div>
    );
}

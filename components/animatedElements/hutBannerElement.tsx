import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../../public/academic-hut-banner.json';

export default function HutBannerElement({ width = 130, height = 130 }) {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        renderer: 'svg',
    };
    return (
        <div className="rounded-full">
            <Lottie options={defaultOptions} height={height} width={width} />
        </div>
    );
}

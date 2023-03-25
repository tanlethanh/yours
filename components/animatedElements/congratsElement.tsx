import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../../public/champion.json';

export default function CongratsElement() {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        renderer: 'svg',
    };
    return (
        <div>
            <Lottie options={defaultOptions} height={300} width={300} />
        </div>
    );
}

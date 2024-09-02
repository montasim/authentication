'use client';

import Lottie from 'react-lottie';
import animationData from '@/public/gifs/loading.json';

export default function Spinner({ animation = animationData }) {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    return (
        <div className="h-full w-full grid place-content-center">
            <Lottie options={defaultOptions} height={140} width={140} />
        </div>
    );
}

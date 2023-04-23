import React from 'react';
import LoadingElement from './animatedElements/loadingElement';

export default function Loading() {
    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <LoadingElement></LoadingElement>
        </div>
    );
}

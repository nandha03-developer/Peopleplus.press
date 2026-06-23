import { useState } from 'react';

let shortsImageState: any = null; // Initialize state

export const useShortsImage = () => {
    const [shortsImage, setShortsImage] = useState<any>(shortsImageState);
    
    const updateShortsImage = (newImage: any) => {
        shortsImageState = newImage; // Update the external state
        setShortsImage(newImage); // Update the local state for the component
    };

    return {
        shortsImage,
        updateShortsImage,
    };
};
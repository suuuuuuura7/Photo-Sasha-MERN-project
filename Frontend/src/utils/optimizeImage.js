export const optimizeCloudinaryUrl = (url, width) => {
    if (!url) return '';

    // Ensure we are using the absolute URL properly
    const fullUrl = url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL?.replace('/api', '') || ''}${url}`;

    // If it's a cloudinary URL, inject transformations
    if (fullUrl.includes('res.cloudinary.com') && fullUrl.includes('/upload/')) {
        // Only inject if it doesn't already have transformations at this segment
        if (!fullUrl.includes('/upload/f_auto')) {
            const widthParam = width ? `,w_${width}` : '';
            return fullUrl.replace('/upload/', `/upload/f_auto,q_auto${widthParam}/`);
        }
    }

    return fullUrl;
};

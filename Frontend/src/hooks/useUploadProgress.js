import { useState, useRef } from "react";

export const useUploadProgress = () => {
    const [progress, setProgress] = useState(0);
    const [speed, setSpeed] = useState(0);      // MB/s
    const [eta, setEta] = useState(null);       // seconds
    const [loadedBytes, setLoadedBytes] = useState(0);
    const startRef = useRef(null);

    const onUploadProgress = (e) => {
        if (!startRef.current) startRef.current = Date.now();

        const loaded = e.loaded;
        const total = e.total;
        const elapsed = (Date.now() - startRef.current) / 1000; // s

        const bytesPerSec = loaded / elapsed;
        const remainingBytes = total - loaded;

        setProgress(Math.round((loaded / total) * 100));
        setLoadedBytes(loaded);
        setSpeed(bytesPerSec);
        setEta(remainingBytes / bytesPerSec);
    };

    const reset = () => {
        startRef.current = null;
        setProgress(0);
        setSpeed(0);
        setEta(null);
        setLoadedBytes(0);
    };

    return { progress, speed, eta, loadedBytes, onUploadProgress, reset };
};
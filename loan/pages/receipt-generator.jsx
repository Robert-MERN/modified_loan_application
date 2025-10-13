import Receipt_generator from '@/components/Receipt_generator'
import React from 'react'

function cleanObject(obj) {
    const cleanedObj = {};
    for (const key in obj) {
        if (obj[key] === undefined) {
            cleanedObj[key] = null;
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            cleanedObj[key] = cleanObject(obj[key]); // Recursively clean nested objects
        } else {
            cleanedObj[key] = obj[key];
        }
    }
    return cleanedObj;
}


const receipt_generator = () => {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
            <Receipt_generator />
        </main>
    )
}

export default receipt_generator
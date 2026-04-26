"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function RatingWidget({ doctorName }: { doctorName: string }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        // TODO: Wire this up to post to a Google App Script endpoint / API route
        // to save the user's rating into your Google Sheet or database.
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="bg-green-50 text-green-700 p-6 rounded-2xl border border-green-100 font-medium text-center shadow-sm">
                <h4 className="text-xl font-bold mb-2">Thank You!</h4>
                <p>Your rating for {doctorName} has been submitted.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Rate Your Experience</h3>
            <p className="text-gray-500 text-sm mb-6 text-center">Help others by sharing your experience with {doctorName}.</p>

            <div className="flex gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className="focus:outline-none hover:scale-110 transition-transform"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                    >
                        <Star
                            className={`w-10 h-10 transition-colors ${star <= (hover || rating)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-gray-200 fill-transparent"
                                }`}
                        />
                    </button>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                disabled={rating === 0}
                className={`w-full max-w-xs py-3 rounded-xl font-bold transition-all ${rating > 0 ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
            >
                Submit Rating
            </button>
        </div>
    );
}
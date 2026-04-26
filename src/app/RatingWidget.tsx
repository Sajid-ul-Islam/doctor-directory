"use client";

import { useState } from "react";
import { Star, Send, Share2 } from "lucide-react";

export default function RatingWidget({ doctorName }: { doctorName: string }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [review, setReview] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `${doctorName} - Doctor Profile`,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert("Profile link copied to clipboard!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call to save rating & review
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSubmitted(true);
        setIsSubmitting(false);
    };

    if (submitted) {
        return (
            <div className="space-y-4">
                <div className="bg-green-50 text-green-700 p-6 rounded-2xl border border-green-100 font-medium text-center shadow-sm animate-in fade-in zoom-in duration-300">
                    <h4 className="text-xl font-bold mb-2">Thank You!</h4>
                    <p>Your feedback for {doctorName} has been submitted.</p>
                </div>
                <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share Profile
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
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

                {rating > 0 && (
                    <div className="w-full mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-sm font-bold text-gray-700 mb-2 text-left w-full">Leave a review (optional)</label>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="How was your visit? Were they supportive of your birth plan?"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm text-gray-700"
                            rows={3}
                        />
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={rating === 0 || isSubmitting}
                    className={`w-full py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 ${rating > 0 ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                >
                    {isSubmitting ? "Submitting..." : <><Send className="w-4 h-4" /> Submit Feedback</>}
                </button>
            </div>

            <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4" />
                Share Profile
            </button>
        </div>
    );
}
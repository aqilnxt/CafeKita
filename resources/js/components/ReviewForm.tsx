import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react'; // Tambahkan import ini
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface ReviewFormProps {
    productId: number;
    orderId?: number;
    existingReview?: {
        id: number;
        rating: number;
        comment: string;
    };
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, orderId, existingReview }) => {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [hoverRating, setHoverRating] = useState(0);

    const { data, setData, post, put, processing, errors } = useForm({
        rating: existingReview?.rating || 0,
        comment: existingReview?.comment || '',
        order_id: orderId
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Update data rating sebelum submit
        setData('rating', rating);
        
        if (existingReview) {
            put(route('customer.reviews.update', existingReview.id));
        } else {
            post(route('customer.reviews.store', productId));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <div className="flex items-center space-x-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => {
                                setRating(star);
                                setData('rating', star);
                            }}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none"
                        >
                            {(hoverRating || rating) >= star ? (
                                <StarIcon className="h-6 w-6 text-yellow-400" />
                            ) : (
                                <StarOutlineIcon className="h-6 w-6 text-gray-300" />
                            )}
                        </button>
                    ))}
                </div>
                {errors.rating && (
                    <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                )}
            </div>

            <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                    Komentar
                </label>
                <textarea
                    id="comment"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={data.comment}
                    onChange={(e) => setData('comment', e.target.value)}
                />
                {errors.comment && (
                    <p className="mt-1 text-sm text-red-600">{errors.comment}</p>
                )}
            </div>

            <div>
                <button
                    type="submit"
                    disabled={processing || rating === 0}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? 'Menyimpan...' : existingReview ? 'Update Review' : 'Kirim Review'}
                </button>
            </div>
        </form>
    );
};

export default ReviewForm;
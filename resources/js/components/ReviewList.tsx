import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { Link } from '@inertiajs/react';

interface Review {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    user: {
        name: string;
    };
}

interface ReviewListProps {
    reviews: Review[];
    canEdit?: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, canEdit = false }) => {
    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500 font-medium">
                                        {review.user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900">
                                    {review.user.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                    {new Date(review.created_at).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                        {canEdit && (
                            <div className="flex space-x-2">
                                <Link
                                    href={route('customer.reviews.edit', review.id)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => {
                                        if (confirm('Apakah Anda yakin ingin menghapus review ini?')) {
                                            // Implementasi delete
                                        }
                                    }}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Hapus
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <StarIcon
                                    key={star}
                                    className={`h-5 w-5 ${
                                        star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                        {review.comment && (
                            <p className="mt-2 text-gray-600">{review.comment}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReviewList; 
import React from 'react';
import { Head } from '@inertiajs/react';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: {
        name: string;
    };
    reviews: Array<{
        id: number;
        rating: number;
        comment: string;
        created_at: string;
        user: {
            name: string;
        };
    }>;
    average_rating: number;
    total_reviews: number;
}

interface Props {
    product: Product;
    canReview: boolean;
    orderId?: number;
    existingReview?: {
        id: number;
        rating: number;
        comment: string;
    };
}

const ProductDetail: React.FC<Props> = ({ product, canReview, orderId, existingReview }) => {
    return (
        <>
            <Head title={product.name} />
            
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Product Image */}
                        <div>
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-96 object-cover rounded-lg"
                            />
                        </div>

                        {/* Product Info */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                            <p className="mt-2 text-sm text-gray-500">{product.category.name}</p>
                            
                            <div className="mt-4">
                                <h2 className="text-lg font-medium text-gray-900">Deskripsi</h2>
                                <p className="mt-2 text-gray-600">{product.description}</p>
                            </div>

                            <div className="mt-6">
                                <h2 className="text-lg font-medium text-gray-900">Harga</h2>
                                <p className="mt-2 text-2xl font-bold text-gray-900">
                                    Rp {product.price.toLocaleString('id-ID')}
                                </p>
                            </div>

                            {/* Rating Summary */}
                            <div className="mt-6">
                                <h2 className="text-lg font-medium text-gray-900">Rating & Review</h2>
                                <div className="mt-2 flex items-center">
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                className={`h-5 w-5 ${
                                                    star <= Math.round(product.average_rating)
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-300'
                                                }`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="ml-2 text-sm text-gray-500">
                                        {product.average_rating.toFixed(1)} dari 5.0
                                    </p>
                                    <p className="ml-2 text-sm text-gray-500">
                                        ({product.total_reviews} review)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900">Review dari Pembeli</h2>
                        
                        {canReview && (
                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {existingReview ? 'Edit Review' : 'Tulis Review'}
                                </h3>
                                <div className="mt-4">
                                    <ReviewForm 
                                        productId={product.id}
                                        orderId={orderId}
                                        existingReview={existingReview}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="mt-8">
                            {product.reviews && product.reviews.length > 0 ? (
                                <ReviewList
                                    reviews={product.reviews}
                                    canEdit={canReview}
                                />
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Belum ada review untuk produk ini.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;
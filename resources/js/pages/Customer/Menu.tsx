import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import CustomerLayout from '@/layouts/CustomerLayout';
import { Product, Category, PageProps } from '@/types';

interface Props extends PageProps {
    products: Product[];
    categories: Category[];
}

interface CartItem {
    product: Product;
    quantity: number;
}

interface OrderFormData {
    items: { product_id: number; quantity: number }[];
    customer_name: string;
    table_number?: string;
    notes?: string;
    order_type: 'dine_in' | 'takeaway';
}

export default function Menu({ auth, products, categories }: Props) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [showCart, setShowCart] = useState(false);
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [orderNumber, setOrderNumber] = useState<string>('');

    const { data, setData, post, processing, errors, reset } = useForm<OrderFormData>({
        items: [],
        customer_name: auth.user?.name || '',
        table_number: '',
        notes: '',
        order_type: 'dine_in'
    });

    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.product.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: number) => {
        setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity < 1) return;
        setCart(prevCart =>
            prevCart.map(item =>
                item.product.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const handleProceedToCheckout = () => {
        const items = cart.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity
        }));
        setData('items', items);
        setShowCart(false);
        setShowCheckoutForm(true);
    };

    const handleSubmitOrder = (e: React.FormEvent) => {
        e.preventDefault();
        
        post(route('customer.orders.store'), {
            onSuccess: (page: any) => {
                // Assuming the backend returns order_number in the response
                const newOrderNumber = page.props?.order_number || `ORD-${Date.now()}`;
                setOrderNumber(newOrderNumber);
                
                // Reset form and cart
                reset();
                setCart([]);
                setShowCheckoutForm(false);
                setShowSuccess(true);
                
                // Optional: Redirect to kasir or show notification
                // You can implement real-time notifications here
            },
            onError: (errors) => {
                console.error('Order submission failed:', errors);
            }
        });
    };

    const filteredProducts = selectedCategory
        ? products.filter(product => product.category_id === selectedCategory)
        : products;

    return (
        <CustomerLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Menu</h2>}
        >
            <Head title="Menu" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Kategori Filter */}
                    <div className="mb-6">
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                                    selectedCategory === null
                                        ? 'bg-[#967259] text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Semua
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                                        selectedCategory === category.id
                                            ? 'bg-[#967259] text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Daftar Produk */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <img
                                    src={product.image ? `/images/menu/${product.image}` : '/api/placeholder/300/200'}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{product.description || 'Produk berkualitas'}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-[#967259]">
                                            Rp {product.price.toLocaleString('id-ID')}
                                        </span>
                                        <button
                                            onClick={() => addToCart(product)}
                                            disabled={product.stock === 0}
                                            className={`px-4 py-2 rounded-md transition-colors ${
                                                product.stock === 0
                                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                                    : 'bg-[#967259] text-white hover:bg-[#7D5A44]'
                                            }`}
                                        >
                                            {product.stock === 0 ? 'Habis' : 'Tambah'}
                                        </button>
                                    </div>
                                    {product.stock <= 5 && product.stock > 0 && (
                                        <p className="text-xs text-orange-500 mt-1">Stok tinggal {product.stock}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tombol Keranjang Floating */}
                    {getTotalItems() > 0 && (
                        <button
                            onClick={() => setShowCart(true)}
                            className="fixed bottom-6 right-6 bg-[#967259] text-white p-4 rounded-full shadow-lg hover:bg-[#7D5A44] transition-colors z-50"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {getTotalItems()}
                            </span>
                        </button>
                    )}

                    {/* Modal Keranjang */}
                    {showCart && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg w-full max-w-md max-h-screen overflow-hidden">
                                <div className="p-4 border-b">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold">Keranjang Belanja</h3>
                                        <button
                                            onClick={() => setShowCart(false)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 max-h-96 overflow-y-auto">
                                    {cart.length === 0 ? (
                                        <p className="text-center text-gray-500 py-8">Keranjang kosong</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {cart.map(item => (
                                                <div key={item.product.id} className="flex items-center space-x-4">
                                                    <img
                                                        src={item.product.image ? `/images/menu/${item.product.image}` : '/api/placeholder/60/60'}
                                                        alt={item.product.name}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                    <div className="flex-1">
                                                        <h4 className="font-medium">{item.product.name}</h4>
                                                        <p className="text-sm text-gray-500">
                                                            Rp {item.product.price.toLocaleString('id-ID')}
                                                        </p>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <button
                                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="min-w-8 text-center">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium">
                                                            Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                                                        </p>
                                                        <button
                                                            onClick={() => removeFromCart(item.product.id)}
                                                            className="text-red-500 hover:text-red-700 mt-1"
                                                        >
                                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {cart.length > 0 && (
                                    <div className="p-4 border-t">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="font-medium">Total:</span>
                                            <span className="font-bold text-lg text-[#967259]">
                                                Rp {getTotalPrice().toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <button
                                            onClick={handleProceedToCheckout}
                                            className="w-full py-3 px-4 rounded-md text-white font-medium bg-[#967259] hover:bg-[#7D5A44] transition-colors"
                                        >
                                            Lanjut ke Checkout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Modal Checkout Form */}
                    {showCheckoutForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg w-full max-w-md max-h-screen overflow-hidden">
                                <div className="p-4 border-b">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold">Detail Pesanan</h3>
                                        <button
                                            onClick={() => setShowCheckoutForm(false)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <form onSubmit={handleSubmitOrder} className="p-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nama Pelanggan *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.customer_name}
                                            onChange={(e) => setData('customer_name', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg focus:ring-[#967259] focus:border-[#967259]"
                                            required
                                        />
                                        {errors.customer_name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.customer_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tipe Pesanan *
                                        </label>
                                        <select
                                            value={data.order_type}
                                            onChange={(e) => setData('order_type', e.target.value as 'dine_in' | 'takeaway')}
                                            className="w-full border-gray-300 rounded-lg focus:ring-[#967259] focus:border-[#967259]"
                                        >
                                            <option value="dine_in">Makan di Tempat</option>
                                            <option value="takeaway">Bawa Pulang</option>
                                        </select>
                                    </div>

                                    {data.order_type === 'dine_in' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nomor Meja
                                            </label>
                                            <input
                                                type="text"
                                                value={data.table_number}
                                                onChange={(e) => setData('table_number', e.target.value)}
                                                className="w-full border-gray-300 rounded-lg focus:ring-[#967259] focus:border-[#967259]"
                                                placeholder="Contoh: A1, B5, dll"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Catatan Tambahan
                                        </label>
                                        <textarea
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg focus:ring-[#967259] focus:border-[#967259]"
                                            rows={3}
                                            placeholder="Permintaan khusus, alergi, dll..."
                                        />
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="font-medium">Total Pesanan:</span>
                                            <span className="font-bold text-lg text-[#967259]">
                                                Rp {getTotalPrice().toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full py-3 px-4 rounded-md text-white font-medium bg-[#967259] hover:bg-[#7D5A44] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {processing ? 'Memproses Pesanan...' : 'Kirim ke Kasir'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowCheckoutForm(false)}
                                                className="w-full py-2 px-4 rounded-md text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                                            >
                                                Kembali
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Modal Success */}
                    {showSuccess && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg w-full max-w-md p-6">
                                <div className="text-center">
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Pesanan Berhasil Dikirim!</h3>
                                    <p className="text-gray-600 mb-1">Nomor Pesanan: <span className="font-semibold text-[#967259]">{orderNumber}</span></p>
                                    <p className="text-sm text-gray-500 mb-6">
                                        Pesanan Anda telah dikirim ke kasir dan akan segera diproses. 
                                        Silakan menunggu konfirmasi dari kasir.
                                    </p>
                                    <button
                                        onClick={() => setShowSuccess(false)}
                                        className="w-full bg-[#967259] text-white py-2 px-4 rounded-lg hover:bg-[#7D5A44] transition-colors"
                                    >
                                        Pesan Lagi
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}
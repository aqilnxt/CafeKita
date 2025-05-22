import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import KasirLayout from '@/layouts/KasirLayout';
import { 
    MagnifyingGlassIcon, 
    XMarkIcon, 
    PlusIcon, 
    MinusIcon,
    ShoppingCartIcon,
    CubeIcon,
    TagIcon
} from '@heroicons/react/24/outline';

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    image: string;
    category?: {
        id: number;
        name: string;
    };
}

interface Category {
    id: number;
    name: string;
}

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
}

interface TransactionFormData {
    items: { product_id: number; quantity: number }[];
    payment_method: string;
    cash_amount: number;
    total_amount: number;
}

interface TransactionFormProps extends PageProps {
    products: Product[];
}

export default function TransactionForm({ auth, products }: TransactionFormProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [cashAmount, setCashAmount] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<TransactionFormData>({
        items: [],
        payment_method: 'cash',
        cash_amount: 0,
        total_amount: 0,
    });

    // Get unique categories
    const categories: Category[] = Array.from(new Set(products.map(p => p.category?.id)))
        .map(id => products.find(p => p.category?.id === id)?.category)
        .filter((category): category is Category => Boolean(category));

    useEffect(() => {
        let filtered = products;
        
        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(product =>
                product.category?.id === selectedCategory
            );
        }
        
        setFilteredProducts(filtered);
    }, [searchQuery, selectedCategory, products]);

    const addToCart = (product: Product) => {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                setCart(cart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
                        : item
                ));
            }
        } else {
            setCart([...cart, {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                subtotal: product.price
            }]);
        }
    };

    const removeFromCart = (productId: number) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: number, newQuantity: number) => {
        const product = products.find(p => p.id === productId);
        if (product && newQuantity > 0 && newQuantity <= product.stock) {
            setCart(cart.map(item =>
                item.id === productId
                    ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.price }
                    : item
            ));
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.subtotal, 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const items = cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity
        }));
        
        setData({
            items,
            payment_method: paymentMethod,
            cash_amount: parseFloat(cashAmount) || 0,
            total_amount: calculateTotal()
        });

        setShowPaymentModal(true);
    };

    const processPayment = () => {
        post(route('kasir.transactions.store'), {
            onSuccess: () => {
                reset();
                setCart([]);
                setCashAmount('');
                setPaymentMethod('cash');
                setShowPaymentModal(false);
                setShowSuccessModal(true);
            },
        });
    };

    return (
        <KasirLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800">Transaksi Baru</h2>}
        >
            <Head title="Transaksi Baru" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="space-y-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari produk..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#967259] focus:border-[#967259]"
                                />
                                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                            
                            {/* Category Filter */}
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        selectedCategory === null
                                            ? 'bg-[#967259] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Semua
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                                            selectedCategory === category.id
                                                ? 'bg-[#967259] text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        <TagIcon className="h-4 w-4" />
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                            {filteredProducts.length === 0 ? (
                                <div className="col-span-full text-center py-8 text-gray-500">
                                    <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-2">Tidak ada produk yang ditemukan</p>
                                </div>
                            ) : (
                                filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                        onClick={() => addToCart(product)}
                                    >
                                        <div className="aspect-square bg-gray-100">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <CubeIcon className="h-12 w-12" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                                            <p className="text-[#967259] font-semibold">
                                                Rp {product.price.toLocaleString('id-ID')}
                                            </p>
                                            <div className="flex justify-between items-center mt-1">
                                                <p className="text-sm text-gray-500">Stok: {product.stock}</p>
                                                {product.category && (
                                                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                                                        {product.category.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Cart */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Keranjang</h3>
                        </div>
                        <div className="p-4">
                            {cart.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <p className="mt-2">Keranjang kosong</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-4">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{item.name}</h4>
                                                <p className="text-[#967259] font-semibold">
                                                    Rp {item.price.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 text-gray-500 hover:text-[#967259]"
                                                >
                                                    <MinusIcon className="h-4 w-4" />
                                                </button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 text-gray-500 hover:text-[#967259]"
                                                >
                                                    <PlusIcon className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-1 text-red-500 hover:text-red-600"
                                                >
                                                    <XMarkIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t">
                            <div className="flex justify-between mb-4">
                                <span className="text-gray-600">Total</span>
                                <span className="text-lg font-semibold text-[#967259]">
                                    Rp {calculateTotal().toLocaleString('id-ID')}
                                </span>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={cart.length === 0 || processing}
                                className="w-full bg-[#967259] text-white py-2 px-4 rounded-lg hover:bg-[#7a5a47] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Memproses...' : 'Bayar'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pembayaran</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Metode Pembayaran
                                </label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full border-gray-300 rounded-lg focus:ring-[#967259] focus:border-[#967259]"
                                >
                                    <option value="cash">Tunai</option>
                                    <option value="qris">QRIS</option>
                                </select>
                            </div>

                            {paymentMethod === 'cash' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Jumlah Uang
                                    </label>
                                    <input
                                        type="number"
                                        value={cashAmount}
                                        onChange={(e) => setCashAmount(e.target.value)}
                                        className="w-full border-gray-300 rounded-lg focus:ring-[#967259] focus:border-[#967259]"
                                        placeholder="Masukkan jumlah uang"
                                    />
                                    {parseFloat(cashAmount) < calculateTotal() && (
                                        <p className="mt-1 text-sm text-red-600">
                                            Jumlah uang kurang
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Total</span>
                                    <span className="font-semibold">
                                        Rp {calculateTotal().toLocaleString('id-ID')}
                                    </span>
                                </div>
                                {paymentMethod === 'cash' && (
                                    <>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Tunai</span>
                                            <span className="font-semibold">
                                                Rp {parseFloat(cashAmount || '0').toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between mb-4">
                                            <span className="text-gray-600">Kembalian</span>
                                            <span className="font-semibold text-[#967259]">
                                                Rp {(parseFloat(cashAmount || '0') - calculateTotal()).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={processPayment}
                                    disabled={processing || (paymentMethod === 'cash' && parseFloat(cashAmount) < calculateTotal())}
                                    className="flex-1 bg-[#967259] text-white py-2 px-4 rounded-lg hover:bg-[#7a5a47] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Memproses...' : 'Proses Pembayaran'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-gray-900">Transaksi Berhasil!</h3>
                            <p className="mt-2 text-gray-600">Transaksi telah berhasil diproses.</p>
                            <div className="mt-6">
                                <button
                                    onClick={() => setShowSuccessModal(false)}
                                    className="w-full bg-[#967259] text-white py-2 px-4 rounded-lg hover:bg-[#7a5a47]"
                                >
                                    Transaksi Baru
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </KasirLayout>
    );
}
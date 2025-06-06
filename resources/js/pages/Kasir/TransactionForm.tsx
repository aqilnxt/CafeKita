import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import KasirLayout from '@/layouts/KasirLayout';
import { 
    MagnifyingGlassIcon, 
    XMarkIcon, 
    PlusIcon, 
    MinusIcon,
    CubeIcon,
    TagIcon,
    ShoppingCartIcon,
    Bars3Icon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

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
    stock: number;
    subtotal: number;
}

interface TransactionFormData {
    items: { product_id: number; quantity: number }[];
    payment_method: string;
    cash_amount: number;
    total_amount: number;
    [key: string]: any;
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
    const [showMobileCart, setShowMobileCart] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<TransactionFormData>({
        items: [],
        payment_method: 'cash',
        cash_amount: 0,
        total_amount: 0,
    });

    // Get unique categories
    const categories: Category[] = Array.from(new Set(products.map(p => p.category?.id).filter(Boolean)))
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
        if (product.stock <= 0) {
            alert('Produk sedang habis!');
            return;
        }

        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                setCart(cart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
                        : item
                ));
            } else {
                alert(`Stok ${product.name} tidak mencukupi! Stok tersedia: ${product.stock}`);
            }
        } else {
            setCart([...cart, {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                stock: product.stock,
                subtotal: product.price
            }]);
        }
        
        // Close mobile cart after adding item on mobile
        if (window.innerWidth < 1024) {
            setShowMobileCart(false);
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
        } else if (product && newQuantity > product.stock) {
            alert(`Stok tidak mencukupi! Maksimal: ${product.stock}`);
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.subtotal, 0);
    };

    const calculateChange = () => {
        const cash = parseFloat(cashAmount) || 0;
        const total = calculateTotal();
        return cash >= total ? cash - total : 0;
    };

    const handlePayment = () => {
        if (cart.length === 0) {
            alert('Keranjang masih kosong!');
            return;
        }

        const items = cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity
        }));

        const total = calculateTotal();
        
        setData({
            items,
            payment_method: paymentMethod,
            cash_amount: paymentMethod === 'cash' ? parseFloat(cashAmount) || 0 : 0,
            total_amount: total
        });

        setShowPaymentModal(true);
        setShowMobileCart(false); // Close mobile cart when opening payment modal
    };

    const processPayment = () => {
        if (paymentMethod === 'cash') {
            const cash = parseFloat(cashAmount) || 0;
            if (cash < calculateTotal()) {
                alert('Jumlah tunai tidak mencukupi!');
                return;
            }
        }

        post('/kasir/transactions', {
            onSuccess: () => {
                reset();
                setCart([]);
                setCashAmount('');
                setPaymentMethod('cash');
                setShowPaymentModal(false);
                setShowMobileCart(false);
            },
            onError: (errors) => {
                console.error('Transaction errors:', errors);
            }
        });
    };

    // Cart Component (reusable for desktop and mobile)
    const CartComponent = ({ className = "" }: { className?: string }) => (
        <Card className={`h-fit ${className}`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingCartIcon className="h-5 w-5" />
                    Keranjang ({cart.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="max-h-80 sm:max-h-96 overflow-y-auto">
                {cart.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 text-gray-500">
                        <ShoppingCartIcon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm sm:text-base">Keranjang kosong</p>
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-4">
                        {cart.map((item) => (
                            <Card key={item.id} className="p-2 sm:p-3">
                                <div className="flex items-start sm:items-center space-x-2 sm:space-x-3">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2 sm:truncate">
                                            {item.name}
                                        </h4>
                                        <p className="text-primary font-semibold text-sm sm:text-base">
                                            Rp {item.price.toLocaleString('id-ID')}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-500">
                                            Subtotal: Rp {item.subtotal.toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                        <div className="flex items-center space-x-1 sm:space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateQuantity(item.id, item.quantity - 1);
                                                }}
                                                disabled={item.quantity <= 1}
                                            >
                                                <MinusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                            </Button>
                                            <span className="w-6 sm:w-8 text-center font-medium text-sm sm:text-base">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateQuantity(item.id, item.quantity + 1);
                                                }}
                                                disabled={item.quantity >= item.stock}
                                            >
                                                <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                            </Button>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-500 hover:text-red-600"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFromCart(item.id);
                                            }}
                                        >
                                            <XMarkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
            
            {cart.length > 0 && (
                <div className="p-3 sm:p-4 border-t bg-gray-50/50">
                    <div className="space-y-2 mb-3 sm:mb-4">
                        <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-600">Jumlah Item</span>
                            <span className="font-medium">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-base sm:text-lg">
                            <span className="font-medium text-gray-900">Total</span>
                            <span className="font-bold text-primary">
                                Rp {calculateTotal().toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                    <Button
                        onClick={handlePayment}
                        disabled={cart.length === 0 || processing}
                        className="w-full text-sm sm:text-base"
                        size="lg"
                    >
                        {processing ? 'Memproses...' : 'Proses Pembayaran'}
                    </Button>
                </div>
            )}
        </Card>
    );

    return (
        <KasirLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Transaksi Baru</h2>
                    
                    {/* Mobile Cart Button */}
                    <div className="lg:hidden">
                        <Sheet open={showMobileCart} onOpenChange={setShowMobileCart}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm" className="relative">
                                    <ShoppingCartIcon className="h-5 w-5" />
                                    {cart.length > 0 && (
                                        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                            {cart.length}
                                        </Badge>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-full sm:w-96 p-0">
                                <div className="p-4">
                                    <SheetHeader className="mb-4">
                                        <SheetTitle>Keranjang Belanja</SheetTitle>
                                        <SheetDescription>
                                            {cart.length} item dalam keranjang
                                        </SheetDescription>
                                    </SheetHeader>
                                    <CartComponent />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            }
        >
            <Head title="Transaksi Baru" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Product List */}
                <div className="lg:col-span-2 space-y-4">
                    <Card>
                        <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                            {/* Search Bar */}
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Cari produk..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 text-sm sm:text-base"
                                />
                                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            </div>
                            
                            {/* Category Filter */}
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                                <Button
                                    variant={selectedCategory === null ? "default" : "outline"}
                                    size="sm"
                                    className="text-xs sm:text-sm h-8 sm:h-9"
                                    onClick={() => setSelectedCategory(null)}
                                >
                                    Semua
                                </Button>
                                {categories.map((category) => (
                                    <Button
                                        key={category.id}
                                        variant={selectedCategory === category.id ? "default" : "outline"}
                                        size="sm"
                                        className="flex items-center gap-1 text-xs sm:text-sm h-8 sm:h-9"
                                        onClick={() => setSelectedCategory(category.id)}
                                    >
                                        <TagIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                        <span className="truncate max-w-20 sm:max-w-none">{category.name}</span>
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Products Grid */}
                    <Card>
                        <CardContent className="p-3 sm:p-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                                {filteredProducts.length === 0 ? (
                                    <div className="col-span-full text-center py-6 sm:py-8 text-gray-500">
                                        <CubeIcon className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                                        <p className="mt-2 text-sm sm:text-base">Tidak ada produk yang ditemukan</p>
                                    </div>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <Card
                                            key={product.id}
                                            className={`cursor-pointer hover:shadow-lg transition-all ${
                                                product.stock <= 0 
                                                    ? 'opacity-50 cursor-not-allowed' 
                                                    : 'hover:scale-105 active:scale-95'
                                            }`}
                                            onClick={() => addToCart(product)}
                                        >
                                            <div className="aspect-square bg-gray-100 relative rounded-t-lg overflow-hidden">
                                                {product.image ? (
                                                    <img
                                                        src={`/images/menu/${product.image}`}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <CubeIcon className="h-8 w-8 sm:h-12 sm:w-12" />
                                                    </div>
                                                )}
                                                {product.stock <= 0 && (
                                                    <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center">
                                                        <Badge variant="destructive" className="text-xs">Habis</Badge>
                                                    </div>
                                                )}
                                            </div>
                                            <CardContent className="p-2 sm:p-3">
                                                <h3 className="font-medium text-gray-900 text-xs sm:text-sm line-clamp-2 min-h-[2.5rem] sm:min-h-[1.25rem] leading-tight">
                                                    {product.name}
                                                </h3>
                                                <p className="text-primary font-semibold text-sm sm:text-base mt-1">
                                                    Rp {product.price.toLocaleString('id-ID')}
                                                </p>
                                                <div className="flex justify-between items-center mt-1 gap-1">
                                                    <p className={`text-xs ${product.stock <= 5 ? 'text-red-500' : 'text-gray-500'}`}>
                                                        Stok: {product.stock}
                                                    </p>
                                                    {product.category && (
                                                        <Badge variant="secondary" className="text-xs px-1 py-0 truncate max-w-16 sm:max-w-none">
                                                            {product.category.name}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Desktop Cart */}
                <div className="hidden lg:block lg:col-span-1">
                    <CartComponent />
                </div>
            </div>

            {/* Payment Modal */}
            <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
                <DialogContent className="max-w-sm sm:max-w-md mx-4">
                    <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl">Konfirmasi Pembayaran</DialogTitle>
                        <DialogDescription className="text-sm sm:text-base">
                            Pilih metode pembayaran dan konfirmasi transaksi Anda
                        </DialogDescription>
                    </DialogHeader>
                    
                    {errors && Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>
                                {Object.values(errors).map((error, index) => (
                                    <p key={index} className="text-sm">{error as string}</p>
                                ))}
                            </AlertDescription>
                        </Alert>
                    )}
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="payment-method" className="text-sm sm:text-base">
                                Metode Pembayaran
                            </Label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger className="text-sm sm:text-base">
                                    <SelectValue placeholder="Pilih metode pembayaran" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Tunai</SelectItem>
                                    <SelectItem value="qris">QRIS</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {paymentMethod === 'cash' && (
                            <div className="space-y-2">
                                <Label htmlFor="cash-amount" className="text-sm sm:text-base">
                                    Jumlah Uang Tunai
                                </Label>
                                <Input
                                    id="cash-amount"
                                    type="number"
                                    value={cashAmount}
                                    onChange={(e) => setCashAmount(e.target.value)}
                                    placeholder="Masukkan jumlah uang"
                                    min="0"
                                    step="1000"
                                    className="text-sm sm:text-base"
                                />
                                {parseFloat(cashAmount) > 0 && parseFloat(cashAmount) < calculateTotal() && (
                                    <p className="text-xs sm:text-sm text-red-600">
                                        Jumlah uang kurang dari total pembayaran
                                    </p>
                                )}
                            </div>
                        )}

                        <Separator />
                        
                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600 text-sm sm:text-base">Total Pembayaran</span>
                                <span className="font-semibold text-base sm:text-lg">
                                    Rp {calculateTotal().toLocaleString('id-ID')}
                                </span>
                            </div>
                            
                            {paymentMethod === 'cash' && parseFloat(cashAmount) > 0 && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 text-sm sm:text-base">Tunai Diterima</span>
                                        <span className="font-semibold text-sm sm:text-base">
                                            Rp {parseFloat(cashAmount).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 text-sm sm:text-base">Kembalian</span>
                                        <span className="font-semibold text-primary text-sm sm:text-base">
                                            Rp {calculateChange().toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="gap-2 flex-col sm:flex-row">
                        <Button
                            variant="outline"
                            onClick={() => setShowPaymentModal(false)}
                            disabled={processing}
                            className="w-full sm:w-auto text-sm sm:text-base"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={processPayment}
                            disabled={processing || (paymentMethod === 'cash' && parseFloat(cashAmount) < calculateTotal())}
                            className="w-full sm:w-auto text-sm sm:text-base"
                        >
                            {processing ? 'Memproses...' : 'Konfirmasi Bayar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </KasirLayout>
    );
}
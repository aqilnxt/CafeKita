import React, { useState, useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import CustomerLayout from '@/layouts/CustomerLayout';
import { Product, Category, PageProps } from '@/types';

// shadcn/ui imports
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

import { 
    ShoppingCart, 
    Plus, 
    Minus, 
    Trash2, 
    X, 
    Check,
    Search,
    Filter,
    Coffee
} from 'lucide-react';

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
    [key: string]: any;
}

export default function Menu({ auth, products, categories }: Props) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showCart, setShowCart] = useState(false);
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [orderNumber, setOrderNumber] = useState<string>('');

    const { data, setData, post, processing, errors, reset } = useForm({
        items: [] as { product_id: number; quantity: number }[],
        customer_name: auth.user?.name || '',
        table_number: '',
        notes: '',
        order_type: 'dine_in' as 'dine_in' | 'takeaway'
    });

    // Memoized filtered products for better performance
    const filteredProducts = useMemo(() => {
        let filtered = products;

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(query) ||
                (product.description && product.description.toLowerCase().includes(query))
            );
        }

        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(product => product.category_id === selectedCategory);
        }

        return filtered;
    }, [products, searchQuery, selectedCategory]);

    // Clear search when category changes
    const handleCategoryChange = (categoryId: number | null) => {
        setSelectedCategory(categoryId);
        // Optionally clear search when changing category
        // setSearchQuery('');
    };

    // Clear category when searching
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        // Optionally clear category filter when searching
        // if (value.trim()) {
        //     setSelectedCategory(null);
        // }
    };

    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedCategory(null);
    };

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
                const newOrderNumber = page.props?.order_number || `ORD-${Date.now()}`;
                setOrderNumber(newOrderNumber);
                
                reset();
                setCart([]);
                setShowCheckoutForm(false);
                setShowSuccess(true);
            },
            onError: (errors) => {
                console.error('Order submission failed:', errors);
            }
        });
    };

    return (
        <CustomerLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Menu</h2>}
        >
            <Head title="Menu" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Search and Filter Section */}
                    <div className="mb-6 space-y-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <Input
                                type="text"
                                placeholder="Cari menu favorit Anda..."
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                </button>
                            )}
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Filter className="h-4 w-4" />
                                <span className="hidden sm:inline">Kategori:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    onClick={() => handleCategoryChange(null)}
                                    variant={selectedCategory === null ? "default" : "outline"}
                                    size="sm"
                                    className={`whitespace-nowrap ${selectedCategory === null ? "bg-[#967259] hover:bg-[#7D5A44]" : ""}`}
                                >
                                    Semua
                                </Button>
                                {categories.map(category => (
                                    <Button
                                        key={category.id}
                                        onClick={() => handleCategoryChange(category.id)}
                                        variant={selectedCategory === category.id ? "default" : "outline"}
                                        size="sm"
                                        className={`whitespace-nowrap ${selectedCategory === category.id ? "bg-[#967259] hover:bg-[#7D5A44]" : ""}`}
                                    >
                                        {category.name}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Active Filters & Results */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                                {(searchQuery || selectedCategory) && (
                                    <Button
                                        onClick={clearAllFilters}
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="h-3 w-3 mr-1" />
                                        Hapus Filter
                                    </Button>
                                )}
                                {searchQuery && (
                                    <Badge variant="secondary" className="text-xs">
                                        Pencarian: "{searchQuery}"
                                    </Badge>
                                )}
                                {selectedCategory && (
                                    <Badge variant="secondary" className="text-xs">
                                        Kategori: {categories.find(c => c.id === selectedCategory)?.name}
                                    </Badge>
                                )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {filteredProducts.length} menu ditemukan
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map(product => (
                                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="aspect-video relative">
                                        <img
                                            src={product.image ? `/images/menu/${product.image}` : '/api/placeholder/300/200'}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                        {product.stock <= 5 && product.stock > 0 && (
                                            <Badge 
                                                variant="secondary" 
                                                className="absolute top-2 right-2 text-orange-600 border-orange-200 bg-orange-50"
                                            >
                                                Stok tinggal {product.stock}
                                            </Badge>
                                        )}
                                        {product.stock === 0 && (
                                            <Badge 
                                                variant="destructive" 
                                                className="absolute top-2 right-2"
                                            >
                                                Habis
                                            </Badge>
                                        )}
                                    </div>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {product.description || 'Produk berkualitas tinggi dengan cita rasa yang lezat'}
                                        </p>
                                    </CardHeader>
                                    <CardFooter className="flex justify-between items-center pt-2">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-bold text-[#967259]">
                                                Rp {product.price.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <Button
                                            onClick={() => addToCart(product)}
                                            disabled={product.stock === 0}
                                            className="bg-[#967259] hover:bg-[#7D5A44] disabled:opacity-50"
                                        >
                                            {product.stock === 0 ? 'Habis' : 'Tambah'}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        /* No Results */
                        <div className="text-center py-12">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
                                <Coffee className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Tidak ada menu ditemukan</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchQuery 
                                    ? `Tidak ada menu yang cocok dengan pencarian "${searchQuery}"` 
                                    : 'Tidak ada menu dalam kategori ini'
                                }
                            </p>
                            <Button 
                                onClick={clearAllFilters}
                                variant="outline"
                                className="mt-2"
                            >
                                Lihat Semua Menu
                            </Button>
                        </div>
                    )}

                    {/* Floating Cart Button */}
                    {getTotalItems() > 0 && (
                        <Button
                            onClick={() => setShowCart(true)}
                            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#967259] hover:bg-[#7D5A44] shadow-lg z-50"
                            size="icon"
                        >
                            <ShoppingCart className="h-6 w-6" />
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500">
                                {getTotalItems()}
                            </Badge>
                        </Button>
                    )}

                    {/* Cart Dialog */}
                    <Dialog open={showCart} onOpenChange={setShowCart}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Keranjang Belanja</DialogTitle>
                            </DialogHeader>
                            <div className="max-h-96 overflow-y-auto">
                                {cart.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        Keranjang kosong
                                    </div>
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
                                                    <p className="text-sm text-muted-foreground">
                                                        Rp {item.product.price.toLocaleString('id-ID')}
                                                    </p>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <Button
                                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                            size="icon"
                                                            variant="outline"
                                                            className="h-8 w-8"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="min-w-8 text-center">{item.quantity}</span>
                                                        <Button
                                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                            size="icon"
                                                            variant="outline"
                                                            className="h-8 w-8"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">
                                                        Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                                                    </p>
                                                    <Button
                                                        onClick={() => removeFromCart(item.product.id)}
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-red-500 hover:text-red-700 mt-1"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {cart.length > 0 && (
                                <>
                                    <Separator />
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">Total:</span>
                                            <span className="font-bold text-lg text-[#967259]">
                                                Rp {getTotalPrice().toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <Button
                                            onClick={handleProceedToCheckout}
                                            className="w-full bg-[#967259] hover:bg-[#7D5A44]"
                                        >
                                            Lanjut ke Checkout
                                        </Button>
                                    </div>
                                </>
                            )}
                        </DialogContent>
                    </Dialog>

                    {/* Checkout Form Dialog */}
                    <Dialog open={showCheckoutForm} onOpenChange={setShowCheckoutForm}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Detail Pesanan</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmitOrder} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="customer_name">Nama Pelanggan *</Label>
                                    <Input
                                        id="customer_name"
                                        type="text"
                                        value={data.customer_name}
                                        onChange={(e) => setData('customer_name', e.target.value)}
                                        required
                                    />
                                    {errors.customer_name && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.customer_name}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="order_type">Tipe Pesanan *</Label>
                                    <Select value={data.order_type} onValueChange={(value) => setData('order_type', value as 'dine_in' | 'takeaway')}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="dine_in">Makan di Tempat</SelectItem>
                                            <SelectItem value="takeaway">Bawa Pulang</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {data.order_type === 'dine_in' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="table_number">Nomor Meja</Label>
                                        <Input
                                            id="table_number"
                                            type="text"
                                            value={data.table_number}
                                            onChange={(e) => setData('table_number', e.target.value)}
                                            placeholder="Contoh: A1, B5, dll"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Catatan Tambahan</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Permintaan khusus, alergi, dll..."
                                        rows={3}
                                    />
                                </div>

                                <Separator />
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Total Pesanan:</span>
                                        <span className="font-bold text-lg text-[#967259]">
                                            Rp {getTotalPrice().toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-[#967259] hover:bg-[#7D5A44]"
                                        >
                                            {processing ? 'Memproses Pesanan...' : 'Kirim ke Kasir'}
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => setShowCheckoutForm(false)}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Kembali
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Success Dialog */}
                    <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                        <DialogContent className="sm:max-w-md">
                            <div className="text-center space-y-4">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                    <Check className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">Pesanan Berhasil Dikirim!</h3>
                                    <p className="text-muted-foreground">
                                        Nomor Pesanan: <Badge className="bg-[#967259]">{orderNumber}</Badge>
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Pesanan Anda telah dikirim ke kasir dan akan segera diproses. 
                                        Silakan menunggu konfirmasi dari kasir.
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setShowSuccess(false)}
                                    className="w-full bg-[#967259] hover:bg-[#7D5A44]"
                                >
                                    Pesan Lagi
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </CustomerLayout>
    );
}
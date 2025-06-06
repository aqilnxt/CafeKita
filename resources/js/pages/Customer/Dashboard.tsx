import React from 'react';
import { Head } from '@inertiajs/react';
import CustomerLayout from '@/layouts/CustomerLayout';
import { Order, PageProps } from '@/types';
import { Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
    Coffee, 
    ShoppingBag, 
    User, 
    TrendingUp,
    Calendar,
    ArrowRight
} from 'lucide-react';

interface Props extends PageProps {
    recentOrders: Order[];
    stats: {
        total_orders: number;
        favorite_products: Array<{
            product: {
                id: number;
                name: string;
                price: number;
                image: string;
            };
            count: number;
        }>;
    };
}

export default function Dashboard({ auth, recentOrders, stats }: Props) {
    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'completed':
                return 'default';
            case 'processing':
                return 'secondary';
            case 'cancelled':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed':
                return 'Selesai';
            case 'processing':
                return 'Diproses';
            case 'cancelled':
                return 'Dibatalkan';
            case 'pending':
                return 'Menunggu';
            default:
                return status;
        }
    };

    return (
        <CustomerLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Selamat datang kembali, {auth.user.name}! Kelola pesanan dan jelajahi menu favorit Anda.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card className="relative overflow-hidden">
                        <CardHeader className="pb-3">
                            <div className="flex items-center space-x-2">
                                <Coffee className="h-5 w-5 text-amber-600" />
                                <CardTitle className="text-lg">Lihat Menu</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="mb-4">
                                Jelajahi menu kami yang lezat
                            </CardDescription>
                            <Button asChild size="sm" className="w-full">
                                <Link href={route('customer.menu')}>
                                    Lihat Menu
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden">
                        <CardHeader className="pb-3">
                            <div className="flex items-center space-x-2">
                                <ShoppingBag className="h-5 w-5 text-blue-600" />
                                <CardTitle className="text-lg">Pesanan Saya</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="mb-4">
                                Lihat status pesanan Anda
                            </CardDescription>
                            <Button asChild size="sm" variant="outline" className="w-full">
                                <Link href={route('customer.orders')}>
                                    Lihat Pesanan
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden">
                        <CardHeader className="pb-3">
                            <div className="flex items-center space-x-2">
                                <User className="h-5 w-5 text-green-600" />
                                <CardTitle className="text-lg">Profil Saya</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="mb-4">
                                Kelola informasi profil Anda
                            </CardDescription>
                            <Button asChild size="sm" variant="outline" className="w-full">
                                <Link href={route('customer.profile')}>
                                    Edit Profil
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Statistics */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="h-5 w-5 text-amber-600" />
                                <CardTitle>Statistik Pesanan</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-amber-600 mb-2">
                                {stats.total_orders}
                            </div>
                            <CardDescription>Total pesanan yang telah Anda buat</CardDescription>
                        </CardContent>
                    </Card>

                    {/* Favorite Products */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <Coffee className="h-5 w-5 text-amber-600" />
                                <CardTitle>Produk Favorit</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {stats.favorite_products.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.favorite_products.map((item) => (
                                        <div key={item.product.id} className="flex items-center space-x-3">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage
                                                    src={`/images/menu/${item.product.image}`}
                                                    alt={item.product.name}
                                                />
                                                <AvatarFallback>
                                                    {item.product.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {item.product.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Dipesan {item.count} kali
                                                </p>
                                            </div>
                                            <Badge variant="secondary" className="text-xs">
                                                #{item.count}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <Coffee className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                    <CardDescription>
                                        Belum ada produk favorit
                                    </CardDescription>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Orders */}
                <Card className="flex-1">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                <CardTitle>Pesanan Terakhir</CardTitle>
                            </div>
                            {recentOrders.length > 0 && (
                                <Button asChild variant="outline" size="sm">
                                    <Link href={route('customer.orders')}>
                                        Lihat Semua
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentOrders.length > 0 ? (
                            <div className="space-y-0">
                                {recentOrders.map((order, index) => (
                                    <div key={order.id}>
                                        <Link href={route('customer.orders.show', order.id)}>
                                            <div className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg transition-colors">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex flex-col space-y-1">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-medium text-amber-600">
                                                                Pesanan #{order.id}
                                                            </span>
                                                            <Badge variant={getStatusVariant(order.status)} className="text-xs">
                                                                {getStatusLabel(order.status)}
                                                            </Badge>
                                                        </div>
                                                        <span className="text-sm text-muted-foreground">
                                                            {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="text-right">
                                                        <div className="font-semibold">
                                                            Rp {(Number(order.total_amount) || 0).toLocaleString('id-ID')}
                                                        </div>
                                                    </div>
                                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            </div>
                                        </Link>
                                        {index < recentOrders.length - 1 && <Separator />}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <CardTitle className="mb-2">Belum ada pesanan</CardTitle>
                                <CardDescription className="mb-4">
                                    Mulai berbelanja untuk melihat pesanan Anda di sini
                                </CardDescription>
                                <Button asChild>
                                    <Link href={route('customer.menu')}>
                                        <Coffee className="mr-2 h-4 w-4" />
                                        Mulai Berbelanja
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </CustomerLayout>
    );
}
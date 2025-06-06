import React from 'react';
import { Head, Link } from '@inertiajs/react';
import KasirLayout from '@/layouts/KasirLayout';
import { ShoppingCartIcon, ClipboardDocumentListIcon, ChartBarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Props {
    auth: {
        user: any;
    };
    stats?: {
        todayTransactions: number;
        todayRevenue: number;
        pendingOrders: number;
        totalProducts: number;
    };
}

export default function Dashboard({ auth, stats }: Props) {
    const quickStats = [
        {
            title: "Transaksi Hari Ini",
            value: stats?.todayTransactions ?? 0,
            icon: ShoppingCartIcon,
            color: "bg-blue-500"
        },
        {
            title: "Pendapatan Hari Ini", 
            value: `Rp ${(stats?.todayRevenue ?? 0).toLocaleString('id-ID')}`,
            icon: CurrencyDollarIcon,
            color: "bg-green-500"
        },
        {
            title: "Pesanan Pending",
            value: stats?.pendingOrders ?? 0,
            icon: ClipboardDocumentListIcon,
            color: "bg-orange-500"
        },
        {
            title: "Total Produk",
            value: stats?.totalProducts ?? 0,
            icon: ChartBarIcon,
            color: "bg-purple-500"
        }
    ];

    return (
        <KasirLayout
            user={auth.user}
            header={<h2 className="font-semibold text-lg sm:text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />
            
            <div className="py-4 sm:py-8 lg:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
                    {/* Welcome Card */}
                    <Card>
                        <CardHeader className="pb-3 sm:pb-6">
                            <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800">
                                Selamat Datang, {auth.user.name}!
                            </CardTitle>
                            <CardDescription className="text-sm sm:text-base">
                                Kelola transaksi dan pesanan dengan mudah dari dashboard ini
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {quickStats.map((stat, index) => (
                            <Card key={index} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-3 sm:p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
                                        <div className={`p-2 sm:p-3 rounded-full ${stat.color} bg-opacity-10 w-fit`}>
                                            <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color.replace('bg-', 'text-')}`} />
                                        </div>
                                        <div className="sm:ml-4">
                                            <p className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">
                                                {stat.title}
                                            </p>
                                            <p className="text-lg sm:text-2xl font-bold text-gray-900 break-words">
                                                {stat.value}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader className="pb-3 sm:pb-6">
                            <CardTitle className="text-lg sm:text-xl">Aksi Cepat</CardTitle>
                            <CardDescription className="text-sm sm:text-base">
                                Akses fitur utama dengan cepat
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <Link href={route('kasir.transactions.create')}>
                                    <Button 
                                        variant="outline" 
                                        className="w-full h-auto p-4 sm:p-6 flex items-center justify-start space-x-3 sm:space-x-4 hover:bg-[#967259] hover:text-white hover:border-[#967259] transition-all"
                                    >
                                        <div className="p-2 sm:p-3 rounded-full bg-[#967259] bg-opacity-10 flex-shrink-0">
                                            <ShoppingCartIcon className="h-6 w-6 sm:h-8 sm:w-8 text-[#967259]" />
                                        </div>
                                        <div className="text-left min-w-0">
                                            <h3 className="text-base sm:text-lg font-medium">Transaksi Baru</h3>
                                            <p className="text-xs sm:text-sm opacity-75 break-words">
                                                Buat transaksi baru untuk pelanggan
                                            </p>
                                        </div>
                                    </Button>
                                </Link>

                                <Link href={route('kasir.orders.index')}>
                                    <Button 
                                        variant="outline" 
                                        className="w-full h-auto p-4 sm:p-6 flex items-center justify-start space-x-3 sm:space-x-4 hover:bg-[#967259] hover:text-white hover:border-[#967259] transition-all"
                                    >
                                        <div className="p-2 sm:p-3 rounded-full bg-[#967259] bg-opacity-10 flex-shrink-0">
                                            <ClipboardDocumentListIcon className="h-6 w-6 sm:h-8 sm:w-8 text-[#967259]" />
                                        </div>
                                        <div className="text-left min-w-0">
                                            <h3 className="text-base sm:text-lg font-medium">Daftar Pesanan</h3>
                                            <p className="text-xs sm:text-sm opacity-75 break-words">
                                                Lihat dan kelola pesanan pelanggan
                                            </p>
                                        </div>
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader className="pb-3 sm:pb-6">
                            <CardTitle className="text-lg sm:text-xl">Aktivitas Terbaru</CardTitle>
                            <CardDescription className="text-sm sm:text-base">
                                Ringkasan aktivitas sistem hari ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                        <span className="text-sm break-words">Sistem berjalan normal</span>
                                    </div>
                                    <Badge variant="secondary" className="bg-green-100 text-green-800 ml-2 flex-shrink-0">
                                        Online
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                        <span className="text-sm break-words">Real-time updates aktif</span>
                                    </div>
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 ml-2 flex-shrink-0">
                                        Aktif
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                                        <span className="text-sm break-words">Sinkronisasi data</span>
                                    </div>
                                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 ml-2 flex-shrink-0">
                                        Proses
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </KasirLayout>
    );
}
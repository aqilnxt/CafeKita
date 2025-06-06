import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { PageProps } from '@/types';
import { Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    DollarSign, 
    Package, 
    Tag, 
    ShoppingCart, 
    Users, 
    Plus,
    BarChart3,
    TrendingUp,
    Calendar
} from 'lucide-react';

interface Props extends PageProps {
    stats: {
        totalProducts: number;
        totalCategories: number;
        totalTransactions: number;
        totalCashiers: number;
        todayRevenue: number;
        monthlyRevenue: number;
    };
}

export default function Dashboard({ auth, stats }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const revenueCards = [
        {
            title: 'Pendapatan Hari Ini',
            value: formatCurrency(stats.todayRevenue),
            icon: Calendar,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-950/50',
            iconColor: 'text-blue-600',
        },
        {
            title: 'Pendapatan Bulan Ini',
            value: formatCurrency(stats.monthlyRevenue),
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-950/50',
            iconColor: 'text-green-600',
        },
    ];

    const statsCards = [
        {
            title: 'Total Produk',
            value: stats.totalProducts.toLocaleString(),
            icon: Package,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-950/50',
        },
        {
            title: 'Total Kategori',
            value: stats.totalCategories.toLocaleString(),
            icon: Tag,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50 dark:bg-amber-950/50',
        },
        {
            title: 'Total Transaksi',
            value: stats.totalTransactions.toLocaleString(),
            icon: ShoppingCart,
            color: 'text-red-600',
            bgColor: 'bg-red-50 dark:bg-red-950/50',
        },
        {
            title: 'Total Kasir',
            value: stats.totalCashiers.toLocaleString(),
            icon: Users,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50 dark:bg-indigo-950/50',
        },
    ];

    const quickActions = [
        {
            title: 'Tambah Produk',
            href: 'admin.products.create',
            icon: Package,
            variant: 'default' as const,
        },
        {
            title: 'Tambah Kategori',
            href: 'admin.categories.create',
            icon: Tag,
            variant: 'secondary' as const,
        },
        {
            title: 'Tambah Kasir',
            href: 'admin.cashiers.create',
            icon: Users,
            variant: 'outline' as const,
        },
        {
            title: 'Lihat Laporan',
            href: 'admin.reports.sales',
            icon: BarChart3,
            variant: 'ghost' as const,
        },
    ];

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex items-center space-x-2">
                    <h2 className="font-semibold text-xl text-foreground">Dashboard</h2>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Revenue Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {revenueCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <Card key={card.title} className="relative overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {card.title}
                                    </CardTitle>
                                    <div className={`p-2 rounded-md ${card.bgColor}`}>
                                        <Icon className={`h-4 w-4 ${card.iconColor}`} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-2xl font-bold ${card.color}`}>
                                        {card.value}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Stats Cards */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <BarChart3 className="h-5 w-5" />
                            <span>Statistik Sistem</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {statsCards.map((stat) => {
                                const Icon = stat.icon;
                                return (
                                    <div 
                                        key={stat.title}
                                        className={`p-4 rounded-lg ${stat.bgColor} border border-border/50`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <Icon className={`h-5 w-5 ${stat.color}`} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">
                                                {stat.title}
                                            </p>
                                            <p className={`text-2xl font-bold ${stat.color}`}>
                                                {stat.value}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Plus className="h-5 w-5" />
                            <span>Aksi Cepat</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {quickActions.map((action) => {
                                const Icon = action.icon;
                                return (
                                    <Button
                                        key={action.title}
                                        asChild
                                        variant={action.variant}
                                        className="h-auto p-4 flex-col space-y-2 hover:scale-105 transition-transform"
                                    >
                                        <Link href={route(action.href)}>
                                            <Icon className="h-6 w-6" />
                                            <span className="text-sm font-medium text-center">
                                                {action.title}
                                            </span>
                                        </Link>
                                    </Button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-base">
                                <DollarSign className="h-5 w-5 text-green-600" />
                                <span>Ringkasan Pendapatan</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                <span className="text-sm text-muted-foreground">Rata-rata per hari</span>
                                <span className="font-semibold">
                                    {formatCurrency(stats.monthlyRevenue / 30)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                <span className="text-sm text-muted-foreground">Target bulan ini</span>
                                <span className="font-semibold text-amber-600">
                                    {formatCurrency(stats.monthlyRevenue * 1.2)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-base">
                                <Package className="h-5 w-5 text-blue-600" />
                                <span>Ringkasan Data</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                <span className="text-sm text-muted-foreground">Produk per kategori</span>
                                <span className="font-semibold">
                                    {stats.totalCategories > 0 
                                        ? Math.round(stats.totalProducts / stats.totalCategories)
                                        : 0
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                <span className="text-sm text-muted-foreground">Transaksi per kasir</span>
                                <span className="font-semibold">
                                    {stats.totalCashiers > 0 
                                        ? Math.round(stats.totalTransactions / stats.totalCashiers)
                                        : 0
                                    }
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
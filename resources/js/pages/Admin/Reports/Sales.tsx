import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { PageProps } from '@/types';
import {
    ArrowUpIcon,
    ArrowDownIcon,
    CurrencyDollarIcon,
    ShoppingCartIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type SalesData = {
    date: string;
    total_sales: number;
    total_orders: number;
    average_order_value: number;
};

type Props = PageProps & {
    salesData: SalesData[];
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    growthRate: number;
};

export default function Sales({ auth, salesData, totalRevenue, totalOrders, averageOrderValue, growthRate }: Props) {
    const [dateRange, setDateRange] = useState('week');

    const stats = [
        {
            name: 'Total Pendapatan',
            value: `Rp ${totalRevenue.toLocaleString('id-ID')}`,
            change: `${growthRate}%`,
            changeType: growthRate >= 0 ? 'increase' : 'decrease',
            icon: CurrencyDollarIcon,
        },
        {
            name: 'Total Pesanan',
            value: totalOrders.toLocaleString('id-ID'),
            change: `${growthRate}%`,
            changeType: growthRate >= 0 ? 'increase' : 'decrease',
            icon: ShoppingCartIcon,
        },
        {
            name: 'Rata-rata Nilai Pesanan',
            value: `Rp ${averageOrderValue.toLocaleString('id-ID')}`,
            change: `${growthRate}%`,
            changeType: growthRate >= 0 ? 'increase' : 'decrease',
            icon: ChartBarIcon,
        },
    ];

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight px-4 sm:px-0">
                    Laporan Penjualan
                </h2>
            }
        >
            <Head title="Laporan Penjualan" />

            <div className="space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
                            <div className="space-y-1">
                                <CardTitle className="text-lg sm:text-xl">Ringkasan Penjualan</CardTitle>
                                <CardDescription className="text-sm sm:text-base">
                                    Analisis performa penjualan berdasarkan periode waktu
                                </CardDescription>
                            </div>
                            <Select value={dateRange} onValueChange={setDateRange}>
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="Pilih periode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="today">Hari Ini</SelectItem>
                                    <SelectItem value="week">Minggu Ini</SelectItem>
                                    <SelectItem value="month">Bulan Ini</SelectItem>
                                    <SelectItem value="year">Tahun Ini</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {stats.map((item) => (
                        <Card key={item.name} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex items-start justify-between space-x-4">
                                    <div className="flex items-start space-x-3 sm:space-x-4 min-w-0 flex-1">
                                        <div className="p-2 sm:p-3 bg-[#967259] rounded-lg flex-shrink-0">
                                            <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" aria-hidden="true" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                                                {item.name}
                                            </p>
                                            <p className="text-lg sm:text-2xl font-bold text-foreground break-all">
                                                {item.value}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 sm:mt-4 flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0">
                                    <Badge 
                                        variant={item.changeType === 'increase' ? 'default' : 'destructive'}
                                        className="flex items-center space-x-1 w-fit"
                                    >
                                        {item.changeType === 'increase' ? (
                                            <ArrowUpIcon className="h-3 w-3" />
                                        ) : (
                                            <ArrowDownIcon className="h-3 w-3" />
                                        )}
                                        <span className="text-xs">{item.change}</span>
                                    </Badge>
                                    <span className="text-xs sm:text-sm text-muted-foreground sm:ml-2">
                                        {item.changeType === 'increase' ? 'naik' : 'turun'} dari periode sebelumnya
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Sales Detail Table */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg sm:text-xl">Detail Penjualan</CardTitle>
                        <CardDescription className="text-sm sm:text-base">
                            Rincian data penjualan harian dalam periode yang dipilih
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0 sm:px-6">
                        {/* Mobile View - Card Layout */}
                        <div className="block sm:hidden space-y-4 px-4">
                            {salesData.length > 0 ? (
                                salesData.map((data, index) => (
                                    <Card key={index} className="p-4">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {new Date(data.date).toLocaleDateString('id-ID', {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <Badge variant="outline" className="text-xs">
                                                    {data.total_orders} pesanan
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-muted-foreground text-xs">Total Penjualan</p>
                                                    <p className="font-semibold text-green-600">
                                                        Rp {data.total_sales.toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground text-xs">Rata-rata Nilai</p>
                                                    <p className="font-medium">
                                                        Rp {data.average_order_value.toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center text-muted-foreground py-8">
                                    <p className="text-sm">Tidak ada data penjualan untuk periode ini</p>
                                </div>
                            )}
                        </div>

                        {/* Desktop/Tablet View - Table Layout */}
                        <div className="hidden sm:block">
                            <div className="rounded-md border overflow-hidden">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="min-w-[140px]">Tanggal</TableHead>
                                                <TableHead className="min-w-[140px]">Total Penjualan</TableHead>
                                                <TableHead className="min-w-[120px]">Jumlah Pesanan</TableHead>
                                                <TableHead className="min-w-[140px]">Rata-rata Nilai Pesanan</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {salesData.length > 0 ? (
                                                salesData.map((data, index) => (
                                                    <TableRow key={index} className="hover:bg-muted/50">
                                                        <TableCell className="font-medium">
                                                            {new Date(data.date).toLocaleDateString('id-ID', {
                                                                weekday: 'short',
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </TableCell>
                                                        <TableCell className="font-semibold text-green-600">
                                                            Rp {data.total_sales.toLocaleString('id-ID')}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">
                                                                {data.total_orders} pesanan
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            Rp {data.average_order_value.toLocaleString('id-ID')}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                                        Tidak ada data penjualan untuk periode ini
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
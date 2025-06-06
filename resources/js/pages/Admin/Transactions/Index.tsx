import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { PageProps } from '@/types';
import {
    MagnifyingGlassIcon,
    EyeIcon,
    PrinterIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Transaction = {
    id: number;
    order_number: string;
    total_amount: number;
    status: string;
    created_at: string;
    cashier: {
        name: string;
    };
    items: {
        id: number;
        product: {
            name: string;
            price: number;
        };
        quantity: number;
    }[];
};

type Props = PageProps & {
    transactions: Transaction[];
};

export default function Index({ auth, transactions }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState('all');

    const filteredTransactions = transactions.filter(transaction =>
        transaction.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.cashier.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'pending':
                return 'secondary';
            case 'completed':
                return 'default';
            case 'cancelled':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <ClockIcon className="h-3 w-3" />;
            case 'completed':
                return <CheckCircleIcon className="h-3 w-3" />;
            case 'cancelled':
                return <XCircleIcon className="h-3 w-3" />;
            default:
                return null;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Menunggu';
            case 'completed':
                return 'Selesai';
            case 'cancelled':
                return 'Dibatalkan';
            default:
                return status;
        }
    };

    const handleExport = () => {
        // Implementasi ekspor ke Excel
        console.log('Exporting to Excel...');
    };

    const totalTransactions = filteredTransactions.length;
    const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.total_amount, 0);
    const completedTransactions = filteredTransactions.filter(t => t.status === 'completed').length;

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Transaksi</h2>}
        >
            <Head title="Transaksi" />

            <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Transaksi</p>
                                    <p className="text-2xl font-bold">{totalTransactions}</p>
                                </div>
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <MagnifyingGlassIcon className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Transaksi Selesai</p>
                                    <p className="text-2xl font-bold">{completedTransactions}</p>
                                </div>
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Nilai</p>
                                    <p className="text-2xl font-bold">Rp {totalAmount.toLocaleString('id-ID')}</p>
                                </div>
                                <div className="p-2 bg-[#967259]/10 rounded-lg">
                                    <ArrowDownTrayIcon className="h-6 w-6 text-[#967259]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Table Card */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <CardTitle>Daftar Transaksi</CardTitle>
                                <CardDescription>
                                    Kelola dan pantau semua transaksi yang terjadi
                                </CardDescription>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <div className="relative min-w-0 sm:min-w-[300px]">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Cari nomor pesanan atau kasir..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Select value={dateRange} onValueChange={setDateRange}>
                                    <SelectTrigger className="w-full sm:w-48">
                                        <SelectValue placeholder="Pilih periode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Waktu</SelectItem>
                                        <SelectItem value="today">Hari Ini</SelectItem>
                                        <SelectItem value="week">Minggu Ini</SelectItem>
                                        <SelectItem value="month">Bulan Ini</SelectItem>
                                        <SelectItem value="year">Tahun Ini</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleExport} className="bg-[#967259] hover:bg-[#7D5A44]">
                                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                                    Export Excel
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No. Pesanan</TableHead>
                                        <TableHead>Kasir</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Waktu</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTransactions.length > 0 ? (
                                        filteredTransactions.map((transaction) => (
                                            <TableRow key={transaction.id} className="hover:bg-muted/50">
                                                <TableCell className="font-medium">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold">{transaction.order_number}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {transaction.items.length} item(s)
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-8 h-8 bg-[#967259]/10 rounded-full flex items-center justify-center">
                                                            <span className="text-xs font-semibold text-[#967259]">
                                                                {transaction.cashier.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <span className="font-medium">{transaction.cashier.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant={getStatusVariant(transaction.status)}
                                                        className="flex items-center gap-1 w-fit"
                                                    >
                                                        {getStatusIcon(transaction.status)}
                                                        {getStatusLabel(transaction.status)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-semibold text-green-600">
                                                        Rp {transaction.total_amount.toLocaleString('id-ID')}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm">
                                                            {new Date(transaction.created_at).toLocaleDateString('id-ID')}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(transaction.created_at).toLocaleTimeString('id-ID', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <TooltipProvider>
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        asChild
                                                                        className="h-8 w-8 p-0"
                                                                    >
                                                                        <Link href={`/admin/transactions/${transaction.id}`}>
                                                                            <EyeIcon className="h-4 w-4" />
                                                                        </Link>
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Lihat Detail</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                            
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => window.print()}
                                                                        className="h-8 w-8 p-0"
                                                                    >
                                                                        <PrinterIcon className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Print Receipt</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </div>
                                                    </TooltipProvider>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8">
                                                <div className="flex flex-col items-center space-y-2">
                                                    <MagnifyingGlassIcon className="h-8 w-8 text-muted-foreground" />
                                                    <p className="text-muted-foreground">
                                                        {searchTerm ? 'Tidak ada transaksi yang ditemukan' : 'Belum ada transaksi'}
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
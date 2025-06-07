import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { PageProps } from '@/types';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    UserCircleIcon,
    PhoneIcon,
    EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type Cashier = {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive';
    last_login: string;
};

type Props = PageProps & {
    cashiers: Cashier[];
};

export default function Index({ auth, cashiers }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCashiers = cashiers.filter(cashier =>
        cashier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cashier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cashier.phone.includes(searchTerm)
    );

    const handleDelete = (id: number) => {
        router.delete(`/admin/cashiers/${id}`);
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Kasir</h2>}
        >
            <Head title="Kasir" />

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <Card>
                    <CardHeader className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <CardTitle className="text-lg sm:text-xl">Manajemen Kasir</CardTitle>
                            <Button asChild className="bg-[#967259] hover:bg-[#7D5A44] w-full sm:w-auto">
                                <Link href={route('admin.cashiers.create')}>
                                    <PlusIcon className="h-4 w-4 mr-2" />
                                    <span className="hidden xs:inline">Tambah </span>Kasir
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                        {/* Search Bar */}
                        <div className="mb-4 sm:mb-6">
                            <div className="relative w-full sm:max-w-sm">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Cari kasir..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden lg:block rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kasir</TableHead>
                                        <TableHead>Kontak</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Login Terakhir</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCashiers.length > 0 ? (
                                        filteredCashiers.map((cashier) => (
                                            <TableRow key={cashier.id} className="hover:bg-muted/50">
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <UserCircleIcon className="h-8 w-8 text-muted-foreground" />
                                                        <div>
                                                            <div className="font-medium">{cashier.name}</div>
                                                            <div className="text-sm text-muted-foreground">{cashier.email}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{cashier.phone}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={cashier.status === 'active' ? 'default' : 'secondary'}
                                                        className={cashier.status === 'active'
                                                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                                            : 'bg-red-100 text-red-800 hover:bg-red-100'
                                                        }
                                                    >
                                                        {cashier.status === 'active' ? 'Aktif' : 'Nonaktif'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(cashier.last_login).toLocaleString('id-ID')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            asChild
                                                            className="text-[#967259] hover:text-[#7D5A44] hover:bg-[#967259]/10"
                                                        >
                                                            <Link href={`/admin/cashiers/${cashier.id}/edit`}>
                                                                <PencilIcon className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-red-600 hover:text-red-900 hover:bg-red-50"
                                                                >
                                                                    <TrashIcon className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Apakah Anda yakin ingin menghapus kasir ini? Tindakan ini tidak dapat dibatalkan.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDelete(cashier.id)}
                                                                        className="bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Hapus
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8">
                                                <div className="flex flex-col items-center space-y-2">
                                                    <UserCircleIcon className="h-12 w-12 text-muted-foreground" />
                                                    <p className="text-muted-foreground">
                                                        {searchTerm ? 'Tidak ada kasir yang ditemukan.' : 'Belum ada data kasir.'}
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden space-y-3">
                            {filteredCashiers.length > 0 ? (
                                filteredCashiers.map((cashier) => (
                                    <Card key={cashier.id} className="shadow-sm hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="space-y-3">
                                                {/* Header Row */}
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                                                        <div className="flex-shrink-0">
                                                            <UserCircleIcon className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="font-medium text-sm sm:text-base truncate">
                                                                {cashier.name}
                                                            </h3>
                                                            <Badge
                                                                variant={cashier.status === 'active' ? 'default' : 'secondary'}
                                                                className={`text-xs mt-1 ${cashier.status === 'active'
                                                                    ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                                                    : 'bg-red-100 text-red-800 hover:bg-red-100'
                                                                }`}
                                                            >
                                                                {cashier.status === 'active' ? 'Aktif' : 'Nonaktif'}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-1 ml-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            asChild
                                                            className="h-8 w-8 p-0 text-[#967259] hover:text-[#7D5A44] hover:bg-[#967259]/10"
                                                        >
                                                            <Link href={`/admin/cashiers/${cashier.id}/edit`}>
                                                                <PencilIcon className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-900 hover:bg-red-50"
                                                                >
                                                                    <TrashIcon className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent className="sm:max-w-md">
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle className="text-base sm:text-lg">
                                                                        Konfirmasi Hapus
                                                                    </AlertDialogTitle>
                                                                    <AlertDialogDescription className="text-sm">
                                                                        Apakah Anda yakin ingin menghapus kasir ini? Tindakan ini tidak dapat dibatalkan.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                                                                    <AlertDialogCancel className="w-full sm:w-auto">
                                                                        Batal
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDelete(cashier.id)}
                                                                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Hapus
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </div>

                                                {/* Contact Information */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center space-x-2 text-sm">
                                                        <EnvelopeIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                        <span className="text-muted-foreground truncate">
                                                            {cashier.email}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-sm">
                                                        <PhoneIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                        <span className="text-muted-foreground">
                                                            {cashier.phone}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Last Login */}
                                                <div className="pt-2 border-t">
                                                    <p className="text-xs text-muted-foreground">
                                                        Login terakhir: {new Date(cashier.last_login).toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <UserCircleIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground text-sm">
                                        {searchTerm ? 'Tidak ada kasir yang ditemukan.' : 'Belum ada data kasir.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
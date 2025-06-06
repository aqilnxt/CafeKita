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

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Manajemen Kasir</CardTitle>
                        <Button asChild className="bg-[#967259] hover:bg-[#7D5A44]">
                            <Link href={route('admin.cashiers.create')}>
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Tambah Kasir
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <div className="relative max-w-sm">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Cari kasir..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <div className="rounded-md border">
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
                                {filteredCashiers.map((cashier) => (
                                    <TableRow key={cashier.id}>
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
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {filteredCashiers.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            {searchTerm ? 'Tidak ada kasir yang ditemukan.' : 'Belum ada data kasir.'}
                        </div>
                    )}
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
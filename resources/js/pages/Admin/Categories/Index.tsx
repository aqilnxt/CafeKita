import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { PageProps } from '@/types';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

type Category = {
    id: number;
    name: string;
    description: string;
    product_count: number;
};

type Props = PageProps & {
    categories: Category[];
};

export default function Index({ auth, categories }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id: number) => {
        router.delete(`/admin/categories/${id}`);
    };

    const handleDeleteAll = () => {
        router.delete('/admin/categories/delete-all', {
            onSuccess: () => {
                router.reload();
            },
            onError: (errors) => {
                alert('Terjadi kesalahan saat menghapus kategori');
            }
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Kategori</h2>}
        >
            <Head title="Kategori" />

            <div className="p-4 sm:p-6 lg:p-8">
                <Card className="w-full">
                    <CardHeader className="px-4 sm:px-6">
                        <CardTitle className="text-lg sm:text-xl">Manajemen Kategori</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6">
                        {/* Search and Actions - Responsive Layout */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            {/* Search Input */}
                            <div className="flex-1 w-full sm:max-w-sm">
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        className="pl-10 w-full"
                                        placeholder="Cari kategori..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                           
                            {/* Action Buttons - Stack on mobile, inline on desktop */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:ml-auto">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                                            <TrashIcon className="h-4 w-4 mr-2" />
                                            <span className="hidden sm:inline">Hapus Semua</span>
                                            <span className="sm:hidden">Hapus Semua</span>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="mx-4 sm:mx-0">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Hapus Semua Kategori</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Apakah Anda yakin ingin menghapus SEMUA kategori? Tindakan ini tidak dapat dibatalkan!
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                            <AlertDialogCancel className="w-full sm:w-auto">Batal</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDeleteAll} className="w-full sm:w-auto">
                                                Hapus Semua
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                               
                                <Button asChild className="w-full sm:w-auto">
                                    <Link href={route('admin.categories.create')}>
                                        <PlusIcon className="h-4 w-4 mr-2" />
                                        <span className="hidden sm:inline">Tambah Kategori</span>
                                        <span className="sm:hidden">Tambah</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="block sm:hidden space-y-4">
                            {filteredCategories.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                    {searchTerm ? 'Tidak ada kategori yang sesuai dengan pencarian' : 'Belum ada kategori'}
                                </div>
                            ) : (
                                filteredCategories.map((category) => (
                                    <Card key={category.id} className="border">
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-base truncate">{category.name}</h3>
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{category.description}</p>
                                                </div>
                                                <div className="flex gap-2 ml-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Link href={`/admin/categories/${category.id}/edit`}>
                                                            <PencilIcon className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                            >
                                                                <TrashIcon className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="mx-4">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Hapus Kategori</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Apakah Anda yakin ingin menghapus kategori "{category.name}"? Tindakan ini tidak dapat dibatalkan.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                                                <AlertDialogCancel className="w-full sm:w-auto">Batal</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(category.id)}
                                                                    className="w-full sm:w-auto"
                                                                >
                                                                    Hapus
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded inline-block">
                                                {category.product_count} produk
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden sm:block rounded-md border overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="min-w-[150px]">Nama Kategori</TableHead>
                                            <TableHead className="min-w-[200px] hidden md:table-cell">Deskripsi</TableHead>
                                            <TableHead className="min-w-[120px]">Jumlah Produk</TableHead>
                                            <TableHead className="text-right min-w-[100px]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredCategories.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                                                    {searchTerm ? 'Tidak ada kategori yang sesuai dengan pencarian' : 'Belum ada kategori'}
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredCategories.map((category) => (
                                                <TableRow key={category.id}>
                                                    <TableCell className="font-medium">
                                                        <div className="truncate max-w-[200px]" title={category.name}>
                                                            {category.name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        <div className="truncate max-w-[300px]" title={category.description}>
                                                            {category.description}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{category.product_count}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end space-x-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                asChild
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <Link href={`/admin/categories/${category.id}/edit`}>
                                                                    <PencilIcon className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                                    >
                                                                        <TrashIcon className="h-4 w-4" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Hapus Kategori</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Apakah Anda yakin ingin menghapus kategori "{category.name}"? Tindakan ini tidak dapat dibatalkan.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() => handleDelete(category.id)}
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
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
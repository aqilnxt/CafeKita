import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import {
    Plus,
    Download,
    Edit,
    Trash2,
    Search,
    MoreVertical,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Product = {
    id: number;
    name: string;
    price: number;
    formatted_price: string;
    stock: number;
    category: {
        name: string;
    };
    image: string;
    description: string;
};

type Props = PageProps & {
    products: Product[];
};

export default function Index({ auth, products }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id: number) => {
        router.delete(`/admin/products/${id}`);
    };

    const getStockVariant = (stock: number) => {
        if (stock === 0) return 'destructive';
        if (stock < 10) return 'secondary';
        return 'default';
    };

    const getStockText = (stock: number) => {
        if (stock === 0) return 'Habis';
        if (stock < 10) return 'Terbatas';
        return 'Tersedia';
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Produk</h2>}
        >
            <Head title="Produk" />

            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div>
                                <CardTitle>Daftar Produk</CardTitle>
                                <CardDescription>
                                    Kelola semua produk yang tersedia di toko Anda
                                </CardDescription>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Button variant="outline" asChild className="w-full sm:w-auto">
                                    <Link href={route('admin.products.import')}>
                                        <Download className="w-4 h-4 mr-2" />
                                        <span className="hidden sm:inline">Import Excel</span>
                                        <span className="sm:hidden">Import</span>
                                    </Link>
                                </Button>
                                <Button asChild className="w-full sm:w-auto">
                                    <Link href={route('admin.products.create')}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        <span className="hidden sm:inline">Tambah Produk</span>
                                        <span className="sm:hidden">Tambah</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6">
                            <div className="relative w-full sm:max-w-sm">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    type="text"
                                    placeholder="Cari produk..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden lg:block rounded-md border overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="min-w-[280px]">Produk</TableHead>
                                            <TableHead className="min-w-[100px]">Kategori</TableHead>
                                            <TableHead className="min-w-[120px]">Harga</TableHead>
                                            <TableHead className="min-w-[120px]">Stok</TableHead>
                                            <TableHead className="text-right min-w-[100px]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredProducts.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-8">
                                                    <div className="text-gray-500">
                                                        {searchTerm ? 'Tidak ada produk yang ditemukan.' : 'Belum ada produk.'}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredProducts.map((product) => (
                                                <TableRow key={product.id}>
                                                    <TableCell className="min-w-[280px]">
                                                        <div className="flex items-center space-x-3">
                                                            <Avatar className="w-12 h-12 flex-shrink-0">
                                                                <AvatarImage 
                                                                    src={`/images/menu/${product.image}`} 
                                                                    alt={product.name}
                                                                />
                                                                <AvatarFallback>
                                                                    {product.name.substring(0, 2).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="min-w-0 flex-1">
                                                                <div className="font-medium text-gray-900 truncate">
                                                                    {product.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500 truncate">
                                                                    {product.description}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="min-w-[100px]">
                                                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                                                            {product.category.name}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-medium min-w-[120px] whitespace-nowrap">
                                                        {product.formatted_price || `Rp ${product.price.toLocaleString('id-ID')}`}
                                                    </TableCell>
                                                    <TableCell className="min-w-[120px]">
                                                        <div className="flex items-center space-x-2">
                                                            <Badge variant={getStockVariant(product.stock)} className="text-xs whitespace-nowrap">
                                                                {getStockText(product.stock)}
                                                            </Badge>
                                                            <span className="text-sm text-gray-500 whitespace-nowrap">
                                                                ({product.stock})
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right min-w-[100px]">
                                                        <div className="flex justify-end space-x-1">
                                                            <Button variant="ghost" size="sm" asChild>
                                                                <Link href={`/admin/products/${product.id}/edit`}>
                                                                    <Edit className="w-4 h-4" />
                                                                </Link>
                                                            </Button>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button variant="ghost" size="sm">
                                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent className="max-w-md">
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
                                                                        <AlertDialogDescription className="break-words">
                                                                            Apakah Anda yakin ingin menghapus produk "{product.name}"? 
                                                                            Tindakan ini tidak dapat dibatalkan.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                        <AlertDialogAction 
                                                                            onClick={() => handleDelete(product.id)}
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
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Tablet Layout */}
                        <div className="hidden md:block lg:hidden space-y-4">
                            {filteredProducts.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-500">
                                        {searchTerm ? 'Tidak ada produk yang ditemukan.' : 'Belum ada produk.'}
                                    </div>
                                </div>
                            ) : (
                                filteredProducts.map((product) => (
                                    <Card key={product.id}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4 min-w-0 flex-1">
                                                    <Avatar className="w-16 h-16 flex-shrink-0">
                                                        <AvatarImage 
                                                            src={`/images/menu/${product.image}`} 
                                                            alt={product.name}
                                                        />
                                                        <AvatarFallback>
                                                            {product.name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-medium text-gray-900 truncate">
                                                            {product.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 truncate mt-1">
                                                            {product.description}
                                                        </p>
                                                        <div className="flex items-center space-x-2 mt-2">
                                                            <Badge variant="outline" className="text-xs">
                                                                {product.category.name}
                                                            </Badge>
                                                            <Badge variant={getStockVariant(product.stock)} className="text-xs">
                                                                {getStockText(product.stock)} ({product.stock})
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3 flex-shrink-0">
                                                    <div className="text-right">
                                                        <div className="font-medium text-sm whitespace-nowrap">
                                                            {product.formatted_price || `Rp ${product.price.toLocaleString('id-ID')}`}
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-1">
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <Link href={`/admin/products/${product.id}/edit`}>
                                                                <Edit className="w-4 h-4" />
                                                            </Link>
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="ghost" size="sm">
                                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent className="max-w-md">
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
                                                                    <AlertDialogDescription className="break-words">
                                                                        Apakah Anda yakin ingin menghapus produk "{product.name}"? 
                                                                        Tindakan ini tidak dapat dibatalkan.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                    <AlertDialogAction 
                                                                        onClick={() => handleDelete(product.id)}
                                                                        className="bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Hapus
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>

                        {/* Mobile Card Layout */}
                        <div className="md:hidden space-y-3">
                            {filteredProducts.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-500 text-sm">
                                        {searchTerm ? 'Tidak ada produk yang ditemukan.' : 'Belum ada produk.'}
                                    </div>
                                </div>
                            ) : (
                                filteredProducts.map((product) => (
                                    <Card key={product.id} className="overflow-hidden">
                                        <CardContent className="p-3">
                                            <div className="flex items-start space-x-3">
                                                <Avatar className="w-12 h-12 flex-shrink-0">
                                                    <AvatarImage 
                                                        src={`/images/menu/${product.image}`} 
                                                        alt={product.name}
                                                    />
                                                    <AvatarFallback className="text-xs">
                                                        {product.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-medium text-gray-900 text-sm truncate">
                                                                {product.name}
                                                            </h3>
                                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2 break-words">
                                                                {product.description}
                                                            </p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                        <MoreVertical className="w-4 h-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-32">
                                                                    <DropdownMenuItem asChild>
                                                                        <Link href={`/admin/products/${product.id}/edit`} className="text-xs">
                                                                            <Edit className="w-3 h-3 mr-2" />
                                                                            Edit
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger asChild>
                                                                            <DropdownMenuItem 
                                                                                onSelect={(e) => e.preventDefault()}
                                                                                className="text-red-600 focus:text-red-600 text-xs"
                                                                            >
                                                                                <Trash2 className="w-3 h-3 mr-2" />
                                                                                Hapus
                                                                            </DropdownMenuItem>
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle className="text-base">Hapus Produk</AlertDialogTitle>
                                                                                <AlertDialogDescription className="text-sm break-words">
                                                                                    Apakah Anda yakin ingin menghapus produk "{product.name}"? 
                                                                                    Tindakan ini tidak dapat dibatalkan.
                                                                                </AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                                                                <AlertDialogCancel className="w-full sm:w-auto">Batal</AlertDialogCancel>
                                                                                <AlertDialogAction 
                                                                                    onClick={() => handleDelete(product.id)}
                                                                                    className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                                                                                >
                                                                                    Hapus
                                                                                </AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 space-y-2">
                                                        <div className="flex flex-wrap items-center gap-1">
                                                            <Badge variant="outline" className="text-xs px-2 py-0.5 truncate max-w-[120px]">
                                                                {product.category.name}
                                                            </Badge>
                                                            <Badge variant={getStockVariant(product.stock)} className="text-xs px-2 py-0.5 whitespace-nowrap">
                                                                {getStockText(product.stock)}
                                                            </Badge>
                                                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                                                ({product.stock})
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <div className="font-medium text-sm text-gray-900 truncate">
                                                                {product.formatted_price || `Rp ${product.price.toLocaleString('id-ID')}`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
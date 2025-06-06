import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';

type Category = {
    id: number;
    name: string;
};

type Product = {
    id: number;
    name: string;
    price: number;
    category_id: number;
    description: string;
    stock: number;
    image: string;
};

type Props = PageProps & {
    product: Product;
    categories: Category[];
};

export default function Edit({ auth, product, categories }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: product?.name || '',
        price: product?.price?.toString() || '',
        category_id: product?.category_id?.toString() || '',
        description: product?.description || '',
        stock: product?.stock?.toString() || '',
        image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.products.update', product.id), {
            onSuccess: () => {
                window.location.href = route('admin.products.index');
            },
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('image', e.target.files[0]);
        }
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Edit Produk - Admin" />
            
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold">Edit Produk</CardTitle>
                        <Button variant="outline" asChild>
                            <Link href={route('admin.products.index')}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Kembali
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Produk</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={errors.name ? 'border-red-500' : ''}
                                    required
                                />
                                {errors.name && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.name}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Harga</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className={errors.price ? 'border-red-500' : ''}
                                    required
                                    min="0"
                                />
                                {errors.price && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.price}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category_id">Kategori</Label>
                                <Select 
                                    value={data.category_id} 
                                    onValueChange={(value) => setData('category_id', value)}
                                >
                                    <SelectTrigger className={errors.category_id ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Pilih Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category_id && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.category_id}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stock">Stok</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    value={data.stock}
                                    onChange={(e) => setData('stock', e.target.value)}
                                    className={errors.stock ? 'border-red-500' : ''}
                                    required
                                    min="0"
                                />
                                {errors.stock && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.stock}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className={errors.description ? 'border-red-500' : ''}
                                />
                                {errors.description && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.description}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="image">Gambar Produk</Label>
                                {product.image && (
                                    <div className="mt-2 mb-4">
                                        <img
                                            src={`/images/menu/${product.image}`}
                                            alt={product.name}
                                            className="h-32 w-32 object-cover rounded-lg border"
                                        />
                                    </div>
                                )}
                                <Input
                                    id="image"
                                    type="file"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className={errors.image ? 'border-red-500' : ''}
                                />
                                {errors.image && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.image}</AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
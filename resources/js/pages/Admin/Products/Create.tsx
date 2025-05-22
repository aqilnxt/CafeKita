import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { PageProps } from '@/types';

type Category = {
    id: number;
    name: string;
};

type Props = PageProps & {
    categories: Category[];
};

export default function Create({ auth, categories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        price: '',
        category_id: '',
        description: '',
        stock: '',
        image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.products.store'), {
            onSuccess: () => {
                // Reset form setelah berhasil
                setData({
                    name: '',
                    price: '',
                    category_id: '',
                    description: '',
                    stock: '',
                    image: null,
                });
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
            <Head title="Tambah Produk - Admin" />
            
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Tambah Produk Baru</h1>
                    <Link
                        href={route('admin.products.index')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#967259]"
                    >
                        Kembali
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nama Produk
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#967259] focus:ring-[#967259] ${
                                    errors.name ? 'border-red-500' : ''
                                }`}
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                Harga
                            </label>
                            <input
                                type="number"
                                id="price"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#967259] focus:ring-[#967259] ${
                                    errors.price ? 'border-red-500' : ''
                                }`}
                                required
                                min="0"
                            />
                            {errors.price && (
                                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                                Kategori
                            </label>
                            <select
                                id="category_id"
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#967259] focus:ring-[#967259] ${
                                    errors.category_id ? 'border-red-500' : ''
                                }`}
                                required
                            >
                                <option value="">Pilih Kategori</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && (
                                <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                                Stok
                            </label>
                            <input
                                type="number"
                                id="stock"
                                value={data.stock}
                                onChange={(e) => setData('stock', e.target.value)}
                                className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#967259] focus:ring-[#967259] ${
                                    errors.stock ? 'border-red-500' : ''
                                }`}
                                required
                                min="0"
                            />
                            {errors.stock && (
                                <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Deskripsi
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#967259] focus:ring-[#967259] ${
                                    errors.description ? 'border-red-500' : ''
                                }`}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                Gambar Produk
                            </label>
                            <input
                                type="file"
                                id="image"
                                onChange={handleImageChange}
                                accept="image/*"
                                className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#967259] file:text-white hover:file:bg-[#7D5A44] ${
                                    errors.image ? 'border-red-500' : ''
                                }`}
                            />
                            {errors.image && (
                                <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#967259] rounded-lg hover:bg-[#7D5A44] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#967259] disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Produk'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

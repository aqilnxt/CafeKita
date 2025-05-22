import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { PageProps } from '@/types';

export default function Import({ auth }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.file) {
            return;
        }
        post(route('admin.products.import.store'), {
            onError: (errors) => {
                console.error('Import error:', errors);
            },
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Import Produk</h2>}
        >
            <Head title="Import Produk" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2">Format Excel yang Diperlukan</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    File Excel harus memiliki kolom-kolom berikut:
                                </p>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    <li>nama - Nama produk (wajib)</li>
                                    <li>deskripsi - Deskripsi produk (wajib)</li>
                                    <li>harga - Harga produk dalam Rupiah (wajib)</li>
                                    <li>stok - Jumlah stok (wajib)</li>
                                    <li>kategori_id - ID kategori produk (wajib)</li>
                                    <li>gambar - Nama file gambar (opsional)</li>
                                </ul>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        File Excel
                                    </label>
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls,.csv"
                                        onChange={(e) => setData('file', e.target.files?.[0] || null)}
                                        className="mt-1 block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-[#967259] file:text-white
                                            hover:file:bg-[#7D5A44]"
                                    />
                                    {errors.file && (
                                        <p className="mt-1 text-sm text-red-600">{errors.file}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing || !data.file}
                                        className="bg-[#967259] text-white px-4 py-2 rounded-lg hover:bg-[#7D5A44] transition-colors disabled:opacity-50"
                                    >
                                        {processing ? 'Mengimpor...' : 'Import Produk'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 
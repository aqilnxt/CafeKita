import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { PageProps } from '@/types';

type Props = PageProps;

export default function Create({ auth }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.cashiers.store'));
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Tambah Kasir - Admin" />
            
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Tambah Kasir Baru</h1>
                    <Link
                        href={route('admin.cashiers.index')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#967259]"
                    >
                        Kembali
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nama Kasir
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
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#967259] focus:ring-[#967259] ${
                                    errors.email ? 'border-red-500' : ''
                                }`}
                                required
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#967259] focus:ring-[#967259] ${
                                    errors.password ? 'border-red-500' : ''
                                }`}
                                required
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                Konfirmasi Password
                            </label>
                            <input
                                type="password"
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#967259] focus:ring-[#967259] ${
                                    errors.password_confirmation ? 'border-red-500' : ''
                                }`}
                                required
                            />
                            {errors.password_confirmation && (
                                <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#967259] rounded-lg hover:bg-[#7D5A44] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#967259] disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Kasir'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
} 
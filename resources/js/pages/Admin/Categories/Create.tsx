import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

type Props = PageProps;

export default function Create({ auth }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.categories.store'));
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Tambah Kategori - Admin" />
           
            <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                <Card className="w-full">
                    <CardHeader className="px-4 sm:px-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <CardTitle className="text-xl sm:text-2xl">Tambah Kategori Baru</CardTitle>
                            <Button variant="outline" asChild className="w-full sm:w-auto">
                                <Link href={route('admin.categories.index')}>
                                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                    Kembali
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Nama Kategori Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">
                                    Nama Kategori <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={`w-full ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                    placeholder="Masukkan nama kategori..."
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Deskripsi Field */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium">
                                    Deskripsi
                                </Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className={`w-full min-h-[80px] resize-y ${errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                    rows={3}
                                    placeholder="Masukkan deskripsi kategori..."
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                                )}
                                <p className="text-xs text-gray-500">
                                    Opsional - berikan deskripsi singkat tentang kategori ini
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    asChild
                                    className="w-full sm:w-auto order-2 sm:order-1"
                                >
                                    <Link href={route('admin.categories.index')}>
                                        Batal
                                    </Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto order-1 sm:order-2"
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        'Simpan Kategori'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
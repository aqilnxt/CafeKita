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

type Category = {
    id: number;
    name: string;
    description: string;
};

type Props = PageProps & {
    category: Category;
};

export default function Edit({ auth, category }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        description: category.description,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.categories.update', category.id));
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Edit Kategori - Admin" />
            
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">Edit Kategori</CardTitle>
                        <Button variant="outline" asChild>
                            <Link href={route('admin.categories.index')}>
                                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                Kembali
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Kategori</Label>
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                required
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className={errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                rows={3}
                                placeholder="Masukkan deskripsi kategori..."
                            />
                            {errors.description && (
                                <p className="text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Button type="button" variant="outline" asChild>
                                <Link href={route('admin.categories.index')}>
                                    Batal
                                </Link>
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
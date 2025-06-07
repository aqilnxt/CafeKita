import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeftIcon, UserPlusIcon } from '@heroicons/react/24/outline';

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
           
            <div className="p-4 sm:p-6">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-[#967259]/10 rounded-lg">
                                    <UserPlusIcon className="h-6 w-6 text-[#967259]" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg sm:text-2xl">Tambah Kasir Baru</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1 hidden sm:block">
                                        Tambahkan kasir baru ke dalam sistem
                                    </p>
                                </div>
                            </div>
                            <Button variant="outline" asChild className="w-full sm:w-auto">
                                <Link href={route('admin.cashiers.index')}>
                                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                    Kembali
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                   
                    <CardContent className="p-4 sm:p-6 pt-0">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium">
                                        Nama Kasir <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Masukkan nama kasir"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={`focus:ring-[#967259] focus:border-[#967259] text-sm sm:text-base ${
                                            errors.name ? 'border-destructive' : ''
                                        }`}
                                        required
                                    />
                                    {errors.name && (
                                        <Alert variant="destructive" className="py-2">
                                            <AlertDescription className="text-sm">
                                                {errors.name}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">
                                        Email <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="kasir@example.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={`focus:ring-[#967259] focus:border-[#967259] text-sm sm:text-base ${
                                            errors.email ? 'border-destructive' : ''
                                        }`}
                                        required
                                    />
                                    {errors.email && (
                                        <Alert variant="destructive" className="py-2">
                                            <AlertDescription className="text-sm">
                                                {errors.email}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium">
                                        Password <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Minimal 8 karakter"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={`focus:ring-[#967259] focus:border-[#967259] text-sm sm:text-base ${
                                            errors.password ? 'border-destructive' : ''
                                        }`}
                                        required
                                    />
                                    {errors.password && (
                                        <Alert variant="destructive" className="py-2">
                                            <AlertDescription className="text-sm">
                                                {errors.password}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                {/* Password Confirmation Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation" className="text-sm font-medium">
                                        Konfirmasi Password <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        placeholder="Ulangi password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className={`focus:ring-[#967259] focus:border-[#967259] text-sm sm:text-base ${
                                            errors.password_confirmation ? 'border-destructive' : ''
                                        }`}
                                        required
                                    />
                                    {errors.password_confirmation && (
                                        <Alert variant="destructive" className="py-2">
                                            <AlertDescription className="text-sm">
                                                {errors.password_confirmation}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            </div>

                            {/* Password Requirements Info */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-blue-900 mb-2">
                                    Persyaratan Password:
                                </h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Minimal 8 karakter</li>
                                    <li>• Kombinasi huruf dan angka</li>
                                    <li>• Password dan konfirmasi harus sama</li>
                                </ul>
                            </div>

                            {/* Submit Button */}
                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    asChild
                                    className="w-full sm:w-auto order-2 sm:order-1"
                                >
                                    <Link href={route('admin.cashiers.index')}>
                                        Batal
                                    </Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-[#967259] hover:bg-[#7D5A44] w-full sm:w-auto order-1 sm:order-2"
                                >
                                    <UserPlusIcon className="h-4 w-4 mr-2" />
                                    {processing ? 'Menyimpan...' : 'Simpan Kasir'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
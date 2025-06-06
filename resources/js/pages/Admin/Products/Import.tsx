import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Upload,
    FileSpreadsheet,
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    Info,
} from 'lucide-react';

export default function Import({ auth }: PageProps) {
    const { data, setData, post, processing, errors, progress } = useForm({
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('file', file);
    };

    const requiredColumns = [
        { name: 'nama', description: 'Nama produk', required: true },
        { name: 'deskripsi', description: 'Deskripsi produk', required: true },
        { name: 'harga', description: 'Harga produk dalam Rupiah', required: true },
        { name: 'stok', description: 'Jumlah stok', required: true },
        { name: 'kategori_id', description: 'ID kategori produk', required: true },
        { name: 'gambar', description: 'Nama file gambar', required: false }
    ];

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={route('admin.products.index')}>
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                    </Button>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Import Produk
                    </h2>
                </div>
            }
        >
            <Head title="Import Produk" />

            <div className="space-y-6">
                {/* Instructions Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Info className="w-5 h-5 text-blue-500" />
                            <CardTitle className="text-lg">Format Excel yang Diperlukan</CardTitle>
                        </div>
                        <CardDescription>
                            Pastikan file Excel Anda memiliki struktur yang sesuai sebelum melakukan import
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                File harus dalam format Excel (.xlsx, .xls) atau CSV (.csv)
                            </AlertDescription>
                        </Alert>

                        <div>
                            <h4 className="font-medium text-sm mb-3">Kolom yang Diperlukan:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {requiredColumns.map((column, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <code className="text-sm font-mono bg-white px-2 py-1 rounded border">
                                                    {column.name}
                                                </code>
                                                <Badge 
                                                    variant={column.required ? "default" : "secondary"}
                                                    className="text-xs"
                                                >
                                                    {column.required ? "Wajib" : "Opsional"}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {column.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start space-x-2">
                                <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-medium text-blue-900 mb-1">Tips untuk Import yang Berhasil:</p>
                                    <ul className="text-blue-700 space-y-1 text-xs">
                                        <li>• Pastikan nama kolom sesuai dengan yang tertera di atas</li>
                                        <li>• Tidak ada baris kosong di antara data</li>
                                        <li>• Format harga hanya berupa angka tanpa simbol mata uang</li>
                                        <li>• ID kategori harus sudah ada di sistem</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Upload Form Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Upload className="w-5 h-5 text-green-500" />
                            <CardTitle className="text-lg">Upload File Excel</CardTitle>
                        </div>
                        <CardDescription>
                            Pilih file Excel atau CSV yang berisi data produk untuk diimport
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="file" className="text-sm font-medium">
                                    File Excel/CSV
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="file"
                                        type="file"
                                        accept=".xlsx,.xls,.csv"
                                        onChange={handleFileChange}
                                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                    />
                                    {data.file && (
                                        <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                                            <FileSpreadsheet className="w-4 h-4" />
                                            <span>{data.file.name}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {(data.file.size / 1024 / 1024).toFixed(2)} MB
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                                {errors.file && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{errors.file}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {progress && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Progress Upload</span>
                                        <span>{progress.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-primary h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${progress.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    asChild
                                    className="w-full sm:w-auto"
                                >
                                    <Link href={route('admin.products.index')}>
                                        Batal
                                    </Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing || !data.file}
                                    className="w-full sm:w-auto"
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Mengimpor...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 mr-2" />
                                            Import Produk
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Additional Info Card */}
                <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <p className="font-medium text-orange-900 mb-2">Perhatian Penting:</p>
                                <ul className="text-orange-800 space-y-1 text-xs">
                                    <li>• Proses import akan menambahkan produk baru ke dalam sistem</li>
                                    <li>• Produk dengan nama yang sama akan tetap ditambahkan sebagai produk terpisah</li>
                                    <li>• Pastikan untuk memeriksa data setelah import selesai</li>
                                    <li>• File yang terlalu besar mungkin memerlukan waktu lebih lama untuk diproses</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
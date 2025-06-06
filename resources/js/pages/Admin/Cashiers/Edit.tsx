import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

type Cashier = {
  id: number;
  name: string;
  email: string;
};

type Props = PageProps & {
  cashier: Cashier;
};

export default function Edit({ auth, cashier }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    name: cashier.name,
    email: cashier.email,
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('admin.cashiers.update', cashier.id));
  };

  return (
    <AdminLayout user={auth.user}>
      <Head title="Edit Kasir - Admin" />
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Edit Kasir</CardTitle>
            <Button variant="outline" asChild>
              <Link href={route('admin.cashiers.index')}>
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Kembali
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Kasir</Label>
                <Input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className={`focus:ring-[#967259] focus:border-[#967259] ${
                    errors.name ? 'border-destructive' : ''
                  }`}
                  required
                />
                {errors.name && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.name}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className={`focus:ring-[#967259] focus:border-[#967259] ${
                    errors.email ? 'border-destructive' : ''
                  }`}
                  required
                />
                {errors.email && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.email}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password Baru</Label>
                <p className="text-sm text-muted-foreground">Kosongkan jika tidak ingin mengubah password</p>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className={`focus:ring-[#967259] focus:border-[#967259] ${
                    errors.password ? 'border-destructive' : ''
                  }`}
                />
                {errors.password && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.password}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Konfirmasi Password Baru</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  className={`focus:ring-[#967259] focus:border-[#967259] ${
                    errors.password_confirmation ? 'border-destructive' : ''
                  }`}
                />
                {errors.password_confirmation && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.password_confirmation}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={processing}
                className="bg-[#967259] hover:bg-[#7D5A44]"
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
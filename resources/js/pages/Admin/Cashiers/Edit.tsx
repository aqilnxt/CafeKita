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
     
      {/* Responsive container with proper padding */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
          <CardHeader className="pb-4 sm:pb-6">
            {/* Responsive header with stacked layout on mobile */}
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Edit Kasir
              </CardTitle>
              <Button
                variant="outline"
                asChild
                className="w-full sm:w-auto"
              >
                <Link href={route('admin.cashiers.index')}>
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Kembali
                </Link>
              </Button>
            </div>
          </CardHeader>
         
          <CardContent className="px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
              {/* Responsive grid that stacks on mobile */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
               
                {/* Name Field */}
                <div className="space-y-2 sm:space-y-3">
                  <Label
                    htmlFor="name"
                    className="text-sm sm:text-base font-medium text-gray-700"
                  >
                    Nama Kasir
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className={`w-full h-10 sm:h-11 text-sm sm:text-base focus:ring-[#967259] focus:border-[#967259] transition-colors ${
                      errors.name ? 'border-destructive' : ''
                    }`}
                    placeholder="Masukkan nama kasir"
                    required
                  />
                  {errors.name && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription className="text-sm">
                        {errors.name}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2 sm:space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-sm sm:text-base font-medium text-gray-700"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className={`w-full h-10 sm:h-11 text-sm sm:text-base focus:ring-[#967259] focus:border-[#967259] transition-colors ${
                      errors.email ? 'border-destructive' : ''
                    }`}
                    placeholder="contoh@email.com"
                    required
                  />
                  {errors.email && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription className="text-sm">
                        {errors.email}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2 sm:space-y-3">
                  <Label
                    htmlFor="password"
                    className="text-sm sm:text-base font-medium text-gray-700"
                  >
                    Password Baru
                  </Label>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                    Kosongkan jika tidak ingin mengubah password
                  </p>
                  <Input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className={`w-full h-10 sm:h-11 text-sm sm:text-base focus:ring-[#967259] focus:border-[#967259] transition-colors ${
                      errors.password ? 'border-destructive' : ''
                    }`}
                    placeholder="Masukkan password baru"
                  />
                  {errors.password && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription className="text-sm">
                        {errors.password}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Password Confirmation Field */}
                <div className="space-y-2 sm:space-y-3">
                  <Label
                    htmlFor="password_confirmation"
                    className="text-sm sm:text-base font-medium text-gray-700"
                  >
                    Konfirmasi Password Baru
                  </Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    className={`w-full h-10 sm:h-11 text-sm sm:text-base focus:ring-[#967259] focus:border-[#967259] transition-colors ${
                      errors.password_confirmation ? 'border-destructive' : ''
                    }`}
                    placeholder="Konfirmasi password baru"
                  />
                  {errors.password_confirmation && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription className="text-sm">
                        {errors.password_confirmation}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              {/* Submit Button - Full width on mobile, auto on larger screens */}
              <div className="flex flex-col sm:flex-row sm:justify-end pt-6 lg:pt-8 border-t border-gray-200">
                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full sm:w-auto h-10 sm:h-11 px-6 sm:px-8 text-sm sm:text-base bg-[#967259] hover:bg-[#7D5A44] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </span>
                  ) : (
                    'Simpan Perubahan'
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
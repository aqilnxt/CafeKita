import React from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/layouts/CustomerLayout';
import { PageProps } from '@/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  Coffee, 
  ShoppingBag, 
  ArrowRight,
  Clock,
  User
} from "lucide-react";

interface Props extends PageProps {
  message: string;
  order: any;
  order_number: string;
}

export default function OrderSuccess({ message, order, order_number, auth }: Props) {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Selesai';
      case 'processing':
        return 'Diproses';
      case 'cancelled':
        return 'Dibatalkan';
      case 'pending':
        return 'Menunggu';
      default:
        return status;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <CustomerLayout user={auth.user}>
      <Head title="Pesanan Berhasil" />

      <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6">
        {/* Success Header */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Pesanan Berhasil!
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md">
              {message || 'Terima kasih! Pesanan Anda telah berhasil dikirim dan akan segera diproses.'}
            </p>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="max-w-2xl mx-auto w-full">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl">
                <ShoppingBag className="h-5 w-5 text-amber-600" />
                Detail Pesanan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Number */}
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Nomor Pesanan</p>
                <Badge className="bg-amber-600 hover:bg-amber-700 text-lg px-4 py-2">
                  {order_number}
                </Badge>
              </div>

              <Separator />

              {/* Order Information Grid */}
              {order && (
                <div className="grid gap-4 sm:gap-6">
                  {/* Customer Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Pelanggan</p>
                        <p className="font-medium">{order.customer_name || auth.user.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge variant={getStatusVariant(order.status)} className="text-xs">
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Order Type & Table */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tipe Pesanan</p>
                      <p className="font-medium">
                        {order.order_type === 'dine_in' ? 'Makan di Tempat' : 'Bawa Pulang'}
                      </p>
                    </div>
                    
                    {order.table_number && (
                      <div>
                        <p className="text-sm text-muted-foreground">Nomor Meja</p>
                        <p className="font-medium">{order.table_number}</p>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  {order.items && order.items.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">Item Pesanan</p>
                      <div className="space-y-3">
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between py-2">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                <Coffee className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{item.product?.name || item.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {item.quantity}x @ Rp {(item.price || item.product?.price || 0).toLocaleString('id-ID')}
                                </p>
                              </div>
                            </div>
                            <p className="font-medium">
                              Rp {((item.quantity * (item.price || item.product?.price || 0))).toLocaleString('id-ID')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  {order.total_amount && (
                    <>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium">Total</span>
                        <span className="text-xl font-bold text-amber-600">
                          Rp {(Number(order.total_amount) || 0).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </>
                  )}

                  {/* Notes */}
                  {order.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Catatan</p>
                      <p className="text-sm bg-muted p-3 rounded-lg">{order.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="max-w-2xl mx-auto w-full space-y-3">
          <Button asChild className="w-full bg-amber-600 hover:bg-amber-700 h-12">
            <Link href={route('customer.menu')}>
              <Coffee className="mr-2 h-4 w-4" />
              Pesan Lagi
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full h-12">
            <Link href={route('customer.orders')}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Lihat Semua Pesanan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Additional Info */}
        <div className="max-w-2xl mx-auto w-full">
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h3 className="font-medium text-amber-800">Informasi Penting</h3>
                <p className="text-sm text-amber-700">
                  Pesanan Anda telah diterima dan akan diproses segera. 
                  Silakan menunggu konfirmasi dari kasir untuk detail lebih lanjut.
                </p>
                <p className="text-xs text-amber-600">
                  Simpan nomor pesanan untuk referensi Anda.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CustomerLayout>
  );
}
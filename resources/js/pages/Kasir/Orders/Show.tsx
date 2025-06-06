import React, { useCallback, useMemo } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import KasirLayout from '@/layouts/KasirLayout';
import { Order, OrderStatus as OrderStatusType, PageProps } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  DollarSign, 
  Package, 
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Play
} from 'lucide-react';

interface Props extends PageProps {
  order: Order;
}

const STATUS_OPTIONS: { 
  value: OrderStatusType; 
  label: string; 
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-500', icon: Clock },
  { value: 'processing', label: 'Processing', color: 'bg-blue-500', icon: Play },
  { value: 'ready', label: 'Ready', color: 'bg-purple-500', icon: Package },
  { value: 'completed', label: 'Completed', color: 'bg-green-500', icon: CheckCircle },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500', icon: XCircle },
];

export default function Show({ auth, order }: Props) {
  const { data, setData, patch, processing, errors } = useForm({
    status: order.status as OrderStatusType,
  });

  const updateStatus = useCallback((status: OrderStatusType) => {
    if (processing || order.status === status) return;
    
    setData('status', status);
    patch(route('kasir.orders.update-status', order.id), {
      preserveScroll: true,
      onSuccess: () => {
        console.log('Status updated successfully');
      },
      onError: (errors) => {
        console.error('Error updating status:', errors);
      },
    });
  }, [processing, order.status, order.id, setData, patch]);

  const formatDateTime = useCallback((dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr;
    }
  }, []);

  const formatCurrency = useCallback((amount: number) => {
    try {
      return amount.toLocaleString('id-ID');
    } catch (error) {
      console.error('Error formatting currency:', error);
      return amount.toString();
    }
  }, []);

  // Memoized calculations
  const orderTotal = useMemo(() => {
    return order.items?.reduce((total, item) => total + (item.price * item.quantity), 0) || order.total_amount;
  }, [order.items, order.total_amount]);

  const canUpdateStatus = useCallback((statusOption: OrderStatusType) => {
    const currentIndex = STATUS_OPTIONS.findIndex(s => s.value === order.status);
    const targetIndex = STATUS_OPTIONS.findIndex(s => s.value === statusOption);
    
    if (order.status === statusOption) return false;
    if (order.status === 'completed' || order.status === 'cancelled') return false;
    if (statusOption === 'cancelled') return true;
    
    return targetIndex > currentIndex;
  }, [order.status]);

  return (
    <KasirLayout
      user={auth.user}
      header={
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <Button variant="outline" size="sm" asChild className="w-fit">
              <Link href={route('kasir.orders.index')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Link>
            </Button>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
              Detail Pesanan #{order.id}
            </h2>
          </div>
          {processing && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Memperbarui status...</span>
            </div>
          )}
        </div>
      }
    >
      <Head title={`Detail Pesanan #${order.id}`} />

      <div className="flex-1 space-y-4 p-3 sm:p-4 md:p-6 lg:p-8 pt-4 sm:pt-6">
        {/* Error Display */}
        {errors && Object.keys(errors).length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {Object.values(errors).map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Order Information */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Package className="h-5 w-5" />
                  Informasi Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Package className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-muted-foreground">ID Pesanan</p>
                        <p className="text-base sm:text-lg font-semibold truncate">#{order.id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-muted-foreground">Pelanggan</p>
                        <p className="font-medium truncate">{order.user?.name || 'Tamu'}</p>
                        {order.user?.email && (
                          <p className="text-sm text-muted-foreground truncate">{order.user.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-muted-foreground">Total</p>
                        <p className="text-base sm:text-lg font-semibold text-green-600 truncate">
                          Rp {formatCurrency(order.total_amount)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-muted-foreground">Tanggal Pesanan</p>
                        <p className="font-medium text-sm sm:text-base">{formatDateTime(order.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">
                  Daftar Item ({order.items?.length || 0} item)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Mobile Card Layout */}
                <div className="block sm:hidden space-y-3">
                  {order.items?.length > 0 ? (
                    order.items.map((item) => (
                      <Card key={item.id} className="p-4">
                        <div className="flex gap-3">
                          {item.product?.image && (
                            <img
                              src={`/images/menu/${item.product.image}`}
                              alt={item.product?.name || 'Product'}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/placeholder.png';
                              }}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {item.product?.name || 'Produk tidak ditemukan'}
                            </div>
                            {item.product?.description && (
                              <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                {item.product.description}
                              </div>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <div className="text-sm text-muted-foreground">
                                Rp {formatCurrency(item.price)} × {item.quantity}
                              </div>
                              <div className="font-medium text-green-600">
                                Rp {formatCurrency(item.price * item.quantity)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      Tidak ada item dalam pesanan ini
                    </div>
                  )}
                  {order.items?.length > 0 && (
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total:</span>
                        <span className="text-lg font-bold text-green-600">
                          Rp {formatCurrency(orderTotal)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden sm:block rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Produk</TableHead>
                        <TableHead className="min-w-[120px]">Harga Satuan</TableHead>
                        <TableHead className="min-w-[80px]">Jumlah</TableHead>
                        <TableHead className="text-right min-w-[120px]">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items?.length > 0 ? (
                        order.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {item.product?.image && (
                                  <img
                                    src={`/images/menu/${item.product.image}`}
                                    alt={item.product?.name || 'Product'}
                                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = '/images/placeholder.png';
                                    }}
                                  />
                                )}
                                <div className="min-w-0 flex-1">
                                  <div className="font-medium truncate">
                                    {item.product?.name || 'Produk tidak ditemukan'}
                                  </div>
                                  {item.product?.description && (
                                    <div className="text-xs text-muted-foreground line-clamp-2">
                                      {item.product.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              Rp {formatCurrency(item.price)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {item.quantity}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              Rp {formatCurrency(item.price * item.quantity)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                            Tidak ada item dalam pesanan ini
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                    {order.items?.length > 0 && (
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-medium">
                            Total:
                          </TableCell>
                          <TableCell className="text-right text-lg font-bold text-green-600">
                            Rp {formatCurrency(orderTotal)}
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    )}
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Management */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">Status Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center">
                  <StatusBadge status={order.status as OrderStatusType} />
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    Ubah Status:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                    {STATUS_OPTIONS.map((statusOption) => {
                      const isCurrentStatus = order.status === statusOption.value;
                      const canUpdate = canUpdateStatus(statusOption.value);
                      const IconComponent = statusOption.icon;
                      
                      return (
                        <Button
                          key={statusOption.value}
                          variant={isCurrentStatus ? "default" : "outline"}
                          size="sm"
                          disabled={processing || !canUpdate}
                          onClick={() => updateStatus(statusOption.value)}
                          className={`w-full justify-start text-sm ${
                            isCurrentStatus ? statusOption.color : ''
                          }`}
                        >
                          <IconComponent className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{statusOption.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
                
                <Alert>
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <AlertDescription className="text-xs">
                    Status hanya dapat diubah secara berurutan. 
                    Pesanan yang sudah selesai atau dibatalkan tidak dapat diubah.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </KasirLayout>
  );
}
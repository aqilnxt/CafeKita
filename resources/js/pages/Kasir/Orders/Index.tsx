import React, { useEffect, useState, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import KasirLayout from '@/layouts/KasirLayout';
import { Order, PageProps } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import { OrderStatus } from '@/utils/status';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  Eye, 
  Users, 
  ShoppingCart, 
  TrendingUp,
  Calendar,
  User,
  CreditCard,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props extends PageProps {
  orders: Order[];
}

export default function Index({ auth, orders: initialOrders }: Props) {
  const [currentOrders, setCurrentOrders] = useState<Order[]>(initialOrders);
  const [isLoading, setIsLoading] = useState(false);

  // Memoized callback functions untuk event handlers
  const onOrderCreated = useCallback((e: { order: Order }) => {
    setCurrentOrders((prev) => {
      // Cek apakah order sudah ada untuk menghindari duplikasi
      if (prev.find((o) => o.id === e.order.id)) return prev;
      return [e.order, ...prev];
    });
  }, []);

  const onOrderStatusUpdated = useCallback((e: { order: Order }) => {
    setCurrentOrders((prev) =>
      prev.map((o) => (o.id === e.order.id ? e.order : o))
    );
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Echo) {
      const Echo = (window as any).Echo;
      setIsLoading(true);

      try {
        const channel = Echo.private('kasir.orders');
        
        channel
          .listen('.order.created', onOrderCreated)
          .listen('.order.statusUpdated', onOrderStatusUpdated);

        setIsLoading(false);

        // Cleanup function
        return () => {
          try {
            Echo.leave('kasir.orders');
          } catch (error) {
            console.warn('Error leaving Echo channel:', error);
          }
        };
      } catch (error) {
        console.error('Error setting up Echo listeners:', error);
        setIsLoading(false);
      }
    }
  }, [onOrderCreated, onOrderStatusUpdated]);

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

  const activeOrders = currentOrders.filter(order => 
    !['completed', 'cancelled'].includes(order.status)
  );

  const completedOrders = currentOrders.filter(order => order.status === 'completed');
  const totalSales = completedOrders.reduce((total, order) => total + order.total_amount, 0);

  return (
    <KasirLayout
      user={auth.user}
      header={
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
            Daftar Pesanan
          </h2>
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs sm:text-sm">Memuat pembaruan...</span>
            </div>
          )}
        </div>
      }
    >
      <Head title="Daftar Pesanan" />

      <div className="flex-1 space-y-4 p-3 sm:p-4 md:p-6 lg:p-8 pt-4 sm:pt-6">
        {/* Stats Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Total Pesanan
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {currentOrders.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Pesanan hari ini
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Pesanan Aktif
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {activeOrders.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Sedang diproses
              </p>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Total Penjualan
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                Rp {formatCurrency(totalSales)}
              </div>
              <p className="text-xs text-muted-foreground">
                Pesanan selesai
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table/Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Pesanan Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {currentOrders.length === 0 ? (
              <Alert>
                <ShoppingCart className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Belum ada pesanan. Pesanan baru akan muncul secara otomatis di sini.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16 lg:w-20">ID</TableHead>
                        <TableHead>Pelanggan</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-24 lg:w-32">Status</TableHead>
                        <TableHead className="hidden lg:table-cell">Tanggal</TableHead>
                        <TableHead className="text-right w-20">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium text-sm">
                            #{order.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">
                                {order.user?.name || 'Tamu'}
                              </span>
                              {order.user?.email && (
                                <span className="text-xs text-muted-foreground hidden lg:inline">
                                  {order.user.email}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-medium text-sm">
                              Rp {formatCurrency(order.total_amount)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={order.status as OrderStatus} />
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm hidden lg:table-cell">
                            {formatDateTime(order.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={route('kasir.orders.show', order.id)}>
                                <Eye className="h-4 w-4 lg:mr-2" />
                                <span className="hidden lg:inline">Detail</span>
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {currentOrders.map((order) => (
                    <Card key={order.id} className="p-0">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              #{order.id}
                            </Badge>
                            <StatusBadge status={order.status as OrderStatus} />
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={route('kasir.orders.show', order.id)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Lihat Detail
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {order.user?.name || 'Tamu'}
                              </p>
                              {order.user?.email && (
                                <p className="text-xs text-muted-foreground">
                                  {order.user.email}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold text-sm">
                              Rp {formatCurrency(order.total_amount)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatDateTime(order.created_at)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </KasirLayout>
  );
}
import React, { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';

type ProductType = {
  name: string;
  price: number;
};

type TransactionItemType = {
  quantity: number;
  price: number;
  subtotal: number;
  product: ProductType;
};

type UserType = {
  name: string;
};

type TransactionType = {
  id: number;
  total: number;
  paid: number;
  change: number;
  created_at: string;
  items: TransactionItemType[];
  user: UserType;
};

type Props = {
  transaction: TransactionType;
};

export default function Invoice({ transaction }: Props) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Add print style dynamically
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'print-style';
    style.innerHTML = `
      @media print {
        @page {
          size: 80mm auto;
          margin: 5mm;
        }
        body {
          font-size: 12px;
          font-family: Arial, sans-serif;
          background: white;
        }
        .container {
          width: 100%;
          max-width: 80mm;
          margin: 0;
          padding: 0;
        }
        .print-container {
          width: 100%;
          padding: 0;
          margin: 0;
          background: white;
          color: black;
          border: none;
          border-radius: 0;
          box-shadow: none;
        }
        .no-print {
          display: none !important;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        table th, table td {
          padding: 4px;
          text-align: left;
          font-size: 10px;
        }
        table th:nth-child(2), table td:nth-child(2),
        table th:nth-child(3), table td:nth-child(3),
        table th:nth-child(4), table td:nth-child(4) {
          text-align: right;
        }
        .receipt-header {
          text-align: center;
          margin-bottom: 10px;
        }
        .receipt-header h1 {
          font-size: 16px;
          font-weight: bold;
          margin: 0;
        }
        .receipt-header p {
          font-size: 12px;
          margin: 0;
        }
        .receipt-footer {
          text-align: center;
          margin-top: 10px;
          border-top: 1px dashed #000;
          padding-top: 10px;
        }
        .dotted-line {
          border-top: 1px dashed #000;
          margin: 5px 0;
        }
        .barcode {
          text-align: center;
          margin: 10px 0;
          font-family: 'Courier New', monospace;
          font-size: 10px;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      const printStyle = document.getElementById('print-style');
      if (printStyle) printStyle.remove();
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <Head title={`Invoice #${transaction.id} - Kopi Kita`} />
      
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 print-container">
        <div className="flex justify-between items-center mb-8 no-print">
          <div>
            <h1 className="text-2xl font-bold">Struk Pembayaran</h1>
            <p className="text-gray-600 dark:text-gray-400">Kopi Kita</p>
          </div>
          <div className="text-right">
            <Link 
              href="/kasir/transactions/create" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition inline-block"
            >
              Transaksi Baru
            </Link>
          </div>
        </div>
        
        {/* Header for printing */}
        <div className="hidden receipt-header print:block">
          <h1>KOPI KITA</h1>
          <p>Jl. Kopi Nikmat No. 123, Malang</p>
          <p>Telp: 0812-3456-7890</p>
          <div className="dotted-line"></div>
        </div>
        
        <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-6 print:border-0 print:py-2">
          <div className="grid grid-cols-2 gap-4 print:gap-1">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">No. Transaksi</p>
              <p className="font-semibold">#{transaction.id}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Tanggal</p>
              <p className="font-semibold">{formatDate(transaction.created_at)}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Kasir</p>
              <p className="font-semibold">{transaction.user.name}</p>
            </div>
          </div>
        </div>
        
        <h2 className="text-lg font-semibold mb-4 print:text-base print:text-center">Detail Pesanan</h2>
        <div className="dotted-line hidden print:block"></div>
        
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 print:divide-none">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 print:bg-transparent">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Produk</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Harga</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Jumlah</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 print:divide-none">
              {transaction.items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 print:hover:bg-transparent">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{item.product.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-right">{formatCurrency(item.price)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-right">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-right">{formatCurrency(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="dotted-line hidden print:block"></div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 print:border-t-0 print:pt-1">
          <div className="flex justify-between py-2">
            <span className="font-medium">Total</span>
            <span className="font-semibold">{formatCurrency(transaction.total)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-medium">Dibayar</span>
            <span className="font-semibold">{formatCurrency(transaction.paid)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-medium">Kembalian</span>
            <span className="font-semibold">{formatCurrency(transaction.change)}</span>
          </div>
        </div>
        
        {/* Footer for printing */}
        <div className="receipt-footer hidden print:block">
          <div className="barcode">*{transaction.id}*</div>
          <p>Terima kasih telah berbelanja di Kopi Kita</p>
          <p>{new Date().toLocaleDateString('id-ID')}</p>
        </div>
        
        <div className="mt-8 text-center border-t border-gray-200 dark:border-gray-700 pt-8 no-print">
          <p className="text-gray-600 dark:text-gray-400">Terima kasih telah berbelanja di Kopi Kita</p>
          <div className="flex justify-center gap-4 mt-6">
            <button 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
              onClick={handlePrint}
            >
              Cetak Struk
            </button>
            <Link 
              href="/kasir/dashboard" 
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg transition"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

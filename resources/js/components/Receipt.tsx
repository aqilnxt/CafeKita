import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReceiptProps {
    order: {
        id: string;
        items: Array<{
            product: {
                name: string;
            };
            quantity: number;
            price: number;
        }>;
        total: number;
        created_at: string;
    };
    cashier: {
        name: string;
    };
}

export default function Receipt({ order, cashier }: ReceiptProps) {
    const generatePDF = async () => {
        const receiptElement = document.getElementById('receipt');
        if (!receiptElement) return;

        const canvas = await html2canvas(receiptElement);
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [80, 297] // Ukuran struk kasir standar
        });

        // Logo
        pdf.addImage('/images/logo.png', 'PNG', 30, 10, 20, 20);
        
        // Header
        pdf.setFontSize(16);
        pdf.text('Kopi Kita', 40, 35, { align: 'center' });
        pdf.setFontSize(10);
        pdf.text('Jl. Contoh No. 123', 40, 40, { align: 'center' });
        pdf.text('Telp: (021) 123-4567', 40, 45, { align: 'center' });
        
        // Divider
        pdf.line(10, 50, 70, 50);
        
        // Order Info
        pdf.setFontSize(8);
        pdf.text(`No. Order: ${order.id}`, 10, 55);
        pdf.text(`Tanggal: ${new Date(order.created_at).toLocaleString('id-ID')}`, 10, 60);
        pdf.text(`Kasir: ${cashier.name}`, 10, 65);
        
        // Items
        let y = 75;
        pdf.text('Item', 10, y);
        pdf.text('Qty', 40, y);
        pdf.text('Harga', 60, y);
        y += 5;
        
        order.items.forEach(item => {
            pdf.text(item.product.name, 10, y);
            pdf.text(item.quantity.toString(), 40, y);
            pdf.text(`Rp ${item.price.toLocaleString('id-ID')}`, 60, y);
            y += 5;
        });
        
        // Total
        pdf.line(10, y, 70, y);
        y += 5;
        pdf.setFontSize(10);
        pdf.text('Total:', 40, y);
        pdf.text(`Rp ${order.total.toLocaleString('id-ID')}`, 60, y);
        
        // Footer
        y += 15;
        pdf.setFontSize(8);
        pdf.text('Terima kasih atas kunjungan Anda', 40, y, { align: 'center' });
        y += 5;
        pdf.text('Silahkan datang kembali', 40, y, { align: 'center' });
        
        // Save PDF
        pdf.save(`struk-${order.id}.pdf`);
    };

    return (
        <div>
            <button
                onClick={generatePDF}
                className="bg-[#967259] text-white px-4 py-2 rounded-lg hover:bg-[#7D5A44] transition-colors"
            >
                Cetak Struk
            </button>
            
            {/* Hidden receipt template for reference */}
            <div id="receipt" className="hidden">
                <div className="w-[80mm] p-4">
                    <div className="text-center mb-4">
                        <img src="/images/logo.png" alt="Logo" className="w-16 h-16 mx-auto mb-2" />
                        <h1 className="text-xl font-bold">Kopi Kita</h1>
                        <p className="text-sm">Jl. Contoh No. 123</p>
                        <p className="text-sm">Telp: (021) 123-4567</p>
                    </div>
                    
                    <div className="border-t border-b border-gray-300 py-2 mb-4">
                        <p className="text-sm">No. Order: {order.id}</p>
                        <p className="text-sm">Tanggal: {new Date(order.created_at).toLocaleString('id-ID')}</p>
                        <p className="text-sm">Kasir: {cashier.name}</p>
                    </div>
                    
                    <div className="mb-4">
                        <div className="grid grid-cols-12 text-sm font-bold mb-2">
                            <div className="col-span-6">Item</div>
                            <div className="col-span-2 text-center">Qty</div>
                            <div className="col-span-4 text-right">Harga</div>
                        </div>
                        
                        {order.items.map((item, index) => (
                            <div key={index} className="grid grid-cols-12 text-sm mb-1">
                                <div className="col-span-6">{item.product.name}</div>
                                <div className="col-span-2 text-center">{item.quantity}</div>
                                <div className="col-span-4 text-right">Rp {item.price.toLocaleString('id-ID')}</div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="border-t border-gray-300 pt-2 mb-4">
                        <div className="flex justify-between font-bold">
                            <span>Total:</span>
                            <span>Rp {order.total.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                    
                    <div className="text-center text-sm">
                        <p>Terima kasih atas kunjungan Anda</p>
                        <p>Silahkan datang kembali</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 
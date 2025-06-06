// src/utils/status.ts
export type OrderStatus = 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled';

export const STATUS_COLOR = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const STATUS_LABEL = {
  pending: 'Menunggu',
  processing: 'Diproses',
  ready: 'Siap Diambil',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};

export function getStatusColor(status: OrderStatus): string {
  return STATUS_COLOR[status] || 'bg-gray-100 text-gray-800';
}

export function getStatusLabel(status: OrderStatus): string {
  return STATUS_LABEL[status] || status;
}

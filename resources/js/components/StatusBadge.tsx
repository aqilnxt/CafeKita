import React from 'react';
import { getStatusColor, getStatusLabel, OrderStatus } from '@/utils/status';

interface StatusBadgeProps {
  status: OrderStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
}

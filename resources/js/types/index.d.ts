import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

// Improved OrderStatus with all possible statuses
export type OrderStatus = 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled';

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role: 'customer' | 'kasir' | 'admin';
    [key: string]: unknown;
}

export interface Order {
    id: number;
    user?: User; // Made optional since it can be null for guest orders
    total_amount: number;
    status: OrderStatus; // Use the proper type instead of string
    created_at: string;
    updated_at: string;
    items: OrderItem[];
    [key: string]: unknown;
}

export interface PageProps {
    auth: Auth;
    [key: string]: unknown;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    category_id: number;
    description?: string;
    stock: number;
    image?: string;
    category?: Category;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    image?: string;
    products?: Product[];
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    product: Product;
    price: number;
    quantity: number;
    [key: string]: unknown;
}
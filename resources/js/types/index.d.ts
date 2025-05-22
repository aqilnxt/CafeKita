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

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role: 'customer' | 'kasir' | 'admin';
    [key: string]: unknown; // This allows for additional properties...
}

export interface Order {
    id: number;
    user: User;
    total: number;
    status: string;
    created_at: string;
    updated_at: string;
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

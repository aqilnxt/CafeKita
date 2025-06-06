import React from 'react';
import { Link } from '@inertiajs/react';
import { PageProps, User, NavItem } from '@/types';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
    Coffee,
    Home,
    Settings,
    Users,
    Package,
    FileText,
} from 'lucide-react';

interface Props {
    children: React.ReactNode;
    user: User;
    header?: React.ReactNode;
}

// nav utama admin
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: Home,
    },
    {
        title: 'Kelola Produk',
        href: '/admin/products',
        icon: Package,
    },
    {
        title: 'Kelola Kasir',
        href: '/admin/cashiers',
        icon: Users,
    },
    {
        title: 'Laporan',
        href: '/admin/reports/sales',
        icon: FileText,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Pengaturan',
        href: '/admin/settings',
        icon: Settings,
    },
];

function AppLogo() {
    return (
        <div className="flex items-center space-x-2">
            <Coffee className="h-6 w-6 text-amber-600" />
            <span className="text-lg font-bold text-foreground">Kopi Kita</span>
        </div>
    );
}

function AdminSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('admin.dashboard')}>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <div className="mt-auto">
                    <NavUser />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}

export default function AdminLayout({ children, user, header }: Props) {
    if (!user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        {header}
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                        <main className="p-6">
                            <div className="mx-auto max-w-7xl">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

import React from 'react';
import { Link } from '@inertiajs/react';
import { PageProps, User } from '@/types'; // Import User type
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
    SidebarInset
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { 
    Coffee,
    Home,
    ShoppingCart,
    ClipboardList,
    Settings
} from 'lucide-react';
import { type NavItem } from '@/types';

interface Props {
    children: React.ReactNode;
    user: User; // Change from 'any' to 'User'
    header?: React.ReactNode;
}

// Navigation items for kasir
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/kasir/dashboard',
        icon: Home,
    },
    {
        title: 'Transaksi Baru',
        href: '/kasir/transactions/create',
        icon: ShoppingCart,
    },
    {
        title: 'Pesanan',
        href: '/kasir/orders',
        icon: ClipboardList,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Pengaturan',
        href: '/kasir/settings',
        icon: Settings,
    },
];

// App Logo Component
function AppLogo() {
    return (
        <div className="flex items-center space-x-2">
            <Coffee className="h-6 w-6 text-amber-600" />
            <span className="text-lg font-bold text-foreground">Kopi Kita</span>
        </div>
    );
}

// Kasir Sidebar Component
function KasirSidebar() { // Change from 'any' to 'User'
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('kasir.dashboard')}>
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

export default function KasirLayout({ children, user, header }: Props) {
    // Show loading if user is undefined
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
            <KasirSidebar />
            <SidebarInset>
                {/* Header */}
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        {header}
                    </div>
                </header>

                {/* Main Content */}
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
import { Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { useState } from 'react';

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const getDashboardRoute = () => {
        if (!auth.user) return route('welcome');
        
        switch (auth.user.role) {
            case 'customer':
                return route('customer.dashboard');
            case 'kasir':
                return route('kasir.dashboard');
            case 'admin':
                return route('admin.dashboard');
            default:
                return route('welcome');
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5DC] dark:bg-[#3C2A21]">
            {/* Header */}
            <header className="sticky top-0 left-0 w-full z-50 bg-[#F5F5DC]/95 dark:bg-[#3C2A21]/95 backdrop-blur-md shadow-md">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        {/* Logo dan Brand */}
                        <Link href={getDashboardRoute()} className="flex items-center gap-2">
                            <img src="/images/logo.png" alt="Kopi Kita Logo" className="w-12 h-12 rounded-full" />
                            <span className="text-xl font-bold text-[#967259] hover:text-[#7D5A44] transition-colors">Kopi Kita</span>
                        </Link>
                        
                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-6 text-sm">
                            <Link href={route('welcome')} className="hover:text-[#967259] transition-colors">Beranda</Link>
                            <Link href={route('customer.menu')} className="hover:text-[#967259] transition-colors">Menu</Link>
                            <Link href={route('about')} className="hover:text-[#967259] transition-colors">Tentang Kami</Link>
                            <Link href={route('contact')} className="hover:text-[#967259] transition-colors">Kontak</Link>
                            {auth.user ? (
                                <Link 
                                    href={getDashboardRoute()} 
                                    className="px-4 py-2 bg-[#967259] text-white rounded-full hover:bg-[#7D5A44] transition-all transform hover:scale-105"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link 
                                        href={route('login')} 
                                        className="px-4 py-2 border border-[#967259] text-[#967259] rounded-full hover:bg-[#967259] hover:text-white transition-all"
                                    >
                                        Log in
                                    </Link>
                                    <Link 
                                        href={route('register')} 
                                        className="px-4 py-2 bg-[#967259] text-white rounded-full hover:bg-[#7D5A44] transition-all transform hover:scale-105"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-[#967259] hover:bg-[#E5D3B3] rounded-lg transition-colors"
                        >
                            <svg 
                                className="w-6 h-6" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                {isMobileMenuOpen ? (
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    <div className={`${
                        isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    } md:hidden transition-all duration-300 ease-in-out overflow-hidden`}>
                        <nav className="flex flex-col gap-4 pt-4 pb-6">
                            <Link 
                                href={route('welcome')} 
                                className="px-4 py-2 hover:bg-[#E5D3B3] dark:hover:bg-[#4A3728] rounded-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Beranda
                            </Link>
                            <Link 
                                href={route('customer.menu')} 
                                className="px-4 py-2 hover:bg-[#E5D3B3] dark:hover:bg-[#4A3728] rounded-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Menu
                            </Link>
                            <Link 
                                href={route('about')} 
                                className="px-4 py-2 hover:bg-[#E5D3B3] dark:hover:bg-[#4A3728] rounded-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Tentang Kami
                            </Link>
                            <Link 
                                href={route('contact')} 
                                className="px-4 py-2 hover:bg-[#E5D3B3] dark:hover:bg-[#4A3728] rounded-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Kontak
                            </Link>
                            {auth.user ? (
                                <Link 
                                    href={getDashboardRoute()} 
                                    className="px-4 py-2 bg-[#967259] text-white rounded-lg hover:bg-[#7D5A44] transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link 
                                        href={route('login')} 
                                        className="px-4 py-2 border border-[#967259] text-[#967259] rounded-lg hover:bg-[#967259] hover:text-white transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Log in
                                    </Link>
                                    <Link 
                                        href={route('register')} 
                                        className="px-4 py-2 bg-[#967259] text-white rounded-lg hover:bg-[#7D5A44] transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-[#3C2A21] text-[#E5D3B3]">
                {/* Main Footer Content */}
                <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Brand Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <img src="/images/logo.png" alt="Kopi Kita Logo" className="w-12 h-12 rounded-full" />
                                <span className="text-2xl font-bold text-white">Kopi Kita</span>
                            </div>
                            <p className="text-sm leading-relaxed">
                                Nikmati kopi terbaik di tempat ternyaman kotamu. Kami menyajikan pengalaman kopi yang tak terlupakan.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="text-[#E5D3B3] hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"/>
                                    </svg>
                                </a>
                                <a href="#" className="text-[#E5D3B3] hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-lg font-bold text-white mb-6">Menu Cepat</h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link href={route('welcome')} className="hover:text-white transition-colors">Beranda</Link>
                                </li>
                                <li>
                                    <Link href={route('customer.menu')} className="hover:text-white transition-colors">Menu</Link>
                                </li>
                                <li>
                                    <Link href={route('about')} className="hover:text-white transition-colors">Tentang Kami</Link>
                                </li>
                                <li>
                                    <Link href={route('contact')} className="hover:text-white transition-colors">Kontak</Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="text-lg font-bold text-white mb-6">Kontak</h4>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <svg className="w-6 h-6 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                    <span>Jl. Kopi No. 123, Jakarta</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-6 h-6 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                    </svg>
                                    <span>info@kopikita.com</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-6 h-6 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                    </svg>
                                    <span>+62 812 3456 7890</span>
                                </li>
                            </ul>
                        </div>

                        {/* Opening Hours */}
                        <div>
                            <h4 className="text-lg font-bold text-white mb-6">Jam Operasional</h4>
                            <ul className="space-y-3">
                                <li className="flex justify-between">
                                    <span>Senin - Jumat</span>
                                    <span>07:00 - 22:00</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Sabtu - Minggu</span>
                                    <span>08:00 - 23:00</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-[#4A3728]">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <p className="text-center text-sm">
                            © {new Date().getFullYear()} Kopi Kita. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

            {/* WhatsApp Floating Button */}
            <a
                href="https://wa.me/6281234567890?text=Halo%20Kopi%20Kita%2C%20saya%20ingin%20memesan%20kopi."
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 bg-[#967259] hover:bg-[#7D5A44] text-[#F5F5DC] rounded-full p-4 shadow-lg z-50 transition"
                title="Chat via WhatsApp"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
                    <path d="M20.52 3.48A11.933 11.933 0 0 0 12.01 0C5.39 0 0 5.39 0 12.01c0 2.12.55 4.15 1.6 5.95L0 24l6.27-1.63a11.987 11.987 0 0 0 5.73 1.47h.01c6.61 0 12-5.39 12-12.01 0-3.2-1.25-6.21-3.49-8.35zM12 22c-1.67 0-3.29-.41-4.74-1.19l-.34-.18-3.72.96.99-3.62-.22-.37A9.943 9.943 0 0 1 2 12.01C2 6.49 6.49 2 12.01 2 15.19 2 18.1 3.26 20.22 5.38 22.35 7.5 23.61 10.41 23.61 13.6c0 5.52-4.49 10-10.01 10zm5.27-7.18c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.66.15-.19.3-.76.97-.93 1.17-.17.2-.34.22-.63.07-.3-.15-1.26-.47-2.4-1.5-.89-.79-1.5-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.5.15-.17.2-.28.3-.47.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.9-2.19-.24-.57-.48-.5-.66-.5-.17 0-.37-.02-.57-.02s-.52.07-.8.37c-.27.3-1.05 1.03-1.05 2.52 0 1.5 1.07 2.95 1.22 3.15.15.2 2.09 3.2 5.07 4.48.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.43.24-.7.24-1.3.17-1.43-.06-.13-.26-.21-.57-.36z" />
                </svg>
            </a>
        </div>
    );
} 
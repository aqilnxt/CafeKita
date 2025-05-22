import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { useState, useEffect } from 'react';

export default function Welcome() {
    // Hero slider
    const heroSlides = [
        {
            image: '/images/hero1.jpg',
            title: 'Selamat Datang di Kopi Kita',
            subtitle: 'Nikmati aroma kopi terbaik dari biji pilihan.',
        },
        {
            image: '/images/hero2.jpg',
            title: 'Kopi yang Membuat Hari Lebih Baik',
            subtitle: 'Temukan kenikmatan dalam setiap tegukan.',
        },
        {
            image: '/images/hero3.jpg',
            title: 'Suasana Nyaman, Kopi Istimewa',
            subtitle: 'Tempat terbaik untuk bersantai dan menikmati kopi.',
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);

    // Auto slide
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Simulasi loader selesai
    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 1500); // Durasi loader (1.5s)
        return () => clearTimeout(timeout);
    }, []);

    // Tambahkan kategori menu dan gambar
    const menuItems = [
        {
            name: 'Espresso',
            price: 'Rp 25.000',
            category: 'Minuman Panas',
            image: '/images/menu/espresso.jpg',
            description: 'Kopi hitam murni dengan cita rasa kuat'
        },
        {
            name: 'Cappuccino',
            price: 'Rp 35.000',
            category: 'Minuman Panas',
            image: '/images/menu/cappuccino.jpg',
            description: 'Paduan espresso dan susu dengan foam yang lembut'
        },
        {
            name: 'Cafe Latte',
            price: 'Rp 33.000',
            category: 'Minuman Panas',
            image: '/images/menu/cafe-latte.jpg',
            description: 'Espresso dengan steamed milk yang creamy'
        },
        // ... tambahkan menu item lainnya
    ];

    // Testimoni Section
    const testimonials = [
        {
            avatar: '/images/testimoni1.jpg',
            name: 'John Doe',
            rating: 5,
            comment: 'Kopi Kita membuat hari saya lebih baik. Kualitas kopi yang luar biasa!'
        },
        {
            avatar: '/images/testimoni2.jpg',
            name: 'Jane Smith',
            rating: 4,
            comment: 'Saya sangat suka dengan pelayanan dan suasana yang nyaman di Kopi Kita.'
        },
        {
            avatar: '/images/testimoni3.jpg',
            name: 'Michael Brown',
            rating: 5,
            comment: 'Kopi Kita adalah tempat terbaik untuk menikmati kopi.'
        },
    ];

    // Gallery Section
    const galleryImages = [
        {
            url: '/images/gallery/gallery1.jpg',
            caption: 'Suasana Cafe yang Nyaman'
        },
        {
            url: '/images/gallery/gallery2.jpg',
            caption: 'Proses Pembuatan Kopi'
        },
        {
            url: '/images/gallery/gallery3.jpg',
            caption: 'Latte Art Spesial'
        },
        {
            url: '/images/gallery/gallery4.jpg',
            caption: 'Menu Favorit Pelanggan'
        },
    ];

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-[#F5F5DC] dark:bg-[#3C2A21] z-50">
                <div className="relative">
                    {/* Loading spinner */}
                    <div className="w-24 h-24 rounded-full border-4 border-[#E5D3B3] border-t-[#967259] animate-spin"></div>
                    
                    {/* Coffee cup animation in the middle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-12 h-12 flex items-center justify-center">
                            <svg 
                                className="w-8 h-8 text-[#967259] animate-bounce" 
                                fill="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path d="M2 21v-2h18v2H2ZM4 17V7q0-1.65 1.175-2.825Q6.35 3 8 3h8q1.65 0 2.825 1.175Q20 5.35 20 7v1h-2V7q0-.825-.587-1.413Q16.825 5 16 5H8q-.825 0-1.412.587Q6 6.175 6 7v10H4Zm14 0V9h2q.825 0 1.413.587Q22 10.175 22 11v4q0 .825-.587 1.413Q20.825 17 20 17h-2Z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                
                {/* Loading text */}
                <div className="absolute mt-32 text-center">
                    <p className="text-[#967259] font-medium animate-pulse">
                        Sedang menyiapkan kopi terbaik...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <MainLayout>
            <Head title="Kopi Kita - Coffee Shop Terbaik di Kotamu">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
                <meta name="description" content="Nikmati kopi terbaik dari Kopi Kita. Kami menyajikan kopi premium, suasana nyaman, dan pelayanan ramah." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo2.png" type="image/png" />
            </Head>

            {/* Hero Carousel */}
            <section className="relative h-screen overflow-hidden">
                {heroSlides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
                            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                    >
                        <div
                            className="relative w-full h-full bg-cover bg-center flex items-center justify-center"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                            {/* Overlay gelap */}
                            <div className="absolute inset-0 bg-black opacity-50"></div>
                            
                            {/* Content */}
                            <div className="relative z-10 p-8 rounded text-center text-white max-w-2xl">
                                <h1 className="text-5xl font-bold mb-4">{slide.title}</h1>
                                <p className="text-xl mb-6">{slide.subtitle}</p>
                                <a href="#menu" className="bg-[#967259] hover:bg-[#7D5A44] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                    Lihat Menu
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Menu Kami */}
            <section id="menu" className="py-20 px-8 bg-[#F5F5DC] text-center dark:bg-[#3C2A21]">
                <h2 className="text-3xl font-bold mb-10">Menu Kami</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {menuItems.map((item, index) => (
                        <div 
                            key={index} 
                            className="p-6 shadow rounded bg-[#E5D3B3] dark:bg-[#4A3728] transform transition-all duration-300 hover:shadow-xl"
                        >
                            <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded mb-4"/>
                            <h3 className="text-xl font-semibold">{item.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                            <p className="mt-2 font-bold text-[#967259]">{item.price}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimoni Section */}
            <section className="py-20 px-8 bg-[#D5C7A3] dark:bg-[#F2E2B1]">
                <h2 className="text-3xl font-bold mb-10 text-center">Apa Kata Mereka</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((testimoni, index) => (
                        <div 
                            key={index} 
                            className="bg-[#F6F0F0] dark:bg-[#BDB395] p-6 rounded-lg shadow-lg"
                        >
                            <div className="flex items-center mb-4">
                                <img src={testimoni.avatar} alt={testimoni.name} className="w-12 h-12 rounded-full"/>
                                <div className="ml-4">
                                    <h4 className="font-semibold">{testimoni.name}</h4>
                                    <div className="flex text-yellow-400">
                                        {[...Array(testimoni.rating)].map((_, i) => (
                                            <span key={i}>★</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="italic">{testimoni.comment}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-20 px-8">
                <h2 className="text-3xl font-bold mb-10 text-center">Galeri Kami</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                    {galleryImages.map((image, index) => (
                        <div 
                            key={index} 
                            className="relative overflow-hidden group"
                        >
                            <img 
                                src={image.url} 
                                alt={image.caption} 
                                className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <p className="text-white text-center p-4">{image.caption}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Special Menu Section */}
            <section className="py-12 px-8 bg-[#967259]">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-[#F5F5DC] dark:bg-[#3C2A21] p-8 rounded-lg shadow-xl">
                        <h3 className="text-2xl font-bold text-center mb-6">Menu Spesial Minggu Ini</h3>
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <img src="/images/special-coffee.jpg" alt="Special Coffee" className="w-full md:w-1/2 rounded-lg"/>
                            <div>
                                <h4 className="text-xl font-semibold text-[#967259]">Vanilla Caramel Latte</h4>
                                <p className="my-4">Nikmati paduan sempurna espresso, vanilla, dan caramel</p>
                                <p className="text-2xl font-bold text-[#967259]">Rp 35.000</p>
                                <p className="text-sm line-through text-gray-500">Rp 45.000</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}

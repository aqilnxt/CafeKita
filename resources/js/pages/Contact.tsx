import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { useState } from 'react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Implementasi pengiriman form akan ditambahkan nanti
        console.log('Form submitted:', formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <MainLayout>
            <Head title="Hubungi Kami - Kopi Kita">
                <meta name="description" content="Hubungi Kopi Kita untuk pertanyaan, saran, atau kerjasama. Kami siap melayani Anda." />
            </Head>

            {/* Hero Section */}
            <div className="relative h-[40vh] bg-cover bg-center" style={{ backgroundImage: "url('/images/hero3.jpg')" }}>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center text-center">
                    <div className="text-white px-4">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h1>
                        <p className="text-xl md:text-2xl">Kami Siap Mendengarkan Anda</p>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <section className="py-16 px-4 md:px-8 bg-[#F5F5DC] dark:bg-[#3C2A21]">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-white dark:bg-[#4A3728] p-8 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-6 text-[#967259]">Kirim Pesan</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-[#E5D3B3] mb-1">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#967259] focus:border-[#967259] dark:bg-[#3C2A21] dark:border-[#967259] dark:text-[#E5D3B3]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-[#E5D3B3] mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#967259] focus:border-[#967259] dark:bg-[#3C2A21] dark:border-[#967259] dark:text-[#E5D3B3]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-[#E5D3B3] mb-1">
                                        Subjek
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#967259] focus:border-[#967259] dark:bg-[#3C2A21] dark:border-[#967259] dark:text-[#E5D3B3]"
                                    >
                                        <option value="">Pilih Subjek</option>
                                        <option value="general">Pertanyaan Umum</option>
                                        <option value="business">Kerjasama Bisnis</option>
                                        <option value="feedback">Saran dan Masukan</option>
                                        <option value="complaint">Keluhan</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-[#E5D3B3] mb-1">
                                        Pesan
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#967259] focus:border-[#967259] dark:bg-[#3C2A21] dark:border-[#967259] dark:text-[#E5D3B3]"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-[#967259] text-white py-3 px-6 rounded-lg hover:bg-[#7D5A44] transition-colors duration-300"
                                >
                                    Kirim Pesan
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-6 text-[#967259]">Informasi Kontak</h2>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-[#967259] rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-[#967259]">Alamat</h3>
                                            <p className="text-gray-600 dark:text-[#E5D3B3]">Jl. Kopi Nikmat No. 123<br />Malang, Jawa Timur</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-[#967259] rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-[#967259]">Email</h3>
                                            <p className="text-gray-600 dark:text-[#E5D3B3]">info@kopikita.id</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-[#967259] rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-[#967259]">Telepon</h3>
                                            <p className="text-gray-600 dark:text-[#E5D3B3]">0812-3456-7890</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Jam Operasional */}
                            <div>
                                <h2 className="text-2xl font-bold mb-6 text-[#967259]">Jam Operasional</h2>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-[#E5D3B3]">Senin - Jumat</span>
                                        <span className="text-gray-600 dark:text-[#E5D3B3]">08:00 - 22:00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-[#E5D3B3]">Sabtu - Minggu</span>
                                        <span className="text-gray-600 dark:text-[#E5D3B3]">10:00 - 23:00</span>
                                    </div>
                                </div>
                            </div>

                            {/* Google Maps */}
                            <div>
                                <h2 className="text-2xl font-bold mb-6 text-[#967259]">Lokasi Kami</h2>
                                <div className="w-full h-[300px] bg-gray-200 dark:bg-[#4A3728] rounded-lg overflow-hidden">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.3040734253444!2d112.6226483!3d-7.9666707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd62822063dc2fb%3A0x78879446481a4da2!2sMalang%2C%20Kota%20Malang%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1624451234567!5m2!1sid!2sid"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
} 
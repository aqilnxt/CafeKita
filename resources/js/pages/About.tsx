import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';

export default function About() {
    return (
        <MainLayout>
            <Head title="Tentang Kami - Kopi Kita">
                <meta name="description" content="Pelajari lebih lanjut tentang Kopi Kita, sejarah kami, dan komitmen kami terhadap kualitas kopi." />
            </Head>

            <div className="min-h-screen bg-[#F5F5DC] dark:bg-[#3C2A21]">
                {/* Hero Section */}
                <div className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: "url('/images/about-hero.jpg')" }}>
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-center">
                        <div className="text-white px-4">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">Tentang Kopi Kita</h1>
                            <p className="text-xl md:text-2xl">Menciptakan Momen Istimewa dengan Secangkir Kopi</p>
                        </div>
                    </div>
                </div>

                {/* Sejarah Section */}
                <section className="py-16 px-4 md:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6 text-[#967259]">Sejarah Kami</h2>
                                <p className="text-gray-700 dark:text-[#E5D3B3] mb-4">
                                    Kopi Kita didirikan pada tahun 2020 dengan visi sederhana: menyajikan kopi berkualitas terbaik dalam suasana yang nyaman dan ramah. Dimulai dari sebuah kedai kecil di sudut kota Malang, kami terus berkembang berkat dukungan pelanggan setia kami.
                                </p>
                                <p className="text-gray-700 dark:text-[#E5D3B3]">
                                    Setiap cangkir kopi yang kami sajikan adalah hasil dari perjalanan panjang dalam mencari dan menyeleksi biji kopi terbaik dari berbagai pelosok Indonesia.
                                </p>
                            </div>
                            <div className="relative">
                                <img 
                                    src="/images/about-history.jpg" 
                                    alt="Sejarah Kopi Kita" 
                                    className="rounded-lg shadow-xl"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Nilai-nilai Kami */}
                <section className="py-16 px-4 md:px-8 bg-[#E5D3B3] dark:bg-[#4A3728]">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center text-[#967259]">Nilai-nilai Kami</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center p-6 bg-white dark:bg-[#3C2A21] rounded-lg shadow-lg">
                                <div className="w-16 h-16 mx-auto mb-4 bg-[#967259] rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-[#967259]">Kualitas</h3>
                                <p className="text-gray-600 dark:text-[#E5D3B3]">Kami berkomitmen untuk selalu menyajikan kopi dengan kualitas terbaik.</p>
                            </div>
                            <div className="text-center p-6 bg-white dark:bg-[#3C2A21] rounded-lg shadow-lg">
                                <div className="w-16 h-16 mx-auto mb-4 bg-[#967259] rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-[#967259]">Konsistensi</h3>
                                <p className="text-gray-600 dark:text-[#E5D3B3]">Setiap cangkir kopi kami dibuat dengan standar yang sama tingginya.</p>
                            </div>
                            <div className="text-center p-6 bg-white dark:bg-[#3C2A21] rounded-lg shadow-lg">
                                <div className="w-16 h-16 mx-auto mb-4 bg-[#967259] rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-[#967259]">Pelayanan</h3>
                                <p className="text-gray-600 dark:text-[#E5D3B3]">Kepuasan pelanggan adalah prioritas utama kami.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tim Kami */}
                <section className="py-16 px-4 md:px-8">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center text-[#967259]">Tim Kami</h2>
                        <div className="grid md:grid-cols-4 gap-8">
                            {[
                                {
                                    name: "Ahmad Rizki",
                                    role: "Head Barista",
                                    image: "/images/team-1.jpg"
                                },
                                {
                                    name: "Sarah Putri",
                                    role: "Coffee Quality Manager",
                                    image: "/images/team-2.jpg"
                                },
                                {
                                    name: "Budi Santoso",
                                    role: "Store Manager",
                                    image: "/images/team-3.jpg"
                                },
                                {
                                    name: "Linda Wati",
                                    role: "Customer Relations",
                                    image: "/images/team-4.jpg"
                                }
                            ].map((member, index) => (
                                <div key={index} className="text-center">
                                    <div className="relative mb-4 overflow-hidden rounded-full">
                                        <img 
                                            src={member.image} 
                                            alt={member.name}
                                            className="w-48 h-48 object-cover mx-auto transition-transform duration-300 hover:scale-110"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#967259]">{member.name}</h3>
                                    <p className="text-gray-600 dark:text-[#E5D3B3]">{member.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 px-4 md:px-8 bg-[#967259] text-white text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">Bergabunglah dengan Kami</h2>
                        <p className="mb-8 text-lg">Jadilah bagian dari perjalanan kami dalam menyajikan kopi terbaik untuk Indonesia</p>
                        <Link 
                            href={route('contact')} 
                            className="inline-block bg-white text-[#967259] px-8 py-3 rounded-full font-bold hover:bg-[#E5D3B3] transition-colors duration-300"
                        >
                            Hubungi Kami
                        </Link>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
} 
// import AppLogoIcon from '@';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { quote } = usePage<SharedData>().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900" />
                <img
                    src="/images/auth-illustration.jpg"
                    alt="Auth Illustration"
                    className="absolute inset-0 h-full w-full object-cover opacity-70"
                />
                <Link href={route('welcome')} className="relative z-20 flex items-center text-lg font-medium">
                    <img 
                        src="/images/logo.png" 
                        alt="Kopi Kita Logo" 
                        className="mr-2 w-12 h-12 rounded-full"
                    />
                    <span className="text-xl font-bold text-[#967259] hover:text-[#7D5A44] transition-colors">Kopi Kita</span>
                </Link>
                
                {quote && (
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">&ldquo;{quote.message}&rdquo;</p>
                            <footer className="text-sm text-neutral-300">{quote.author}</footer>
                        </blockquote>
                    </div>
                )}
            </div>

            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link href={route('welcome')} className="relative z-20 flex items-center justify-center lg:hidden">
                        <img 
                            src="/images/logo.png" 
                            alt="Kopi Kita Logo" 
                            className="h-10 sm:h-12"
                        />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-muted-foreground text-sm text-balance">{description}</p>
                    </div>  
                    {children}
                </div>
            </div>
        </div>
    );
}

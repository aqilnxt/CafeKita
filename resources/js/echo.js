// resources/js/echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Inisialisasi Echo
window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY, // Pastikan env var ini ada
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER, // Pastikan env var ini ada
    forceTLS: true,
    encrypted: true,
});

export default echo;


import { Head, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <Head title="Log in" />
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden p-8 border border-white/20">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-indigo-100">Sign in to access your dashboard</p>
                </div>

                <form onSubmit={submit}>
                    <div className="mb-6">
                        <label className="block text-indigo-100 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-indigo-300/30 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-200"
                            placeholder="your@email.com"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && <div className="text-pink-300 text-sm mt-1">{errors.email}</div>}
                    </div>

                    <div className="mb-6">
                        <label className="block text-indigo-100 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-indigo-300/30 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-200"
                            placeholder="••••••••"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        {errors.password && <div className="text-pink-300 text-sm mt-1">{errors.password}</div>}
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <label className="flex items-center text-indigo-100 text-sm cursor-pointer hover:text-white transition">
                            <input
                                type="checkbox"
                                className="mr-2 rounded border-indigo-300 bg-white/10 text-indigo-600 focus:ring-offset-0 focus:ring-white/50"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            Remember me
                        </label>
                        <a href="#" className="text-sm text-indigo-200 hover:text-white transition">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-white text-indigo-600 font-bold py-3 px-4 rounded-lg hover:bg-indigo-50 transition duration-300 shadow-lg transform hover:-translate-y-0.5"
                    >
                        {processing ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
            </div>
        </div>
    );
}

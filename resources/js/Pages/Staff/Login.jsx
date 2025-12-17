
import { Head, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('staff.login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500">
            <Head title="Staff Login" />
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden p-8 border border-white/20">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Staff Access</h1>
                    <p className="text-emerald-100">Authorized personnel only</p>
                </div>

                <form onSubmit={submit}>
                    <div className="mb-6">
                        <label className="block text-emerald-100 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-emerald-300/30 text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-200"
                            placeholder="staff@example.com"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && <div className="text-pink-300 text-sm mt-1">{errors.email}</div>}
                    </div>

                    <div className="mb-6">
                        <label className="block text-emerald-100 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-emerald-300/30 text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-200"
                            placeholder="••••••••"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        {errors.password && <div className="text-pink-300 text-sm mt-1">{errors.password}</div>}
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <label className="flex items-center text-emerald-100 text-sm cursor-pointer hover:text-white transition">
                            <input
                                type="checkbox"
                                className="mr-2 rounded border-emerald-300 bg-white/10 text-emerald-600 focus:ring-offset-0 focus:ring-white/50"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            Remember me
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-white text-emerald-600 font-bold py-3 px-4 rounded-lg hover:bg-emerald-50 transition duration-300 shadow-lg transform hover:-translate-y-0.5"
                    >
                        {processing ? 'Verifying...' : 'Access Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
}

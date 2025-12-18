import { Head, Link, useForm } from '@inertiajs/react';

export default function Welcome() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('inquiry.store'));
    };

    return (
        <>
            <Head title="Hair Salon CRM - サロン運営を美しく" />
            <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-rose-500 selection:text-white">

                {/* Navigation */}
                <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-20">
                            <div className="flex-shrink-0 flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                    H
                                </div>
                                <span className="font-bold text-xl tracking-tight text-gray-900">Hair Salon <span className="text-rose-500">CRM</span></span>
                            </div>
                            <div className="hidden md:flex space-x-8 items-center">
                                <a href="#features" className="text-gray-600 hover:text-rose-500 transition-colors font-medium">機能</a>
                                <a href="#solutions" className="text-gray-600 hover:text-rose-500 transition-colors font-medium">ソリューション</a>
                                <a href="#inquiry" className="text-gray-600 hover:text-rose-500 transition-colors font-medium">お問い合わせ</a>
                                <div className="flex items-center gap-4 ml-4">
                                    <Link href="/staff/login" className="px-5 py-2.5 bg-gray-900 text-white rounded-full font-medium hover:bg-rose-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                        デモを見る
                                    </Link>
                                </div>
                            </div>
                            {/* Mobile menu button could go here */}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/images/salon_hero.png"
                            alt="Luxury Salon Interior"
                            className="w-full h-full object-cover opacity-20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <span className="inline-block py-1 px-3 rounded-full bg-rose-100 text-rose-600 text-sm font-bold tracking-wide mb-6 animate-fade-in-up">
                            次世代のサロン管理システム
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
                            サロン運営を、<br className="md:hidden" />もっと<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">自由に</span>、<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">美しく</span>。
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed mb-10">
                            予約管理から顧客分析、スタッフのシフト管理まで。<br />
                            Hair Salon CRMは、あなたのサロンビジネスの可能性を最大限に引き出す<br className="hidden md:inline" />オールインワンプラットフォームです。
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/staff/login" className="px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                                デモを見る
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div id="features" className="py-20 bg-white relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                                サロン運営に必要な<br className="md:hidden" />すべてをここに
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                複雑な業務をシンプルに。直感的なインターフェースで、<br className="hidden md:inline" />
                                導入したその日から、あなたの右腕として機能します。
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="group p-8 bg-gray-50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-2xl transition-all duration-300">
                                <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">スマート予約管理</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    ダブルブッキングを自動防止。24時間365日、機会損失なく予約を受け付けます。
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="group p-8 bg-gray-50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-2xl transition-all duration-300">
                                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">スタッフ・シフト管理</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    個々のスタッフのスキルや出勤状況に合わせて、最適な予約枠を自動調整します。
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="group p-8 bg-gray-50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-2xl transition-all duration-300">
                                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">マルチ店舗・組織対応</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    複数店舗のデータを一元管理。組織全体のパフォーマンスをリアルタイムで可視化します。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Target Audience Section */}
                <div id="solutions" className="py-20 bg-gray-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                    <span className="text-rose-400">オーナー様</span>へ。<br />
                                    経営をもっとクリアに。
                                </h2>
                                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                                    日々の業務に追われて、本来の「おもてなし」がおろそかになっていませんか？
                                    Hair Salon CRMなら、事務作業を自動化し、お客様と向き合う時間を生み出します。
                                </p>
                                <ul className="space-y-4">
                                    {['リアルタイムの売上分析', 'スタッフの稼働率最適化', '顧客リピート率の向上支援', '安心のセキュリティ'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <svg className="w-5 h-5 text-rose-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-gray-200">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-10">
                                    <Link href="/staff/login" className="inline-flex items-center text-white font-bold hover:text-rose-400 transition-colors">
                                        管理画面へログイン
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 to-orange-500/20 rounded-2xl blur-xl"></div>
                                <div className="relative bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-2xl">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="w-2 h-8 bg-rose-500 rounded-full"></span>
                                        売上推移
                                    </h3>
                                    {/* Mock Chart */}
                                    <div className="flex items-end gap-2 h-40 mt-6 px-2">
                                        {[40, 65, 45, 90, 75, 100, 85].map((h, i) => (
                                            <div key={i} className="flex-1 bg-gradient-to-t from-gray-700 to-gray-600 rounded-t-sm relative group overflow-hidden">
                                                <div
                                                    style={{ height: `${h}%` }}
                                                    className="absolute bottom-0 w-full bg-gradient-to-t from-rose-600 to-rose-400 transition-all duration-1000 ease-out"
                                                ></div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-gray-500 font-mono">
                                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="py-20 text-center px-4">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        あなたのサロンも、<br className="md:hidden" />新しいステージへ
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                        導入は簡単。今すぐ始めて、サロン運営の「新しい常識」を体験してください。
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mb-8">
                        価格：税込月額2万円
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/staff/login" className="px-8 py-3 bg-gray-900 text-white font-bold rounded-lg shadow hover:bg-black transition-all">
                            デモを見る
                        </Link>
                    </div>
                </div>

                {/* Inquiry Section */}
                <div id="inquiry" className="py-20 bg-gray-50">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">お問い合わせ</h2>
                            <p className="text-gray-600">
                                サービスに関するご質問やご相談など、お気軽にお問い合わせください。<br />
                                通常、3営業日以内にご返信いたします。
                            </p>
                        </div>

                        <div className="bg-white overflow-hidden shadow-xl sm:rounded-2xl p-8">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">お名前 <span className="text-rose-500">*</span></label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                                        placeholder="山田 太郎"
                                    />
                                    {errors.name && <div className="text-rose-500 text-sm mt-1">{errors.name}</div>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス <span className="text-rose-500">*</span></label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                                        placeholder="taro.yamada@example.com"
                                    />
                                    {errors.email && <div className="text-rose-500 text-sm mt-1">{errors.email}</div>}
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">件名 <span className="text-rose-500">*</span></label>
                                    <input
                                        id="subject"
                                        type="text"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                                        placeholder="導入に関するご相談"
                                    />
                                    {errors.subject && <div className="text-rose-500 text-sm mt-1">{errors.subject}</div>}
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">お問い合わせ内容 <span className="text-rose-500">*</span></label>
                                    <textarea
                                        id="message"
                                        rows="5"
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                                        placeholder="ご自由にご記入ください"
                                    ></textarea>
                                    {errors.message && <div className="text-rose-500 text-sm mt-1">{errors.message}</div>}
                                </div>

                                <div className="flex justify-center pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        お問い合わせを送信
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-gray-50 border-t border-gray-200 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center text-white text-xs font-bold">H</div>
                            <span className="font-bold text-gray-900">Hair Salon CRM</span>
                        </div>
                        <div className="text-gray-500 text-sm">
                            &copy; {new Date().getFullYear()} Hair Salon CRM. All rights reserved.
                        </div>
                        <div className="flex gap-6 text-sm font-medium text-gray-500">
                            <Link href="/privacy-policy" className="hover:text-gray-900">プライバシーポリシー</Link>
                            <Link href="/terms-of-service" className="hover:text-gray-900">利用規約</Link>
                            <a href="#inquiry" className="hover:text-gray-900">お問い合わせ</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

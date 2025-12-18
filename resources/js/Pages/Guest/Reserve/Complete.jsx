import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Complete({ store }) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col items-center justify-center p-4">
            <Head title={`${store.name} - 予約完了`} />

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 max-w-md w-full text-center">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">予約が完了しました</h1>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    ご予約ありがとうございます。<br />
                    詳細な内容はマイページまたは登録メールアドレスにご案内しております。
                </p>

                <div className="space-y-4">
                    <Link
                        href={route('guest.reservation.index', { store_code: store.store_code })}
                        className="block w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors"
                    >
                        トップに戻る
                    </Link>
                    {/* Placeholder for My Page Link */}
                </div>
            </div>

            <footer className="mt-12 text-center text-sm text-gray-400">
                &copy; {new Date().getFullYear()} {store.name}
            </footer>
        </div>
    );
}

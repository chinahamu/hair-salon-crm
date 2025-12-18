import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Complete() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="送信完了 - Hair Salon CRM" />

            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                H
                            </div>
                            <span className="font-bold text-xl tracking-tight text-gray-900">Hair Salon <span className="text-rose-500">CRM</span></span>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-12 text-center">
                            <div className="mb-6">
                                <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-4 text-gray-900">お問い合わせありがとうございます</h2>
                            <p className="text-gray-600 mb-8">
                                お問い合わせ内容を受け付けました。<br />
                                担当者より順次ご連絡させていただきます。
                            </p>

                            <Link
                                href="/"
                                className="inline-flex items-center px-6 py-3 bg-gray-900 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                            >
                                トップページへ戻る
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Confirm({ store, date, time, menus, staff, totalPrice, totalDuration, auth_user }) {

    // If user is already logged in, we default to 'logged_in' action type
    const [actionType, setActionType] = useState(auth_user ? 'logged_in' : 'register');

    const { data, setData, post, processing, errors } = useForm({
        store_code: store.store_code,
        date: date,
        time: time,
        menu_ids: menus.map(m => m.id),
        staff_id: staff?.id || null,
        action_type: auth_user ? 'logged_in' : 'register',
        name: '',
        phone: '',
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        // Sync action type
        data.action_type = actionType;
        post(route('guest.reservation.store', { store_code: store.store_code }), {
            onFinish: () => {
                // Handle finish if valid
            }
        });
    };

    // Switch between Register and Login
    const handleActionChange = (type) => {
        setActionType(type);
        setData('action_type', type);
    };

    const formatTime = (timeStr) => {
        const [h, m] = timeStr.split(':');
        return `${h}:${m}`;
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-12">
            <Head title={`${store.name} - 予約確認`} />

            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-xl font-bold text-gray-900">{store.name}</h1>
                    </div>
                    {/* Progress / Step Indicator */}
                    <div className="flex items-center text-sm text-gray-500 space-x-2">
                        <span>日時選択</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        <span>メニュー選択</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        <span>スタッフ指名</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        <span className="font-bold text-indigo-600">お客様情報・確認</span>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

                <h2 className="text-2xl font-bold mb-6">予約内容の確認</h2>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">来店日時</dt>
                            <dd className="mt-1 text-lg font-bold text-gray-900">{formatDate(date)} {formatTime(time)}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">指名スタッフ</dt>
                            <dd className="mt-1 text-lg font-bold text-gray-900">{staff ? staff.name : '指名なし'}</dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">選択メニュー</dt>
                            <dd className="mt-1 text-base text-gray-900">
                                <ul className="list-disc list-inside">
                                    {menus.map(menu => (
                                        <li key={menu.id}>
                                            {menu.name} (¥{menu.price.toLocaleString()} / {menu.duration}分)
                                        </li>
                                    ))}
                                </ul>
                            </dd>
                        </div>
                        <div className="sm:col-span-2 border-t border-gray-100 pt-4 mt-2">
                            <div className="flex justify-between items-end">
                                <dt className="text-base font-bold text-gray-900">合計金額 (目安)</dt>
                                <dd className="text-2xl font-bold text-indigo-600">¥{totalPrice.toLocaleString()}</dd>
                            </div>
                        </div>
                    </dl>
                </div>

                <h2 className="text-2xl font-bold mb-6">お客様情報の入力</h2>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {auth_user ? (
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-lg mr-3">
                                    {auth_user.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{auth_user.name} 様</h3>
                                    <p className="text-sm text-gray-500">{auth_user.email}</p>
                                </div>
                            </div>
                            <p className="text-gray-600 mb-6">
                                こちらのアカウントで予約を確定します。
                            </p>
                            <button
                                onClick={submit}
                                disabled={processing}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg shadow-md transition-all disabled:opacity-50"
                            >
                                {processing ? '処理中...' : 'この内容で予約を確定する'}
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex border-b border-gray-200">
                                <button
                                    onClick={() => handleActionChange('register')}
                                    className={`flex-1 py-4 text-center font-bold text-sm transition-colors ${actionType === 'register' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    初めての方 (各種登録)
                                </button>
                                <button
                                    onClick={() => handleActionChange('login')}
                                    className={`flex-1 py-4 text-center font-bold text-sm transition-colors ${actionType === 'login' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    会員の方 (ログイン)
                                </button>
                            </div>

                            <div className="p-6">
                                {actionType === 'register' && (
                                    <form onSubmit={submit}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">お名前 <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                                placeholder="例: 山田 太郎"
                                            />
                                            {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">電話番号 <span className="text-red-500">*</span></label>
                                            <input
                                                type="tel"
                                                value={data.phone}
                                                onChange={e => setData('phone', e.target.value)}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                                placeholder="例: 090-1234-5678"
                                            />
                                            {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス <span className="text-red-500">*</span></label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                                placeholder="例: example@email.com"
                                            />
                                            {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                                        </div>
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">パスワード <span className="text-red-500">*</span></label>
                                            <input
                                                type="password"
                                                value={data.password}
                                                onChange={e => setData('password', e.target.value)}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                                placeholder="8文字以上"
                                            />
                                            {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg shadow-md transition-all disabled:opacity-50"
                                        >
                                            {processing ? '処理中...' : '登録して予約を確定する'}
                                        </button>
                                    </form>
                                )}

                                {actionType === 'login' && (
                                    <form onSubmit={submit}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                            {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                                        </div>
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
                                            <input
                                                type="password"
                                                value={data.password}
                                                onChange={e => setData('password', e.target.value)}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                            {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg shadow-md transition-all disabled:opacity-50"
                                        >
                                            {processing ? '処理中...' : 'ログインして予約を確定する'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </>
                    )}
                </div>

            </main>
        </div>
    );
}

import React from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function Staff({ store, availableStaff, date, time, menus, totalPrice, totalDuration }) {

    // Helper to select staff and proceed
    // Helper to select staff and proceed
    const selectStaff = (staffId = null) => {
        router.visit(route('guest.reservation.confirm', {
            store_code: store.store_code,
            date: date,
            time: time,
            menu_ids: menus.map(m => m.id),
            staff_id: staffId
        }));
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
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-24">
            <Head title={`${store.name} - スタッフ指名`} />

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
                        <span className="font-bold text-indigo-600">スタッフ指名</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        <span>お客様情報</span>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

                {/* Info Bar */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-8">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div className="text-xs text-indigo-500 font-bold uppercase tracking-wide">予約日時</div>
                            <div className="text-lg font-bold text-indigo-900">
                                {formatDate(date)} <span className="ml-2 text-xl">{formatTime(time)}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-indigo-500 font-bold uppercase tracking-wide">合計</div>
                            <div className="text-lg font-bold text-indigo-900">
                                ¥{totalPrice.toLocaleString()} / {totalDuration}分
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-indigo-200 pt-2 mt-2">
                        <div className="text-xs text-indigo-500 font-bold uppercase tracking-wide mb-1">選択メニュー</div>
                        <ul className="text-sm text-indigo-800 list-disc list-inside">
                            {menus.map(menu => (
                                <li key={menu.id}>{menu.name}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-6">スタッフを指名してください</h2>

                <div className="grid grid-cols-1 gap-6">
                    {/* No Nomination Option */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center sm:items-start transition-all hover:shadow-md">
                        <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 font-bold text-xl">なし</span>
                            </div>
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">指名なし</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                スタッフを指名せずに予約します。
                            </p>
                            <button
                                onClick={() => selectStaff(null)}
                                className="w-full sm:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors"
                            >
                                指名なしで予約へ進む
                            </button>
                        </div>
                    </div>

                    {/* Staff List */}
                    {availableStaff.map(staff => (
                        <div key={staff.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center sm:items-start transition-all hover:shadow-md">
                            <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                                {/* Placeholder for Staff Image if we had one */}
                                <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-2xl">
                                    {staff.name.charAt(0)}
                                </div>
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{staff.name}</h3>
                                {staff.specialties && (
                                    <div className="mb-2">
                                        <span className="inline-block bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full">{staff.specialties}</span>
                                    </div>
                                )}
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    {staff.introduction || '店舗スタッフです。'}
                                </p>
                                <button
                                    onClick={() => selectStaff(staff.id)}
                                    className="w-full sm:w-auto px-6 py-2 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold rounded-lg transition-colors"
                                >
                                    このスタッフを指名する
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {availableStaff.length === 0 && (
                    <div className="text-center mt-4 text-gray-500 text-sm">
                        ※ 現在、指名可能なスタッフはいませんが、「指名なし」で予約可能です。
                    </div>
                )}

            </main>
        </div>
    );
}

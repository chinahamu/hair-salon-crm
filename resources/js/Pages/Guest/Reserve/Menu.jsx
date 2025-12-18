import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Menu({ store, menus, date, time }) {
    const [selectedMenuIds, setSelectedMenuIds] = useState([]);

    const toggleMenu = (menuId) => {
        if (selectedMenuIds.includes(menuId)) {
            setSelectedMenuIds(selectedMenuIds.filter(id => id !== menuId));
        } else {
            setSelectedMenuIds([...selectedMenuIds, menuId]);
        }
    };

    const selectedMenus = menus.filter(menu => selectedMenuIds.includes(menu.id));
    const totalDuration = selectedMenus.reduce((sum, menu) => sum + menu.duration, 0);
    const totalPrice = selectedMenus.reduce((sum, menu) => sum + menu.price, 0);

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
            <Head title={`${store.name} - メニュー選択`} />

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
                        <span className="font-bold text-indigo-600">メニュー選択</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        <span>お客様情報</span>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

                {/* Info Bar */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-8 flex items-center justify-between">
                    <div>
                        <div className="text-xs text-indigo-500 font-bold uppercase tracking-wide">予約日時</div>
                        <div className="text-lg font-bold text-indigo-900">
                            {formatDate(date)} <span className="ml-2 text-2xl">{formatTime(time)}</span>
                        </div>
                    </div>
                    <Link
                        href={route('guest.reservation.index', { store_code: store.store_code })}
                        className="text-sm text-indigo-600 hover:text-indigo-800 underline"
                    >
                        変更する
                    </Link>
                </div>

                <h2 className="text-2xl font-bold mb-6">メニューを選択してください</h2>

                {/* Menu List */}
                <div className="space-y-4">
                    {menus.map((menu) => (
                        <div
                            key={menu.id}
                            onClick={() => toggleMenu(menu.id)}
                            className={`
                                relative flex items-start p-4 rounded-xl border-2 transition-all cursor-pointer bg-white
                                ${selectedMenuIds.includes(menu.id)
                                    ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500'
                                    : 'border-transparent shadow-sm hover:border-gray-200'
                                }
                            `}
                        >
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{menu.name}</h3>
                                    <div className="text-lg font-bold text-gray-900">¥{menu.price.toLocaleString()}</div>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    所要時間: {menu.duration}分
                                </div>
                                {menu.description && (
                                    <p className="text-gray-600 text-sm leading-relaxed">{menu.description}</p>
                                )}
                            </div>
                            <div className="ml-4 flex items-center h-full">
                                <div className={`
                                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                                    ${selectedMenuIds.includes(menu.id)
                                        ? 'bg-indigo-600 border-indigo-600'
                                        : 'border-gray-300'
                                    }
                                `}>
                                    {selectedMenuIds.includes(menu.id) && (
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {menus.length === 0 && (
                        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                            現在利用可能なメニューがありません。
                        </div>
                    )}
                </div>

            </main>

            {/* Bottom Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-20">
                <div className="max-w-3xl mx-auto flex justify-between items-center">
                    <div>
                        <div className="text-xs text-gray-500">合計 (目安)</div>
                        <div className="text-lg font-bold text-gray-900">
                            <span className="mr-4">¥{totalPrice.toLocaleString()}</span>
                            <span className="text-sm font-normal text-gray-600">{totalDuration}分</span>
                        </div>
                    </div>
                    <button
                        disabled={selectedMenuIds.length === 0}
                        className={`
                            px-8 py-3 rounded-lg font-bold text-white shadow-md transition-all
                            ${selectedMenuIds.length > 0
                                ? 'bg-indigo-600 hover:bg-indigo-700 transform hover:-translate-y-0.5'
                                : 'bg-gray-300 cursor-not-allowed'
                            }
                        `}
                        onClick={() => {
                            // Proceed to next step (Not implemented yet)
                            alert('Step 3: Confirm/UserInfo (Not implemented yet)\nMenus: ' + selectedMenuIds.join(', '));
                        }}
                    >
                        次へ進む
                    </button>
                </div>
            </div>
        </div>
    );
}

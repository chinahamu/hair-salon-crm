import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';

export default function Index({ store }) {
    // Helper to get local date string YYYY-MM-DD
    const getLocalDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [selectedDate, setSelectedDate] = useState(getLocalDateString(new Date()));
    const [availability, setAvailability] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAvailability = async () => {
            setLoading(true);
            try {
                // Using window.axios if configured, or relying on fetch
                const response = await window.axios.get(route('guest.reservation.availability', { store_code: store.store_code }), {
                    params: { date: selectedDate }
                });
                setAvailability(response.data);
            } catch (error) {
                console.error("Error fetching availability", error);
                setAvailability({ status: 'error', slots: [] });
            } finally {
                setLoading(false);
            }
        };

        fetchAvailability();
    }, [selectedDate, store.store_code]);

    const changeDate = (days) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + days);
        setSelectedDate(getLocalDateString(date));
    };

    const formatDateDisplay = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Head title={`${store.name} - 予約状況`} />

            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{store.name}</h1>
                        <p className="text-sm text-gray-500">{store.address}</p>
                    </div>
                    {/* Placeholder for menu or login link if needed */}
                </div>
            </header>

            <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

                <h2 className="text-2xl font-bold mb-6 text-center">予約日時の選択</h2>

                {/* Date Navigation */}
                <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <button
                        onClick={() => changeDate(-1)}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                        aria-label="前の日"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">予約日</div>
                        <div className="text-xl font-bold text-gray-900">
                            {formatDateDisplay(selectedDate)}
                        </div>
                    </div>

                    <button
                        onClick={() => changeDate(1)}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                        aria-label="次の日"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Availability Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                    </div>
                ) : availability ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {availability.status === 'closed' ? (
                            <div className="p-12 text-center">
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    {availability.reason === 'regular_holiday' ? '定休日です' : 'この日は休業日です'}
                                </h3>
                                <p className="mt-2 text-sm text-gray-500">別の日付を選択してください。</p>
                            </div>
                        ) : (
                            <div className="p-6">
                                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-4">
                                    {availability.slots.map((slot, index) => (
                                        <button
                                            key={index}
                                            disabled={!slot.available}
                                            onClick={() => router.visit(route('guest.reservation.menus', {
                                                store_code: store.store_code,
                                                date: selectedDate,
                                                time: slot.time
                                            }))}
                                            className={`
                                                relative flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
                                                ${slot.available
                                                    ? 'border-indigo-100 bg-indigo-50 hover:border-indigo-300 hover:shadow-md cursor-pointer'
                                                    : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                                                }
                                            `}
                                        >
                                            <span className="text-lg font-bold text-gray-900 mb-1">{slot.time}</span>
                                            <span className={`text-sm font-bold ${slot.available ? 'text-indigo-600' : 'text-gray-400'}`}>
                                                {slot.available ? '◎ 空き' : '× 満席'}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                {availability.slots.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        この日の予約枠はありません。
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12 text-red-500">
                        情報の取得に失敗しました。再読み込みしてください。
                    </div>
                )}
            </main>
        </div>
    );
}

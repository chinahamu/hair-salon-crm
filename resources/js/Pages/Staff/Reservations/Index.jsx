import React, { useState, useEffect } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

export default function Index({ auth, reservations, stores, staffs, filters }) {
    // Current View Mode: 'list', 'month', 'week', 'day'
    const [viewMode, setViewMode] = useState(filters.view_mode || 'list');

    // Current Navigation Date
    const [currentDate, setCurrentDate] = useState(filters.date ? new Date(filters.date) : new Date());

    const { data, setData, get } = useForm({
        date: filters.date || '',
        store_id: filters.store_id || '',
        staff_id: filters.staff_id || '',
    });

    // --- Timezone & Date Helpers ---

    // Format a Date object or ISO string to 'YYYY-MM-DD' in JST
    const toJSTDateString = (dateInput) => {
        if (!dateInput) return '';
        const date = new Date(dateInput);
        return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
    };

    // Format a Date object or ISO string to Display Date (e.g. 2024/12/18) in JST
    const formatDisplayDateJST = (dateInput) => {
        if (!dateInput) return '';
        const date = new Date(dateInput);
        return date.toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' });
    };

    // Format a Date object or ISO string to HH:MM in JST
    const formatTimeJST = (dateInput) => {
        if (!dateInput) return '';
        const date = new Date(dateInput);
        return date.toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Tokyo',
        });
    };

    // Format full datetime in JST
    const formatDateTimeJST = (dateInput) => {
        if (!dateInput) return '';
        const date = new Date(dateInput);
        return date.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
    };

    // Check if two dates are on the same day in JST
    const isSameDayJST = (d1, d2) => {
        return toJSTDateString(d1) === toJSTDateString(d2);
    };

    // --- Handlers ---

    const handleFilterChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const submitFilter = (e) => {
        e.preventDefault();
        const query = {
            store_id: data.store_id,
            staff_id: data.staff_id,
            view_mode: viewMode,
        };

        if (viewMode === 'list' && data.date) {
            query.date = data.date;
        } else {
            if (data.date) {
                const newDate = new Date(data.date);
                setCurrentDate(newDate);
                query.date = data.date;
            }
        }

        get(route('staff.reservations.index'), {
            data: query,
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Re-fetch when viewMode or currentDate changes
    useEffect(() => {
        if (viewMode === 'list') return;

        const query = {
            store_id: data.store_id,
            staff_id: data.staff_id,
            view_mode: viewMode,
            get_all: 1,
        };

        let start = new Date(currentDate);
        let end = new Date(currentDate);

        if (viewMode === 'month') {
            start.setDate(1);
            end.setMonth(end.getMonth() + 1);
            end.setDate(0);
        } else if (viewMode === 'week') {
            const day = start.getDay();
            const diff = start.getDate() - day;
            start.setDate(diff);
            end.setDate(start.getDate() + 6);
        } else if (viewMode === 'day') {
            // Just one day
        }

        query.start_date = toJSTDateString(start);
        query.end_date = toJSTDateString(end);

        router.get(route('staff.reservations.index'), query, {
            preserveState: true,
            preserveScroll: true,
            only: ['reservations'],
        });

    }, [currentDate, viewMode]);


    // Status badges
    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">確定</span>;
            case 'cancelled': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">キャンセル</span>;
            case 'completed': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">完了</span>;
            default: return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    // View Switcher Component
    const ViewSwitcher = () => (
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {['list', 'month', 'week', 'day'].map((mode) => (
                <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${viewMode === mode
                        ? 'bg-white shadow text-gray-900 font-medium'
                        : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    {mode === 'list' && 'リスト'}
                    {mode === 'month' && '月'}
                    {mode === 'week' && '週'}
                    {mode === 'day' && '日'}
                </button>
            ))}
        </div>
    );

    // Navigation Controls
    const navigate = (direction) => {
        const newDate = new Date(currentDate);
        if (viewMode === 'month') {
            newDate.setMonth(newDate.getMonth() + direction);
        } else if (viewMode === 'week') {
            newDate.setDate(newDate.getDate() + (direction * 7));
        } else if (viewMode === 'day') {
            newDate.setDate(newDate.getDate() + direction);
        }
        setCurrentDate(newDate);
    };

    // --- Render Functions ---

    const renderMonthView = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days = [];
        // Empty slots
        for (let i = 0; i < startingDay; i++) {
            days.push(<div key={`empty-${i}`} className="bg-gray-50 h-24 border-b border-r border-gray-200" />);
        }

        const resList = Array.isArray(reservations) ? reservations : (reservations.data || []);

        for (let i = 1; i <= daysInMonth; i++) {
            const cellDate = new Date(year, month, i);
            const targetDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

            const daysRes = resList.filter(r => toJSTDateString(r.start_time) === targetDateStr);

            days.push(
                <div key={i} className="bg-white h-24 border-b border-r border-gray-200 p-1 overflow-y-auto">
                    <div className="text-sm font-semibold text-gray-700">{i}</div>
                    <div className="mt-1 space-y-1">
                        {daysRes.map(res => (
                            <Link key={res.id} href={route('staff.reservations.edit', res.id)} className="block text-xs bg-indigo-50 text-indigo-700 rounded px-1 truncate">
                                {formatTimeJST(res.start_time)} {res.user?.name}
                            </Link>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="border border-gray-200 mt-4">
                <div className="grid grid-cols-7 bg-gray-100 border-b border-gray-200 text-center text-sm font-medium text-gray-500 py-2">
                    <div>日</div><div>月</div><div>火</div><div>水</div><div>木</div><div>金</div><div>土</div>
                </div>
                <div className="grid grid-cols-7">
                    {days}
                </div>
            </div>
        );
    };

    const renderWeekView = () => {
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        startOfWeek.setDate(startOfWeek.getDate() - day);

        const weekDays = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(d.getDate() + i);
            weekDays.push(d);
        }

        const resList = Array.isArray(reservations) ? reservations : (reservations.data || []);

        return (
            <div className="border border-gray-200 mt-4 overflow-x-auto">
                <div className="grid grid-cols-7 min-w-[800px]">
                    {weekDays.map((d, idx) => {
                        const cellDateStr = toJSTDateString(d);

                        return (
                            <div key={idx} className="border-r border-gray-200 last:border-r-0">
                                <div className="bg-gray-100 text-center py-2 text-sm font-medium border-b border-gray-200">
                                    {d.getMonth() + 1}/{d.getDate()} ({['日', '月', '火', '水', '木', '金', '土'][d.getDay()]})
                                </div>
                                <div className="bg-white min-h-[400px] p-2 space-y-2">
                                    {resList.filter(r => toJSTDateString(r.start_time) === cellDateStr).map(r => (
                                        <Link key={r.id} href={route('staff.reservations.edit', r.id)} className="block p-2 text-xs bg-indigo-50 border border-indigo-100 rounded hover:bg-indigo-100">
                                            <div className="font-bold">{formatTimeJST(r.start_time)}</div>
                                            <div>{r.user?.name}</div>
                                            <div className="text-gray-500">{r.staff?.name}</div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderDayView = () => {
        // We want strict "Same Date in JST" as currentDate
        const targetDateStr = toJSTDateString(currentDate);
        const resList = Array.isArray(reservations) ? reservations : (reservations.data || []);
        const daysRes = resList.filter(r => toJSTDateString(r.start_time) === targetDateStr);

        const staffGroups = {};
        const displayStaffs = (data.staff_id)
            ? staffs.filter(s => s.id == data.staff_id)
            : staffs;

        displayStaffs.forEach(s => {
            staffGroups[s.id] = { staff: s, reservations: [] };
        });

        daysRes.forEach(r => {
            if (r.staff_id && staffGroups[r.staff_id]) {
                staffGroups[r.staff_id].reservations.push(r);
            }
        });

        return (
            <div className="border border-gray-200 mt-4 overflow-x-auto">
                <div className="flex min-w-full">
                    {Object.values(staffGroups).map((group) => (
                        <div key={group.staff.id} className="flex-1 min-w-[150px] border-r border-gray-200">
                            <div className="bg-gray-100 text-center py-2 text-sm font-bold border-b border-gray-200 sticky top-0">
                                {group.staff.name}
                            </div>
                            <div className="bg-white min-h-[400px] p-2 relative">
                                {group.reservations.sort((a, b) => new Date(a.start_time) - new Date(b.start_time)).map(r => (
                                    <Link key={r.id} href={route('staff.reservations.edit', r.id)} className="block mb-2 p-2 text-xs bg-indigo-50 border border-indigo-100 rounded hover:bg-indigo-100">
                                        <div className="font-bold">
                                            {formatTimeJST(r.start_time)} - {formatTimeJST(r.end_time)}
                                        </div>
                                        <div>{r.user?.name}</div>
                                        <div>{r.menus?.map(m => m.name).join(', ')}</div>
                                    </Link>
                                ))}
                                {group.reservations.length === 0 && (
                                    <div className="text-gray-400 text-xs text-center mt-4">- 予約なし -</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderListView = () => (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日時</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">顧客</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">店舗</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">担当スタッフ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {(reservations.data || []).map((reservation) => (
                                <tr key={reservation.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reservation.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDateTimeJST(reservation.start_time)} <br />
                                        <span className="text-gray-500 text-xs">~ {formatTimeJST(reservation.end_time)}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.user?.name || '不明'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.store?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.staff?.name || '指名なし'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(reservation.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link href={route('staff.reservations.edit', reservation.id)} className="text-indigo-600 hover:text-indigo-900">編集</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4">
                    {reservations.links && reservations.links.map((link, key) => (
                        link.url ?
                            <Link
                                key={key}
                                href={link.url}
                                className={`mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-indigo-500 focus:text-indigo-500 ${link.active ? 'bg-indigo-600 text-white' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            /> : <span key={key} className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded" dangerouslySetInnerHTML={{ __html: link.label }}></span>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <StaffLayout stores={stores}>
            <Head title="予約管理" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">予約管理</h2>

                        <div className="flex items-center gap-4">
                            {/* Navigation for Calendar */}
                            {viewMode !== 'list' && (
                                <div className="flex items-center bg-white rounded-md shadow-sm border border-gray-300">
                                    <button onClick={() => navigate(-1)} className="px-3 py-1 hover:bg-gray-50 border-r text-gray-600">
                                        &lt;
                                    </button>
                                    <span className="px-4 py-1 font-medium text-gray-700 min-w-[150px] text-center">
                                        {viewMode === 'month' && `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月`}
                                        {viewMode === 'week' && `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月`}
                                        {viewMode === 'day' && `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月${currentDate.getDate()}日`}
                                    </span>
                                    <button onClick={() => navigate(1)} className="px-3 py-1 hover:bg-gray-50 border-l text-gray-600">
                                        &gt;
                                    </button>
                                </div>
                            )}

                            <ViewSwitcher />
                        </div>
                    </div>

                    {/* Actions and Filters */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex gap-2">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {viewMode === 'list' ? '予約リスト' : 'カレンダー'}
                                </h3>
                            </div>

                            <Link href={route('staff.reservations.create')}>
                                <PrimaryButton>新規予約登録</PrimaryButton>
                            </Link>
                        </div>

                        <form onSubmit={submitFilter} className="flex gap-4 items-end flex-wrap">
                            <div>
                                <InputLabel htmlFor="date" value="日付" />
                                <TextInput
                                    id="date"
                                    type="date"
                                    name="date"
                                    value={data.date}
                                    className="mt-1 block w-full"
                                    onChange={handleFilterChange}
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="store_id" value="店舗" />
                                <select
                                    id="store_id"
                                    name="store_id"
                                    value={data.store_id}
                                    onChange={handleFilterChange}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                >
                                    <option value="">全店舗</option>
                                    {stores.map(store => (
                                        <option key={store.id} value={store.id}>{store.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <InputLabel htmlFor="staff_id" value="スタッフ" />
                                <select
                                    id="staff_id"
                                    name="staff_id"
                                    value={data.staff_id}
                                    onChange={handleFilterChange}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                >
                                    <option value="">全スタッフ</option>
                                    {staffs.map(staff => (
                                        <option key={staff.id} value={staff.id}>{staff.name}</option>
                                    ))}
                                </select>
                            </div>

                            <PrimaryButton className="mb-0.5" disabled={false}>
                                絞り込み
                            </PrimaryButton>
                        </form>
                    </div>


                    {viewMode === 'list' && renderListView()}
                    {viewMode === 'month' && renderMonthView()}
                    {viewMode === 'week' && renderWeekView()}
                    {viewMode === 'day' && renderDayView()}

                </div>
            </div>
        </StaffLayout>
    );
}

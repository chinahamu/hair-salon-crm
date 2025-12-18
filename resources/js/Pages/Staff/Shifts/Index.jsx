import React, { useState, useEffect } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';

export default function Index({ auth, shifts, stores, staffList, filters }) {
    // Current View Mode: 'list', 'month', 'week', 'day'
    const [viewMode, setViewMode] = useState(filters.view_mode || 'list');

    // Current Navigation Date
    const [currentDate, setCurrentDate] = useState(filters.date ? new Date(filters.date) : new Date());

    // Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Filter Form
    const { data: filterData, setData: setFilterData, get } = useForm({
        date: filters.date || '',
        store_id: filters.store_id || '',
        staff_id: filters.staff_id || '',
    });

    // Create Form
    const { data: createData, setData: setCreateData, post, processing, errors: createErrors, reset: resetCreate, clearErrors } = useForm({
        staff_id: auth.user.staff ? auth.user.staff.id : (staffList.length > 0 ? staffList[0].id : ''),
        store_id: filters.store_id || (stores.length > 0 ? stores[0].id : ''),
        start_time: '',
        end_time: '',
    });

    // --- Timezone & Date Helpers ---

    const toJSTDateString = (dateInput) => {
        if (!dateInput) return '';
        const date = new Date(dateInput);
        return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
    };

    const formatDisplayDateJST = (dateInput) => {
        if (!dateInput) return '';
        const date = new Date(dateInput);
        return date.toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' });
    };

    const formatTimeJST = (dateInput) => {
        if (!dateInput) return '';
        const date = new Date(dateInput);
        return date.toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Tokyo',
        });
    };

    const formatDateTimeJST = (dateInput) => {
        if (!dateInput) return '';
        const date = new Date(dateInput);
        return date.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
    };

    // --- Handlers ---

    const handleFilterChange = (e) => {
        setFilterData(e.target.name, e.target.value);
    };

    const submitFilter = (e) => {
        e.preventDefault();
        const query = {
            store_id: filterData.store_id,
            staff_id: filterData.staff_id,
            view_mode: viewMode,
        };

        if (viewMode === 'list' && filterData.date) {
            query.date = filterData.date;
        } else {
            // If manual date set in list mode or forced update
            // Logic in Reservation was: if data.date set, use it.
            if (filterData.date) {
                const newDate = new Date(filterData.date);
                setCurrentDate(newDate);
                query.date = filterData.date;
            }
        }

        get(route('staff.shifts.index'), {
            data: query,
            preserveState: true,
            preserveScroll: true,
        });
    };

    const submitCreate = (e) => {
        e.preventDefault();
        post(route('staff.shifts.store'), {
            onSuccess: () => {
                setShowCreateModal(false);
                resetCreate('start_time', 'end_time');
                // Refresh logic is handled by Inertia reload
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('このシフトを削除してもよろしいですか？')) {
            router.delete(route('staff.shifts.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    // Re-fetch when viewMode or currentDate changes
    useEffect(() => {
        if (viewMode === 'list') return;

        const query = {
            store_id: filterData.store_id,
            staff_id: filterData.staff_id,
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

        router.get(route('staff.shifts.index'), query, {
            preserveState: true,
            preserveScroll: true,
            only: ['shifts'],
        });

    }, [currentDate, viewMode]);


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

        const shiftList = Array.isArray(shifts) ? shifts : (shifts.data || []);

        for (let i = 1; i <= daysInMonth; i++) {
            const cellDate = new Date(year, month, i);
            const targetDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

            const daysShifts = shiftList.filter(s => toJSTDateString(s.start_time) === targetDateStr);

            days.push(
                <div key={i} className="bg-white h-24 border-b border-r border-gray-200 p-1 overflow-y-auto">
                    <div className="text-sm font-semibold text-gray-700">{i}</div>
                    <div className="mt-1 space-y-1">
                        {daysShifts.map(s => (
                            <div key={s.id} className="text-xs bg-indigo-50 text-indigo-700 rounded px-1 truncate flex justify-between items-center group">
                                <span>{formatTimeJST(s.start_time)} {s.staff?.name}</span>
                                <button onClick={() => handleDelete(s.id)} className="text-red-500 hidden group-hover:block ml-1">×</button>
                            </div>
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

        const shiftList = Array.isArray(shifts) ? shifts : (shifts.data || []);

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
                                    {shiftList.filter(s => toJSTDateString(s.start_time) === cellDateStr).map(s => (
                                        <div key={s.id} className="block p-2 text-xs bg-indigo-50 border border-indigo-100 rounded hover:bg-indigo-100 relative group">
                                            <div className="font-bold">{formatTimeJST(s.start_time)} - {formatTimeJST(s.end_time)}</div>
                                            <div>{s.staff?.name}</div>
                                            <button onClick={() => handleDelete(s.id)} className="absolute top-1 right-1 text-red-500 hidden group-hover:block">×</button>
                                        </div>
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
        const targetDateStr = toJSTDateString(currentDate);
        const shiftList = Array.isArray(shifts) ? shifts : (shifts.data || []);
        const daysShifts = shiftList.filter(s => toJSTDateString(s.start_time) === targetDateStr);

        const staffGroups = {};
        const displayStaffs = (filterData.staff_id)
            ? staffList.filter(s => s.id == filterData.staff_id)
            : staffList;

        displayStaffs.forEach(s => {
            staffGroups[s.id] = { staff: s, shifts: [] };
        });

        daysShifts.forEach(s => {
            if (s.staff_id && staffGroups[s.staff_id]) {
                staffGroups[s.staff_id].shifts.push(s);
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
                                {group.shifts.sort((a, b) => new Date(a.start_time) - new Date(b.start_time)).map(s => (
                                    <div key={s.id} className="block mb-2 p-2 text-xs bg-indigo-50 border border-indigo-100 rounded hover:bg-indigo-100 relative group">
                                        <div className="font-bold">
                                            {formatTimeJST(s.start_time)} - {formatTimeJST(s.end_time)}
                                        </div>
                                        <div>{s.store?.name}</div>
                                        <button onClick={() => handleDelete(s.id)} className="absolute top-1 right-1 text-red-500 hidden group-hover:block">×</button>
                                    </div>
                                ))}
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">スタッフ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">店舗</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">開始</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">終了</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {(shifts.data || []).map((shift) => (
                                <tr key={shift.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shift.staff.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shift.store?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateTimeJST(shift.start_time)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateTimeJST(shift.end_time)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shift.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(shift.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            削除
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination - Only show in list view */}
                <div className="mt-4">
                    {shifts.links && shifts.links.map((link, key) => (
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
        <StaffLayout
            stores={stores}
        >
            <Head title="シフト管理" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">シフト管理</h2>

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
                                    {viewMode === 'list' ? 'シフトリスト' : 'カレンダー'}
                                </h3>
                            </div>

                            <PrimaryButton onClick={() => setShowCreateModal(true)}>New Shift</PrimaryButton>
                        </div>

                        <form onSubmit={submitFilter} className="flex gap-4 items-end flex-wrap">
                            <div>
                                <InputLabel htmlFor="date" value="日付" />
                                <TextInput
                                    id="date"
                                    type="date"
                                    name="date"
                                    value={filterData.date}
                                    className="mt-1 block w-full"
                                    onChange={handleFilterChange}
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="store_id" value="店舗" />
                                <select
                                    id="store_id"
                                    name="store_id"
                                    value={filterData.store_id}
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
                                    value={filterData.staff_id}
                                    onChange={handleFilterChange}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                >
                                    <option value="">全スタッフ</option>
                                    {staffList.map(staff => (
                                        <option key={staff.id} value={staff.id}>{staff.name}</option>
                                    ))}
                                </select>
                            </div>

                            <PrimaryButton classNa="mb-0.5" disabled={false}>
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

            <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">新規シフト登録</h2>
                    <form onSubmit={submitCreate} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="modal_staff_id" value="スタッフ" />
                            <select
                                id="modal_staff_id"
                                name="staff_id"
                                value={createData.staff_id}
                                onChange={(e) => setCreateData('staff_id', e.target.value)}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            >
                                {staffList.map((staff) => (
                                    <option key={staff.id} value={staff.id}>
                                        {staff.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={createErrors.staff_id} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="modal_store_id" value="店舗" />
                            <select
                                id="modal_store_id"
                                name="store_id"
                                value={createData.store_id}
                                onChange={(e) => setCreateData('store_id', e.target.value)}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            >
                                {stores.map((store) => (
                                    <option key={store.id} value={store.id}>
                                        {store.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={createErrors.store_id} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="start_time" value="開始日時" />
                                <TextInput
                                    id="start_time"
                                    type="datetime-local"
                                    name="start_time"
                                    value={createData.start_time}
                                    onChange={(e) => setCreateData('start_time', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={createErrors.start_time} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="end_time" value="終了日時" />
                                <TextInput
                                    id="end_time"
                                    type="datetime-local"
                                    name="end_time"
                                    value={createData.end_time}
                                    onChange={(e) => setCreateData('end_time', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={createErrors.end_time} className="mt-2" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <SecondaryButton onClick={() => setShowCreateModal(false)}>キャンセル</SecondaryButton>
                            <PrimaryButton disabled={processing}>登録する</PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </StaffLayout>
    );
}

import React, { useState, useEffect } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Checkbox from '@/Components/Checkbox';
import DangerButton from '@/Components/DangerButton';

export default function Edit({ auth, reservation, stores, users, staffs }) {
    // Helper to format date for datetime-local input (YYYY-MM-DDTHH:mm)
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        // We need local ISO string.
        const offset = d.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(d - offset)).toISOString().slice(0, 16);
        return localISOTime;
    };

    const { data, setData, put, processing, errors, delete: destroy } = useForm({
        user_id: reservation.user_id,
        store_id: reservation.store_id,
        menu_ids: reservation.menus ? reservation.menus.map(m => m.id) : [],
        start_time: formatDate(reservation.start_time),
        staff_id: reservation.staff_id || '',
        is_nominated: !!reservation.is_nominated,
        status: reservation.status,
    });

    const [availableMenus, setAvailableMenus] = useState([]);

    useEffect(() => {
        if (data.store_id) {
            const selectedStore = stores.find(s => s.id == data.store_id);
            setAvailableMenus(selectedStore ? selectedStore.menus : []);
        } else {
            setAvailableMenus([]);
        }
    }, [data.store_id, stores]);

    const handleMenuChange = (e) => {
        const menuId = parseInt(e.target.value);
        if (e.target.checked) {
            setData('menu_ids', [...data.menu_ids, menuId]);
        } else {
            setData('menu_ids', data.menu_ids.filter(id => id !== menuId));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('staff.reservations.update', reservation.id));
    };

    const cancelReservation = (e) => {
        e.preventDefault();
        if (confirm('本当にこの予約をキャンセルしてもよろしいですか？')) {
            destroy(route('staff.reservations.destroy', reservation.id));
        }
    };

    return (
        <StaffLayout
            stores={stores}
        >
            <Head title={`予約編集 #${reservation.id}`} />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight mb-6">予約編集 #{reservation.id}</h2>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit}>
                                {/* Store Selection */}
                                <div>
                                    <InputLabel htmlFor="store_id" value="店舗" />
                                    <select
                                        id="store_id"
                                        name="store_id"
                                        value={data.store_id}
                                        onChange={(e) => setData('store_id', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="">店舗を選択してください</option>
                                        {stores.map(store => (
                                            <option key={store.id} value={store.id}>{store.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.store_id} className="mt-2" />
                                </div>

                                {/* User Selection */}
                                <div className="mt-4">
                                    <InputLabel htmlFor="user_id" value="顧客" />
                                    <select
                                        id="user_id"
                                        name="user_id"
                                        value={data.user_id}
                                        onChange={(e) => setData('user_id', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="">顧客を選択してください</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.user_id} className="mt-2" />
                                </div>

                                {/* Menu Selection */}
                                <div className="mt-4">
                                    <InputLabel value="メニュー" />
                                    <div className="mt-2 grid grid-cols-1 gap-2 border p-3 rounded-md max-h-48 overflow-y-auto">
                                        {availableMenus.length > 0 ? availableMenus.map(menu => (
                                            <label key={menu.id} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    value={menu.id}
                                                    checked={data.menu_ids.includes(menu.id)}
                                                    onChange={handleMenuChange}
                                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                />
                                                <span className="text-gray-700">{menu.name} - ¥{menu.price} ({menu.duration}分)</span>
                                            </label>
                                        )) : <p className="text-sm text-gray-500">この店舗で利用可能なメニューはありません。</p>}
                                    </div>
                                    <InputError message={errors.menu_ids} className="mt-2" />
                                </div>

                                {/* Date & Time */}
                                <div className="mt-4">
                                    <InputLabel htmlFor="start_time" value="日時" />
                                    <TextInput
                                        id="start_time"
                                        type="datetime-local"
                                        name="start_time"
                                        value={data.start_time}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('start_time', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.start_time} className="mt-2" />
                                </div>

                                {/* Staff Selection */}
                                <div className="mt-4">
                                    <InputLabel htmlFor="staff_id" value="担当スタッフ (任意)" />
                                    <select
                                        id="staff_id"
                                        name="staff_id"
                                        value={data.staff_id}
                                        onChange={(e) => setData('staff_id', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    >
                                        <option value="">指名なし (空いているスタッフ)</option>
                                        {staffs.map(staff => (
                                            <option key={staff.id} value={staff.id}>{staff.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.staff_id} className="mt-2" />
                                </div>

                                {/* Nomination */}
                                <div className="block mt-4">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="is_nominated"
                                            checked={data.is_nominated}
                                            onChange={(e) => setData('is_nominated', e.target.checked)}
                                        />
                                        <span className="ml-2 text-sm text-gray-600">指名する</span>
                                    </label>
                                </div>

                                {/* Status */}
                                <div className="mt-4">
                                    <InputLabel htmlFor="status" value="ステータス" />
                                    <select
                                        id="status"
                                        name="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="confirmed">確定</option>
                                        <option value="completed">完了</option>
                                        <option value="cancelled">キャンセル</option>
                                    </select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <DangerButton type="button" onClick={cancelReservation} >
                                        予約をキャンセルする
                                    </DangerButton>

                                    <div className="flex items-center">
                                        <Link href={route('staff.reservations.index')} className="text-sm text-gray-600 hover:text-gray-900 underline mr-4">
                                            戻る
                                        </Link>
                                        <PrimaryButton className="ml-4" disabled={processing}>
                                            更新する
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}

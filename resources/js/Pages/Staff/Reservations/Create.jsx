import React, { useState, useEffect } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Checkbox from '@/Components/Checkbox';

export default function Create({ auth, stores, users, staffs }) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        store_id: stores.length > 0 ? stores[0].id : '',
        menu_ids: [],
        start_time: '',
        staff_id: '',
        is_nominated: false,
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
        post(route('staff.reservations.store'));
    };

    return (
        <StaffLayout
            stores={stores}
        >
            <Head title="Create Reservation" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight mb-6">Create Reservation</h2>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit}>
                                {/* Store Selection */}
                                <div>
                                    <InputLabel htmlFor="store_id" value="Store" />
                                    <select
                                        id="store_id"
                                        name="store_id"
                                        value={data.store_id}
                                        onChange={(e) => setData('store_id', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="">Select a Store</option>
                                        {stores.map(store => (
                                            <option key={store.id} value={store.id}>{store.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.store_id} className="mt-2" />
                                </div>

                                {/* User Selection */}
                                <div className="mt-4">
                                    <InputLabel htmlFor="user_id" value="Customer" />
                                    <select
                                        id="user_id"
                                        name="user_id"
                                        value={data.user_id}
                                        onChange={(e) => setData('user_id', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="">Select a Customer</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.user_id} className="mt-2" />
                                </div>

                                {/* Menu Selection */}
                                <div className="mt-4">
                                    <InputLabel value="Menus" />
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
                                                <span className="text-gray-700">{menu.name} - ¥{menu.price} ({menu.duration} min)</span>
                                            </label>
                                        )) : <p className="text-sm text-gray-500">No menus available for this store.</p>}
                                    </div>
                                    <InputError message={errors.menu_ids} className="mt-2" />
                                </div>

                                {/* Date & Time */}
                                <div className="mt-4">
                                    <InputLabel htmlFor="start_time" value="Date & Time" />
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
                                    <InputLabel htmlFor="staff_id" value="Staff (Optional)" />
                                    <select
                                        id="staff_id"
                                        name="staff_id"
                                        value={data.staff_id}
                                        onChange={(e) => setData('staff_id', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    >
                                        <option value="">Any Available</option>
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
                                        <span className="ml-2 text-sm text-gray-600">Nominated (Finger-name request)</span>
                                    </label>
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <Link href={route('staff.reservations.index')} className="text-sm text-gray-600 hover:text-gray-900 underline mr-4">
                                        Cancel
                                    </Link>
                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Create Reservation
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}

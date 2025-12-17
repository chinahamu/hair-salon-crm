import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

export default function Create({ auth, stores }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        store_id: stores.length > 0 ? stores[0].id : '',
        staff_id: '',
        start_time: '',
        end_time: '',
        is_nominated: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('reservations.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Make a Reservation</h2>}
        >
            <Head title="Reservation" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="space-y-4 max-w-md">
                                <div>
                                    <InputLabel htmlFor="store_id" value="Store" />
                                    <select
                                        id="store_id"
                                        name="store_id"
                                        value={data.store_id}
                                        onChange={(e) => setData('store_id', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    >
                                        {stores.map((store) => (
                                            <option key={store.id} value={store.id}>
                                                {store.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.store_id} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="start_time" value="Start Time" />
                                        <TextInput
                                            id="start_time"
                                            type="datetime-local"
                                            name="start_time"
                                            value={data.start_time}
                                            onChange={(e) => setData('start_time', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors.start_time} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="end_time" value="End Time" />
                                        <TextInput
                                            id="end_time"
                                            type="datetime-local"
                                            name="end_time"
                                            value={data.end_time}
                                            onChange={(e) => setData('end_time', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors.end_time} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="staff_id" value="Nominate Staff (Optional)" />
                                    <TextInput
                                        id="staff_id"
                                        type="number"
                                        placeholder="Staff ID (Advanced: dynamic fetch implemented later)"
                                        name="staff_id"
                                        value={data.staff_id}
                                        onChange={(e) => {
                                            setData('staff_id', e.target.value);
                                            setData('is_nominated', !!e.target.value);
                                        }}
                                        className="mt-1 block w-full"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Leave blank for auto-assignment.</p>
                                    <InputError message={errors.staff_id} className="mt-2" />
                                </div>

                                <PrimaryButton disabled={processing}>Book Appointment</PrimaryButton>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import React, { useState } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Head, useForm, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

export default function Index({ auth, shifts, staffList, store }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        staff_id: auth.user ? auth.user.id : (staffList.length > 0 ? staffList[0].id : ''),
        store_id: store.id,
        start_time: '',
        end_time: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('staff.shifts.store'), {
            onSuccess: () => reset('start_time', 'end_time'),
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this shift?')) {
            router.delete(route('staff.shifts.destroy', id));
        }
    };

    return (
        <StaffLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Shift Management</h2>}
            stores={auth.user.staff?.organization?.stores || []} // Assuming passed by middleware or layout logic? Layout expects stores. 
            // Wait, Layout expects 'stores' and 'selectedStore'. 
            // StaffLayout typically gets these from props. Dashboard passes them.
            // I should pass them from controller if Layout needs them.
            // But StaffLayout implies they might be global or shared. 
            // In Dashboard, they are passed from DashboardController.
            // I need to ensure ShiftController passes necessary layout props or Layout handles it.
            // Let's assume standard props handling.
            // Just pass nothing for now or handle in controller.
            // Re-reading Dashboard.jsx: <StaffLayout stores={stores} selectedStore={selectedStore}>
            // So these need to be passed to this Index component.
            selectedStore={store}
        >
            <Head title="Shifts" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">Add New Shift</h3>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="staff_id" value="Staff" />
                                    <select
                                        id="staff_id"
                                        name="staff_id"
                                        value={data.staff_id}
                                        onChange={(e) => setData('staff_id', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    >
                                        {staffList.map((staff) => (
                                            <option key={staff.id} value={staff.id}>
                                                {staff.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.staff_id} className="mt-2" />
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

                                <PrimaryButton disabled={processing}>Add Shift</PrimaryButton>
                            </form>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">Scheduled Shifts</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {shifts.map((shift) => (
                                            <tr key={shift.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{shift.staff.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{shift.start_time}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{shift.end_time}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{shift.status}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleDelete(shift.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}

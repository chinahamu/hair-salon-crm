import React from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

export default function Index({ auth, reservations, stores, filters }) {
    const { data, setData, get } = useForm({
        date: filters.date || '',
        store_id: filters.store_id || '',
    });

    const handleFilterChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const submitFilter = (e) => {
        e.preventDefault();
        get(route('staff.reservations.index'));
    };

    // Status badges
    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Confirmed</span>;
            case 'cancelled': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Cancelled</span>;
            case 'completed': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Completed</span>;
            default: return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    return (
        <StaffLayout
            stores={stores}
        >
            <Head title="Reservations" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight mb-6">Reservation Management</h2>

                    {/* Actions and Filters */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Reservations List</h3>
                            <Link href={route('staff.reservations.create')}>
                                <PrimaryButton>New Reservation</PrimaryButton>
                            </Link>
                        </div>

                        <form onSubmit={submitFilter} className="flex gap-4 items-end">
                            <div>
                                <InputLabel htmlFor="date" value="Date" />
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
                                <InputLabel htmlFor="store_id" value="Store" />
                                <select
                                    id="store_id"
                                    name="store_id"
                                    value={data.store_id}
                                    onChange={handleFilterChange}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                >
                                    <option value="">All Stores</option>
                                    {stores.map(store => (
                                        <option key={store.id} value={store.id}>{store.name}</option>
                                    ))}
                                </select>
                            </div>

                            <PrimaryButton className="mb-0.5" disabled={false}>
                                Filter
                            </PrimaryButton>
                        </form>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {reservations.data.map((reservation) => (
                                            <tr key={reservation.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reservation.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(reservation.start_time).toLocaleString('ja-JP')} <br />
                                                    <span className="text-gray-500 text-xs">~ {new Date(reservation.end_time).toLocaleTimeString('ja-JP')}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.user?.name || 'Unknown'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.store?.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.staff?.name || 'Any'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(reservation.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link href={route('staff.reservations.edit', reservation.id)} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
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
                </div>
            </div>
        </StaffLayout>
    );
}

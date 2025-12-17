import { Head, Link, useForm } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Edit({ store }) {
    const { data, setData, put, processing, errors } = useForm({
        name: store.name,
        phone: store.phone,
        address: store.address,
        email: store.email || '',
        description: store.description || '',
        business_hours: store.business_hours || { start: '09:00', end: '18:00' },
        regular_holidays: store.regular_holidays || [],
        temporary_closures: store.temporary_closures || [],
        min_reservation_unit: store.min_reservation_unit || 30,
    });

    const daysOfWeek = [
        { id: 'Mon', label: '月' },
        { id: 'Tue', label: '火' },
        { id: 'Wed', label: '水' },
        { id: 'Thu', label: '木' },
        { id: 'Fri', label: '金' },
        { id: 'Sat', label: '土' },
        { id: 'Sun', label: '日' },
    ];

    const handleHolidayChange = (day) => {
        if (data.regular_holidays.includes(day)) {
            setData('regular_holidays', data.regular_holidays.filter(d => d !== day));
        } else {
            setData('regular_holidays', [...data.regular_holidays, day]);
        }
    };

    const addTemporaryClosure = () => {
        setData('temporary_closures', [...data.temporary_closures, '']);
    };

    const updateTemporaryClosure = (index, value) => {
        const newClosures = [...data.temporary_closures];
        newClosures[index] = value;
        setData('temporary_closures', newClosures);
    };

    const removeTemporaryClosure = (index) => {
        const newClosures = data.temporary_closures.filter((_, i) => i !== index);
        setData('temporary_closures', newClosures);
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('staff.stores.update', store.id));
    };

    return (
        <StaffLayout>
            <Head title="店舗編集" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-xl font-semibold mb-6">店舗編集</h2>

                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">店舗名</label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">電話番号</label>
                                    <input
                                        id="phone"
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.phone && <div className="text-red-600 text-sm mt-1">{errors.phone}</div>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">住所</label>
                                    <input
                                        id="address"
                                        type="text"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.address && <div className="text-red-600 text-sm mt-1">{errors.address}</div>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス (任意)</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">説明 (任意)</label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows="4"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    ></textarea>
                                    {errors.description && <div className="text-red-600 text-sm mt-1">{errors.description}</div>}
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">営業時間設定</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">開店時間</label>
                                            <input
                                                type="time"
                                                value={data.business_hours?.start || ''}
                                                onChange={(e) => setData('business_hours', { ...data.business_hours, start: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">閉店時間</label>
                                            <input
                                                type="time"
                                                value={data.business_hours?.end || ''}
                                                onChange={(e) => setData('business_hours', { ...data.business_hours, end: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                    {errors.business_hours && <div className="text-red-600 text-sm mt-1">{errors.business_hours}</div>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">定休日</label>
                                    <div className="flex flex-wrap gap-4">
                                        {daysOfWeek.map((day) => (
                                            <label key={day.id} className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    value={day.id}
                                                    checked={data.regular_holidays.includes(day.id)}
                                                    onChange={() => handleHolidayChange(day.id)}
                                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">{day.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.regular_holidays && <div className="text-red-600 text-sm mt-1">{errors.regular_holidays}</div>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">臨時休業日</label>
                                    {data.temporary_closures.map((date, index) => (
                                        <div key={index} className="flex items-center mb-2">
                                            <input
                                                type="date"
                                                value={date}
                                                onChange={(e) => updateTemporaryClosure(index, e.target.value)}
                                                className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mr-2"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeTemporaryClosure(index)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                削除
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addTemporaryClosure}
                                        className="mt-1 text-sm text-indigo-600 hover:text-indigo-900"
                                    >
                                        + 臨時休業日を追加
                                    </button>
                                    {errors.temporary_closures && <div className="text-red-600 text-sm mt-1">{errors.temporary_closures}</div>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="min_reservation_unit" className="block text-sm font-medium text-gray-700">最小予約単位 (分)</label>
                                    <select
                                        id="min_reservation_unit"
                                        value={data.min_reservation_unit}
                                        onChange={(e) => setData('min_reservation_unit', parseInt(e.target.value))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="15">15分</option>
                                        <option value="30">30分</option>
                                        <option value="45">45分</option>
                                        <option value="60">60分</option>
                                    </select>
                                    {errors.min_reservation_unit && <div className="text-red-600 text-sm mt-1">{errors.min_reservation_unit}</div>}
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <Link
                                        href={route('staff.stores.index')}
                                        className="text-gray-600 hover:text-gray-900 mr-4"
                                    >
                                        キャンセル
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        更新
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { useState, useRef } from 'react';
import dayjs from 'dayjs';

export default function Show({ auth, customer }) {
    const [activeTab, setActiveTab] = useState('karte');
    const [showKarteForm, setShowKarteForm] = useState(false);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        visit_date: dayjs().format('YYYY-MM-DD'),
        content: '',
        images: [],
        reservation_id: '',
    });

    const handleImageChange = (e) => {
        setData('images', Array.from(e.target.files));
    };

    const submitKarte = (e) => {
        e.preventDefault();
        post(route('staff.medical-records.store', customer.id), {
            onSuccess: () => {
                reset();
                setShowKarteForm(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    const deleteKarte = (recordId) => {
        if (confirm('本当にこの記録を削除しますか？')) {
            router.delete(route('staff.medical-records.destroy', recordId));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">顧客詳細: {customer.name}</h2>}
        >
            <Head title={`顧客詳細: ${customer.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">基本情報</h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-gray-500 block text-sm">氏名</span>
                                        <span className="text-gray-900">{customer.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block text-sm">電話番号</span>
                                        <span className="text-gray-900">{customer.phone}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block text-sm">メールアドレス</span>
                                        <span className="text-gray-900">{customer.email}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block text-sm">メモ</span>
                                        <span className="text-gray-900 whitespace-pre-wrap">{customer.memo}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {/* Placeholder for stats or other info */}
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('karte')}
                                className={`${activeTab === 'karte'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                カルテ
                            </button>
                            <button
                                onClick={() => setActiveTab('reservations')}
                                className={`${activeTab === 'reservations'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                予約履歴
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        {activeTab === 'karte' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium text-gray-900">施術履歴</h3>
                                    <PrimaryButton onClick={() => setShowKarteForm(!showKarteForm)}>
                                        {showKarteForm ? 'キャンセル' : 'カルテ新規追加'}
                                    </PrimaryButton>
                                </div>

                                {/* Add New Record Form */}
                                {showKarteForm && (
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <form onSubmit={submitKarte} className="space-y-4">
                                            <div>
                                                <InputLabel htmlFor="visit_date" value="来店日" />
                                                <TextInput
                                                    id="visit_date"
                                                    type="date"
                                                    className="mt-1 block w-full"
                                                    value={data.visit_date}
                                                    onChange={(e) => setData('visit_date', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors.visit_date} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="content" value="内容" />
                                                <textarea
                                                    id="content"
                                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                    rows="4"
                                                    value={data.content}
                                                    onChange={(e) => setData('content', e.target.value)}
                                                    required
                                                ></textarea>
                                                <InputError message={errors.content} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="images" value="写真" />
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    className="mt-1 block w-full text-sm text-gray-500
                                                        file:mr-4 file:py-2 file:px-4
                                                        file:rounded-md file:border-0
                                                        file:text-sm file:font-semibold
                                                        file:bg-indigo-50 file:text-indigo-700
                                                        hover:file:bg-indigo-100"
                                                    onChange={handleImageChange}
                                                    ref={fileInputRef}
                                                />
                                                <InputError message={errors.images} className="mt-2" />
                                            </div>

                                            <div className="flex justify-end">
                                                <PrimaryButton disabled={processing}>
                                                    保存
                                                </PrimaryButton>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Records List */}
                                <div className="space-y-6">
                                    {customer.medical_records && customer.medical_records.length > 0 ? (
                                        customer.medical_records.sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date)).map((record) => (
                                            <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="font-bold text-gray-900">{dayjs(record.visit_date).format('YYYY-MM-DD')}</span>
                                                        <span className="text-gray-500 text-sm ml-2">担当: {record.staff?.name}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => deleteKarte(record.id)}
                                                        className="text-red-500 hover:text-red-700 text-sm"
                                                    >
                                                        削除
                                                    </button>
                                                </div>
                                                <div className="text-gray-700 whitespace-pre-wrap mb-4">
                                                    {record.content}
                                                </div>
                                                {record.images && record.images.length > 0 && (
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        {record.images.map((image) => (
                                                            <div key={image.id} className="relative group">
                                                                <img
                                                                    src={image.url}
                                                                    alt={image.description || 'Medical Record Image'}
                                                                    className="w-full h-32 object-cover rounded-lg cursor-pointer"
                                                                    onClick={() => window.open(image.url, '_blank')}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">カルテはありません。</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'reservations' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">予約履歴</h3>
                                {customer.reservations && customer.reservations.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日付</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">時間</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">担当スタッフ</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メニュー</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {customer.reservations.sort((a, b) => new Date(b.start_time) - new Date(a.start_time)).map((reservation) => (
                                                    <tr key={reservation.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {dayjs(reservation.start_time).format('YYYY-MM-DD')}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {dayjs(reservation.start_time).format('HH:mm')} - {dayjs(reservation.end_time).format('HH:mm')}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {reservation.staff?.name || '指名なし'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            -
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                                ${reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                                    reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                                                {reservation.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-4">予約履歴がありません。</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

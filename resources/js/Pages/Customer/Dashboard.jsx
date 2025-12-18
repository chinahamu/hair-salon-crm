import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth, nextReservation, pastReservations }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
        }).format(price);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">マイページ</h2>}
        >
            <Head title="マイページ" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Next Reservation */}
                    <section className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">次回のご予約</h3>
                            {nextReservation ? (
                                <div className="border border-gray-200 rounded-lg p-6 bg-indigo-50/50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">来店日時</p>
                                            <p className="text-xl font-bold text-gray-900">{formatDate(nextReservation.start_time)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">店舗</p>
                                            <p className="text-lg font-semibold text-gray-800">{nextReservation.store.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">担当スタッフ</p>
                                            <p className="text-base text-gray-800">
                                                {nextReservation.staff ? nextReservation.staff.name : '指名なし'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">メニュー</p>
                                            <ul className="list-disc list-inside text-gray-700">
                                                {nextReservation.menus.map(menu => (
                                                    <li key={menu.id}>{menu.name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">金額</p>
                                            <p className="text-xl font-bold text-gray-900">
                                                {formatPrice(nextReservation.menus.reduce((sum, menu) => sum + parseInt(menu.pivot.price), 0))}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-500 text-center py-8">
                                    次回のご予約はありません。
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Reservation History */}
                    <section className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">予約履歴</h3>
                            {pastReservations.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日時</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">店舗</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メニュー</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金額</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {pastReservations.map((reservation) => (
                                                <tr key={reservation.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatDate(reservation.start_time)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {reservation.store.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        <ul className="list-disc list-inside">
                                                            {reservation.menus.map(menu => (
                                                                <li key={menu.id}>{menu.name}</li>
                                                            ))}
                                                        </ul>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {/* Total price calculation if not stored directly, assuming sum of menus for now, or just placeholder if complex logic exists */}
                                                        {formatPrice(reservation.menus.reduce((sum, menu) => sum + parseInt(menu.pivot.price), 0))}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-gray-500 text-center py-8">
                                    過去の予約履歴はありません。
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

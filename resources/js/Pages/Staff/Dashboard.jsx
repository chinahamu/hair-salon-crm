
import { Head, Link } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Dashboard({ stores, selectedStore }) {
    return (
        <StaffLayout stores={stores} selectedStore={selectedStore}>
            <Head title="スタッフダッシュボード" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-lg font-medium text-gray-900">
                                {selectedStore ? `${selectedStore.name} の管理` : '店舗が選択されていません'}
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                現在選択中の店舗: <strong>{selectedStore?.name || 'なし'}</strong>
                            </p>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">デモ用情報</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h4 className="font-medium text-gray-700 mb-2">顧客ログイン認証情報</h4>
                                    <dl className="text-sm">
                                        <div className="flex justify-between py-1">
                                            <dt className="text-gray-500">Email:</dt>
                                            <dd className="font-mono text-gray-900">customer@example.com</dd>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <dt className="text-gray-500">Password:</dt>
                                            <dd className="font-mono text-gray-900">password</dd>
                                        </div>
                                    </dl>
                                </div>
                                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                                    <h4 className="font-medium text-emerald-800 mb-2">予約ページURL</h4>
                                    <p className="text-sm text-emerald-600 mb-2">以下のURLから予約デモを確認できます</p>
                                    <a
                                        href="https://hair-salon-crm.meta-alchemist.co.jp/reserve/bGV8iIR397"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-emerald-700 hover:text-emerald-900 underline break-all"
                                    >
                                        https://hair-salon-crm.meta-alchemist.co.jp/reserve/bGV8iIR397
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {selectedStore && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">店舗基本情報</h3>
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">住所</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{selectedStore.address}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">電話番号</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{selectedStore.phone}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">営業時間</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {selectedStore.business_hours
                                                ? `${selectedStore.business_hours.start} - ${selectedStore.business_hours.end}`
                                                : '未設定'}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">定休日</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {selectedStore.regular_holidays && selectedStore.regular_holidays.length > 0
                                                ? selectedStore.regular_holidays.join(', ')
                                                : 'なし'}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">説明</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{selectedStore.description || 'なし'}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </StaffLayout>
    );
}

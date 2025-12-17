import StaffLayout from '@/Layouts/StaffLayout';
import { Head, useForm } from '@inertiajs/react'; // Corrected import
import { useState } from 'react';
import CreateEditModal from './CreateEditModal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton'; // Added import for PrimaryButton

export default function Index({ menus, stores, selectedStore }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState(null);
    const { delete: destroy } = useForm(); // Hook for delete action

    const openCreateModal = () => {
        setEditingMenu(null);
        setIsModalOpen(true);
    };

    const openEditModal = (menu) => {
        setEditingMenu(menu);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingMenu(null);
    };

    const deleteMenu = (menu) => {
        if (confirm('本当にこのメニューを削除しますか？')) {
            destroy(route('staff.menus.destroy', menu.id));
        }
    };

    return (
        <StaffLayout stores={stores} selectedStore={selectedStore}>
            <Head title="メニュー管理" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">メニュー管理</h2>
                        <PrimaryButton onClick={openCreateModal}>
                            新規メニュー追加
                        </PrimaryButton>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {menus && menus.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    名前
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    料金 (円)
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    所要時間 (分)
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ステータス
                                                </th>
                                                <th scope="col" className="relative px-6 py-3">
                                                    <span className="sr-only">操作</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {menus.map((menu) => (
                                                <tr key={menu.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{menu.name}</div>
                                                        <div className="text-sm text-gray-500">{menu.description}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">¥{menu.price.toLocaleString()}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{menu.duration}分</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${menu.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {menu.status ? '有効' : '無効'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() => openEditModal(menu)}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                        >
                                                            編集
                                                        </button>
                                                        <button
                                                            onClick={() => deleteMenu(menu)}
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
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">メニューが登録されていません。</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <CreateEditModal
                show={isModalOpen}
                onClose={closeModal}
                menu={editingMenu}
            />
        </StaffLayout>
    );
}

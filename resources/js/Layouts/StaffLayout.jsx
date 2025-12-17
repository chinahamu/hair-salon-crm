import { useState } from 'react';
import { Link, router } from '@inertiajs/react';

export default function StaffLayout({ children, stores = [], selectedStore = null }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const handleStoreChange = (e) => {
        router.post(route('staff.dashboard.store'), {
            store_id: e.target.value,
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:block flex-shrink-0">
                <div className="h-full flex flex-col">
                    {/* Logo / Brand */}
                    <div className="h-16 flex items-center px-6 border-b border-gray-200">
                        <Link href={route('staff.dashboard')} className="text-xl font-bold text-gray-800">
                            スタッフポータル
                        </Link>
                    </div>

                    {/* Store Selector */}
                    {stores.length > 0 && (
                        <div className="px-4 py-4 border-b border-gray-200">
                            <label htmlFor="store-select" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                店舗選択
                            </label>
                            <select
                                id="store-select"
                                value={selectedStore?.id || ''}
                                onChange={handleStoreChange}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                {stores.map((store) => (
                                    <option key={store.id} value={store.id}>
                                        {store.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Navigation Links */}
                    <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                        <Link
                            href={route('staff.dashboard')}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${route().current('staff.dashboard')
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            ダッシュボード
                        </Link>
                        <Link
                            href={route('staff.stores.index')}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${route().current('staff.stores.*')
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            店舗管理
                        </Link>
                        <Link
                            href={route('staff.menus.index')}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${route().current('staff.menus.*')
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            メニュー管理
                        </Link>
                        <Link
                            href={route('staff.facilities.index')}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${route().current('staff.facilities.*')
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            設備管理
                        </Link>
                        <Link
                            href={route('staff.shifts.index')}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${route().current('staff.shifts.*')
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            シフト管理
                        </Link>
                    </nav>

                    {/* User Info / Logout */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 truncate">スタッフ</span>
                            <Link
                                href={route('staff.logout')}
                                method="post"
                                as="button"
                                className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors duration-150"
                            >
                                ログアウト
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Header & Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="bg-white border-b border-gray-200 md:hidden flex items-center justify-between px-4 h-16 shrink-0">
                    <Link href={route('staff.dashboard')} className="text-lg font-bold text-gray-800">
                        スタッフポータル
                    </Link>
                    <button
                        onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                    >
                        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path
                                className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                            <path
                                className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </header>

                {/* Mobile Navigation Dropdown */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' md:hidden bg-white border-b border-gray-200'}>
                    {stores.length > 0 && (
                        <div className="px-4 py-3 border-b border-gray-200">
                            <div className="text-sm font-medium text-gray-500 mb-1">店舗選択</div>
                            <select
                                value={selectedStore?.id || ''}
                                onChange={handleStoreChange}
                                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                {stores.map((store) => (
                                    <option key={store.id} value={store.id}>
                                        {store.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            href={route('staff.dashboard')}
                            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${route().current('staff.dashboard')
                                ? 'border-indigo-500 text-indigo-700 bg-indigo-50'
                                : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                        >
                            ダッシュボード
                        </Link>
                        <Link
                            href={route('staff.stores.index')}
                            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${route().current('staff.stores.*')
                                ? 'border-indigo-500 text-indigo-700 bg-indigo-50'
                                : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                        >
                            店舗管理
                        </Link>
                        <Link
                            href={route('staff.menus.index')}
                            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${route().current('staff.menus.*')
                                ? 'border-indigo-500 text-indigo-700 bg-indigo-50'
                                : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                        >
                            メニュー管理
                        </Link>
                        <Link
                            href={route('staff.facilities.index')}
                            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${route().current('staff.facilities.*')
                                ? 'border-indigo-500 text-indigo-700 bg-indigo-50'
                                : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                        >
                            設備管理
                        </Link>
                        <Link
                            href={route('staff.shifts.index')}
                            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${route().current('staff.shifts.*')
                                ? 'border-indigo-500 text-indigo-700 bg-indigo-50'
                                : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                        >
                            シフト管理
                        </Link>
                    </div>
                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="mt-3 space-y-1">
                            <Link
                                href={route('staff.logout')}
                                method="post"
                                as="button"
                                className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-50 hover:border-gray-300"
                            >
                                ログアウト
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}



import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="スタッフダッシュボード" />

            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <span className="text-xl font-bold text-gray-800">スタッフポータル</span>
                            </div>
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <Link
                                    href={route('staff.stores.index')}
                                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out"
                                >
                                    店舗管理
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Link
                                href={route('staff.logout')}
                                method="post"
                                as="button"
                                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                ログアウト
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            スタッフとしてログインしています！
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

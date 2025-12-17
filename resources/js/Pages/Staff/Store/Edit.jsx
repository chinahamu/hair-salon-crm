import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ store }) {
    const { data, setData, put, processing, errors } = useForm({
        name: store.name,
        phone: store.phone,
        address: store.address,
        email: store.email || '',
        description: store.description || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('staff.stores.update', store.id));
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="店舗編集" />

            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href={route('staff.dashboard')} className="text-xl font-bold text-gray-800">
                                    スタッフポータル
                                </Link>
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
        </div>
    );
}

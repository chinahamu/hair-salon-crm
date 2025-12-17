import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="ようこそ" />
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <h1 className="text-4xl font-bold text-gray-800">ヘアサロンCRMへようこそ</h1>
            </div>
            {/*
             * Remove these temporary links later
             */}
            <div className="fixed bottom-4 right-4 flex flex-col gap-2">
                <a href="/staff/login" className="text-blue-500 hover:underline">スタッフログイン</a>
                <a href="/customer/login" className="text-blue-500 hover:underline">お客様ログイン</a>
            </div>
        </>
    );
}

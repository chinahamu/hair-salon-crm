import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <h1 className="text-4xl font-bold text-gray-800">Welcome to Hair Salon CRM</h1>
            </div>
        </>
    );
}

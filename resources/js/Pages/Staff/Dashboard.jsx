
import { Head, Link } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Dashboard() {
    return (
        <StaffLayout>
            <Head title="スタッフダッシュボード" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            スタッフとしてログインしています！
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}

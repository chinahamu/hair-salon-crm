import StaffLayout from '@/Layouts/StaffLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Index({ auth, metrics, filters }) {
    const { data, setData, get } = useForm({
        start_date: filters.start_date,
        end_date: filters.end_date,
    });

    const handleFilter = (e) => {
        e.preventDefault();
        get(route('staff.analytics.index'));
    };

    const mediaData = Object.keys(metrics.media_inflow).map(key => ({
        name: key,
        value: metrics.media_inflow[key]
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <StaffLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">スタッフ分析</h2>}
        >
            <Head title="分析" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Filters */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6 p-6">
                        <form onSubmit={handleFilter} className="flex gap-4 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">開始日</label>
                                <input
                                    type="date"
                                    value={data.start_date}
                                    onChange={e => setData('start_date', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">終了日</label>
                                <input
                                    type="date"
                                    value={data.end_date}
                                    onChange={e => setData('end_date', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                            >
                                フィルタ適用
                            </button>
                        </form>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <KpiCard title="予約数" value={metrics.reservation_count} unit=" 件" />
                        <KpiCard title="稼働率" value={metrics.occupancy_rate} unit="%" />
                        <KpiCard title="平均客単価" value={metrics.average_spend.toLocaleString()} unit=" 円" />
                        <KpiCard title="リピート率" value={metrics.repeat_rate} unit="%" />
                        <KpiCard title="No-Show率" value={metrics.no_show_rate} unit="%" />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Media Inflow Chart */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 h-96">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">媒体別流入</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={mediaData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {mediaData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Placeholder for future charts */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 h-96 flex items-center justify-center text-gray-400">
                            他のチャートは準備中です...
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}

function KpiCard({ title, value, unit }) {
    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <div className="text-gray-500 text-sm font-medium uppercase">{title}</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">
                {value}<span className="text-lg text-gray-500 font-normal">{unit}</span>
            </div>
        </div>
    );
}

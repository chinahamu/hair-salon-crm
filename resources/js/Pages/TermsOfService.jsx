import { Head, Link } from '@inertiajs/react';

export default function TermsOfService() {
    return (
        <>
            <Head title="利用規約 - Hair Salon CRM" />
            <div className="min-h-screen bg-gray-50 font-sans text-gray-800">

                {/* Header */}
                <nav className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex-shrink-0 flex items-center gap-2">
                                <Link href="/" className="flex items-center gap-2 group">
                                    <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:opacity-90 transition-opacity">
                                        H
                                    </div>
                                    <span className="font-bold text-xl tracking-tight text-gray-900 group-hover:text-rose-500 transition-colors">Hair Salon <span className="text-rose-500">CRM</span></span>
                                </Link>
                            </div>
                            <div className="flex items-center">
                                <Link href="/" className="text-gray-600 hover:text-rose-500 transition-colors font-medium text-sm">
                                    トップへ戻る
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Content */}
                <div className="py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">利用規約</h1>

                        <div className="prose prose-rose max-w-none text-gray-600">
                            <p className="mb-6">
                                この利用規約（以下，「本規約」といいます。）は，株式会社Meta-Alchemist（以下，「当社」といいます。）がこのウェブサイト上で提供するサービス（以下，「本サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆さま（以下，「ユーザー」といいます。）には，本規約に従って，本サービスをご利用いただきます。
                            </p>

                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">第1条（適用）</h2>
                            <p className="mb-4">
                                本規約は，ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。
                            </p>
                            <p className="mb-4">
                                当社は本サービスに関し，本規約のほか，ご利用にあたってのルール等，各種の定め（以下，「個別規定」といいます。）をすることがあります。これら個別規定はその名称のいかんに関わらず，本規約の一部を構成するものとします。
                                本規約の規定が前項の個別規定の規定と矛盾する場合には，個別規定において特段の定めなき限り，個別規定の規定が優先されるものとします。
                            </p>

                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">第2条（利用登録）</h2>
                            <p className="mb-4">
                                本サービスにおいては，登録希望者が本規約に同意の上，当社の定める方法によって利用登録を申請し，当社がこれを承認することによって，利用登録が完了するものとします。
                            </p>
                            <p className="mb-4">
                                当社は，利用登録の申請者に以下の事由があると判断した場合，利用登録の申請を承認しないことがあり，その理由については一切の開示義務を負わないものとします。
                            </p>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
                                <li>本規約に違反したことがある者からの申請である場合</li>
                                <li>その他，当社が利用登録を相当でないと判断した場合</li>
                            </ul>

                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">第3条（禁止事項）</h2>
                            <p className="mb-4">ユーザーは，本サービスの利用にあたり，以下の行為をしてはなりません。</p>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li>法令または公序良俗に違反する行為</li>
                                <li>犯罪行為に関連する行為</li>
                                <li>本サービスの内容等，本サービスに含まれる著作権，商標権ほか知的財産権を侵害する行為</li>
                                <li>当社，ほかのユーザー，またはその他第三者のサーバーまたはネットワークの機能を破壊したり，妨害したりする行為</li>
                                <li>当社のサービスの運営を妨害するおそれのある行為</li>
                                <li>不正な目的を持って本サービスを利用する行為</li>
                            </ul>

                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">第4条（本サービスの提供の停止等）</h2>
                            <p className="mb-4">
                                当社は，以下のいずれかの事由があると判断した場合，ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
                            </p>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                                <li>地震，落雷，火災，停電または天災などの不可抗力により，本サービスの提供が困難となった場合</li>
                                <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                                <li>その他，当社が本サービスの提供が困難と判断した場合</li>
                            </ul>

                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">第5条（利用規約の変更）</h2>
                            <p className="mb-4">
                                当社は，必要と判断した場合には，ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお，本規約の変更後，本サービスの利用を開始した場合には，当該ユーザーは変更後の規約に同意したものとみなします。
                            </p>

                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">第6条（準拠法・裁判管轄）</h2>
                            <p className="mb-4">
                                本規約の解釈にあたっては，日本法を準拠法とします。
                                本サービスに関して紛争が生じた場合には，当社の本店所在地を管轄する裁判所を専属的合意管轄とします。
                            </p>

                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">第7条（お問い合わせ窓口）</h2>
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <p className="mb-2"><strong>社名：</strong> 株式会社Meta-Alchemist</p>
                                <p className="mb-2"><strong>関連リンク：</strong> <a href="https://meta-alchemist.co.jp/company-profile/" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline">会社概要</a></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Hair Salon CRM. All rights reserved.
                    </div>
                </footer>
            </div>
        </>
    );
}

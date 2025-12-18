import { Head, Link } from '@inertiajs/react';

export default function PrivacyPolicy() {
    return (
        <>
            <Head title="プライバシーポリシー - Hair Salon CRM" />
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">プライバシーポリシー</h1>

                        <div className="prose prose-rose max-w-none text-gray-600">
                            <p className="mb-6">
                                株式会社Meta-Alchemist（以下、「当社」といいます。）は、本ウェブサイト上で提供するサービス「Hair Salon CRM」（以下、「本サービス」といいます。）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。
                            </p>

                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">第1条（個人情報）</h2>
                            <p className="mb-4">
                                「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報及び容貌、指紋、声紋にかかるデータ、及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。
                            </p>

                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">第2条（個人情報の収集方法）</h2>
                            <p className="mb-4">
                                当社は、ユーザーが利用登録をする際に氏名、生年月日、住所、電話番号、メールアドレス、銀行口座番号、クレジットカード番号などの個人情報をお尋ねすることがあります。また、ユーザーと提携先などとの間でなされたユーザーの個人情報を含む取引記録や決済に関する情報を、当社の提携先（情報提供元、広告主、広告配信先などを含みます。以下、｢提携先｣といいます。）などから収集することがあります。
                            </p>

                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">第3条（個人情報を収集・利用する目的）</h2>
                            <p className="mb-4">当社が個人情報を収集・利用する目的は、以下のとおりです。</p>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li>本サービスの提供・運営のため</li>
                                <li>ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）</li>
                                <li>ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等及び当社が提供する他のサービスの案内のメールを送付するため</li>
                                <li>メンテナンス、重要なお知らせなど必要に応じたご連絡のため</li>
                                <li>利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため</li>
                                <li>ユーザーにご自身の登録情報の閲覧や変更、削除、ご利用状況の閲覧を行っていただくため</li>
                                <li>有料サービスにおいて、ユーザーに利用料金を請求するため</li>
                                <li>上記の利用目的に付随する目的</li>
                            </ul>

                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">第4条（利用目的の変更）</h2>
                            <p className="mb-4">
                                当社は、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。
                                利用目的の変更を行った場合には、変更後の目的について、当社所定の方法により、ユーザーに通知し、または本ウェブサイト上に公表するものとします。
                            </p>

                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">第5条（個人情報の第三者提供）</h2>
                            <p className="mb-4">
                                当社は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
                            </p>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                                <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                                <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき</li>
                                <li>予め次の事項を告知あるいは公表し、かつ当社が個人情報保護委員会に届出をしたとき</li>
                            </ul>

                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">第6条（お問い合わせ窓口）</h2>
                            <p className="mb-4">
                                本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。
                            </p>
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <p className="mb-2"><strong>社名：</strong> 株式会社Meta-Alchemist</p>
                                <p className="mb-2"><strong>関連リンク：</strong> <a href="https://meta-alchemist.co.jp/company-profile/" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline">会社概要</a></p>
                                <p className="mb-0"><strong>お問い合わせ：</strong> <Link href="/#inquiry" className="text-rose-500 hover:underline">お問い合わせフォーム</Link>よりご連絡ください。</p>
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

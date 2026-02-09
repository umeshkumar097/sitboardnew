import pool from '@/lib/db';
import { notFound } from 'next/navigation';
import BrandLogo from '@/components/BrandLogo';
import CurrencyDisplay from '@/components/CurrencyDisplay'; // Assuming CurrencyDisplay.tsx is in components

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Validate ID is a number
    const invoiceId = parseInt(id);
    if (isNaN(invoiceId)) notFound();

    const client = await pool.connect();
    let invoice;
    let company;

    try {
        const invoiceRes = await client.query('SELECT * FROM invoices WHERE id = $1', [invoiceId]);
        if (invoiceRes.rowCount === 0) notFound();
        invoice = invoiceRes.rows[0];

        const companyRes = await client.query('SELECT * FROM companies WHERE id = $1', [invoice.company_id]);
        if (companyRes.rowCount === 0) notFound();
        company = companyRes.rows[0];

    } finally {
        client.release();
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden print:shadow-none print:max-w-none">
                {/* Header */}
                <div className="bg-slate-900 border-b border-slate-200 px-8 py-6 flex justify-between items-center text-white print:bg-white print:text-black print:border-b-2 print:border-black">
                    <div className="flex items-center gap-3">
                        <BrandLogo className="w-8 h-8 text-white" textClassName="text-white" />
                    </div>
                    <div className="text-right">
                        <h1 className="text-2xl font-bold uppercase tracking-widest">Invoice</h1>
                        <p className="text-sm opacity-80">#{invoice.invoice_number}</p>
                    </div>
                </div>

                {/* Info */}
                <div className="px-8 py-8 grid grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Billed From</h3>
                        <p className="font-bold text-slate-900 text-lg uppercase">AICLEX TECHNOLOGIES</p>
                        <p className="text-slate-600 text-sm whitespace-pre-line leading-relaxed">
                            UNIT NO 8125, 8TH FLOOR<br />
                            GAUR CITY MALL OFFICE SPACE, SECTOR 4<br />
                            Greater Noida, Gautambuddha Nagar<br />
                            UTTAR PRADESH, 201318
                        </p>
                        <div className="mt-3 text-sm text-slate-600">
                            <p><span className="font-medium">GSTIN:</span> 09JAMPK1070B1ZS</p>
                            <p><span className="font-medium">PAN:</span> JAMPK1070B</p>
                            <p><span className="font-medium">Mobile:</span> +91 8449488090</p>
                            <p><span className="font-medium">Email:</span> info@aiclex.in</p>
                            <p><span className="font-medium">Website:</span> aiclex.in</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div>
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Billed To</h3>
                            <p className="font-bold text-slate-900 text-lg">{company.name}</p>
                            <p className="text-slate-600 text-sm whitespace-pre-line">
                                {company.address || 'Address not provided'}<br />
                                {company.city}, {company.state || ''}<br />
                                {company.email}
                            </p>
                        </div>
                        <div className="mt-8">
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Payment Details</h3>
                            <p className="text-sm text-slate-600"><span className="font-medium text-slate-900">Date Issued:</span> {new Date(invoice.created_at).toLocaleDateString()}</p>
                            <p className="text-sm text-slate-600"><span className="font-medium text-slate-900">Status:</span> <span className="text-emerald-600 font-bold">{invoice.status}</span></p>
                        </div>
                    </div>
                </div>

                {/* Line Items */}
                <div className="px-8 py-4">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-slate-100">
                                <th className="py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                                <th className="py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Period</th>
                                <th className="py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <tr>
                                <td className="py-4">
                                    <p className="font-medium text-slate-900 capitalize">{invoice.plan_name} Plan Subscription</p>
                                    <p className="text-xs text-slate-500">SiteBoard Platform Access</p>
                                </td>
                                <td className="py-4 text-right text-sm text-slate-600">
                                    {invoice.period_start && invoice.period_end ? (
                                        `${new Date(invoice.period_start).toLocaleDateString()} - ${new Date(invoice.period_end).toLocaleDateString()}`
                                    ) : 'N/A'}
                                </td>
                                <td className="py-4 text-right">
                                    <CurrencyDisplay amountUSD={parseFloat(invoice.amount)} className="items-end" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Total */}
                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 print:bg-white">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-slate-500">Thank you for your business!</p>
                        <div className="text-right">
                            <p className="text-sm text-slate-500 mb-1">Total Amount</p>
                            <div className="text-3xl font-bold text-slate-900">
                                <CurrencyDisplay amountUSD={parseFloat(invoice.amount)} className="items-end text-3xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Print Button */}
                <div className="px-8 py-6 border-t border-slate-100 bg-white print:hidden text-center">
                    <button
                        // onClick={() => window.print()} 
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline print:hidden"
                    >
                        Use Browser Print (Cmd+P) to Save as PDF
                    </button>
                    <p className="text-xs text-slate-400 mt-2">
                        Note: Currency toggle is for display only. Invoices are officially generated in USD.
                    </p>
                </div>
            </div>
        </div>
    );
}

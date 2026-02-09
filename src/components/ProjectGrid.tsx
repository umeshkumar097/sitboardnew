"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProjectGrid({ project, plots, session }: { project: any, plots: any[], session: any }) {
    const router = useRouter();
    const [selectedPlot, setSelectedPlot] = useState<any>(null);
    const [isActionModalOpen, setActionModalOpen] = useState(false);
    const [isAddPlotModalOpen, setAddPlotModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        clientName: '',
        amount: '',
        agentName: session.name || 'Agent', // Auto-fill if possible
    });

    const handlePlotClick = (plot: any) => {
        setSelectedPlot(plot);
        setActionModalOpen(true);
        setFormData({ ...formData, clientName: '', amount: '' }); // Reset form
    };

    const handleAction = async (action: 'book' | 'sell' | 'cancel') => {
        // Implement API calls
        try {
            if (action === 'book') {
                await fetch('/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        projectId: project.id,
                        plotId: selectedPlot.id,
                        clientName: formData.clientName,
                        amount: formData.amount
                    })
                });
            } else if (action === 'sell') {
                await fetch('/api/sales', {
                    method: 'POST',
                    body: JSON.stringify({
                        projectId: project.id,
                        plotId: selectedPlot.id,
                        bookingId: selectedPlot.booking_id, // Need to make sure booking_id is in plot object if fetched
                        clientName: formData.clientName || selectedPlot.booking_client,
                        amount: formData.amount
                    })
                });
            } else if (action === 'cancel') {
                // Implement cancellation. Usually needs booking ID.
                // Since we might not have booking ID easily, we need an endpoint that cancels ACTIVE booking on plot.
                await fetch(`/api/bookings/cancel`, {
                    method: 'POST',
                    body: JSON.stringify({ plotId: selectedPlot.id })
                });
            }

            setActionModalOpen(false);
            router.refresh();
        } catch (e) {
            alert('Action failed');
        }
    };

    // Add Plot Logic
    const [newPlotData, setNewPlotData] = useState({ number: '', dimension: '', price: '' });
    const handleAddPlot = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/plots', {
                method: 'POST',
                body: JSON.stringify({ ...newPlotData, projectId: project.id })
            });
            if (res.ok) {
                setAddPlotModalOpen(false);
                setNewPlotData({ number: '', dimension: '', price: '' });
                router.refresh();
            } else {
                alert('Failed to add plot');
            }
        } catch (e) { alert('Error'); }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
                    <p className="text-slate-500 text-sm">{project.location} • {plots.length} Plots</p>
                </div>

                <div className="flex gap-4">
                    <div className="flex gap-2 text-sm">
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-100 border border-green-500"></span> Available</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-500"></span> Booked</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-100 border border-red-500"></span> Sold</span>
                    </div>
                    {session.role === 'company_admin' && (
                        <button
                            onClick={() => setAddPlotModalOpen(true)}
                            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors"
                        >
                            + Add Plot
                        </button>
                    )}
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto bg-slate-50 rounded-xl border border-slate-200 p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {plots.map(plot => {
                        const statusColor =
                            plot.status === 'available' ? 'bg-white border-green-200 hover:border-green-400 text-green-700' :
                                plot.status === 'booked' ? 'bg-yellow-50 border-yellow-200 hover:border-yellow-400 text-yellow-800' :
                                    'bg-red-50 border-red-200 text-red-700 opacity-90'; // Sold

                        return (
                            <div
                                key={plot.id}
                                onClick={() => handlePlotClick(plot)}
                                className={`
                  aspect-square rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all transform hover:scale-105 shadow-sm
                  ${statusColor}
                `}
                                title={plot.status === 'booked' ? `Booked by: ${plot.booking_client}` : plot.status}
                            >
                                <span className="font-bold text-lg">{plot.plot_number}</span>
                                <span className="text-[10px] uppercase font-semibold mt-1">{plot.status}</span>
                                {plot.dimension && <span className="text-[10px] opacity-70">{plot.dimension}</span>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Action Modal */}
            {isActionModalOpen && selectedPlot && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold mb-4">Plot {selectedPlot.plot_number}</h2>

                        <div className="mb-6 space-y-2 text-sm text-slate-600">
                            <p>Status: <span className="font-semibold uppercase">{selectedPlot.status}</span></p>
                            {selectedPlot.dimension && <p>Size: {selectedPlot.dimension}</p>}
                            {selectedPlot.price && <p>Price: {selectedPlot.price}</p>}
                            {selectedPlot.booking_client && <p>Client: {selectedPlot.booking_client}</p>}
                        </div>

                        {/* Booking Form */}
                        {selectedPlot.status === 'available' && session.role !== 'agent' && (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Client Name"
                                    className="w-full px-4 py-2 border rounded-lg"
                                    value={formData.clientName}
                                    onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                                />
                                <input
                                    type="number"
                                    placeholder="Booking Amount"
                                    className="w-full px-4 py-2 border rounded-lg"
                                    value={formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                />
                                <button
                                    onClick={() => handleAction('book')}
                                    className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700"
                                >
                                    Confirm Booking
                                </button>
                            </div>
                        )}

                        {/* Sale / Cancel Form */}
                        {selectedPlot.status === 'booked' && session.role !== 'agent' && (
                            <div className="space-y-4">
                                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm mb-4">
                                    Booked by <strong>{selectedPlot.booking_client}</strong>
                                </div>

                                <button
                                    onClick={() => handleAction('sell')}
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
                                >
                                    Mark as Sold (Finalize)
                                </button>

                                <button
                                    onClick={() => handleAction('cancel')}
                                    className="w-full bg-white border border-red-200 text-red-600 py-2 rounded-lg font-medium hover:bg-red-50"
                                >
                                    Cancel Booking
                                </button>
                            </div>
                        )}

                        {selectedPlot.status === 'sold' && (
                            <div className="p-4 bg-red-50 text-red-800 rounded-lg text-sm">
                                Sold to {selectedPlot.sale_client || 'Client'}.
                            </div>
                        )}

                        {session.role === 'agent' && <p className="text-center text-slate-500 text-sm mt-4">View Only Assignment</p>}

                        <button
                            onClick={() => setActionModalOpen(false)}
                            className="mt-6 w-full text-slate-500 text-sm hover:underline"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Add Plot Modal */}
            {isAddPlotModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Add New Plot</h2>
                        <form onSubmit={handleAddPlot} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Plot Number (e.g. 101)"
                                required
                                className="w-full px-4 py-2 border rounded-lg"
                                value={newPlotData.number}
                                onChange={e => setNewPlotData({ ...newPlotData, number: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Dimensions (e.g. 30x40)"
                                className="w-full px-4 py-2 border rounded-lg"
                                value={newPlotData.dimension}
                                onChange={e => setNewPlotData({ ...newPlotData, dimension: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Price (Optional)"
                                className="w-full px-4 py-2 border rounded-lg"
                                value={newPlotData.price}
                                onChange={e => setNewPlotData({ ...newPlotData, price: e.target.value })}
                            />
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setAddPlotModalOpen(false)} className="flex-1 py-2 border rounded-lg">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-slate-900 text-white rounded-lg">Add Plot</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

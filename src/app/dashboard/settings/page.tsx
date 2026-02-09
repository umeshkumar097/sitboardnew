export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-sm font-semibold text-slate-800 mb-1 tracking-tight">Settings</h1>
            <p className="text-[10px] text-gray-400 mb-6">Manage your account and preferences.</p>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-100">
                <div className="p-6 flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-slate-900">Profile Information</h3>
                        <p className="text-sm text-gray-500">Update your name and email address.</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50">
                        Edit
                    </button>
                </div>
                <div className="p-6 flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-slate-900">Password</h3>
                        <p className="text-sm text-gray-500">Change your password.</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50">
                        Update
                    </button>
                </div>
                <div className="p-6 flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-slate-900">Notifications</h3>
                        <p className="text-sm text-gray-500">Manage how you receive alerts.</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50">
                        Configure
                    </button>
                </div>
            </div>
        </div>
    );
}

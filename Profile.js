function ProfilePage({ currentUser }) {
    const [offlineAccess, setOfflineAccess] = React.useState(false);

    const toggleOfflineAccess = () => {
        setOfflineAccess(!offlineAccess);
        // In a real app, this would trigger PWA caching strategies or other offline mechanisms.
        // For this mock, it just toggles state.
        alert(`Offline access ${!offlineAccess ? 'enabled' : 'disabled'}. (This is a mock feature)`);
    };

    const enrolledCourses = currentUser.courses || [];

    // Aggregate weekly schedule
    // This is a simple aggregation. More complex parsing might be needed for varied schedule formats.
    const weeklySchedule = enrolledCourses.map(course => `${course.name} (${course.code}): ${course.schedule}`);

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h2>

            {/* User Details Section */}
            <div className="bg-white shadow-xl rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Personal Information</h3>
                <div className="space-y-3">
                    <p className="text-gray-800"><span className="font-semibold text-gray-600">Name:</span> {currentUser.name}</p>
                    <p className="text-gray-800"><span className="font-semibold text-gray-600">Email:</span> {currentUser.email}</p>
                    <p className="text-gray-800"><span className="font-semibold text-gray-600">Mobile:</span> {currentUser.mobile}</p>
                </div>
            </div>

            {/* Enrolled Courses Section */}
            <div className="bg-white shadow-xl rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">My Enrolled Courses</h3>
                {enrolledCourses.length > 0 ? (
                    <ul className="space-y-2 list-disc list-inside">
                        {enrolledCourses.map(course => (
                            <li key={course.code} className="text-gray-700">
                                {course.name} ({course.code})
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">You are not enrolled in any courses yet.</p>
                )}
            </div>

            {/* Weekly Schedule Section */}
            <div className="bg-white shadow-xl rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">My Weekly Schedule</h3>
                {weeklySchedule.length > 0 ? (
                    <ul className="space-y-2">
                        {weeklySchedule.map((scheduleItem, index) => (
                            <li key={index} className="text-gray-700 bg-gray-50 p-2 rounded-md">
                                {scheduleItem}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No schedule available. Enroll in courses to see your schedule.</p>
                )}
            </div>
            
            {/* Offline Access Toggle */}
            <div className="bg-white shadow-xl rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Settings</h3>
                <div className="flex items-center justify-between">
                    <span className="text-gray-700">Offline Access</span>
                    <label htmlFor="offlineToggle" className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input type="checkbox" id="offlineToggle" className="sr-only" checked={offlineAccess} onChange={toggleOfflineAccess} />
                            <div className={`block w-14 h-8 rounded-full ${offlineAccess ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${offlineAccess ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                    </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">Enable offline access to view cached materials and schedules without an internet connection (mock feature).</p>
            </div>
        </div>
    );
}

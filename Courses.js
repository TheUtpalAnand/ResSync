function CoursesPage({ currentUser, setCurrentUser, setActivePage }) {
    const MOCK_COURSES_AVAILABLE = {
        "CS101": { name: "Introduction to Computer Science", schedule: "10:00 AM - 11:00 AM, Mon, Wed, Fri" },
        "MATH201": { name: "Calculus I", schedule: "11:00 AM - 12:00 PM, Tue, Thu" },
        "PHY101": { name: "General Physics I", schedule: "09:00 AM - 10:00 AM, Mon, Wed" },
        "CHM101": { name: "General Chemistry I", schedule: "01:00 PM - 02:00 PM, Tue, Thu, Fri" },
    };

    const [courseCodeInput, setCourseCodeInput] = React.useState('');
    const [foundCourse, setFoundCourse] = React.useState(null);
    const [message, setMessage] = React.useState('');
    const [userCourses, setUserCourses] = React.useState(currentUser.courses || []);

    const handleSearchCourse = () => {
        setMessage('');
        setFoundCourse(null);
        const upperCaseCode = courseCodeInput.toUpperCase();
        if (MOCK_COURSES_AVAILABLE[upperCaseCode]) {
            if (userCourses.find(c => c.code === upperCaseCode)) {
                setMessage(`Course ${upperCaseCode} is already in your list.`);
            } else {
                setFoundCourse({ code: upperCaseCode, ...MOCK_COURSES_AVAILABLE[upperCaseCode] });
            }
        } else {
            setMessage(`Course code ${upperCaseCode} not found in the current semester.`);
        }
        setCourseCodeInput('');
    };

    const handleFinalizeAdd = () => {
        if (foundCourse) {
            const updatedCourses = [...userCourses, foundCourse];
            setUserCourses(updatedCourses);
            
            // Update currentUser in App's state and localStorage
            const updatedUser = { ...currentUser, courses: updatedCourses };
            setCurrentUser(updatedUser); // This will trigger localStorage update in App.js
            
            setFoundCourse(null);
            setMessage(`Course ${foundCourse.code} added successfully!`);
        }
    };
    
    const navigateToCourseDetail = (courseCode) => {
        // Store selected course code for detail page to use
        localStorage.setItem('selectedCourseCode', courseCode);
        setActivePage('courseDetail'); // We'll create this page type
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Manage Courses</h2>

            {/* Course Addition Section */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Add New Course</h3>
                <div className="flex items-center mb-2">
                    <input
                        type="text"
                        className="flex-grow shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                        placeholder="Enter Course Code (e.g., CS101)"
                        value={courseCodeInput}
                        onChange={(e) => setCourseCodeInput(e.target.value)}
                    />
                    <button
                        onClick={handleSearchCourse}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Search
                    </button>
                </div>
                {message && <p className={`text-sm mt-2 ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
                {foundCourse && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                        <p className="font-semibold text-gray-700">Course Found: {foundCourse.name} ({foundCourse.code})</p>
                        <p className="text-sm text-gray-600">Schedule: {foundCourse.schedule}</p>
                        <button
                            onClick={handleFinalizeAdd}
                            className="mt-3 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        >
                            Finalize Add
                        </button>
                    </div>
                )}
            </div>

            {/* My Courses Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">My Courses</h3>
                {userCourses.length > 0 ? (
                    <ul className="space-y-3">
                        {userCourses.map(course => (
                            <li
                                key={course.code}
                                className="p-4 bg-gray-50 hover:bg-gray-100 rounded-md shadow-sm cursor-pointer border border-gray-200"
                                onClick={() => navigateToCourseDetail(course.code)}
                            >
                                <h4 className="font-semibold text-blue-600">{course.name} ({course.code})</h4>
                                <p className="text-sm text-gray-600">Schedule: {course.schedule}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">You haven't added any courses yet. Use the form above to add courses.</p>
                )}
            </div>
        </div>
    );
}

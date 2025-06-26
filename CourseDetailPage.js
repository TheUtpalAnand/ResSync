function CourseDetailPage({ currentUser, setActivePage }) {
    const [courseDetails, setCourseDetails] = React.useState(null);
    const [qrCodeUrl, setQrCodeUrl] = React.useState('');
    const [qrError, setQrError] = React.useState('');

    // Your Materials State
    const [userMaterials, setUserMaterials] = React.useState([]);
    const [showUploadModal, setShowUploadModal] = React.useState(false);
    const [newMaterialName, setNewMaterialName] = React.useState('');
    const [newMaterialTag, setNewMaterialTag] = React.useState('Notes'); // Default tag
    const [sortType, setSortType] = React.useState('date'); // 'date' or 'type'

    // Available Materials (Mock)
    const MOCK_AVAILABLE_MATERIALS = [
        { id: 'am1', name: "Lecture 1 Notes.pdf", type: "Notes", url: "#" },
        { id: 'am2', name: "Assignment 1.pdf", type: "Assignment", url: "#" },
        { id: 'am3', name: "Past Exam Paper - Midterm.pdf", type: "Paper", url: "#" },
        { id: 'am4', name: "Solution Set 1.pdf", type: "Solutions", url: "#" },
    ];


    React.useEffect(() => {
        const storedCourseCode = localStorage.getItem('selectedCourseCode');
        if (storedCourseCode) {
            const course = currentUser.courses.find(c => c.code === storedCourseCode);
            if (course) {
                setCourseDetails(course);
                fetchQrCode(storedCourseCode);
                loadUserMaterials(storedCourseCode);
            } else {
                setCourseDetails({ name: "Course not found", code: storedCourseCode, schedule: "" });
                setQrError("Course data not found for QR.");
            }
        } else {
            setQrError("No course selected for QR.");
        }
    }, [currentUser.courses]);

    const fetchQrCode = async (courseCode) => {
        setQrError('');
        setQrCodeUrl(''); // Reset previous QR code
        try {
            // The prompt specifies view_text_website, but for parsing HTML to find an image,
            // a direct fetch in JS is more straightforward if allowed, or if view_text_website can give raw HTML.
            // Assuming view_text_website gives HTML content:
            // This part cannot be directly implemented with view_text_website in the frontend JS.
            // This tool is for the agent. For the frontend, we'd use fetch().
            // Since direct network calls are restricted except for this URL, we'll use fetch().
            
            const response = await fetch("https://www.iiserpune.in/sam/teacher/qrcodes/?C=M;O=D");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const htmlText = await response.text();
            
            // DOM parsing to find the QR code image
            // This is a simplified parser. A more robust solution would use a proper DOM parser library
            // or more sophisticated regex if the structure is very consistent.
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            const links = Array.from(doc.querySelectorAll('a'));
            
            const courseQrLink = links.find(link => {
                const href = link.getAttribute('href');
                return href && href.startsWith(courseCode) && (href.endsWith('.png') || href.endsWith('.jpg') || href.endsWith('.jpeg'));
            });

            if (courseQrLink) {
                // Construct full URL if href is relative
                const qrUrl = new URL(courseQrLink.getAttribute('href'), "https://www.iiserpune.in/sam/teacher/qrcodes/").href;
                setQrCodeUrl(qrUrl);
            } else {
                setQrError(`QR code starting with '${courseCode}' not found.`);
            }
        } catch (error) {
            console.error("Failed to fetch QR code page:", error);
            setQrError("Failed to load QR code. Check console for details.");
        }
    };

    const loadUserMaterials = (courseCode) => {
        const materials = JSON.parse(localStorage.getItem(`materials_${currentUser.name}_${courseCode}`)) || [];
        setUserMaterials(materials);
    };

    const saveUserMaterials = (materials, courseCode) => {
        localStorage.setItem(`materials_${currentUser.name}_${courseCode}`, JSON.stringify(materials));
    };

    const handleAddMaterial = () => {
        if (!newMaterialName.trim()) return;
        const newMaterial = {
            id: Date.now().toString(),
            name: newMaterialName,
            tag: newMaterialTag,
            date: new Date().toISOString(),
        };
        const updatedMaterials = [...userMaterials, newMaterial];
        setUserMaterials(updatedMaterials);
        saveUserMaterials(updatedMaterials, courseDetails.code);
        setNewMaterialName('');
        setShowUploadModal(false);
    };
    
    const sortedUserMaterials = React.useMemo(() => {
        let sorted = [...userMaterials];
        if (sortType === 'date') {
            sorted.sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first
        } else if (sortType === 'type') {
            sorted.sort((a, b) => a.tag.localeCompare(b.tag));
        }
        return sorted;
    }, [userMaterials, sortType]);


    if (!courseDetails) {
        return (
            <div className="p-4 flex flex-col items-center justify-center min-h-[calc(100vh-128px)]"> {/* Adjust min-h based on header/nav height */}
                <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Loading course details...</p>
                <button onClick={() => setActivePage('courses')} className="mt-4 text-sm text-blue-500 hover:text-blue-700">&larr; Or go back to Courses</button>
            </div>
        );
    }

    const materialTags = ["Notes", "Assignment", "Paper", "Solutions", "Other"];

    return (
        <div className="p-4 pb-20"> {/* Added padding bottom for FAB */}
            <button 
                onClick={() => setActivePage('courses')} 
                className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center transition duration-150 ease-in-out"
            >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                Back to Courses
            </button>
            <h2 className="text-3xl font-bold mb-1 text-gray-800">{courseDetails.name} <span className="text-2xl text-gray-600">({courseDetails.code})</span></h2>
            <p className="text-md text-gray-600 mb-8">Schedule: {courseDetails.schedule}</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* QR Code Section */}
                <div className="lg:col-span-1 bg-white shadow-xl rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">QR Code</h3>
                    <div className="flex items-center justify-center h-48 bg-gray-50 rounded-md border border-gray-200">
                        {qrCodeUrl && <img src={qrCodeUrl} alt={`${courseDetails.code} QR Code`} className="max-h-full max-w-full object-contain"/>}
                        {qrError && <p className="text-red-500 text-sm text-center px-2">{qrError}</p>}
                        {!qrCodeUrl && !qrError && <p className="text-gray-400">Loading QR Code...</p>}
                    </div>
                </div>

                {/* Your Material Section */}
                <div className="lg:col-span-2 bg-white shadow-xl rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-700">Your Materials</h3>
                        <div className="space-x-2">
                            <button onClick={() => setSortType('date')} className={`px-3 py-1 text-sm rounded-md ${sortType === 'date' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>Sort by Date</button>
                            <button onClick={() => setSortType('type')} className={`px-3 py-1 text-sm rounded-md ${sortType === 'type' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>Sort by Type</button>
                        </div>
                    </div>
                    {sortedUserMaterials.length > 0 ? (
                        <ul className="space-y-3 max-h-96 overflow-y-auto">
                            {sortedUserMaterials.map(material => (
                                <li key={material.id} className="p-3 bg-gray-50 rounded-md border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-800">{material.name}</span>
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{material.tag}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Added: {new Date(material.date).toLocaleDateString()}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No materials uploaded for this course yet.</p>
                    )}
                </div>
            </div>
            
            {/* Available Material Section */}
            <div className="bg-white shadow-xl rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Available Materials (Mock)</h3>
                {MOCK_AVAILABLE_MATERIALS.length > 0 ? (
                    <ul className="space-y-3">
                        {MOCK_AVAILABLE_MATERIALS.map(material => (
                             <li key={material.id} className="p-3 bg-gray-50 rounded-md border border-gray-200 hover:shadow-md transition-shadow flex justify-between items-center">
                                <div>
                                    <span className="text-gray-800">{material.name}</span>
                                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{material.type}</span>
                                </div>
                                <a href={material.url} download title={`Download ${material.name}`} className="text-blue-500 hover:text-blue-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                     <p className="text-gray-500">No pre-uploaded materials available.</p>
                )}
            </div>

            {/* Floating Action Button for Upload */}
            <button
                onClick={() => setShowUploadModal(true)}
                title="Upload New Material"
                className="fixed bottom-20 right-6 bg-blue-600 hover:bg-blue-700 text-white font-bold w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-150 ease-in-out hover:scale-110 z-40"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            </button>

            {/* Upload Material Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Upload New Material</h3>
                        <div className="mb-4">
                            <label htmlFor="materialName" className="block text-sm font-medium text-gray-700 mb-1">Material Name (e.g., "Chapter 1 Scan")</label>
                            <input
                                type="text"
                                id="materialName"
                                value={newMaterialName}
                                onChange={(e) => setNewMaterialName(e.target.value)}
                                placeholder="Enter material name or description"
                                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="materialTag" className="block text-sm font-medium text-gray-700 mb-1">Tag as</label>
                            <select
                                id="materialTag"
                                value={newMaterialTag}
                                onChange={(e) => setNewMaterialTag(e.target.value)}
                                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {materialTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                            </select>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">Note: This is a mock upload. No actual file will be transferred. Only the name and tag will be saved.</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddMaterial}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Add Material
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

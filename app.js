function App() {
    const [currentUser, setCurrentUser] = React.useState(null);
    // Attempt to load user from localStorage on initial load
    React.useEffect(() => {
        const loggedInUser = localStorage.getItem('currentUser');
        if (loggedInUser) {
            setCurrentUser(JSON.parse(loggedInUser));
            // setActivePage('home'); // Default to home if user is found
        } else {
            setActivePage('login');
        }
    }, []);
    
    // Set activePage to 'home' if currentUser exists, else 'login'
    // This needs to be dynamic based on currentUser state
    const [activePage, setActivePage] = React.useState(() => {
        const initialPage = localStorage.getItem('activePage');
        // Ensure that if we have a user, we don't default to login/signup page from localStorage
        if (localStorage.getItem('currentUser') && (initialPage === 'login' || initialPage === 'signup')) {
            return 'home';
        }
        return initialPage || (localStorage.getItem('currentUser') ? 'home' : 'login');
    });


    React.useEffect(() => {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            // If user is logged in, don't let activePage be login/signup
            if (activePage === 'login' || activePage === 'signup') {
                 setActivePage('home');
            } else {
                 localStorage.setItem('activePage', activePage);
            }
        } else {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('activePage'); // Clear active page when logged out
            // No need to redirect here, login/signup screens will be shown by default check
        }
    }, [currentUser, activePage]);
    
    // Effect to update activePage in localStorage whenever it changes and user is logged in
    React.useEffect(() => {
        if(currentUser) {
            localStorage.setItem('activePage', activePage);
        }
    }, [activePage, currentUser]);


    const handleSetCurrentUser = (user) => {
        setCurrentUser(user);
        // setActivePage('home'); // This is handled by useEffect logic now
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setActivePage('login');
        localStorage.removeItem('currentUser'); // Clear current user from storage
        localStorage.removeItem('selectedCourseCode'); // Clear selected course on logout
        localStorage.removeItem('activePage'); // Ensure active page is cleared for next login
    };

    if (!currentUser && (activePage === 'login' || activePage === 'signup')) {
        if (activePage === 'signup') {
            return <Signup setCurrentUser={handleSetCurrentUser} setActivePage={setActivePage} />;
        }
        return <Login setCurrentUser={handleSetCurrentUser} setActivePage={setActivePage} />;
    }
    
    // If currentUser exists but somehow activePage is login/signup, redirect to home
    if (currentUser && (activePage === 'login' || activePage === 'signup')) {
        setActivePage('home');
    }


    // SVG Icons for navigation (simple placeholders)
    const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
    const CoursesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m0 0A7.5 7.5 0 0019.5 12S19.5 6.253 12 6.253m0 11.494A7.5 7.5 0 014.5 12S4.5 6.253 12 6.253z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253V3m0 3.253L6.753 12M12 6.253L17.253 12" /></svg>; // Simplified book icon
    const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-50">
                <h1 className="text-xl font-semibold">CourseApp</h1>
                {currentUser && (
                    <div>
                        <span className="mr-2 sm:mr-4 text-sm sm:text-base">Welcome, {currentUser.name}!</span>
                        <button 
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </header>

            <main className="flex-grow pb-16"> {/* Add padding-bottom to avoid overlap with nav */}
                {activePage === 'home' && <HomePage currentUser={currentUser} />}
                {activePage === 'courses' && <CoursesPage currentUser={currentUser} setCurrentUser={setCurrentUser} setActivePage={setActivePage} />}
                {activePage === 'profile' && <ProfilePage currentUser={currentUser} />}
                {activePage === 'courseDetail' && <CourseDetailPage currentUser={currentUser} setActivePage={setActivePage} />}
            </main>

            {currentUser && (
                <nav className="bg-white shadow-t fixed bottom-0 w-full flex justify-around py-2 border-t z-50">
                    <button 
                        onClick={() => setActivePage('home')} 
                        className={`flex flex-col items-center p-2 ${activePage === 'home' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
                    >
                        <HomeIcon />
                        <span className="text-xs">Home</span>
                    </button>
                    <button 
                        onClick={() => setActivePage('courses')} 
                        className={`flex flex-col items-center p-2 ${activePage === 'courses' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
                    >
                        <CoursesIcon />
                        <span className="text-xs">Courses</span>
                    </button>
                    <button 
                        onClick={() => setActivePage('profile')} 
                        className={`flex flex-col items-center p-2 ${activePage === 'profile' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
                    >
                        <ProfileIcon />
                        <span className="text-xs">Profile</span>
                    </button>
                </nav>
            )}
            {/* No explicit spacer div needed if main has padding-bottom */}
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));

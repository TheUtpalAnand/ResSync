function Signup({ setCurrentUser, setActivePage }) {
    const [name, setName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const generateRandomEmail = (name) => {
        const randomNumber = Math.floor(Math.random() * 10000);
        return `${name.toLowerCase().replace(/\s+/g, '.')}.${randomNumber}@example.com`;
    };

    const generateRandomMobile = () => {
        const randomNumber = Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000;
        return `+91${randomNumber}`;
    };

    const handleSignup = () => {
        if (!name || !password || !confirmPassword) {
            setError('All fields are required.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (localStorage.getItem(name)) {
            setError('User already exists. Please log in.');
            return;
        }

        const newUser = {
            name: name,
            password: password,
            email: generateRandomEmail(name),
            mobile: generateRandomMobile(),
            courses: []
        };

        localStorage.setItem(name, JSON.stringify(newUser));
        setCurrentUser(newUser);
        setActivePage('home');
        setError('');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Sign Up</h2>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name-signup">
                        Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name-signup"
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password-signup">
                        Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password-signup"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password-signup">
                        Confirm Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="confirm-password-signup"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div className="flex flex-col items-center justify-between space-y-4">
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        type="button"
                        onClick={handleSignup}
                    >
                        Sign Up
                    </button>
                    <button
                        className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                        type="button"
                        onClick={() => setActivePage('login')}
                    >
                        Already have an account? Log In
                    </button>
                </div>
            </div>
        </div>
    );
}

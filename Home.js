function HomePage({ currentUser }) {
    // Mock tasks for Google Tasks like UI
    const [tasks, setTasks] = React.useState([
        { id: 1, text: 'Review CS101 Lecture Notes', completed: false },
        { id: 2, text: 'Start MATH201 Assignment 1', completed: false },
        { id: 3, text: 'Prepare for Project Meeting', completed: true },
    ]);
    const [newTask, setNewTask] = React.useState('');

    const handleAddTask = () => {
        if (newTask.trim() === '') return;
        setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
        setNewTask('');
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">My Tasks</h2>
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex mb-4">
                    <input
                        type="text"
                        className="flex-grow shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                        placeholder="Add a new task"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                    />
                    <button
                        onClick={handleAddTask}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Add
                    </button>
                </div>
                <ul>
                    {tasks.map(task => (
                        <li
                            key={task.id}
                            className={`flex items-center justify-between p-3 mb-2 rounded-md ${task.completed ? 'bg-green-100' : 'bg-gray-50'} hover:bg-gray-100 cursor-pointer`}
                            onClick={() => toggleTask(task.id)}
                        >
                            <span className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                {task.text}
                            </span>
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTask(task.id)}
                                className="form-checkbox h-5 w-5 text-blue-600 rounded"
                            />
                        </li>
                    ))}
                </ul>
                {tasks.length === 0 && <p className="text-gray-500 text-center">No tasks yet. Add some!</p>}
            </div>
        </div>
    );
}

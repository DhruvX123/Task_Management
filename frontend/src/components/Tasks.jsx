import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';
import Tooltip from './utils/Tooltip';

const Tasks = () => {

  const authState = useSelector(state => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [fetchData, { loading }] = useFetch();

  const fetchTasks = useCallback(() => {
    const config = { url: "/tasks", method: "get", headers: { Authorization: authState.token } };
    fetchData(config, { showSuccessToast: false }).then(data => setTasks(data.tasks));
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);


  const handleDelete = (id) => {
    const config = { url: `/tasks/${id}`, method: "delete", headers: { Authorization: authState.token } };
    fetchData(config).then(() => fetchTasks());
  }


  return (
    <>
      <div className="my-2 mx-auto max-w-[700px] py-4">

        {tasks.length !== 0 && <h2 className='my-2 ml-2 md:ml-0 text-xl'>Your tasks ({tasks.length})</h2>}
        {loading ? (
          <Loader />
        ) : (
          <div>
              {tasks.length === 0 ? (

              <div className='w-[600px] h-[300px] flex items-center justify-center gap-4'>
                <span>No tasks found</span>
                <Link to="/tasks/add" className="bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md px-4 py-2">+ Add new task </Link>
              </div>

            ) : (
              ['high', 'medium', 'low'].map(priority => (
                <div key={priority} className="mb-6">
                  <h3 className={`text-lg font-semibold mb-2 ${priority === 'high' ? 'text-red-600' : priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                  </h3>
                  {tasks.filter(task => task.priority === priority).map((task, index) => (
                    <div key={task._id} className='bg-white my-4 p-6 text-gray-700 rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-2xl'>
                      <div className='flex'>

                        <span className='font-medium'>Task #{index + 1}</span>

                        <Tooltip text={"Edit this task"} position={"top"}>
                          <Link to={`/tasks/${task._id}`} className='ml-auto mr-2 text-green-600 cursor-pointer hover:text-green-800 transition-colors duration-300'>
                            <i className="fa-solid fa-pen"></i>
                          </Link>
                        </Tooltip>

                        <Tooltip text={"Delete this task"} position={"top"}>
                          <span className='text-red-500 cursor-pointer hover:text-red-700 transition-colors duration-300' onClick={() => handleDelete(task._id)}>
                            <i className="fa-solid fa-trash"></i>
                          </span>
                        </Tooltip>

                      </div>
                      <div>
                        <div className='font-semibold'>{task.title}</div>
                        <div className='whitespace-pre'>{task.description}</div>
                        {task.dueDate && <div className='text-sm text-gray-500'>Due: {new Date(task.dueDate).toLocaleDateString()}</div>}
                        <div className={`text-sm font-semibold ${task.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                          Status: {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))

            )}
          </div>
        )}
      </div>
    </>
  )

}

export default Tasks

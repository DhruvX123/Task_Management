import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Tasks from '../components/Tasks';
import MainLayout from '../layouts/MainLayout';

const Home = () => {

  const authState = useSelector(state => state.authReducer);
  const { isLoggedIn } = authState;

  useEffect(() => {
    document.title = authState.isLoggedIn ? `${authState.user.name}'s tasks` : "Task Manager";
  }, [authState]);

  return (
    <>
      <MainLayout>
        {!isLoggedIn ? (
          <div className='bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 text-white h-[50vh] flex flex-col justify-center items-center py-8 px-4 text-center'>
            <h1 className='text-4xl font-extrabold mb-6 drop-shadow-lg'>Welcome to Task Manager App</h1>
            <Link to="/signup" className='mt-6'>
              <button className='bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out'>
                Join now to manage your tasks
              </button>
            </Link>
          </div>
        ) : (
          <>
            <h1 className='text-2xl mt-8 mx-8 border-b border-b-gray-300 pb-2 font-semibold'>Welcome {authState.user.name}</h1>
            <div className='mx-8 mt-4 p-6 bg-white rounded-lg shadow-lg max-w-4xl'>
              <Tasks />
            </div>
          </>
        )}
      </MainLayout>
    </>
  )
}

export default Home

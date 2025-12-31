import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setTask(data.task);
    } catch (error) {
      console.error('Error fetching task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      navigate('/tasks');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      setTask(data.task);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const priorityConfig = {
    high: { color: 'red', icon: '🔴', label: 'High Priority' },
    medium: { color: 'yellow', icon: '🟡', label: 'Medium Priority' },
    low: { color: 'green', icon: '🟢', label: 'Low Priority' }
  };

  const statusConfig = {
    pending: { color: 'gray', icon: '⏰', label: 'Pending' },
    'in-progress': { color: 'blue', icon: '⚡', label: 'In Progress' },
    completed: { color: 'green', icon: '✅', label: 'Completed' }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Task not found</h3>
        <p className="text-gray-600 mb-6">The task you're looking for doesn't exist or has been deleted.</p>
        <Link
          to="/tasks"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
          ← Back to Tasks
        </Link>
      </div>
    );
  }

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        to="/tasks"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium mb-6 transition"
      >
        ← Back to Tasks
      </Link>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header with Priority Indicator */}
        <div className={`h-3 bg-gradient-to-r from-${priority.color}-500 to-${priority.color}-600`}></div>
        
        <div className="p-8">
          {/* Title & Actions */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{task.title}</h1>
              <div className="flex flex-wrap gap-3">
                <span className={`px-4 py-2 bg-${priority.color}-100 text-${priority.color}-800 rounded-full text-sm font-semibold border border-${priority.color}-300 flex items-center gap-2`}>
                  <span>{priority.icon}</span>
                  {priority.label}
                </span>
                <span className={`px-4 py-2 bg-${status.color}-100 text-${status.color}-800 rounded-full text-sm font-semibold flex items-center gap-2`}>
                  <span>{status.icon}</span>
                  {status.label}
                </span>
                {isOverdue && (
                  <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold flex items-center gap-2">
                    <span>⚠️</span>
                    Overdue
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Link
                to={`/tasks/edit/${task._id}`}
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <span>✏️</span>
                Edit
              </Link>
              {(user?.role === 'admin' || task.createdBy?._id === user?._id) && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                >
                  <span>🗑️</span>
                  Delete
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span>📝</span>
              Description
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-700 whitespace-pre-wrap">
                {task.description || 'No description provided'}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Assigned To */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span>👤</span>
                Assigned To
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {task.assignedTo?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{task.assignedTo?.name}</p>
                  <p className="text-sm text-gray-600">{task.assignedTo?.email}</p>
                </div>
              </div>
            </div>

            {/* Created By */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span>👨‍💼</span>
                Created By
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {task.createdBy?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{task.createdBy?.name}</p>
                  <p className="text-sm text-gray-600">{task.createdBy?.email}</p>
                </div>
              </div>
            </div>

            {/* Due Date */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span>📅</span>
                Due Date
              </h3>
              <p className={`text-lg font-bold ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                {formatDate(task.dueDate)}
              </p>
              {isOverdue && (
                <p className="text-sm text-red-600 mt-1 font-semibold">This task is overdue!</p>
              )}
            </div>

            {/* Created Date */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span>🕐</span>
                Created On
              </h3>
              <p className="text-lg font-bold text-gray-900">
                {formatDate(task.createdAt)}
              </p>
            </div>
          </div>

          {/* Status Actions */}
          {task.status !== 'completed' && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
              <div className="flex flex-wrap gap-3">
                {task.status === 'pending' && (
                  <button
                    onClick={() => handleStatusChange('in-progress')}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <span>▶️</span>
                    Start Task
                  </button>
                )}
                {task.status === 'in-progress' && (
                  <button
                    onClick={() => handleStatusChange('completed')}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <span>✅</span>
                    Mark as Complete
                  </button>
                )}
              </div>
            </div>
          )}

          {task.status === 'completed' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-5xl mb-3">🎉</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Task Completed!</h3>
              <p className="text-green-700">Great job on completing this task.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
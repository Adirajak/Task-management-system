import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TaskItem = ({ task, onDelete, onStatusChange }) => {
  const { user } = useAuth();

  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-green-100 text-green-800 border-green-300'
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  };

  const statusIcons = {
    pending: '⏰',
    'in-progress': '⚡',
    completed: '✅'
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Priority Badge */}
      <div className={`h-2 ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <Link to={`/tasks/${task._id}`} className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition line-clamp-2">
              {task.title}
            </h3>
          </Link>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold border ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {task.description || 'No description provided'}
        </p>

        {/* Status & Due Date */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[task.status]} flex items-center gap-1`}>
            <span>{statusIcons[task.status]}</span>
            {task.status.replace('-', ' ')}
          </span>
          <span className={`text-xs font-medium flex items-center gap-1 ${
            isOverdue ? 'text-red-600' : 'text-gray-600'
          }`}>
            <span>📅</span>
            {formatDate(task.dueDate)}
            {isOverdue && <span className="text-red-600 font-bold">⚠️</span>}
          </span>
        </div>

        {/* Assigned User */}
        {task.assignedTo && (
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
            <span>👤</span>
            <span>Assigned to: <span className="font-medium">{task.assignedTo.name}</span></span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {task.status !== 'completed' && (
            <button
              onClick={() => onStatusChange(task._id, task.status === 'pending' ? 'in-progress' : 'completed')}
              className="flex-1 px-3 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-1"
            >
              <span>{task.status === 'pending' ? '▶️' : '✅'}</span>
              {task.status === 'pending' ? 'Start' : 'Complete'}
            </button>
          )}
          <Link
            to={`/tasks/edit/${task._id}`}
            className="px-4 py-2 bg-indigo-500 text-white text-sm font-semibold rounded-lg hover:bg-indigo-600 transition"
          >
            ✏️
          </Link>
          {(user?.role === 'admin' || task.createdBy?._id === user?._id) && (
            <button
              onClick={() => onDelete(task._id)}
              className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
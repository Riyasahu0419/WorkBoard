// src/components/Task.jsx
import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';

const priorityColors = {
  low: 'bg-green-100 border-green-300',
  medium: 'bg-yellow-100 border-yellow-300',
  high: 'bg-red-100 border-red-300'
};

const Task = ({ task, index, deleteTask, updateTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateTask(editedTask);
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-2 p-3 rounded-md shadow-sm border ${priorityColors[task.priority] || 'bg-white border-gray-300'} ${
            snapshot.isDragging ? 'shadow-lg opacity-90' : ''
          }`}
        >
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="space-y-2">
              <input
                type="text"
                value={editedTask.content}
                onChange={(e) => setEditedTask({ ...editedTask, content: e.target.value })}
                className="w-full px-2 py-1 rounded border border-gray-400"
                autoFocus
              />
              <textarea
                value={editedTask.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                className="w-full px-2 py-1 rounded border border-gray-400 text-sm"
                rows="2"
                placeholder="Description"
              />
              <select
                value={editedTask.priority}
                onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                className="w-full px-2 py-1 rounded border border-gray-400"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex justify-between">
                <h4 className="font-medium">{task.content}</h4>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-500 hover:text-blue-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={deleteTask}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              {task.description && (
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              )}
              <div className="mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  task.priority === 'low' ? 'bg-green-200 text-green-800' :
                  task.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-red-200 text-red-800'
                }`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Task;
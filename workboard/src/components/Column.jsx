// src/components/Column.jsx
import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';

const Column = ({ 
  column, 
  tasks, 
  openAddTaskForm, 
  deleteTask, 
  updateTask, 
  deleteColumn,
  renameColumn
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    renameColumn(title);
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-200 rounded-md shadow-md w-72 flex-shrink-0 flex flex-col max-h-full">
      <div className="p-3 bg-gray-300 rounded-t-md flex justify-between items-center">
        {isEditing ? (
          <form onSubmit={handleTitleSubmit} className="flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-2 py-1 rounded border border-gray-400"
              autoFocus
              onBlur={handleTitleSubmit}
            />
          </form>
        ) : (
          <h3 
            className="font-semibold text-gray-700 text-lg cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {column.title}
          </h3>
        )}
        <div className="flex space-x-2">
          <button 
            onClick={openAddTaskForm}
            className="text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={deleteColumn}
            className="text-red-600 hover:text-red-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-2 flex-grow overflow-y-auto min-h-[200px] ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
          >
            {tasks.map((task, index) => (
              <Task 
                key={task.id} 
                task={task} 
                index={index} 
                deleteTask={() => deleteTask(task.id)}
                updateTask={(updatedTask) => updateTask(task.id, updatedTask)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;

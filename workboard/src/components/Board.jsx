// src/App.jsx
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import Header from './Heasder';
import Column from './Column';
import AddItemForm from './AddItemForm';


const Board = () => {
  // Initial board data
  const initialData = {
    tasks: {
      'task-1': { id: 'task-1', content: 'Take out the garbage', description: 'Remember to separate recyclables', priority: 'medium' },
      'task-2': { id: 'task-2', content: 'Watch my favorite show', description: 'New episode airs tonight', priority: 'low' },
      'task-3': { id: 'task-3', content: 'Charge my phone', description: 'Battery is low', priority: 'high' },
      'task-4': { id: 'task-4', content: 'Cook dinner', description: 'Try new pasta recipe', priority: 'medium' },
    },
    columns: {
      'column-1': {
        id: 'column-1',
        title: 'To do',
        taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
      },
      'column-2': {
        id: 'column-2',
        title: 'In progress',
        taskIds: [],
      },
      'column-3': {
        id: 'column-3',
        title: 'Done',
        taskIds: [],
      },
    },
    columnOrder: ['column-1', 'column-2', 'column-3'],
  };

  // Check for saved state in localStorage
  const getSavedState = () => {
    const savedState = localStorage.getItem('workboardState');
    return savedState ? JSON.parse(savedState) : initialData;
  };

  const [state, setState] = useState(getSavedState);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('workboardState', JSON.stringify(state));
  }, [state]);

  // Handle drag end event
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or if the item is dropped in the same place, do nothing
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Get the source and destination columns
    const startColumn = state.columns[source.droppableId];
    const finishColumn = state.columns[destination.droppableId];

    // If moving within the same column
    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      };

      setState(newState);
      return;
    }

    // Moving from one column to another
    const startTaskIds = Array.from(startColumn.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...startColumn,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finishColumn.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finishColumn,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setState(newState);
  };

  // Add a new task
  const addTask = (task, columnId) => {
    const taskId = `task-${uuidv4()}`;
    const column = state.columns[columnId];
    
    const newState = {
      ...state,
      tasks: {
        ...state.tasks,
        [taskId]: { id: taskId, ...task },
      },
      columns: {
        ...state.columns,
        [columnId]: {
          ...column,
          taskIds: [...column.taskIds, taskId],
        },
      },
    };
    
    setState(newState);
    setIsFormOpen(false);
  };

  // Delete a task
  const deleteTask = (taskId, columnId) => {
    const column = state.columns[columnId];
    const newTaskIds = column.taskIds.filter(id => id !== taskId);
    
    const newTasks = { ...state.tasks };
    delete newTasks[taskId];
    
    const newState = {
      ...state,
      tasks: newTasks,
      columns: {
        ...state.columns,
        [columnId]: {
          ...column,
          taskIds: newTaskIds,
        },
      },
    };
    
    setState(newState);
  };

  // Update a task
  const updateTask = (taskId, updatedTask) => {
    setState({
      ...state,
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...state.tasks[taskId],
          ...updatedTask,
        },
      },
    });
  };

  // Add a new column
  const addColumn = () => {
    const columnId = `column-${uuidv4()}`;
    const newColumn = {
      id: columnId,
      title: 'New Column',
      taskIds: [],
    };
    
    setState({
      ...state,
      columns: {
        ...state.columns,
        [columnId]: newColumn,
      },
      columnOrder: [...state.columnOrder, columnId],
    });
  };

  // Delete a column
  const deleteColumn = (columnId) => {
    const column = state.columns[columnId];
    
    // Delete tasks in this column
    const newTasks = { ...state.tasks };
    column.taskIds.forEach(taskId => {
      delete newTasks[taskId];
    });
    
    // Remove the column
    const newColumns = { ...state.columns };
    delete newColumns[columnId];
    
    // Update column order
    const newColumnOrder = state.columnOrder.filter(id => id !== columnId);
    
    setState({
      ...state,
      tasks: newTasks,
      columns: newColumns,
      columnOrder: newColumnOrder,
    });
  };

  // Rename a column
  const renameColumn = (columnId, newTitle) => {
    setState({
      ...state,
      columns: {
        ...state.columns,
        [columnId]: {
          ...state.columns[columnId],
          title: newTitle,
        },
      },
    });
  };

  const openAddTaskForm = (columnId) => {
    setSelectedColumn(columnId);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header addColumn={addColumn} />
      
      <div className="container mx-auto px-4 py-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-4 overflow-x-auto pb-6">
            {state.columnOrder.map((columnId) => {
              const column = state.columns[columnId];
              const tasks = column.taskIds.map(taskId => state.tasks[taskId]);
              
              return (
                <Column
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  openAddTaskForm={() => openAddTaskForm(column.id)}
                  deleteTask={(taskId) => deleteTask(taskId, column.id)}
                  updateTask={updateTask}
                  deleteColumn={() => deleteColumn(column.id)}
                  renameColumn={(newTitle) => renameColumn(column.id, newTitle)}
                />
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {isFormOpen && (
        <AddItemForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={(task) => addTask(task, selectedColumn)}
        />
      )}
    </div>
  );
};

export default Board;
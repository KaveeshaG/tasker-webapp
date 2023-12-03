import Layout from "../components/Layout";
import {
  PlusCircleIcon,
} from "@heroicons/react/outline";
import CardItem from "../components/CardItem";
import { fetchTasks, createTask, updateTask } from "../api/task";

import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";

export default function Home() {
  const [ready, setReady] = useState(false);
  const [boardData, setBoardData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchTasks();
        setBoardData(response.data);
        setReady(true);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    if (process.browser) {
      fetchData();
    }

  }, []);

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const sourceBoardId = parseInt(result.source.droppableId);
    const destinationBoardId = parseInt(result.destination.droppableId);

    const draggedTask = boardData[sourceBoardId].items[result.source.index];
    const updatedTask = {
      ...draggedTask,
      status: mapBoardToStatus(destinationBoardId),
    };

    try {
      await updateTask(draggedTask.id, updatedTask);

      const newBoardData = [...boardData];
      newBoardData[sourceBoardId].items.splice(result.source.index, 1);
      newBoardData[destinationBoardId].items.splice(result.destination.index, 0, updatedTask);
      setBoardData(newBoardData);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const mapBoardToStatus = (boardValue) => {
    switch (boardValue) {
      case 0:
        return 'ToDo';
      case 1:
        return 'In-progress';
      case 2:
        return 'In-review';
      case 3:
        return 'Done';
      default:
        return '';
    }
  };

  const onTextAreaKeyPress = async (e) => {
    if (e.keyCode === 13) {
      const val = e.target.value.trim();
      if (val.length === 0 || !title || !description || priority === undefined) {
        setShowForm(false);
      }
      else {
        const boardId = e.target.attributes['data-id'].value;
        const status = mapBoardToStatus(selectedBoard);

        const item = {
          title: title,
          description: description,
          priority: parseInt(priority),
          status: status
        };

        try {
          const createdTask = await createTask(item);
          console.log('Task created:', createdTask);
        } catch (error) {
          console.error('Error creating task:', error);
        }

        let newBoardData = [...boardData];
        let boardItems = [...newBoardData[boardId].items];
        boardItems.push(item);
        newBoardData[boardId] = { ...newBoardData[boardId], items: boardItems };
        setBoardData(newBoardData);
        setShowForm(false);
        setTitle("");
        setDescription("");
        setPriority(0);
        e.target.value = '';
      }
    }
  }

  return (
    <Layout>
      <div className="p-10 flex flex-col h-screen">
        <div className="flex flex-initial justify-between">
          <div className="flex items-center">
            <h4 className="text-4xl font-bold text-gray-600">Task Board</h4>
          </div>
        </div>

        {ready && (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-4 gap-5 my-5">
              {boardData.map((board, bIndex) => {
                return (
                  <div key={board.name}>
                    <Droppable droppableId={bIndex.toString()}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          <div
                            className={`bg-gray-100 rounded-md shadow-md
                            flex flex-col relative overflow-hidden
                            ${snapshot.isDraggingOver && "bg-green-100"}`}
                          >
                            <span
                              className="w-full h-1 bg-gradient-to-r from-pink-700 to-red-200
                          absolute inset-x-0 top-0"
                            ></span>
                            <h4 className=" p-3 flex justify-between items-center mb-2">
                              <span className="text-2xl text-gray-600">
                                {board.name}
                              </span>
                            </h4>

                            <div className="overflow-y-auto overflow-x-hidden h-auto"
                              style={{ maxHeight: 'calc(100vh - 290px)' }}>
                              {board.items.length > 0 &&
                                board.items.map((item, iIndex) => {
                                  return (
                                    <CardItem
                                      key={item.id}
                                      data={item}
                                      index={iIndex}
                                      className="m-3"
                                    />
                                  );
                                })}
                              {provided.placeholder}
                            </div>

                            {
                              showForm && selectedBoard === bIndex ? (
                                <div className="p-3">
                                  <input
                                    type="text"
                                    placeholder="Title"
                                    className=" border-gray-300 rounded focus:ring-purple-400 w-full"
                                    onChange={(e) => setTitle(e.target.value)}
                                  />

                                  <select
                                    className="border-gray-300 rounded focus:ring-purple-400 w-full"
                                    onChange={(e) => setPriority(e.target.value)}
                                  >
                                    <option value="0">Low</option>
                                    <option value="1">Medium</option>
                                    <option value="2">High</option>
                                  </select>

                                  <textarea className="border-gray-300 rounded focus:ring-purple-400 w-full"
                                    rows={3} placeholder="Task info"
                                    data-id={bIndex}
                                    onChange={(e) => setDescription(e.target.value)}
                                    onKeyDown={(e) => onTextAreaKeyPress(e)} />
                                </div>
                              ) : (
                                <button
                                  className="flex justify-center items-center my-3 space-x-2 text-lg"
                                  onClick={() => { setSelectedBoard(bIndex); setShowForm(true); }}
                                >
                                  <span>Add task</span>
                                  <PlusCircleIcon className="w-5 h-5 text-gray-500" />
                                </button>
                              )
                            }
                          </div>
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        )}
      </div>
    </Layout>
  );
}

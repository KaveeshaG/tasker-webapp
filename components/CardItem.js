import React from "react";
import { Draggable } from "react-beautiful-dnd";
import {
  MinusIcon
} from "@heroicons/react/outline";
import { deleteTask } from "../api/task";
import { useState } from "react";

function CardItem({ data, index }) {
  const [isVisible, setIsVisible] = useState(true);
  const handleDeleteClick = async () => {
    try {
      await deleteTask(data.id);
      setIsVisible(false);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Draggable index={index} draggableId={String(data.id)}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded-md p-3 m-3 mt-0 last:mb-0"
        >
          <label
            className={`bg-gradient-to-r
              px-2 py-1 rounded text-white text-sm
              ${data.priority === 0
                ? "from-blue-600 to-blue-400"
                : data.priority === 1
                  ? "from-green-600 to-green-400"
                  : "from-red-600 to-red-400"
              }
              `}
          >
            {data.priority === 0
              ? "Low Priority"
              : data.priority === 1
                ? "Medium Priority"
                : "High Priority"}
          </label>
          <h5 className="text-md my-3 text-lg leading-6">{data.title}</h5>
          <p className="text-md my-3 text-sm leading-6">{data.description}</p>

          <div className="flex justify-between">
            <ul className="flex space-x-3">
              <li>
                <button
                  className="border border-dashed flex items-center w-9 h-9 border-red-500 justify-center
                    rounded-full" onClick={handleDeleteClick}
                >
                  <MinusIcon className="w-5 h-5 text-red-500" />
                </button>
              </li>
            </ul>

          </div>
        </div>

      )}
    </Draggable>
  );
}

export default CardItem;

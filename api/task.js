import axios from "axios";

export const fetchTasks = async () => {
    try {
        const response = await axios.get('http://localhost:8081/task');
        return response;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
};

export const createTask = async (taskData) => {
    try {
        const response = await axios.post('http://localhost:8081/task', taskData);
        return response;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
};

export const updateTask = async (taskId, updatedTaskData) => {
    try {
        const response = await axios.put(`http://localhost:8081/task/${taskId}`, updatedTaskData);
        return response.data;
    } catch (error) {
        console.error(`Error updating task with ID ${taskId}:`, error);
        throw error;
    }
};

export const deleteTask = async (taskId) => {
    try {
        const response = await axios.delete(`http://localhost:8081/task/${taskId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting task with ID ${taskId}:`, error);
        throw error;
    }
};
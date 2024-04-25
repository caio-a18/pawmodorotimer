//import axios from 'axios';
//Using the axios library to help with conciseness and readibility
async function loginUser(credentials) {
  try {
    const response = await axios.post('http://localhost:8080/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

async function createUser(userData) {
  try {
    const response = await axios.post('http://localhost:8080/create-user', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

const updateUserLevel = async (userId, duration) => {
  try {
    const response = await axios.post(`/api/user/level/update/${userId}`, {
      focusDuration: duration, // Duration in minutes
    });
    return response.data.newLevel; // Assuming the API returns the new level
  } catch (error) {
    console.error('Error updating user level:', error);
    throw error; 
  }
};

export { loginUser, createUser, updateUserLevel};
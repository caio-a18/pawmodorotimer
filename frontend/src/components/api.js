import axios from 'axios';
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

// Function to fetch user details by email
const fetchUserDetailsByEmail = async (email) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/user/details?email=${encodeURIComponent(email)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

// Function to increment the total study time for a user by email
const updateUserStudyTimeByEmail = async (email, additionalTime) => {
  try {
    const response = await axios.post(`http://localhost:8080/api/user/level/update`, {
      email,
      focusDuration: additionalTime, // Clearly indicates this is a duration to add
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user study time:', error);
    throw error;
  }
};


async function checkUser(email) {
  try {
    const response = await axios.get(`http://localhost:8080/check-user?email=${encodeURIComponent(email)}`);
    return response.data;
  } catch (error) {
    console.error('Error checking user:', error);
    throw error;
  }
}

// Function to log a study session
const logStudySession = async (userId, startTime, endTime, duration) => {
  try {
    const response = await axios.post('http://localhost:8080/api/log-study-session', {
      user_id: userId,
      start_time: new Date(startTime),
      end_time: new Date(endTime),
      duration: duration
    });
    console.log('Study session logged successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error logging study session:', error);
    throw error;  // Rethrow or handle error appropriately
  }
};


const fetchUserIdByEmail = async (email) => {
  try {
      const response = await axios.get(`http://localhost:8080/api/get-user-id`, { params: { email } });
      return response.data.userId; // Assuming the backend sends back an object with a userId property
  } catch (error) {
      console.error('Error fetching user ID:', error);
      throw error;  // Consider how you want to handle errors - maybe return null or a specific code
  }
};

export {loginUser, createUser, updateUserLevel, checkUser, updateUserStudyTimeByEmail, fetchUserDetailsByEmail, logStudySession, fetchUserIdByEmail};
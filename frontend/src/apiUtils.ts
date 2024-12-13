import axios from "axios";

export const fetchData = async (url: string): Promise<any> => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

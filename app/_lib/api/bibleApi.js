import { fetchData } from "./api";
const BASE_URL = "https://api.scripture.api.bible/v1/bibles";
const API_KEY = "2917b29dcc612336646fc8dd29282dbd";

export const fetchBibleData = async (endpoint) => {
  try {
    const { data, error } = await fetchData(endpoint, {
      method: "GET",
      headers: {
        "api-key": API_KEY,
      },
    });
    if (error) {
      throw new Error(error.message); // Handle error
    }
    return data; // Return the data to the caller
  } catch (error) {
    throw new Error(error.message); // Throw error to be handled by the component
  }
};

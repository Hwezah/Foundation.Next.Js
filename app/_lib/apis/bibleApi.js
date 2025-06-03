import fetchData from "@/app/_lib/apis/api";
const URL = "https://api.scripture.api.bible/v1/bibles";
const API_KEY = "2917b29dcc612336646fc8dd29282dbd";
// Renamed parameters for clarity: baseApiUrl is the constant, endpointPath is the specific path
export const fetchBibleData = async (endpointPath) => {
  try {
    const fullUrl = `${URL}${endpointPath}`; // Correctly construct the full URL
    const responseData = await fetchData(fullUrl, {
      // Get the full response object
      method: "GET",
      headers: { "api-key": API_KEY },
    });
    // fetchData already throws on non-OK status, so no need to check for 'error' property here
    return responseData; // Return the full data object received from fetchData
  } catch (err) {
    console.error("Error in fetchBibleData:", err); // Log the error
    throw new Error(`Failed to fetch Bible data: ${err.message}`); // Throw a new error to be handled by the component
  }
};

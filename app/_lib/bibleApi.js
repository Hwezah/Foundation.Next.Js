import fetchData from "@/app/api/api";

// Renamed parameters for clarity: baseApiUrl is the constant, endpointPath is the specific path
export const fetchBibleData = async (endpointPath) => {
  try {
    // Construct the URL to your internal API route, passing the endpointPath as a query parameter
    const internalApiUrl = `/api/bible?endpointPath=${encodeURIComponent(
      endpointPath
    )}`;
    const responseData = await fetchData(internalApiUrl); // fetchData will call your internal API
    return responseData;
  } catch (err) {
    console.error("Error in fetchBibleData:", err); // Log the error
    throw new Error(
      `Failed to fetch Bible data from internal API: ${err.message}`
    );
  }
};

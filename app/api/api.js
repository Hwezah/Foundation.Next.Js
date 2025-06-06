export default async function fetchData(URL, endpoint) {
  const response = await fetch(URL, endpoint);
  if (!response.ok) {
    const errorBody = await response.text(); // Try to read the error body
    console.error(
      `[fetchData] Failed (${URL}): ${response.status} ${response.statusText}`
    );
    console.error(`Error details: ${errorBody}`);
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data);

  // Removed localStorage handling for pagination tokens

  return data;
}

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

  // Handle YouTube's pagination
  if (data.nextPageToken) {
    localStorage.setItem("nextPageToken", data.nextPageToken);
  } else {
    localStorage.removeItem("nextPageToken");
  }

  // Handle ListenNotes pagination
  if (data.next_offset !== undefined) {
    localStorage.setItem("nextOffset", data.next_offset);
  } else {
    localStorage.removeItem("nextOffset");
  }

  return data;
}

export default async function fetchData(URL: string, endpoint: string): Promise<any>{

  const response = await fetch(URL + endpoint);

  if (!response.ok) {
    const errorBody = await response.text(); 
    console.error(
      `[fetchData] Failed (${URL}): ${response.status} ${response.statusText}`
    );
    console.error(`Error details: ${errorBody}`);
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data);

  return data;
}

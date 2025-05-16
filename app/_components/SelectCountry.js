import { useEffect, useState } from "react";

function SelectCountry({ defaultCountry, name, id, className }) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCountries() {
      try {
        const res = await fetch(
          "https://restcountries.com/v2/all?fields=name,flag"
        );
        const data = await res.json();
        setCountries(data);
      } catch (err) {
        console.error("Could not fetch countries:", err);
      } finally {
        setLoading(false);
      }
    }

    getCountries();
  }, []);

  const flag =
    countries.find((country) => country.name === defaultCountry)?.flag ?? "";

  return (
    <select
      name={name}
      id={id}
      defaultValue={`${defaultCountry}%${flag}`}
      className={className}
    >
      <option value="">Select country...</option>
      {loading ? (
        <option disabled>Loading...</option>
      ) : (
        countries.map((c) => (
          <option key={c.name} value={`${c.name}%${c.flag}`}>
            {c.name}
          </option>
        ))
      )}
    </select>
  );
}

export default SelectCountry;

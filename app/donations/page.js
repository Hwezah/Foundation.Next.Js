import Donations from "../_components/Donations";
export default function Page() {
  return (
    <div>
      <ul className="flex justify-between gap-6 hidden">
        <li>
          <Donations />
        </li>
      </ul>
    </div>
  );
}

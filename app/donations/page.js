export default function Page() {
  return (
    <div>
      <ul className="flex justify-between gap-6 hidden">
        <li>
          <Donations showSearch={showSearch} />
        </li>
      </ul>
    </div>
  );
}

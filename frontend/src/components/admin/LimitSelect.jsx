const LIMIT_OPTIONS = [10, 25, 50, 100];

export default function LimitSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-500"
    >
      {LIMIT_OPTIONS.map((n) => (
        <option key={n} value={n}>
          {n} / halaman
        </option>
      ))}
    </select>
  );
}

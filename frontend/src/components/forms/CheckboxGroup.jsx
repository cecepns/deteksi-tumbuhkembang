export default function CheckboxGroup({
  label,
  name,
  options,
  value = [],
  onChange,
  required,
  hint,
  hasTidakAda = true,
  error,
}) {
  const handleToggle = (option) => {
    onChange(name, option, hasTidakAda);
  };

  return (
    <fieldset className="space-y-3">
      <legend className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </legend>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}

      <div className="space-y-2">
        {options.map((option) => {
          const checked = value.includes(option);
          return (
            <label
              key={option}
              className={`flex cursor-pointer gap-3 rounded-xl border p-3 transition ${
                checked
                  ? "border-primary-300 bg-primary-50"
                  : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
              }`}
            >
              <input
                type="checkbox"
                name={name}
                value={option}
                checked={checked}
                onChange={() => handleToggle(option)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm leading-relaxed text-slate-700">{option}</span>
            </label>
          );
        })}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </fieldset>
  );
}

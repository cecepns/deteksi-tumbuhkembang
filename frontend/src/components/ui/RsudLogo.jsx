import logo from "@/assets/logo.png";

export default function RsudLogo({ className = "h-10 w-10" }) {
  return (
    <img
      src={logo}
      alt="Logo RSUD Kebayoran Lama"
      className={`object-contain ${className}`}
    />
  );
}

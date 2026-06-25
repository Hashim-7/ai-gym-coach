interface AuthInputProps {
  field: string;
}

export default function AuthInput({ field }: AuthInputProps) {
  const type =
    field === "Email" || field === "Password" ? field.toLowerCase() : "text";
  return (
    <input
      type={type}
      name={field}
      placeholder={field}
      className="input input-bordered input-lg w-full"
    />
  );
}

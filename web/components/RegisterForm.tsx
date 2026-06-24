"use client";
import AuthInput from "@/components/AuthInput";
import RememberMe from "@/components/RememberMe";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("Email"),
      password: formData.get("Password"),
      name: formData.get("Name"),
      username: formData.get("username"),
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        },
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Honeypot field to prevent botspam */}
      <div style={{ display: "none" }} aria-hidden="true">
        <input type="text" name="username" tabIndex={-1} autoComplete="off" />
      </div>

      <AuthInput field="Name" />
      <AuthInput field="Email" />
      <AuthInput field="Password" />

      <RememberMe />

      <button type="submit" className="btn btn-primary btn-lg w-full">
        Sign Up
      </button>
    </form>
  );
}

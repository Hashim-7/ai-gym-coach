"use client";
import AuthInput from "@/components/AuthInput";
import RememberMe from "@/components/RememberMe";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("Email"),
      password: formData.get("Password"),
      username: formData.get("username"),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot field to prevent botspam */}
      <div style={{ display: "none" }} aria-hidden="true">
        <input type="text" name="username" tabIndex={-1} autoComplete="off" />
      </div>

      <AuthInput field="Email" />
      <AuthInput field="Password" />

      <RememberMe />

      <button type="submit" className="btn btn-primary btn-lg w-full">
        Sign In
      </button>
    </form>
  );
}

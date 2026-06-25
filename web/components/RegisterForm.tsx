"use client";
import AuthInput from "@/components/AuthInput";
import RememberMe from "@/components/RememberMe";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("Email"),
      password: formData.get("Password"),
      name: formData.get("Name"),
      username: formData.get("username"),
      rememberMe: formData.get("rememberMe") === "on",
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
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
      setError((error as Error).message);
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

      {error && (
        <p className="text-red-500 text-sm whitespace-pre line">{error}</p>
      )}

      <button type="submit" className="btn btn-primary btn-lg w-full">
        Sign Up
      </button>
    </form>
  );
}

import CentralCard from "@/components/CentralCard";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <CentralCard heading="Sign In">
      <LoginForm />
      <div className="flex justify-center gap-2 mt-6 text-base">
        <span>Don't have an account yet?</span>
        <a className="link link-primary font-medium" href="/register">
          Sign up
        </a>
      </div>
    </CentralCard>
  );
}

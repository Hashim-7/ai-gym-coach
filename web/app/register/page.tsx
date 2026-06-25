import CentralCard from "@/components/CentralCard";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <CentralCard heading="Sign Up">
      <RegisterForm />
      <div className="flex justify-center gap-2 mt-6 text-base">
        <span>Already have an account?</span>
        <a className="link link-primary font-medium" href="/login">
          Sign in
        </a>
      </div>
    </CentralCard>
  );
}

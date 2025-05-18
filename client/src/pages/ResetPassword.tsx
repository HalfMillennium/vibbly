import ResetPasswordForm from "@/components/ResetPasswordForm";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

export default function ResetPassword() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted">
      <AppHeader />
      <main className="flex-1 flex justify-center items-center px-4 py-8">
        <ResetPasswordForm />
      </main>
      <AppFooter />
    </div>
  );
}
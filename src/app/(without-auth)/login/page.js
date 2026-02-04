import Illustration from "@/assets/login-illustration";
import FallBackImg from "@/components/FallBackImage";
import LoginForm from "@/components/login-form";
export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-281.25 flex flex-col md:flex-row border-[3px] border-border-design rounded-design overflow-hidden min-h-164">
        {/* Left Side: Illustration */}
        <div className="hidden md:flex flex-1 items-center justify-center p-8 bg-white ">
          <Illustration className="w-full h-auto max-w-112.5" />
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 bg-white">
          <div className="w-full max-w-112.5 space-y-12">
            <div className="flex flex-col items-center space-y-4">
              {/* <Logo className="w-44.75 h-14" /> */}
              <FallBackImg className="w-44.75 h-14" IsEager  />
              <div className="text-center space-y-2">
                <h1 className="text-[45px] font-serif font-bold text-primary-foreground leading-tight">
                  Login
                </h1>
                <p className="text-[20px] font-medium text-primary-foreground leading-tight">
                  Log in to manage your embroidery workflow
                </p>
              </div>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  )
}
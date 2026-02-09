'use client'
import EmailIcon from '@/assets/email-icon';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import PasswordIcon from '@/assets/password-icon';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { useRedirect } from '@/hook/useRedirect';
import { usePost } from '@/hooks/useApi';
import { toast } from 'sonner';
import Cookies from 'js-cookie';


const formSchema = Yup.object({
    email: Yup.string().email().required("Email is required"),
    password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .matches(/[a-zA-Z]/, "Password must contain at least one letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[\W_]/, "Password must contain at least one special character"),
})

function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const { redirectTo } = useRedirect()

    const { mutate: login, isPending } = usePost('/auth/login', {
        onSuccess: (data) => {
            toast.success('Login successful!')
            // Store token in cookies for middleware access
            if (data?.token) {
                Cookies.set('token', data.token, { expires: 7, secure: true })
            }
            redirectTo('/')
        },
        onError: (error) => {
            toast.error(error?.message || 'Login failed. Please try again.')
        },
    })

    const handleLogin = (values) => {
        login({
            email: values.email,
            password: values.password,
        })
    }

    return (
        <Formik
            initialValues={{
                email: "",
                password: "",
            }}
            validationSchema={formSchema}
            onSubmit={handleLogin}
        >
            {(runForm) => (
                <form
                    onSubmit={runForm.handleSubmit}
                    className="space-y-6"
                >
                    <Input
                        id="email"
                        name="email"
                        placeholder="Email"
                        runForm={runForm}
                        className={"pl-13"}
                        // className="pl-13 h-14 text-[18px] border-primary-foreground rounded-[10px] placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-primary transition-colors"
                        icon={<EmailIcon />}
                    />
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="Password"
                            className={"pl-13"}
                            runForm={runForm}
                            icon={<PasswordIcon />}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary-foreground transition-colors"
                        >
                            {!showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                        </button>
                    </div>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-16 bg-button-bg hover:bg-button-bg/90 text-primary-foreground text-[22.58px] font-semibold rounded-[10px] shadow-none uppercase"
                    >
                        {isPending ? 'Logging in...' : 'LOGIN'}
                    </Button>

                </form>
            )}
        </Formik>
    )
}

export default LoginForm

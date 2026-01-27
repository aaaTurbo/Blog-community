import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import z from "zod";
import {login} from "@/api/requests.ts";
import {Link, useNavigate} from "react-router-dom";
import {useAuthStore} from "@/store/authStore.ts";
import {useState} from "react";
import {LoadingSpinner} from "@/components/LoadingSpinner.tsx";


export default function AuthorizationPage() {

    const navigate = useNavigate();
    const setTokens = useAuthStore((state) => state.setTokens);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const schema = z.object({
        login: z.string().email("Enter valid email").min(3, "minimum 3 symbols"),
        password: z.string().min(3, "minimum 3 symbols")
    })

    type Schema = z.infer<typeof schema>;

    const form = useForm<Schema>({
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data: Schema) => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const response = await login(data.login, data.password);
            if (response.status === 200 && response.data) {
                const { tokens } = response.data;
                setTokens(tokens.token, tokens.refreshToken);
                navigate("/");
            }
        } catch (error: any) {
            console.error("Login error:", error);
            const errorMsg = error.response?.data?.message || error.message || "Login failed";
            setErrorMessage(errorMsg);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {isLoading && <LoadingSpinner />}
            <div className="flex min-h-screen flex-col items-center justify-start bg-background px-4">

                <div className="mt-24 mb-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">
                        Blog<span className="text-primary">Community</span>
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Sign in to your account
                    </p>
                </div>

                {errorMessage && (
                    <div className="w-full max-w-sm mb-4 p-3 bg-destructive/10 text-destructive border border-destructive rounded-md">
                        {errorMessage}
                    </div>
                )}

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full max-w-sm flex flex-col gap-5"
                    >
                        <FormField
                            control={form.control}
                            name="login"
                            render={({field}) => (
                                <FormItem className={""}>
                                    <FormControl>
                                        <Input {...field} placeholder="Email" type="email" disabled={isLoading}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type="password" {...field} placeholder="Password" disabled={isLoading}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign in"}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            Don't have account?{' '}
                            <Link to="/register" className="text-primary hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </form>
                </Form>
            </div>
        </>

    )
}
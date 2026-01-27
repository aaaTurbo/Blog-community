import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import z from "zod";
import {register} from "@/api/requests.ts";
import {Link, useNavigate} from "react-router-dom";
import {useAuthStore} from "@/store/authStore.ts";
import {useState} from "react";
import {LoadingSpinner} from "@/components/LoadingSpinner.tsx";


export default function RegistrationPage() {

    const navigate = useNavigate();
    const setTokens = useAuthStore((state) => state.setTokens);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const schema = z.object({
        username: z.string().min(3, "minimum 3 symbols"),
        email: z.string().email("Enter valid email"),
        password: z.string().min(3, "minimum 3 symbols"),
        secondPassword: z.string().min(3, "minimum 3 symbols"),
    }).refine((data) => data.password === data.secondPassword, {
        message: "Passwords don't match",
        path: ["secondPassword"],
    })

    type Schema = z.infer<typeof schema>;

    const form = useForm<Schema>({
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data: Schema) => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const response = await register(data.username, data.email, data.password);
            if (response.status === 201 && response.data) {
                const { tokens } = response.data;
                setTokens(tokens.token, tokens.refreshToken);
                navigate("/");
            }
        } catch (error: any) {
            console.error("Registration error:", error);
            const errorMsg = error.response?.data?.message || error.message || "Registration failed";
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
                        Welcome to a quiet and cozy place
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
                            name="username"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} placeholder="Username" disabled={isLoading}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
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

                        <FormField
                            control={form.control}
                            name="secondPassword"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type="password" {...field} placeholder="Password again" disabled={isLoading}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Signing up..." : "Sign up"}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            Already have account?{' '}
                            <Link to="/login" className="text-primary hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </Form>
            </div>
        </>

    )
}
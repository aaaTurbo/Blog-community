import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import z from "zod";
import {login} from "@/api/requests.ts";
import {Link, useNavigate} from "react-router-dom";


export default function RegistrationPage() {

    const navigate = useNavigate();

    const schema = z.object({
        login: z.email().min(3, "minimum 3 symbols"),
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

    const onSubmit = (data: Schema) => {
        login(data.login, data.password).then(r => {
                console.log(r);
                if (r.status === 200) {
                    navigate("/")
                }
            }
        );
    }

    const onError = (error: any) => {
        console.log(error);
    }
    return (
        <>
            <div className="flex min-h-screen flex-col items-center justify-start bg-background px-4">

                <div className="mt-24 mb-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">
                        Blog<span className="text-primary">Community</span>
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Welcome to a quiet and cozy place
                    </p>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit, onError)}
                        className="w-full max-w-sm flex flex-col gap-5"
                    >
                        <FormField
                            control={form.control}
                            name="login"
                            render={({field}) => (
                                <FormItem className={""}>
                                    <FormControl>
                                        <Input {...field} placeholder="Login"/>
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
                                        <Input type="password" {...field} placeholder="Password"/>
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
                                        <Input type="password" {...field} placeholder="Password again"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            Sign up
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
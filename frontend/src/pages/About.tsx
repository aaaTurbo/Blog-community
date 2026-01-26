import {parseAsString, useQueryState} from "nuqs";
import {useEffect, useState} from "react";
import z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from '@hookform/resolvers/zod';
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {api} from "@/api/apiClient.ts";




const schema = z.object({
    pizda: z.string().min(3, "ebaniy rot oshibka")
})

type Schema = z.infer<typeof schema>;

export default function About() {
    const [name, setName] = useQueryState("name", parseAsString)
    const [surname, setSurname] = useQueryState("surname", parseAsString)

    const [data, setData] = useState();

    const form = useForm<Schema>({
        defaultValues: {
            pizda: ""
        },
        resolver: zodResolver(schema)
    });

    useEffect(() => {
        api.get("/about", {params: {name, surname}}).then(d => {
            setData(d.data)
        });
    }, [name, surname])

    const onSubmit = (data: Schema) => {
        console.log(data)
    }

    const onError = (error: any) => {
        console.log(error);
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                    <FormField control={form.control} name="pizda" render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <Button variant="default" type="submit">hui</Button>
                </form>
            </Form>
        </div>
    );
}
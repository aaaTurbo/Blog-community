import {api} from "@/api/apiClient.ts";


export async function login(mail: string, password: string) {
    return await api.post("/auth/login", {
        mail: mail,
        password: password
    })

}
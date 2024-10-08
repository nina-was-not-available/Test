import axios, {AxiosInstance} from "axios";
import {User} from "../components/Table/Table.tsx";

const BASE_URL = 'https://67024c1dbd7c8c1ccd3e74b3.mockapi.io/api/v1/users';

const instance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
});

export function getUsers ()  {
    return instance.get<User[]>('')
}

export function updateUser(id: string, userData: Partial<User>) {
    return instance.put<User>(`/${id}`, userData);
}
export interface User {
    id: string;
    displayName: string;
    email: string;
    token: string;
    imageUrl?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData extends LoginData {
    displayName: string;
}
export interface IUser {
    id: number
    uuid: string;
    email: string;
    username: string;
    role: string;
    permissions: string[];
}

export interface TokenPayload {
    sub: string;
    iss: string;
    user: IUser
}

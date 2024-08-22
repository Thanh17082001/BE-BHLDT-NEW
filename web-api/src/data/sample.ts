import { CreateRoleDto } from "src/role/dtos/create-role.dto";
import { CreateUserDto } from "src/user/dtos/create-user.dto";

export const sample_roles: CreateRoleDto[] = [
    {
        name: 'Admin',
        description: 'Description default',
        permissions: []
    },
    {
        name: 'Teacher',
        description: 'Description of User role',
        permissions: [],
    },
];

export const sample_users: CreateUserDto[] = [
    {
        firstname: 'Admin',
        lastname: 'Admin',
        email: 'admin@gmail.com',
        username: '',
        phone: '+84 09096569423',
        password: '123456',
        avatar: '',
        gender: 'male',
        birthday: '1988-11-14',
        job_title: '',
        note: 'Learning English an hour per day',
    },
    {
        firstname: 'Teacher',
        lastname: 'Teacher',
        email: 'teacher@gmail.com',
        username: '',
        phone: '+84 8577227374',
        password: '123456',
        avatar: '',
        gender: 'male',
        birthday: '1988-11-14',
        job_title: '',
        note: 'Learning English an hour per day',
    },
];

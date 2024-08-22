import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const PERMISSION_KEY = 'PERMISSION_KEY';
export type PermissionType = { name: string; description: string };


export const Permission = (permission: PermissionType) =>
    SetMetadata(PERMISSION_KEY, permission);

export const SKIP_PERMISSION = 'SKIP_PERMISSION';
export const SkipPermission = () => SetMetadata(SKIP_PERMISSION, true);
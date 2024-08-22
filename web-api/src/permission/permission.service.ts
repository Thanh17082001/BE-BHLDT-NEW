import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { PERMISSION_KEY, PermissionType } from './permission.decorator';


@Injectable()
export class PermissionService implements OnModuleInit {
    private readonly logger = new Logger(PermissionService.name);
    private readonly permissionMap = new Map<string, PermissionType>();

    constructor(
        private readonly discoveryService: DiscoveryService,
        private readonly reflector: Reflector,
    ) { }

    onModuleInit() {
        this.collectpermission();
    }

    private collectpermission() {
        const controllers = this.discoveryService.getControllers();

        controllers.forEach(wrapper => {
            const { instance } = wrapper;
            if (!instance) return;

            const prototype = Object.getPrototypeOf(instance);
            const methods = Object.getOwnPropertyNames(prototype)
                .filter(method => method !== 'constructor' && typeof instance[method] === 'function');

            methods.forEach(method => {
                const permission = this.reflector.getAllAndMerge<PermissionType>(PERMISSION_KEY, [
                    instance[method],
                    prototype,
                ]);

                const key = `${prototype.constructor.name}.${method}`;
                this.permissionMap.set(key, permission);
            });
        });

        this.logger.log('Collected permission:');
        this.permissionMap.forEach((permission, key) => {
            this.logger.log(`${key}: ${permission}`);
        });
    }

    getAllpermission() {
        return Array.from(this.permissionMap.entries()).map(([key, permission]) => ({ method: key, permission }));
    }
}

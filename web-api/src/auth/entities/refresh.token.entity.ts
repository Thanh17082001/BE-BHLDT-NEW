import { AbstractEntity } from "src/utils/AbstractEntity";
import { Column, Entity } from "typeorm";

@Entity()
export class RefreshToken extends AbstractEntity {

    @Column()
    user_id: number;

    @Column()
    refresh_token: string;

    @Column()
    expired_in: Date;

    @Column({ nullable: true, default: 'default_device' })
    device_info: string;

    @Column({ nullable: true, default: 'default_ip' })
    ip: string;

}
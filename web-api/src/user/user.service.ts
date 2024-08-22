import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserUtil } from '../utils/UserUtil';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { UserDto } from './dtos/user.dto';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { QueryUserDto } from './dtos/query-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { isEmptyString } from 'src/utils/StringUtil';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) { }

  async create(
    createUserDto: CreateUserDto
  ) {
    const [isExistedEmail, isExistedUsername] = await Promise.all([this.findOneByEmail(createUserDto.email), this.findOneByUsername(createUserDto.username)])
    if (isExistedEmail) {
      throw new BadRequestException('Email is Already Registered');
    }

    if (isExistedUsername) {
      throw new BadRequestException('Username is Already Registered');
    }

    const newUser = {
      firstname: createUserDto.firstname,
      lastname: createUserDto.lastname,
      email: createUserDto.email,
      username: createUserDto.username ? (isEmptyString(createUserDto.username) ? createUserDto.email.split('@')[0] : createUserDto.username) : createUserDto.email.split('@')[0],
      phone: createUserDto.phone ? (isEmptyString(createUserDto.phone) ? '84+ xxx' : createUserDto.phone) : '84+ xxx',
      password: UserUtil.hashPassword(createUserDto.password),
      avatar: createUserDto.avatar ? (isEmptyString(createUserDto.avatar) ? 'your_default_avatar' : createUserDto.avatar) : 'your_default_avatar',
      gender: createUserDto.gender,
      birthday: new Date(createUserDto.birthday) ?? new Date(),
      job_title: createUserDto.job_title ? (isEmptyString(createUserDto.job_title) ? 'your_default_job_titile' : createUserDto.job_title) : 'your_default_job_titile',
      note: createUserDto.note ? (isEmptyString(createUserDto.note) ? 'your_default_note' : createUserDto.note) : 'your_default_note',
      role_id: 1, //default -1
      room_id: 1, //default -1
    }
    const user = this.userRepo.create(newUser);
    const userEntiy = await this.userRepo.save(user);
    return userEntiy
  }

  async find(
    userQuery: QueryUserDto,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    const queryBuilder = this.userRepo.createQueryBuilder('user');
    if (userQuery.email) {
      let emailQuery = userQuery.email;
      queryBuilder.where('user.email = :email', { email: emailQuery });
    }

    await queryBuilder
      .orderBy('user.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });



    // return new PageDto(entities, pageMetaDto);
    return null;
  }

  async getAllUsers() {
    const users = await this.userRepo.find();
    return users
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: {
        id
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user
  }

  findOneByUsername(username: string) {
    return this.userRepo.findOne({
      where: {
        username
      },
    });
  }

  findOneByEmail(email: string) {
    return this.userRepo.findOne({
      where: {
        email
      },
    });
  }

  async update(id: number, properties: Partial<User>) {
    const user = await this.userRepo.findOne({
      where: {
        id
      }
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (properties.password) {
      properties.password = UserUtil.hashPassword(properties.password);
    }

    Object.assign(user, properties);
    return this.userRepo.save(user);
  }

  async softDelete(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.status = 0
    await this.userRepo.save(user)
    return user
  }
  async save(user: User) {
    return this.userRepo.save(user);
  }
}

import * as crypto from 'node:crypto';
import DBEntity from './DBEntity';
import { users } from './example';

export type UserEntity = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subscribedToUserIds: string[];
};
type CreateUserDTO = Omit<UserEntity, 'id' | 'subscribedToUserIds'>;
type ChangeUserDTO = Partial<Omit<UserEntity, 'id'>>;

export default class DBUsers extends DBEntity<
  UserEntity,
  ChangeUserDTO,
  CreateUserDTO
	> {
		constructor() {
			super();
	  
			void this.entities.push(users[0]);
		 }
  async create(dto: CreateUserDTO) {
    const created: UserEntity = {
      ...dto,
      subscribedToUserIds: [],
      id: crypto.randomUUID(),
    };
    this.entities.push(created);
    return created;
  }
}

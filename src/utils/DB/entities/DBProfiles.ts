import * as crypto from 'node:crypto';
import DBEntity from './DBEntity';
import { profiles } from "./example";

export type ProfileEntity = {
  id: string;
  avatar: string;
  sex: string;
  birthday: number;
  country: string;
  street: string;
  city: string;
  memberTypeId: string;
  userId: string;
};
type CreateProfileDTO = Omit<ProfileEntity, 'id'>;
type ChangeProfileDTO = Partial<Omit<ProfileEntity, 'id' | 'userId'>>;

export default class DBProfiles extends DBEntity<
  ProfileEntity,
  ChangeProfileDTO,
  CreateProfileDTO
> {
 //for check-integrity delete constructor and import { posts } and this string
  constructor() {
    super();
    void this.entities.push(profiles[0]);
    void this.entities.push(profiles[1]);
  }

  async create(dto: CreateProfileDTO) {
    const created: ProfileEntity = {
      ...dto,
      id: crypto.randomUUID(),
    };
    this.entities.push(created);
    return created;
  }
}

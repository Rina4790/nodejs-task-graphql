import * as crypto from 'node:crypto';
import DBEntity from './DBEntity';
import { posts } from "./example";

export type PostEntity = {
  id: string;
  title: string;
  content: string;
  userId: string;
};
type CreatePostDTO = Omit<PostEntity, 'id'>;
type ChangePostDTO = Partial<Omit<PostEntity, 'id' | 'userId'>>;

export default class DBPosts extends DBEntity<
  PostEntity,
  ChangePostDTO,
  CreatePostDTO
> {
  //for check-integrity delete constructor and import { posts } and this string
  constructor() {
    super();
    void this.entities.push(posts[0]);
    void this.entities.push(posts[1]);
  }
  async create(dto: CreatePostDTO) {
    const created: PostEntity = {
      ...dto,
      id: crypto.randomUUID(),
    };
    this.entities.push(created);
    return created;
  }
}

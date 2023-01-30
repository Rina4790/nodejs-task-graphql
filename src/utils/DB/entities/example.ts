import { UserEntity } from "../entities/DBUsers";
import { PostEntity } from "./DBPosts";
import { ProfileEntity } from "./DBProfiles";

export const users: UserEntity[] = [
  {
    id: "d0064fdd-efc1-4997-9f3d-5982d5e0c9fa",
    firstName: "Rina",
    lastName: "Coda",
    email: "titoli@d.com",
    subscribedToUserIds: ["310eab7d-0f28-4ec9-9de5-6ff9c5b5b8b4"],
  },
  {
    id: "310eab7d-0f28-4ec9-9de5-6ff9c5b5b8b4",
    firstName: "Lili",
    lastName: "Totoli",
    email: "coda@d.com",
    subscribedToUserIds: ["d0064fdd-efc1-4997-9f3d-5982d5e0c9fa"],
  },
];

export const profiles: ProfileEntity[] = [
  {
    id: "73e5ab79-952e-48fc-b082-0dd047a077c0",
    avatar: "",
    sex: "",
    birthday: 33,
    country: "",
    street: "",
    city: "",
    memberTypeId: "basic",
    userId: "310eab7d-0f28-4ec9-9de5-6ff9c5b5b8b4",
  },
  {
    id: "40caa12e-ae66-4225-bfc2-ccb6ab937dbf",
    avatar: "",
    sex: "",
    birthday: 18,
    country: "",
    street: "",
    city: "",
    memberTypeId: "basic",
    userId: "d0064fdd-efc1-4997-9f3d-5982d5e0c9fa",
  },
];

export const posts: PostEntity[] = [
  {
    id: "b2c59f38-77d5-480a-9218-ccce318c81b2",
    title: "title1",
    content: "content1",
    userId: "d0064fdd-efc1-4997-9f3d-5982d5e0c9fa",
  },
  {
    id: "fc314580-ef5d-4b9c-a6f0-dd600edf1387",
    title: "title2",
    content: "content2",
    userId: "310eab7d-0f28-4ec9-9de5-6ff9c5b5b8b4",
  },
];

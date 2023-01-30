## Install

```bash
npm i
```
# Task 1: Add logic to the restful endpoints

Add logic to the restful endpoints (users, posts, profiles, member-types folders in ./src/routes).
1.1. npm run test - 100%

```bash
npm run test
```
# Task 2: Add logic to the graphql endpoint

```bash
npm run start
```

For check graphql endpoint you can use Postman collection in repository (Or use the information below).

### 2.1. Get users, profiles, posts, memberTypes - 4 operations in one query.

```
query {
   users {
      id,
      firstName
   }
   profiles {
      id,
      birthday,
      memberTypeId,
   }
   posts {
      id,
      title
   }
   memberTypes {
      id,
      monthPostsLimit
   }
}
```

### 2.2. Get user, profile, post, memberType by id - 4 operations in one query.

```
{
  "userId": "3cb2d920-4ee2-4468-bb02-8432ba31d213",
  "profileId": "73e5ab79-952e-48fc-b082-0dd047a077c0",
  "postId": "b2c59f38-77d5-480a-9218-ccce318c81b2",
  "memberTypeId": "business"
}
```

```
query($userId: ID,  $profileId: ID, $postId: ID, $memberTypeId: String) {
    user(id: $userId) {
        id,
        lastName
    }
    profile(id: $profileId) {
        id,
        birthday,
    }
    post(id: $postId) {
        title,
        content,
    }
    memberType(id: $memberTypeId) {
        discount,
        monthPostsLimit
    }
}
```

### 2.3. Get users with their posts, profiles, memberTypes.

```
query {
    users {
        id,
        firstName,
        posts {
            id
        },
        profile {
            id
        },
        memberType {
            id,
        }
    }
}
```

### 2.4. Get user by id with his posts, profile, memberType.
```
{
  "id": "d0064fdd-efc1-4997-9f3d-5982d5e0c9fa"
}
```
```
query ($id: ID) {
    user (id: $id) {
        id,
        firstName,
        posts {
            id
        },
        profile {
            id
        },
        memberType {
            id,
        }
    }
}
```

### 2.5. Get users with their userSubscribedTo, profile.
```
query {
   users {
      id,
      firstName,
      profile {
         id,
         memberTypeId
      },
      userSubscribedTo  {
         id,
         firstName,
      }
   }
}
```

### 2.6. Get user by id with his subscribedToUser, posts.
```
{
    "id": "d0064fdd-efc1-4997-9f3d-5982d5e0c9fa"
}
```
```
query($id: ID) {
    user(id: $id) {
        id,
        firstName,
        posts {
            id,
            title
        },
        subscribedToUser {
            id,
            firstName,
        }
    }
}
``` 

### 2.7. Get users with their userSubscribedTo, subscribedToUser (additionally for each user in userSubscribedTo, subscribedToUser add their userSubscribedTo, subscribedToUser).

```
query {
    users {
      id,
      firstName,
      userSubscribedTo {
          id,
          firstName,
          userSubscribedTo {
              id,
              firstName,
          },
          subscribedToUser {
              id,
              firstName,
          },
      },
      subscribedToUser {
          id,
          firstName,
          userSubscribedTo {
              id,
              firstName,
          },
          subscribedToUser {
              id,
              firstName,
          },
      },
    }
}
```

let db = {
  users: [
    {
      userId: 'sd78cxz7dc78c789z0cb56',
      email: 'user@email.com',
      user: 'user',
      time: '2020-05-20T19:40:00.018Z',
      imageUrl: 'image/downloads/here',
      bio: 'Hello, my name is user, welcome to my bio',
      website: 'https://user.com',
      location: 'Helsinki, Finland',
    },
  ],
  posts: [
    {
      user: 'user',
      body: 'post',
      time: '2020-05-20T19:40:00.018Z',
      likes: 5,
      comments: 3,
    },
  ],
  comments: [
    {
      user: 'user',
      postId: 'jksdfjskflkj80sfd0sdf',
      body: 'Sweet dreams!',
      time: '2020-05-20T19:40:00.018Z',
    },
  ],
  notifications: [
    {
      recipient: 'user',
      sender: 'benjamin',
      read: 'true | false',
      postId: 'jksdfjskflkj80sfd0sdf',
      type: 'like | comment',
      time: '2020-05-20T19:40:00.018Z',
    },
  ],
}

const userDetails = {
  // Redux data
  credentials: {
    userId: 'M34KL4KJ54JJBH4L4K5JLJN45B',
    email: 'user@email.com',
    user: 'user',
    time: '2020-05-20T19:40:00.018Z',
    imageUrl: 'image/downloads/here',
    bio: 'Hello, my name is user, welcome to my bio',
    website: 'https://user.com',
    location: 'Helsinki, Finland',
  },
  likes: [
    { user: 'user', postId: 'hh343hjkjhJKnjJfeJ3' },
    {
      user: 'user',
      postId: '88fdsf89875fg4d5f6g456',
    },
  ],
}

const functions = require('firebase-functions')
const app = require('express')()
const FBAuth = require('./utilities/fbAuth')

const { db } = require('./utilities/admin')

const {
  getAllPosts,
  postOnePost,
  getPost,
  commentOnPost,
  likePost,
  unlikePost,
  deletePost,
} = require('./handlers/posts')
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead,
} = require('./handlers/users')

/* POST ROUTES */

// Get posts route
app.get('/posts', getAllPosts)
// Create post route
app.post('/post', FBAuth, postOnePost)
// Get one post
app.get('/post/:postId', getPost)
// Delete post
app.delete('/post/:postId', FBAuth, deletePost)
// Like a post
app.get('/post/:postId/like', FBAuth, likePost)
// TODO: unlike a post
app.get('/post/:postId/unlike', FBAuth, unlikePost)
// Comment a post
app.post('/post/:postId/comment', FBAuth, commentOnPost)

/* USERS ROUTES */

// Signup route
app.post('/signup', signup)
// Login route
app.post('/login', login)
// Image uploading route for user
app.post('/user/image', FBAuth, uploadImage)
// Adding user details for user
app.post('/user', FBAuth, addUserDetails)
// Get own user details for user
app.get('/user', FBAuth, getAuthenticatedUser)
// Get any users details
app.get('/user/:user', getUserDetails)
// Marking users notifications read
app.post('/notifications', markNotificationsRead)

exports.api = functions.region('europe-west1').https.onRequest(app)

exports.createNotificationOnLike = functions
  .region('europe-west1')
  .firestore.document('likes/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/posts/${snapshot.data().postId}`)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().user !== snapshot.data().user) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            time: new Date().toISOString(),
            recipient: doc.data().user,
            sender: snapshot.data().user,
            type: 'like',
            read: false,
            postId: doc.id,
          })
        }
      })
      .catch((err) => {
        console.error(err)
      })
  })

exports.deleteNotificationOnUnlike = functions
  .region('europe-west1')
  .firestore.document('likes/{id}')
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err)
      })
  })

exports.createNotificationOnComment = functions
  .region('europe-west1')
  .firestore.document('comments/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/posts/${snapshot.data().postId}`)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().user !== snapshot.data().user) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            time: new Date().toISOString(),
            recipient: doc.data().user,
            sender: snapshot.data().user,
            type: 'comment',
            read: false,
            postId: doc.id,
          })
        }
      })
      .catch((err) => {
        console.error(err)
      })
  })

exports.onUserImageChange = functions
  .region('europe-west1')
  .firestore.document('/users/{userID}')
  .onUpdate((change) => {
    console.log(change.before.data())
    console.log(change.after.data())
    if (change.before.data().imageUrl != change.after.data().imageUrl) {
      console.log('Image has changed')
      const batch = db.batch()
      return db
        .collection('posts')
        .where('user', '==', change.before.data().user)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const post = db.doc(`/posts/${doc.id}`)
            batch.update(post, { userImage: change.after.data().imageUrl })
          })
          return batch.commit()
        })
    } else return true
  })

exports.onPostDelete = functions
  .region('europe-west1')
  .firestore.document('/posts/{postId}')
  .onDelete((snapshot, context) => {
    const postId = context.params.postId
    const batch = db.batch()
    return db
      .collection('comments')
      .where('postId', '==', postId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`))
        })
        return db.collection('likes').where('postId', '==', postId).get()
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`))
        })
        return db
          .collection('notifications')
          .where('postId', '==', postId)
          .get()
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`))
        })
        return batch.commit()
      })
      .catch((err) => console.error(err))
  })

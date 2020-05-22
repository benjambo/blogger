const { db } = require('../utilities/admin')

exports.getAllPosts = (req, res) => {
  db.collection('posts')
    .orderBy('time', 'desc')
    .get()
    .then((data) => {
      let posts = []
      data.forEach((doc) => {
        posts.push({
          id: doc.id,
          body: doc.data().body,
          user: doc.data().user,
          time: doc.data().time,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          userImage: doc.data().userImage,
        })
      })
      return res.json(posts)
    })

    .catch((err) => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}

// Post one post
exports.postOnePost = (req, res) => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ body: 'Body must not be empty' })
  }
  const newPost = {
    body: req.body.body,
    user: req.user.user,
    userImage: req.user.imageUrl,
    time: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  }

  db.collection('posts')
    .add(newPost)
    .then((doc) => {
      const resPost = newPost
      resPost.postId = doc.id
      res.json(resPost)
    })
    .catch((err) => {
      res.status(500).json({ error: `An error occured` })
      console.error(err)
    })
}

// Fetch one post
exports.getPost = (req, res) => {
  let postData = {}
  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Post not found' })
      }
      postData = doc.data()
      postData.postId = doc.id
      return db
        .collection('comments')
        .orderBy('time', 'desc')
        .where('postId', '==', req.params.postId)
        .get()
    })
    .then((data) => {
      postData.comments = []
      data.forEach((doc) => {
        postData.comments.push(doc.data())
      })
      return res.json(postData)
    })
    .catch((err) => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}

// Comment on a post
exports.commentOnPost = (req, res) => {
  if (req.body.body.trim() === '')
    return res.status(400).json({ comment: 'Comment must not be empty' })

  const newComment = {
    body: req.body.body,
    time: new Date().toISOString(),
    postId: req.params.postId,
    user: req.user.user,
    userImage: req.user.imageUrl,
  }

  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Post not found' })
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 })
    })
    .then(() => {
      return db.collection('comments').add(newComment)
    })
    .then(() => {
      res.json(newComment)
    })
    .catch((err) => {
      console.error(err)
      res.status(500).json({ error: 'Something went wrong' })
    })
}

// Like a post
exports.likePost = (req, res) => {
  const likeDocument = db
    .collection('likes')
    .where('user', '==', req.user.user)
    .where('postId', '==', req.params.postId)
    .limit(1)

  const postDocument = db.doc(`/posts/${req.params.postId}`)

  let postData

  postDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        postData = doc.data()
        postData.postId = doc.id
        return likeDocument.get()
      } else {
        return res.status(404).json({ error: 'Post not found' })
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection('likes')
          .add({
            postId: req.params.postId,
            user: req.user.user,
          })
          .then(() => {
            postData.likeCount++
            return postDocument.update({ likeCount: postData.likeCount })
          })
          .then(() => {
            return res.json(postData)
          })
      } else {
        return res.status(400).json({ error: 'Post already liked' })
      }
    })
    .catch((err) => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}

exports.unlikePost = (req, res) => {
  const likeDocument = db
    .collection('likes')
    .where('user', '==', req.user.user)
    .where('postId', '==', req.params.postId)
    .limit(1)

  const postDocument = db.doc(`/posts/${req.params.postId}`)

  let postData

  postDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        postData = doc.data()
        postData.postId = doc.id
        return likeDocument.get()
      } else {
        return res.status(404).json({ error: 'Post not found' })
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: 'Post already liked' })
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            postData.likeCount--
            return postDocument.update({ likeCount: postData.likeCount })
          })
          .then(() => {
            res.json(postData)
          })
      }
    })
    .catch((err) => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}

// Delete a post
exports.deletePost = (req, res) => {
  const document = db.doc(`/posts/${req.params.postId}`)
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Post not found' })
      }
      if (doc.data().user !== req.user.user) {
        return res.status(403).json({
          error: `Unauthorized`,
        })
      } else {
        return document.delete()
      }
    })
    .then(() => {
      res.json({ message: 'Post deleted successfully' })
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}

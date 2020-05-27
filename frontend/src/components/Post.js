import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import PropTypes from 'prop-types'
import CustomButton from '../utilities/CustomButton'
import DeletePost from './DeletePost'
import PostDialog from './PostDialog'

// Mui imports
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'

// Icons
import ChatIcon from '@material-ui/icons/Chat'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'

// Redux
import { connect } from 'react-redux'
import { likePost, unlikePost } from '../redux/actions/dataActions'

const styles = {
  card: {
    position: 'relative',
    display: 'flex',
    marginBottom: 20,
  },
  image: {
    minWidth: 160,
  },
  content: {
    padding: 25,
    objectFit: 'cover',
  },
}

class Post extends Component {
  likedPost = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        (like) => like.postId === this.props.post.postId
      )
    )
      return true
    else return false
  }
  likePost = () => {
    this.props.likePost(this.props.post.postId)
  }
  unlikePost = () => {
    this.props.unlikePost(this.props.post.postId)
  }
  render() {
    dayjs.extend(relativeTime)
    const {
      classes,
      post: {
        body,
        time,
        userImage,
        userHandle,
        postId,
        likeCount,
        commentCount,
      },
      user: {
        authenticated,
        credentials: { handle },
      },
    } = this.props
    const likeButton = !authenticated ? (
      <CustomButton tip="Like">
        <Link to="/login">
          <FavoriteBorder color="primary" />
        </Link>
      </CustomButton>
    ) : this.likedPost() ? (
      <CustomButton tip="Unlike" onClick={this.unlikePost}>
        <FavoriteIcon color="primary" />
      </CustomButton>
    ) : (
      <CustomButton tip="Like" onClick={this.likePost}>
        <FavoriteBorder color="primary" />
      </CustomButton>
    )
    const deleteButton =
      authenticated && userHandle === handle ? (
        <DeletePost postId={postId} />
      ) : null
    return (
      <Card className={classes.card}>
        <CardMedia
          className={classes.image}
          image={userImage}
          title="Profile picture"
        />
        <CardContent className={classes.content}>
          <Typography
            variant="h5"
            component={Link}
            to={`/users/${userHandle}`}
            color="primary"
          >
            {userHandle}
          </Typography>
          {deleteButton}
          <Typography variant="body2" color="textSecondary">
            {dayjs(time).fromNow()}
          </Typography>
          <Typography variant="body1">{body}</Typography>
          {likeButton}
          <span>{likeCount} Likes</span>
          <CustomButton tip="Comments">
            <ChatIcon color="primary" />
          </CustomButton>
          <span>{commentCount} Comments</span>
        </CardContent>
        <PostDialog postId={postId} userHandle={userHandle} />
      </Card>
    )
  }
}

Post.propTypes = {
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  user: state.user,
})

const mapActionsToProps = {
  likePost,
  unlikePost,
}

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Post))

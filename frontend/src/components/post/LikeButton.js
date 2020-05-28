import React, { Component } from 'react'
import CustomButton from '../../utilities/CustomButton'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

// Icons
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'

// Redux
import { connect } from 'react-redux'
import { likePost, unlikePost } from '../../redux/actions/dataActions'

export class LikeButton extends Component {
  likedPost = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        (like) => like.postId === this.props.postId
      )
    )
      return true
    else return false
  }
  likePost = () => {
    this.props.likePost(this.props.postId)
  }
  unlikePost = () => {
    this.props.unlikePost(this.props.postId)
  }
  render() {
    const {authenticated} = this.props.user
    const likeButton = !authenticated ? (
      <Link to="/login">
        <CustomButton tip="Like">
          <FavoriteBorder color="primary" />
        </CustomButton>
      </Link>
    ) : this.likedPost() ? (
      <CustomButton tip="Undo like" onClick={this.unlikePost}>
        <FavoriteIcon color="primary" />
      </CustomButton>
    ) : (
      <CustomButton tip="Like" onClick={this.likePost}>
        <FavoriteBorder color="primary" />
      </CustomButton>
    )
    return likeButton
  }
}

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  user: state.user,
})

const mapActionsToProps = {
  likePost,
  unlikePost,
}

export default connect(mapStateToProps, mapActionsToProps)(LikeButton)

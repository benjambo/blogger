import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'

import Post from '../components/post/Post'
import Profile from '../components/profile/Profile'

import { connect } from 'react-redux'
import { getPosts } from '../redux/actions/dataActions'

export class home extends Component {
  componentDidMount() {
    this.props.getPosts()
  }
  render() {
    const { posts, loading } = this.props.data
    let recentPostMarkup = !loading ? (
      posts.map((post) => <Post key={post.postId} post={post} />)
    ) : (
      <p>Loading...</p>
    )
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          {recentPostMarkup}
        </Grid>
        <Grid item xs={12} sm={4}>
          <Profile />
        </Grid>
      </Grid>
    )
  }
}

home.propTypes = {
  getPosts: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  data: state.data,
})

export default connect(mapStateToProps, { getPosts })(home)

import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import CustomButton from '../utilities/CustomButton'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'

// MaterialUi imports
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

// Icons
import CloseIcon from '@material-ui/icons/Close'
import UnfoldMore from '@material-ui/icons/UnfoldMore'

// Redux imports
import { connect } from 'react-redux'
import { getPost } from '../redux/actions/dataActions'

const styles = (theme) => ({
  ...theme.spreadIt,
  invisibleSeparator: {
    border: 'none',
    margin: 4,
  },
  profileImage: {
    maxWidth: 200,
    height: 200,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  dialogContent: {
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    left: '91%',
    top: '10%',
    padding: 0,
  },
  expandButton: {
    position: 'absolute',
    left: '89%',
    bottom: '10%',
  },
  spinnerDiv: {
      textAlign: 'center',
      marginTop: 50,
      marginBottom: 50
  }
})

class PostDialog extends Component {
  state = {
    open: false,
  }

  handleOpen = () => {
    this.setState({ open: true })
    this.props.getPost(this.props.postId)
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render() {
    const {
      classes,
      post: {
        postId,
        body,
        time,
        likeCount,
        commentCount,
        userImage,
        userHandle,
      },
      UI: { loading },
    } = this.props

    const dialogMarkup = loading ? (
      <div className={classes.spinnerDiv}>
        <CircularProgress size={150} thickness={2} />
      </div>
    ) : (
      <Grid container spacing={2}>
        <Grid item sm={5}>
          <img src={userImage} alt="profile" className={classes.profileImage} />
        </Grid>
        <Grid item sm={7}>
          <Typography
            component={Link}
            color="primary"
            variant="h5"
            to={`/isers/${userHandle}`}
          >
            @{userHandle}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body2" color="textSecondary">
            {dayjs(time).format('h:mm a, MMMM DD YYYY')}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body1">{body}</Typography>
        </Grid>
      </Grid>
    )

    return (
      <Fragment>
        <CustomButton
          onClick={this.handleOpen}
          tip="Expand Post"
          tipClassName={classes.expandButton}
        >
          <UnfoldMore color="primary" />
        </CustomButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <CustomButton
            tip="Close"
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </CustomButton>
          <DialogContent className={classes.dialogContent}>
            {dialogMarkup}
          </DialogContent>
        </Dialog>
      </Fragment>
    )
  }
}

PostDialog.propTypes = {
  getPost: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  post: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  post: state.data.post,
  UI: state.UI,
})

const mapActionsToProps = {
  getPost,
}

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(PostDialog))

import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import CustomButton from '../../utilities/CustomButton'

// MaterialUi imports
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'

// Icons
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'

// Redux imports
import { connect } from 'react-redux'
import { postToBe, clearErrors } from '../../redux/actions/dataActions'

const styles = (theme) => ({
  ...theme.spreadIt,
  submitButton: {
    position: 'relative',
    float: 'right',
    marginTop: 10,
  },
  closeButton: {
    position: 'absolute',
    left: '91%',
    top: '10%',
    padding: 0,
  },
})

class PostToBe extends Component {
  state = {
    open: false,
    body: '',
    errors: {},
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors,
      })
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: '', open: false, errors: {} })
    }
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.props.clearErrors()
    this.setState({ open: false, errors: {} })
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }
  handleSubmit = (event) => {
    event.preventDefault()
    this.props.postToBe({ body: this.state.body })
  }

  render() {
    const { errors } = this.state
    const {
      classes,
      UI: { loading },
    } = this.props
    return (
      <Fragment>
        <CustomButton onClick={this.handleOpen} tip="Create a Post">
          <AddIcon />
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
          <DialogTitle>Create a new Post</DialogTitle>
          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              <TextField
                name="body"
                type="text"
                label="Post"
                multiline
                rows="1"
                placeholder="Create your post here"
                error={errors.body ? true : false}
                helperText={errors.body}
                className={classes.textField}
                onChange={this.handleChange}
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submitButton}
                disabled={loading}
              >
                Submit
                {loading && (
                  <CircularProgress size={20} className={classes.progress} />
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </Fragment>
    )
  }
}

PostToBe.propTypes = {
  postToBe: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  UI: state.UI,
})

export default connect(mapStateToProps, { postToBe, clearErrors })(
  withStyles(styles)(PostToBe)
)

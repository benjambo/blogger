import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import CustomButton from '../../utilities/CustomButton'

// MaterialUi imports
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { TextField } from '@material-ui/core'

// Icons
import EditIcon from '@material-ui/icons/Edit'

// Redux imports
import { connect } from 'react-redux'
import { editUserDetails } from '../../redux/actions/userActions'


const styles = (theme) => ({
  ...theme.spreadIt,
  button: {
    float: 'right',
  },
})

class EditDetails extends Component {
  state = {
    bio: '',
    website: '',
    location: '',
    open: false,
  }

  mapUserDetailsToState = (credentials) => {
    this.setState({
      bio: credentials.bio ? credentials.bio : '',
      website: credentials.website ? credentials.website : '',
      location: credentials.location ? credentials.location : '',
    })
  }

  handleOpen = () => {
    this.setState({ open: true })
    this.mapUserDetailsToState(this.props.credentials)
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  componentDidMount() {
    const credentials = this.props
    this.mapUserDetailsToState(credentials)
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit = () => {
    const userDetails = {
      bio: this.state.bio,
      website: this.state.website,
      location: this.state.location,
    }
    this.props.editUserDetails(userDetails)
    this.handleClose()
  }

  render() {
    const { classes } = this.props
    return (
      <Fragment>
        <CustomButton
          tip="Edit Details"
          onClick={this.handleOpen}
          btnClassName={classes.button}
        >
          <EditIcon color="primary" />
        </CustomButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit Your Details</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name="bio"
                type="text"
                label="Bio"
                multiline
                placeholder="A Short Bio About Yourself"
                className={classes.TextField}
                value={this.state.bio}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="website"
                type="text"
                label="Website"
                placeholder="Your Personal Website"
                className={classes.TextField}
                value={this.state.website}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="location"
                type="text"
                label="Location"
                placeholder="Your Location"
                className={classes.TextField}
                value={this.state.location}
                onChange={this.handleChange}
                fullWidth
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    )
  }
}

EditDetails.propTypes = {
  editUserDetails: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  credentials: state.user.credentials,
})

export default connect(mapStateToProps, { editUserDetails })(
  withStyles(styles)(EditDetails)
)

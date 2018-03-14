import React, {Component} from 'react'
import Modal from 'material-ui/Modal'
import { withStyles } from 'material-ui/styles'

export const screens = {
	CHOOSE: 'CHOOSE',
	SELECT: 'SELECT',
}

const styles = theme => {
	console.log('theme', theme)
	return {paper: {
		position: 'absolute',
		width: theme.spacing.unit * 100,
		height: '80%',
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[3],
		padding: theme.spacing.unit*4,
	}}
}

const modalStyle = {
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)'
}

class PopupContainer extends Component{
	
	getScreen(){
		switch(this.props.screen){
			case screens.CHOOSE:
				return null
			case screens.SELECT:
				return null
			default:
				return null
		}
	}

	render(){
		console.log('PopupContainer', this.props)
		const { classes } = this.props

		return (
			<Modal
				open={this.props.open}
				onClose={this.props.onClose}
			>
				<div style={modalStyle} className={classes.paper}>
					{this.getScreen()}
				</div>

			</Modal>
		)
	}
} 


export default withStyles(styles)(PopupContainer)
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import { getSuggestion } from '../actions/searchbar'
import { TextField, List, ListItem, ListItemText } from 'material-ui'
import { levDist } from '../utils'

const styles = theme => ({
    removePointerEvents: {
        pointerEvents: 'none',
    },
    textField: {
        minWidth: 300,
    },
    listItem: {
        cursor: 'pointer',
    }
})

const mapStateToProps = state => ({
    student: state.searchBar.student,
    target: state.searchBar.target,
})

class SearchPure extends Component{
    constructor(props){
        super(props)
        this.state = {
            searchText: '',
        }
    }
    
    onTextChange = (e) => {
        this.setState({ searchText: e.target.value })
        this.props.dispatch(getSuggestion({ query: e.target.value }, 'search-pure'))
    }

    handleClick = e => {
        const eid = e.target.id
        const [value, id] = eid.split('-')
        this.setState({ searchText: ''})
        this.props.dispatch(getSuggestion({ query: '' }))
        this.props.onChange({'name': value, 'id': id})
    }

    render() {
        const { student, classes, theme, target } = this.props
        const keys = Object.keys(this.props)
        const totalLength = student.length
        let distances = {}
        const studentList = student.slice(0, 30)

        for(let i in studentList){
            distances[studentList[i]] = levDist(studentList[i].name, this.state.searchText)
        }
        let allValues = []
        if(target == 'search-pure')
            allValues = studentList.sort((a, b)=> distances[a.name] - distances[b.name])

        return (
            <div style={{position: 'relative'}}>
                <TextField type="text"
                    value={this.state.searchText}
                    onChange={this.onTextChange}
                    placeholder={"Search for a student"}
                    style={{minWidth: 150}}/>

                <div style={this.props.style && this.props.style.list ? this.props.style.list : {}}>
                    <List >
                        {allValues.map((d, index) => (
                            <ListItem key={index} className={classes.listItem + ' hoverlistitem'}
                                onClick={this.handleClick}
                                id={`${d.name}-${d.id}`}>
                                <ListItemText className={classes.removePointerEvents} primary={d.name} secondary={d.id} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(connect(mapStateToProps)(SearchPure))
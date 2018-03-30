import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import { Chip, Select, FormControl, InputLabel, MenuItem, Paper, Grid, TextField, Button} from 'material-ui'

const styles = theme => ({
    chip: {
        margin: theme.spacing.unit / 2,
	},
})

class FilterAdder extends Component{
    constructor(props){
        super(props)
        this.state = {
            selectedFilter : {
                name: '',
                type: '',
                val: null,
                op: null,
            }
        }
    }

    handleFilterInputChange = (type, e) => {
        let v = e.target.value
        let { formVals } = this.props

        switch (type) {
            case 'name':
                this.setState({
                    selectedFilter: {
                        name: v,
                        val: null,
                        op: null,
                        type: formVals.filters[v].type,
                    }
                })
                break

            case 'op':
                this.setState({
                    selectedFilter: Object.assign({}, this.state.selectedFilter, {
                        op: v,
                    })
                })

                break

            case 'val':
                this.setState({
                    selectedFilter: Object.assign({}, this.state.selectedFilter, {
                        val: v,
                    })
                })
                break
            default:
                break
        }
    }

    getValidOperators = (selectedFilter) => {
        let { type } = selectedFilter
        const {classes} = this.props
        let a = []
        switch (type) {
            case 'int':
            case 'date':
                a = ['=', '>', '<', '>=', '<=']
                break
            case 'string':
            case 'bool':
                a = ['=']
                break

            default:
                a = []

        }

        if (selectedFilter.name == '') return null

        return (
            <FormControl styles={{ marginLeft: 50 }} >
                <InputLabel htmlFor='add-op'>Operand</InputLabel>
                <Select value={selectedFilter.op == null ? a[0] : selectedFilter.op}
                    onChange={this.handleFilterInputChange.bind(this, 'op')}
                    inputProps={{
                        id: 'add-op',
                        name: 'add-op'
                    }}>
                    {a.map(op => {
                        return (
                            <MenuItem key={op} value={op}>{op}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        )
    }

    getInputField = (selectedFilter) => {
        let { type } = selectedFilter
        let { classes } = this.props

        let defaultValue = ''
        if (type === 'int') defaultValue = 0
        if (type === 'bool') defaultValue = 'False'

        return (
            <FormControl >
                <TextField required type={type === 'int' ? 'number' : 'text'}
                    onChange={this.handleFilterInputChange.bind(this, 'val')}
                    value={selectedFilter.val !== null ? selectedFilter.val : defaultValue}
                    label="Value" />
            </FormControl>
        )
    }

    handleFiltersChange = (type, id, e) => {
        let { filters, classes } = this.props
        let { selectedFilter } = this.state
        let sFilter = Object.assign({}, selectedFilter)

        switch (type) {
            case 'add':
                let newFilters = filters.slice()
                if (selectedFilter.op === null) {
                    sFilter['op'] = '='
                }
                if (selectedFilter.val === null) {
                    switch (selectedFilter.type) {
                        case 'int': sFilter.val = 0
                            break
                        case 'bool': sFilter.val = 'False'
                            break
                        case 'string': sFilter.val = ''
                            break
                        case 'date': sFilter.val = ''
                            break
                        default:
                            break
                    }
                }


                newFilters.push(sFilter)

                this.props.onChange(
                    Object.assign({}, this.props, {
                        filters: newFilters,
                    })
                )

                this.setState({
                    selectedFilter: {
                        name: '',
                        op: null,
                        val: null,
                        type: '',
                    }
                })

                break

            case 'delete':

                console.log('del', id)
                const val = filters[id]

                this.props.onChange(Object.assign({}, this.props, {
                    filters: filters.filter(v => v != val)
                }))

                break

            default:
                break
        }
    }

    formChip = v => `${v.name} ${v.op} ${v.val}`


    render(){
        const { filters, formVals, classes } = this.props
        const filterVals = (formVals && formVals.filters) || {}
        const filterValsKeys = Object.keys(filterVals)

        const paperStyle = {
            display: 'flex',
            justifyContent: 'left',
            flexWrap: 'wrap',
            padding: 4,
        }

        return(
            <div>
            <div className="chips-container">
                <Paper style={paperStyle} className={classes.root}>
                    {
                        filters.map((v, index) => {
                            return (
                                <Chip id={index}
                                    key={this.formChip(v)}
                                    onDelete={this.handleFiltersChange.bind(this, 'delete', index)}
                                    className={classes.chip}
                                    label={this.formChip(v)} />
                            )
                        })}
                </Paper>
            </div>
            <br />
            <FormControl>
                <Grid container>
                    <Grid item xs={4}>
                        <InputLabel htmlFor='add-filter'>Filter name</InputLabel>
                        <Select value={this.state.selectedFilter.name}
                            onChange={this.handleFilterInputChange.bind(this, 'name')}
                            inputProps={{
                                name: 'add-filter',
                                id: 'add-filter',
                            }}>
                            {
                                filterValsKeys.map(k => {

                                    return (
                                        <MenuItem key={k} value={k}>{k}</MenuItem>
                                    )
                                })}
                        </Select>
                    </Grid>
                    <Grid style={{ textAlign: 'center' }} item xs={4}>
                        {this.getValidOperators(this.state.selectedFilter)}
                    </Grid>
                    <Grid item xs={4}>
                        {this.state.selectedFilter.name !== '' ? this.getInputField(this.state.selectedFilter) : null}
                    </Grid>
                </Grid>
                <br />
                {this.state.selectedFilter.name !== '' && this.state.selectedFilter.val !== '' ? (
                    <Grid item xs={3}>
                        <Button variant="raised" color="primary"
                            className={classes.button}
                            onClick={this.handleFiltersChange.bind(this, 'add', -1)}>
                            Add
							</Button></Grid>) : null

                }
            </FormControl>
            </div>
        )
    }
}

export default withStyles(styles)(FilterAdder)
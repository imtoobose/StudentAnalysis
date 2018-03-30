import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import { Card, CardHeader, CardContent, Grid, FormControl, Input, TextField } from 'material-ui'
import { getFormVals, formValTypes } from '../actions/popup'
import SelectInput from '../components/Select'
import SearchPure from '../components/SearchPure'
import { updateListForm } from '../actions/popup'
import FilterAdder from '../components/FilterAdder'

const mapStateToProps = state => ({
     formVals: state.popup.list.formVals,
     filters: state.popup.list.filters,
})

const styles = theme => ({
    formControl: {
        minWidth: 150,
        margin: theme.spacing.unit,
    },
    grid:{
        position: 'relative',
        margin: '0 auto',
        marginTop: 20,
        width: 'calc(100% - 40px)',
    }
})

class AddFilterContainer extends Component{
    constructor(props){
        super(props)
        this.state = {
            fname: '',
            ftype: formValTypes.int,
            fdefault: 0,
            fselected: [],
        }
    }

    handleOnChange = (e) => {
        const conv = {
            'int': 0,
            'string': '',
            'bool': 'True',
            'date': '2014-01-01',
        }
        
        const d = {}
        console.log('change', e.target.id, e.target.name)
        d[e.target.name] = e.target.value
        if(e.target.name == 'ftype') d['fdefault'] = conv[e.target.value]
        this.setState(d)
    }

    componentWillMount(){
        this.props.dispatch(getFormVals())
    }

    render(){
        const { fname, ftype, fdefault, fselected } = this.state 
        const { classes, formVals, filters, theme } = this.props 

        console.log('ADD FILTER', this.state, this.props)
        const convToType = {
            'int': 'number',
            'string': 'text',
            'bool': 'text',
            'date': 'text'
        }

        return (
        <div>
            <Grid container className={classes.grid}>
                <Grid item xs={6}>
                    <Card>
                        <CardHeader title="Add a filter"/>
                        <CardContent>
                            <FormControl className={classes.formControl}>
                                <TextField id="fname"
                                    label="Filter Name"
                                    value={fname}
                                    name="fname"
                                    onChange={this.handleOnChange}
                                    />
                            </FormControl>
                            <SelectInput
                                style={{minWidth: 150}}
                                label="Filter Type"
                                onChange={this.handleOnChange}
                                options={Object.keys(formValTypes).map(v => ({ 
                                    value: v,
                                    name: v,
                                }))}
                                id="ftype"
                                name="ftype"
                                value={ftype}/>
                            <FormControl className={classes.formControl}>
                                <TextField 
                                name="fdefault"
                                label="Default value"
                                type={convToType[ftype]}
                                value={fdefault}
                                onChange={this.handleOnChange}
                                />
                            </FormControl>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card>
                        <CardHeader title="Select Students"/>
                        <CardContent>
                            <SearchPure 
                                onChange={(val)  => { console.log('search pure', val)}}
                                style={{list: {
                                        position: 'absolute',
                                        top: 40,
                                        left: 0,
                                        maxHeight: 250,
                                        minWidth: 330,
                                        overflow: 'auto',
                                        backgroundColor: theme.palette.secondary.main,
                                        zIndex: 10000,
                                }}}/>
                            <br/>
                            <br/>
                            <FilterAdder 
                                formVals={formVals} 
                                filters={filters} 
                                onChange={v => {this.props.dispatch(updateListForm(v))}}/>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12}>
                    
                </Grid>
            </Grid>
        </div>)
    }
}

export default withStyles(styles, {withTheme: true})(connect(mapStateToProps)(AddFilterContainer))
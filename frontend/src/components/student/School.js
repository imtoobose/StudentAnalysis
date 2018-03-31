import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Card from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import GraphBar from './GraphBar'
import GraphLine from './GraphLine'
import GraphComponent from '../GraphComponent'
import List from './List.js'
import Chips from './Chips'
import { Table, TableBody, TableCell, TableHead, TableRow } from 'material-ui'
import FaceIcon from 'material-ui-icons/Face'
import MoodIcon from 'material-ui-icons/Mood'
import AssIcon from 'material-ui-icons/Assessment'
import WorldIcon from 'material-ui-icons/Language'
import Typography from 'material-ui/Typography';
import Progress from '../Progress'
import Progress1 from '../Progress1'
import Progress2 from '../Progress2'
import Progress3 from '../Progress3'
import { ListItem, ListItemText, ListSubheader } from 'material-ui/List'
import { addGraph, getAllGraphs, removeGraph } from '../../actions/graph'
import { addList, getAllLists, removeList } from '../../actions/list'
import {BarChart,XAxis,YAxis,CartesianGrid,Tooltip,Legend,Bar,ResponsiveContainer} from 'recharts'
import { push } from 'react-router-redux'
import { changeScreen, screens } from '../../actions/root'
import * as FontAwesome from "react-icons/lib/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import {LinearProgress} from "material-ui"


const styles = theme => ({
  root: {
    flexGrow: 1,
    width : '99%',
    
  },
   root1: {
    height: '265px',
    backgroundColor: theme.palette.secondary.main,
    margin: '0 auto',
    overflow: 'auto',
    paddingBottom: 15,
  },
});
const mapStateToProps = (state) => ({
  screen: state.root.screen,
  id: state.root.id,
})  
class SchoolGrid extends Component {

render() {
  const { classes } = this.props
  const {p_marks,p_sport,top_extra_curr,b_marks,g_marks,avg_marks,avg_sport,avg_extra_curr,p_c,p_b,p_g,students,s_n} = this.props.school
  return (
    <div className={classes.root}>
       <Typography style={{fontSize:'45px',textAlign:'center',color:"#FFC200 ",marginBottom:'-20px'}} >{s_n}</Typography>

      <Grid container style={{margin: 25, maxWidth: 'calc(100% - 50px)'}}>

          <Grid item xs={3}>
            <Paper style={{height:'inherit'}}>
            <Typography style={{paddingBottom:'10px',fontSize:'15px',textAlign:'center'}}>% of Girls And Boys</Typography>
                  
                   <FontAwesome.FaFemale size={90} color="#e54587" style={{ verticalAlign: "middle" }} />
                  {/* <FontAwesome.FaFemale size={50} color="#e54587" style={{ verticalAlign: "middle" }} /> */}
                  <span style={{ display: "inline-block", verticalAlign: "middle", margin: "0 auto", color: "white" }}>
                    {p_g.map(d => {
                      return <Typography
                          style={{ fontSize: "20px", textAlign: "center" }}
                        >
                          {Math.floor(parseFloat(d.value)) + "%"}
                        </Typography>;
                    })}
                  </span>
                  <FontAwesome.FaMale size={90} color="#558fd5" style={{ verticalAlign: "middle" }} />
                  <span style={{ display: "inline-block", verticalAlign: "right", margin: "0 auto", color: "white" }}>
                    {p_b.map(d => {
                      return <Typography
                          style={{ fontSize: "20px", textAlign: "right" ,right:'0px'}}
                        >
                          {Math.floor(parseFloat(d.value)) + "%"}
                        </Typography>;
                    })}
                  </span>
                  <br/>
                    {p_g.map((d)=>{
                      return <LinearProgress id={'bar'} className={classes.barColorPrimary} variant="determinate" value={d.value} style={{backgroundColor:'#558fd5',marginTop:'10px'}}/>
                    })}
                  </Paper>
            </Grid>
          <Grid item xs={3}>
            <Paper style={{height:"inherit"}}>
            <Typography style={{fontSize:'15px',textAlign:'center'}}>Best Student-Academics</Typography>

              <Progress data={p_marks[0]} style={{marginBottom: 10}}/>
           </Paper>
            </Grid>
            <Grid item xs={3}>
             <Paper style={{height:"inherit"}}>
            <Typography style={{fontSize:'15px',textAlign:'center'}}>Best Student-Sports</Typography>

              <Progress3 data={p_sport[0]} style={{marginBottom: 10}}/>
           </Paper>
              </Grid>
              <Grid item xs={3}>
                <Paper style={{height:"inherit"}}>
            <Typography style={{fontSize:'15px',textAlign:'center'}}>School-Pass Percentage</Typography>

              <Progress data={p_c[0]} style={{marginBottom: 10}}/>
           </Paper>
                </Grid>
                </Grid>
        <Grid container style={{margin: 25, maxWidth: 'calc(100% - 50px)'}}>
          <Grid item xs={5}>
          <Paper  style={{height:'350px'}}>
            <Typography style={{paddingTop:'10px',fontSize:'20px',textAlign:'center'}}>Student List</Typography>
 <div className={classes.root2}>
                      <Table>
                      <TableBody>
                        { students.map((d, index) => {
                       return <TableRow key={index}>
                          <TableCell onClick={() => this.props.dispatch(push('/student/' + d.value))}>{d.name}</TableCell>
                         <TableCell style={{ textAlign: 'right' }} onClick={() => { this.props.dispatch(push('/student/' + d.value))}}>{d.value}</TableCell>
                          {
                            /*
                              () => {this.props.dispatch(changeScreen(screens.STUDENT, d.value))}
                            */
                          }

                      </TableRow>
             })
             }</TableBody></Table></div>
          </Paper>
          </Grid>
          <Grid item xs={7}>
          <Paper style={{height:'350px'}}>
            <Typography style={{paddingTop:'10px',fontSize:'20px',textAlign:'center'}}>School Sports Performance</Typography>

          <GraphBar value={p_sport}/>
            </Paper>
          
          </Grid>
            </Grid>

<Grid container style={{margin: 25, maxWidth: 'calc(100% - 50px)'}}>
          <Grid item xs={3}>
        
       <Paper style={{height:"inherit"}}>
            <Typography style={{fontSize:'15px',textAlign:'center'}}>Best Student-Extra Curricular</Typography>

              <Progress3 data={top_extra_curr[0]} style={{marginBottom: 10}}/>
           </Paper>
           
          <br/>

            
          <Paper style={{height:"inherit"}}>
            <Typography style={{fontSize:'15px',textAlign:'center'}}>Best Student-Academics</Typography>

              <Progress data={p_marks[0]} style={{marginBottom: 10}}/>
           </Paper>
               
          </Grid>
          <Grid item xs={5}>
          <Paper style={{height:'270px'}}>
            <Typography style={{paddingTop:'10px',fontSize:'20px',textAlign:'center'}}>School Extra Curricular Performance</Typography>

          <GraphBar value={top_extra_curr}/>
            </Paper>
          
          </Grid>
          <Grid item xs={4}>
          <Paper style={{height:'270px'}}>
            <Typography style={{paddingTop:'10px',fontSize:'20px',textAlign:'center'}}>Boys Academic Performances</Typography>

            <GraphLine value={b_marks}/>
            </Paper>
          </Grid>
              </Grid>

              <Grid container style={{margin: 25, maxWidth: 'calc(100% - 50px)'}}>
                        <Grid item xs={4}>
                      <Paper style={{height:'300px',textAlign:'center'}}>
                      <Typography style={{paddingTop:'10px',fontSize:'20px'}}>Academic-Top Performers</Typography>
                      <div className={classes.root1}>
                      <Table>
                      <TableBody>
                        { p_marks.map((d) => {
                       return <TableRow>
                          <TableCell>{d.name}</TableCell>
                          <TableCell style={{textAlign:'right'}}>{d.value}</TableCell>
                      </TableRow>
             })
             }</TableBody></Table></div>
                          </Paper>
                        </Grid>
                        <Grid item xs={4}>
                        <Paper style={{height:'300px'}}>
                          <Typography style={{paddingTop:'10px',fontSize:'20px',textAlign:'center'}}>Girls Academic Performances</Typography>
                            <br/>
                            <GraphLine value={g_marks}/>
                          </Paper>
                        </Grid>
                        <Grid item xs={4}>
                        <Paper style={{height:'300px'}}>
                      <Typography style={{paddingTop:'10px',fontSize:'20px',textAlign:'center'}}> Sports-Top Performers</Typography>
                        <div className={classes.root1}>
                      <Table>
                      <TableBody>
                        { p_sport.map((d) => {
                       return <TableRow>
                          <TableCell>{d.name}</TableCell>
                          <TableCell style={{textAlign:'right'}}>{d.value}</TableCell>
                      </TableRow>
             })
             }</TableBody></Table></div>
                          </Paper>
                        </Grid>
                            </Grid>
    </div>
  )
}
}



export default withStyles(styles)(SchoolGrid);

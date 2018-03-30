import { combineReducers } from 'redux'
// Import reducers here
import popup from './popup'
import list from './list'
import graph from './graph'
import rootComp from './root'
import studentData from './student'
import searchBar from './searchBar'
import countryData from './country'
import stateData from './state'
import chatbot from './chatbot'
import districtData from './district'
import schoolData from './school'
// Combine all reducers
// If you don't give a key, the name of the reducer is it's
// state's key

const studentApp = combineReducers({
	popup: popup,
	graph: graph, 
	list: list,
	root: rootComp,
	student: studentData,
	searchBar: searchBar,
	country: countryData,
	state : stateData,
	district : districtData,
	school : schoolData,
	chatbot: chatbot,
})

export default studentApp
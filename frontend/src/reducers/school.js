 import { REQUEST_SCHOOL_DATA, RECEIVE_SCHOOL_DATA } from '../actions/school'

const initialState = {
	p_marks : [],
	p_sport : [],
	top_extra_curr : [],
	b_marks:[],
	g_marks:[],
	p_c:[],
	p_b:[],
	p_g:[],
	avg_marks:[],
	avg_sport:[],
	avg_extra_curr:[],
	s_n:[],
	fetchingData: false
}

function ind(getData){
	const pmarks_Pass=[]
	const psport_Pass=[]
	const pcurr_Pass=[]
	const bmarks_Pass=[]
	const gmarks_Pass=[]
	const avgmarks_Pass=[]
	const avgsport_Pass=[]
	const avgcurr_Pass=[]
	const pc_Pass = []
	const pb_Pass = []
	const pg_Pass = []

	const pmarks_Get=getData['p_marks']
	const psport_Get=getData['p_sport']
	const pcurr_Get=getData['top_extra_curr']
	const bmarks_Get=getData['b_marks']
	const gmarks_Get=getData['g_marks']
	const avgmarks_Get=getData['avg_marks']
	const avgsport_Get=getData['avg_sport']
	const avgcurr_Get=getData['avg_extra_curr']
	const pc_Get =getData['p_c']
	const pb_Get = getData['p_b']
	const pg_Get = getData['p_g'] 
	const sn_Get = getData['s_n']

	const marks_keys=Object.keys(pmarks_Get)
	const sport_keys=Object.keys(psport_Get)
	const curr_keys=Object.keys(pcurr_Get)
	const b_keys=Object.keys(bmarks_Get)
	const g_keys=Object.keys(gmarks_Get)
	for(let i=0;i<marks_keys.length;i++){
		pmarks_Pass.push({'name':pmarks_Get.name,'value':Math.round(pmarks_Get.marks)})
	}
	for(let i=0;i<sport_keys.length;i++){
		psport_Pass.push({'name':sport_keys[i],'value':Math.round(psport_Get[sport_keys[i]])})
	}
	for(let i=0;i<curr_keys.length;i++){
		pcurr_Pass.push({'name':curr_keys[i],'value':Math.round(pcurr_Get[curr_keys[i]])})
	}
	for(let i=0;i<b_keys.length;i++){
		bmarks_Pass.push({'name':b_keys[i],'value':Math.round(bmarks_Get[b_keys[i]])})
	}
	for(let i=0;i<g_keys.length;i++){
		gmarks_Pass.push({'name':g_keys[i],'value':Math.round(gmarks_Get[g_keys[i]])})
	}
	
	pc_Pass.push({'name':sn_Get,'value':pc_Get});
	pb_Pass.push({'name':'Boys%','value':pb_Get});
	pg_Pass.push({'name':'Girls%','value':pg_Get});
	avgmarks_Pass.push({'name':'Average Academic Performance','value':avgmarks_Get});
	avgsport_Pass.push({'name':'Average Sport Performance','value':avgsport_Get});
	avgcurr_Pass.push({'name':'Average Extra Curricular Performance','value':avgcurr_Get});

	const allDataPass = {
		'p_marks' : pmarks_Get,
		'p_sport' : psport_Get,
		'top_extra_curr' : pcurr_Get,
		'p_c':pc_Pass,
		'p_b':pb_Pass,
		'p_g':pg_Pass,
		'b_marks':bmarks_Pass,
		'g_marks':gmarks_Pass,
		'avg_marks':avgmarks_Pass,
		'avg_sport':avgsport_Pass,
		'avg_extra_curr':avgcurr_Pass,

	}
	console.log('School Data Passed',allDataPass);
	return allDataPass; 
}

const schoolData = (state = initialState, action) => {
	let { data, type } = action.data || {}
	
	switch(action.type){
		case REQUEST_SCHOOL_DATA:
			return Object.assign({}, state, {
				fetchingData: true
			})

		case RECEIVE_SCHOOL_DATA: {
			let ret = Object.assign({}, state, ind(action.data) )
			ret['fetchingData'] = false
			return ret
		}

		default:
			return state
	}
}

export default schoolData
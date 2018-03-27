from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from .models import Student, School, extra_curricular, Acads, Graphs, Lists
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from django.shortcuts import get_object_or_404
import json
import os
import datetime
from pprint import pprint
import pandas as pd
from .forms import StudentForm
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.forms.models import model_to_dict
# Create your views here.
CSV_STORAGE = os.path.join(os.getcwd(), 'studentapp', 'static', 'csv')

def index(req):
	import time
	time.sleep(1)
	return JsonResponse({
		'error': False,
		'data': ['Api root', 'nice']
	})
	

def get_formvals():
	retGraph = {'x':[] , 'y':[] , 'filters':{}}
	rval = Student._meta.get_fields()
	types = {'CharField':'string', 
			'IntegerField':'int',
			'BooleanField':'bool',
			'DateField':'date'}

	for i in rval:
		if types.__contains__(i.get_internal_type()):
			tem = {}
			tem['name'] = i.name
			tem['type'] = types[i.get_internal_type()]
			retGraph['filters'][i.name] = tem
			retGraph['x'].append(i.name)
			retGraph['y'].append(i.name)

	retr = {'graph':retGraph,'list':retGraph}
	return retr

@csrf_exempt
def formVal(request):
	retr = get_formvals()
	return JsonResponse(retr)

@csrf_exempt
def getGraph(request):
	ret = {}
	if request.method == 'POST':
		print(request.body)
		dt = json.loads(request.body.decode('ascii'))
		x_axis = dt['x']
		y_axis = dt['y']
		filters_all = dt['filters']
		new_filter = {}
		x_filter_present = False
		x_filter = {}

		for i in filters_all:
			parm = ''
			val = ''
			for v,k in i.items():
				if v == 'name':
					parm = k
				elif v == 'val':
					val = k 
				elif v == 'op':
					if k == '>=':
						parm += '__gte'
					elif k == '<=':
						parm += '__lte'
					elif k == '>':
						parm += '__gt'
					elif k == '<':
						parm += '__lt'

			for v,k in i.items():
				if v == 'type':
					if k == 'int':
						val = int(val)
					elif k == 'bool':
						val = bool(val)

			new_filter[parm] = val

			if i['name'] == x_axis:
				x_filter_present = True
				x_filter[parm] = val
		
		qs = Student.objects.filter(**new_filter)
		if not x_filter_present:
			qss = Student.objects.all()
		else:
			qss = Student.objects.filter(**x_filter)

		data = {}
		tdata = {}  

		# Filtered objects
		for i in qs:
			ii = i.__dict__
			if isinstance(ii[x_axis], datetime.date):
				ii[x_axis] = str(ii[x_axis])
			
			if data.__contains__(ii[x_axis]):
				data[ii[x_axis]] = float(data[ii[x_axis]]*tdata[x_axis] + ii[y_axis])/(tdata[x_axis] + 1)
				tdata[x_axis] += 1
			
			else:
				data[ii[x_axis]] = ii[y_axis]
				tdata[x_axis] = 1
		
		data_nf = {}
		tdata_nf = {} 

		for i in qss:
			ii = i.__dict__
			if isinstance(ii[x_axis], datetime.date):
				ii[x_axis] = str(ii[x_axis])

			if data_nf.__contains__(ii[x_axis]):
				data_nf[ii[x_axis]] = float(data_nf[ii[x_axis]]*tdata_nf[x_axis] + ii[y_axis])/(tdata_nf[x_axis] + 1)
				tdata_nf[x_axis] += 1
			else:
				data_nf[ii[x_axis]] = ii[y_axis]
				tdata_nf[x_axis] = 1

		dt['data'] = data
		dt['data_nf'] = data_nf

		if dt['id'] is not None:
			gd = Graphs.objects.get(id=dt['id'])
			gd.gD = json.dumps(dt)
			gd.save()	
		
		else :
			gd = Graphs()
			gd.save()
			dt['id'] = gd.id
			gd.gD = json.dumps(dt)
			gd.save()
		ret = dt

	return JsonResponse(ret)

def get_list_data(dt, save=True, limit=True):
	x_axis = dt['x']
	print('x_axis', x_axis)
	filters_all = dt['filters']
	new_filter = {}

	for i in filters_all:
		parm = ''
		val = ''
		for v, k in i.items():
			if v == 'name':
				parm = k
			elif v == 'val':
				val = k
			elif v == 'op':
				if k == '>=':
					parm += '__gte'
				elif k == '<=':
					parm += '__lte'
				elif k == '>':
					parm += '__gt'
				elif k == '<':
					parm += '__lt'
					
		for v, k in i.items():
			if v == 'type':
				if k == 'int':
					val = int(val)
				elif k == 'bool':
					val = bool(val)
		new_filter[parm] = val

	qs = Student.objects.filter(**new_filter)
	data = []
	ret = {}

	for i in qs:
		ii = i.__dict__
		tem = {}

		if not ii['aadhar_id'] in ret:
			x_vals = []
			x_unpack = {}
			for k, v in x_axis.items():
				x_vals.append(ii[k])
				x_unpack[k] = ii[k]
				
			ret[ii['aadhar_id']] = {'name': ii['name'], 
					'value': x_vals, 
                    'std': ii['std'], 'unpacked': x_unpack}
		
		else:
			if ret[ii['aadhar_id']]['std'] < ii['std']:
				x_vals = []
				x_unpack = {}
				for k, v in x_axis.items():
					x_vals.append(ii[k])
					x_unpack[k] = ii[k]


				ret[ii['aadhar_id']] = {
					'name': ii['name'], 'value': x_vals, 
					'std': ii['std'], 'unpacked': x_unpack }

	pddata = []
	for k, v in ret.items():
		data.append({
			'name': v['name'],
			'value': v['value'],
			'aadhar_id': k,
		})
		
		udata = {'aadhar_id': k, 'name': v['name']}
		for kx, vx in v['unpacked'].items():
			udata[kx] = vx
		
		pddata.append(udata)
	
	data = sorted(data, key= lambda k : k['value'])
	
	if limit:
		data = data[::-1][:300]

	dt['data'] = data
	if not save:
		return dt
	
	df = pd.DataFrame(pddata)

	if dt['id'] is not None:
		gd = Lists.objects.get(id=dt['id'])
		df.to_csv(os.path.join(CSV_STORAGE, str(dt['id']) + '.csv'), index=False)
		dt['csv_path'] = 'static/csv/' + str(dt['id']) + '.csv'
		gd.lD = json.dumps(dt)	
		gd.save()

	else:
		gd = Lists()
		gd.save()
		dt['id'] = gd.id
		df.to_csv(os.path.join(CSV_STORAGE, str(dt['id']) + '.csv'), index=False)
		dt['csv_path'] = 'static/csv/' + str(dt['id']) + '.csv'
		gd.lD = json.dumps(dt)
		gd.save()

	return dt
	
@csrf_exempt
def getList(request):
	ret = {} 
	if request.method == 'POST':
		dt = json.loads(request.body.decode('ascii'))
		ret = get_list_data(dt)

	print(ret) 
	return JsonResponse(ret)

@csrf_exempt
def allGraphs(request):
	qs = Graphs.objects.all()
	data = []
	for i in qs:
		data.append( json.loads(i.gD) )
	return JsonResponse( {
		'data':data
	})

@csrf_exempt
def allLists(request):
	qs = Lists.objects.all()
	data = []
	for i in qs:
		data.append( json.loads(i.lD) )
	return JsonResponse( {
		'data':data
	})

@csrf_exempt
def delete_graph(request, id):
	g = get_object_or_404(Graphs, pk=id)
	g.delete()
	return JsonResponse({
			"error": "false"
		})


@csrf_exempt
def delete_list(request, id):
	l = get_object_or_404(Lists, pk=id)
	l.delete()
	return JsonResponse({
		"error": "false"
	})

@csrf_exempt
def suggestions(request):
	if request.method == 'POST':
		qJson = json.loads(request.body.decode('ascii'))

		query = qJson['query']
		if query == '':
			return JsonResponse({
				'student': [],
				'state': [],
				'district': [],
				'school': []
			})

		studentList = []

		allStudentsMatching = Student.objects.filter(name__contains=query)
		aadharSet = set()

		for s in allStudentsMatching:
			if not aadharSet.__contains__(s.aadhar_id):
				studentList.append({
					'id': s.aadhar_id,
					'name': s.name
				})

				aadharSet.add(s.aadhar_id)

		schoolsMatching = Q()
		schoolsMatching = schoolsMatching | Q(school__contains=query)
		allschoolsMatching = Student.objects.filter(schoolsMatching)
		schoolList = list(map(lambda s: {'name': s}, set([s.school for s in allschoolsMatching])))

		districtsMatching = Q()
		districtsMatching = districtsMatching | Q(district__contains=query)
		alldistrictsMatching = Student.objects.filter(districtsMatching)
		districtList = list(map(lambda s: {'name': s}, set([s.district for s in alldistrictsMatching])))

		statesMatching = Q()
		statesMatching = statesMatching | Q(state__contains=query)
		allstatesMatching = Student.objects.filter(statesMatching)
		stateList = list(map(lambda s: {'name': s}, set([s.state for s in allstatesMatching])))

		result= {
			'student': studentList,
			'state': stateList,
			'district': districtList,
			'school': schoolList
		}

		return JsonResponse(result)

@csrf_exempt
def getStudentData(request,aadhar_id):
	ret = {}
	if request.method == 'GET':
		aadhar_id_dt = aadhar_id
		qs = Student.objects.filter(aadhar_id=aadhar_id_dt)
		data = []
		acad_data = []
		sport_data = []
		c_data = []
		d_data = []
		eng = 0.0
		maths = 0.0
		hindi = 0.0
		sci = 0.0
		name = ''
		school = ''
		district = ''
		state = ''
		d = {}
		for i in qs:
			acad_data.append({str(i.date):i.marks})
			sport_data.append({str(i.date):i.sport})
			c_data.append({str(i.date):i.extra_curr})
			d_data.append({str(i.date):i.atten})
			eng += i.english_marks
			maths += i.maths_marks
			sci += i.science_marks
			hindi += i.hindi_marks
			name = i.name
			school = i.school
			district = i.district
			state = i.state
			d = model_to_dict(i)

		eng /= len(qs)
		maths /= len(qs)
		sci /= len(qs)
		hindi /= len(qs)
		data = [{'english':eng},{'maths':maths},{'science':sci},{'hindi':hindi}]
		print('ddd', d)
		ret = { 
			'data':data, 
			'acad_data':acad_data, 
			'sport_data':sport_data,
			'c_data':c_data, 
			'd_data':d_data,
			'details': {
				'name': name,
				'school': school,
				'district': district,
				'state': state,
			},
			'params': d
		}
		print(ret)
	return JsonResponse(ret) 

@csrf_exempt
def studentform(request):
	if request.method == "POST":

		form = StudentForm(request.POST)
		if form.is_valid():
			studentdata = form.save(commit = False)
			studentdata.savedata()
			return redirect('studentform')

		return HttpResponse('ERROR')
	else:
		form = StudentForm()
		return render(request, 'studentform.html', {'form' : form})

def convert_filters(filters):
	sendfilters = []
	for y in filters:
		r = {}
		if not type(y) is dict:
			continue

		for k, v in y.items():
			if k == 'parameter':
				r['name'] = v
				if v == 'number of parents':
					r['name'] = 'no_of_parents'
				elif v == 'number of siblings':
					r['name'] = 'no_of_siblings'
				elif len(v.split()) > 1:
					r['name'] = '_'.join(v.split())

			elif k == 'operator':
				r['op'] = v
			else:
				if k == 'number':
					r['type'] = 'number'
				else:
					if v == 'True' or v == 'False':
						r['type'] = 'bool'
					else:
						r['type'] = 'string'

				r['val'] = v
		sendfilters.append(r)
	return sendfilters

def fix_param(param):
	if len(param.strip().split()) > 1:
		return '_'.join(param.strip().split())
	else:
		return param


def fix_param_display(param):
	if param == 'atten':
		return 'attendance'
	elif param  == 'no of parents':
		return 'number of parents'
	elif param == 'no of siblings':
		return 'number of siblings'
	elif param == 'std':
		return 'standard'
	elif param == 'Fedu':
		return 'Father\'s education'
	elif param == 'Medu':
		return 'Mother\'s education'
	else:
		return param


@csrf_exempt
def chatbot(request):
	if request.method == 'POST':
		data = json.loads(request.body)
		pprint(data)
		if not data['status']['code'] == 200:
			return JsonResponse({
				error: 'true',
			})

		result = data['result']

		if result['action'] == 'get_param_list':
			ret = get_formvals()
			print(ret)
			s = ', '.join(ret['graph']['x'])
			ans = 'The possible list of parameters are {}'.format(s)
			return JsonResponse({
				'speech': ans,
				'displayText': ans,
			})

		elif result['action'] == 'get_correlation':
			df = pd.read_csv(os.path.join(os.getcwd(), 'studentapp', 'static', 'misc', 'corr.csv'))
			df = df.set_index(df.columns[0])

			print(df)
			p1 = result['parameters']['Parameter']
			p2 = result['parameters']['Parameter1']
			p1f = fix_param(p1)
			p2f = fix_param(p2)

			corr_value = df[p1f][p2f]
			if corr_value >= 0.15:
				comp = 'strongly and positively correlated'
			elif corr_value <= -0.15:
				comp = 'strongly and negatively correlated'
			else:
				comp = 'not correlated'

			p1 = fix_param_display(p1)
			p2 = fix_param_display(p2)

			return JsonResponse({
				'speech': 'The factors {} and {} are {}'.format(p1, p2, comp),
				'displayText': 'The factors {} and {} are {}'.format(p1, p2, comp),
			})

		elif result['action'] in ['get_filters', 'get_number_filters']:
			filters = result['parameters']['Filter']
			sendfilters = convert_filters(filters)
			x_ans = {}

			try:
				x = result['parameters']['Parameter']
				for v in x:
					if len(v.split()) > 1:
						v = '_'.join(v.split())
					x_ans[v] = True

			except KeyError:
				x_ans = {}

			payload = get_list_data({
				'x': x_ans,
				'filters': sendfilters,
			}, False, False)

			datalen = len(payload['data'])
			payload['data'] = payload['data'][::-1][:30]
			pprint(payload)

			if result['action'] == 'get_filters':
				
				return JsonResponse({
					'speech': 'Here is a list of top students satisfying your query',
					'displayText': 'Here is a list of top students satisfying your query',
					'data': payload,
				})

			elif result['action'] == 'get_number_filters':
				return JsonResponse({
					'speech': 'There are {} students satisfying your query'.format(datalen),
					'displayText': 'There are {} students satisfying your query'.format(datalen)
				})

		else:
			return JsonResponse({
				'error': 'false',
			})


@csrf_exempt
def getStateData(request,state_name):
	ret = {}
	if request.method == 'GET':
		pp_data = {}
		ex_curr = {}
		state_ct = {}
		sport_d = {}
		top_marks = []
		top_sport = []
		top_extra_curr = [] 
		qs = Student.objects.filter(state=state_name)
		for i in qs:
			c_state = i.district
			if state_ct.__contains__(c_state):
				pp_data[c_state] = float(pp_data[c_state]*state_ct[c_state] + i.marks)/(state_ct[c_state] + 1)
				ex_curr[c_state] = float(ex_curr[c_state]*state_ct[c_state] + i.extra_curr)/(state_ct[c_state] + 1)
				sport_d[c_state] = float(sport_d[c_state]*state_ct[c_state] + i.sport)/(state_ct[c_state] + 1)
				state_ct[c_state] += 1
			else:
				pp_data[c_state] = float(i.marks)
				ex_curr[c_state] = float(i.extra_curr)
				sport_d[c_state] = float(i.sport)
				state_ct[c_state] = 1
		qs = Student.objects.filter(state=state_name,date__gte=datetime.datetime.strptime('2010-01-01','%Y-%m-%d').date()).order_by('-marks')[:10]
		for i in qs:
			top_marks.append({'name':i.name,'marks':i.marks,'district':i.district})
		qs = Student.objects.filter(state=state_name,date__gte=datetime.datetime.strptime('2010-01-01','%Y-%m-%d').date()).order_by('-extra_curr')[:10]
		for i in qs:
			top_extra_curr.append({'name':i.name,'extra_curr':i.extra_curr,'district':i.district})
		qs = Student.objects.filter(state=state_name,date__gte=datetime.datetime.strptime('2010-01-01','%Y-%m-%d').date()).order_by('-sport')[:10]
		for i in qs:
			top_sport.append({'name':i.name,'sport':i.sport,'district':i.district})
		ret = {'pp_data':pp_data,'ex_curr':ex_curr,'ss_no':state_ct,'sport_d':sport_d,'top_marks':top_marks,'top_sport':top_sport,'top_extra_curr':top_extra_curr}
		print(ret)
	return JsonResponse(ret)

@csrf_exempt
def getDistrictData(request,district_name):
	ret = {}
	if request.method == 'GET':
		pp_data = {}
		ex_curr = {}
		state_ct = {}
		sport_d = {}
		top_marks = []
		top_sport = []
		top_extra_curr = [] 
		qs = Student.objects.filter(district=district_name)
		for i in qs:
			c_state = i.school
			if state_ct.__contains__(c_state):
				pp_data[c_state] = float(pp_data[c_state]*state_ct[c_state] + i.marks)/(state_ct[c_state] + 1)
				ex_curr[c_state] = float(ex_curr[c_state]*state_ct[c_state] + i.extra_curr)/(state_ct[c_state] + 1)
				sport_d[c_state] = float(sport_d[c_state]*state_ct[c_state] + i.sport)/(state_ct[c_state] + 1)
				state_ct[c_state] += 1
			else:
				pp_data[c_state] = float(i.marks)
				ex_curr[c_state] = float(i.extra_curr)
				sport_d[c_state] = float(i.sport)
				state_ct[c_state] = 1
		qs = Student.objects.filter(district=district_name,date__gte=datetime.datetime.strptime('2010-01-01','%Y-%m-%d').date()).order_by('-marks')[:10]
		for i in qs:
			top_marks.append({'name':i.name,'marks':i.marks,'district':i.district})
		qs = Student.objects.filter(district=district_name,date__gte=datetime.datetime.strptime('2010-01-01','%Y-%m-%d').date()).order_by('-extra_curr')[:10]
		for i in qs:
			top_extra_curr.append({'name':i.name,'extra_curr':i.extra_curr,'district':i.district})
		qs = Student.objects.filter(district=district_name,date__gte=datetime.datetime.strptime('2010-01-01','%Y-%m-%d').date()).order_by('-sport')[:10]
		for i in qs:
			top_sport.append({'name':i.name,'sport':i.sport,'district':i.district})
		ret = {'pp_data':pp_data,'ex_curr':ex_curr,'ss_no':state_ct,'sport_d':sport_d,'top_marks':top_marks,'top_sport':top_sport,'top_extra_curr':top_extra_curr}
		print(ret)
	return JsonResponse(ret)

@csrf_exempt
def getCountryData(request):
	ret = {}
	if request.method == 'GET':
		pp_data = {}
		ex_curr = {}
		state_ct = {}
		sport_d = {}
		top_marks = []
		top_sport = []
		top_extra_curr = [] 
		qs = Student.objects.all()
		for i in qs:
			c_state = i.state
			if state_ct.__contains__(c_state):
				pp_data[c_state] = float(pp_data[c_state]*state_ct[c_state] + i.marks)/(state_ct[c_state] + 1)
				ex_curr[c_state] = float(ex_curr[c_state]*state_ct[c_state] + i.extra_curr)/(state_ct[c_state] + 1)
				sport_d[c_state] = float(sport_d[c_state]*state_ct[c_state] + i.sport)/(state_ct[c_state] + 1)
				state_ct[c_state] += 1
			else:
				pp_data[c_state] = float(i.marks)
				ex_curr[c_state] = float(i.extra_curr)
				sport_d[c_state] = float(i.sport)
				state_ct[c_state] = 1

		qs = Student.objects.filter(date__gte=datetime.datetime.strptime('2010-01-01','%Y-%m-%d').date()).order_by('-marks')[:10]
		for i in qs:
			top_marks.append({'name':i.name,'marks':i.marks,'state':i.state})
		qs = Student.objects.filter(date__gte=datetime.datetime.strptime('2010-01-01','%Y-%m-%d').date()).order_by('-extra_curr')[:10]
		for i in qs:
			top_extra_curr.append({'name':i.name,'extra_curr':i.extra_curr,'state':i.state})
		qs = Student.objects.filter(date__gte=datetime.datetime.strptime('2010-01-01','%Y-%m-%d').date()).order_by('-sport')[:10]
		for i in qs:
			top_sport.append({'name':i.name,'sport':i.sport,'state':i.state})
		ret = {'pp_data':pp_data,'ex_curr':ex_curr,'ss_no':state_ct,'sport_d':sport_d,'top_marks':top_marks,'top_sport':top_sport,'top_extra_curr':top_extra_curr}
		print(ret)
	return JsonResponse(ret)

@csrf_exempt
def filter_data(request):
	if request.method == 'GET':
		students_all = Student.objects.all()
		arr = []
		for a in students_all:
			arr.append({'id':a.aadhar_id, 'name': a.name})
		print(arr)
		return JsonResponse({'data':arr})
	else:
		filter_info = json.loads(request.body.decode('ascii'))
		fil_name = filter_info['filter_name']
		fil_type = filter_info['filter_type']
		stu_sel = filter_info['students_selected']
		for i in stu_sel:
			t,v = list(i.items())[0]
			s = Student,objects.filter(aadhar_id=t)
			if s.filter1_active == False:
				s.filter1_name = fil_name
				s.filter1_type = fil_type
				s.filter1_active = true
				s.filter1_val = v
				s.save()
			elif s.filter2_active == False:
				s.filter2_name = fil_name
				s.filter2_type = fil_type
				s.filter2_active = true
				s.filter2_val = v
				s.save()
			elif s.filter3_active == False:
				s.filter3_name = fil_name
				s.filter3_type = fil_type
				s.filter3_active = true
				s.filter3_val = v
				s.save()
			elif s.filter4_active == False:
				s.filter4_name = fil_name
				s.filter4_type = fil_type
				s.filter4_active = true
				s.filter4_val = v
				s.save()
			else:
				s.filter5_name = fil_name
				s.filter5_type = fil_type
				s.filter5_active = true
				s.filter5_val = v
				s.save()
	return JsonResponse({'error':false})



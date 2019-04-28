/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
//数据接口服务地址
axios.defaults.baseURL = 'http://133.12.1.247:9990'

//文档服务地址
axios.defaults.serviceURL = 'http://133.26.139.154:3701'

axios.interceptors.request.use(
	config => {
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

axios.interceptors.response.use(
	response => {
		const data = response.data
		if (data.code != '200') {
			const err = new Error(data.msg)
			return Promise.reject(err)
		}
		return data
	},
	error => {
		return Promise.reject(error)
	}
)

const apiService = {
	//获取历届会展专利投诉案件量
	exhibition_zlts_statistical: () => axios.get('/exhibition/preStatistical'),

	//获取会展侵权黑名单企业
	exhibition_blackList: hzjs => axios.get('/exhibition/blackList/' + hzjs),

	//获取热门侵权行业
	exhibition_hotInfringeIndustry: hzjs =>
		axios.get('/exhibition/hotInfringeIndustry/' + hzjs),

	//获取投诉案件处理结果
	exhibition_processResult: hzjs =>
		axios.get('/exhibition/processResult/' + hzjs),

	//获取所有查询选择项
	exhibition_optionAll: () => axios.get('/exhibition/option/all/'),

	//获取即搜数据统计
	exhibition_searchStatisticResult: () =>
		axios.post('/exhibition/search/static', {
			params: ''
		}),

	//即搜数据结果
	exhibition_searchResult: params =>
		axios.post('/exhibition/search/data', params),

	//下载文档
	exhibition_downFile: fileId => {
		return axios.get(
			axios.defaults.baseURL + '/exhibition/serach/file/uri/' + fileId
		)
	},

	//获取专利剩余保护期情况
	patentRemain_patentRemainYears: () =>
		axios.get('/patentRemain/patentRemainYears'),

	//获取专利产品分布
	patentRemain_getProducts: () => axios.get('/patentRemain/getProducts'),

	/*******************************menus头部图表数据*************************** */
	//保护范围专利数
	patentRemain_countPatentNum: () => axios.get('/patentRemain/countPatentNum'),
	//累计采集图片数
	compare_countCollectPic: () => axios.get('/compare/countCollectPic'),
	//累计对比专利次数
	compare_countComparePatentNum: () =>
		axios.get('/compare/countComparePatentNum'),
	//监控任务数
	monitortktb_countClueNum: () => axios.get('/monitortktb/countClueNum'),

	/******************************** menu-监控任务*******************************************/
	//获取三个指标统计值
	monitortktb_getCountData: () => axios.get('/monitortktb/getCountData'),

	//获取待处理监控任务
	monitortktb_getMonitortktb: () => axios.get('/monitortktb/getMonitortktb'),

	/*********************************鉴别引擎 ***************************/
	//获取相似度产品
	distinguish_getSemblancePic: params =>
		axios.post('/dist/getSemblancePic', params),

	//获取对比次数
	distinguish_getCompPorNum: params => axios.post('/dist/compPorNum', params),

	//获取对比详情
	distinguish_distDetail: params => axios.post('/dist/distDetail', params),

	/*********************************对比预警 ***************************/
	//获取专利信息
	compare_getComparePics: () => axios.get('/compare/getComparePics'),

	//获取专利图片对应的数据源图片
	compare_getCompareDataPics: params =>
		axios.post('/compare/getCompareDataPics', params)
}

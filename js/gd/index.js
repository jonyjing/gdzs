const exhibitionTypeStr = ['其它', '广交会', ' 中博会']
template.registerFunction('exhibition_trans', function(exhibitionType) {
	return exhibitionTypeStr[exhibitionType]
})
$(
	(function() {
		//系统查询选择项
		let searchTypeData = {
			industryType: [],
			exhibitionType: [],
			year: [],
			resultType: [],
			complaintType: []
		}

		apiService
			.exhibition_optionAll()
			.then(ajaxData => {
				let result = ajaxData.data
				searchTypeData.industryType = result.industryType.split(',')
				searchTypeData.exhibitionType = result.exhibitionType
					.split(',')
					.map(value => exhibitionTypeStr[value])
				searchTypeData.year = result.year.split(',')
				searchTypeData.resultType = result.result.split(',')
				searchTypeData.complaintType = result.complaintType.split(',')
				loadIndustryType(searchTypeData.industryType)
				new Swiper('.swiper-container', {
					autoplay: true,
					pagination: {
						el: '.swiper-pagination',
						clickable: true
					}
				})
				$('.type-list>li').on('click', function() {
					let name = $(this).text()
					let userSelectParams = {
						industryType: name,
						curPage: 1,
						pageSize: '10'
					}
					searchResultPopWin.search(userSelectParams)
				})
			})
			.catch(function(error) {
				console.log('获取所有查询选择项' + error)
			})

		$('.seachBox>input').on('click', () => {
			searchPopWin.open(searchTypeData)
		})

		if ($('.jt_scroll').length > 0) {
			$('.jt_scroll').niceScroll({
				cursorcolor: '#4554E3',
				cursorwidth: '5px',
				cursorborder: '0',
				cursorborderradius: '4px',
				background: '#000745',
				autohidemode: false
			})
		}

		let key = '122届'
		loadChart1('chart1')

		loadChart2('chart2')

		loadChart3('chart3', key)

		loadChart4('chart4', key)

		loadTable('table1Data', key)
	})()
)

const popWin = (function() {
	const close = function(className) {
		$('.' + className).hide()
	}
	const open = function(className) {
		$('.' + className).show()
	}
	return {
		close: close,
		open: open
	}
})()

const searchResultPopWin = (function(popWin) {
	let inited
	let myPaginationInited
	let cache_userSelectParams
	const bindEvent = function() {
		$('.result-item .btns>button:nth-child(1)').on('click', function() {
			let fileId = $(this).data('fileid')
			apiService.exhibition_downFile(fileId).then(ajaxData => {
				window.open(axios.defaults.serviceURL + ajaxData.data)
			})
			//window.open('../data/gd/档案.pdf')
		})
		$('.result-item .btns>button:nth-child(2)').on('click', function() {
			let fileId = $(this).data('fileid')
			apiService.exhibition_downFile(fileId).then(ajaxData => {
				window.open(axios.defaults.serviceURL + ajaxData.data)
			})
			//window.open('../data/gd/受理.pdf')
		})
		$('.result-item .btns>button:nth-child(3)').on('click', function() {
			let fileId = $(this).data('fileid')
			apiService.exhibition_downFile(fileId).then(ajaxData => {
				window.open(axios.defaults.serviceURL + ajaxData.data)
			})
		})
		if (!inited) {
			$('.pop-searchResultsWrapper .close').on('click', () => {
				this.close()
			})
			$('#popSearch_ID').on('click', () => {
				cache_userSelectParams.queryStr = $('#searchResultPanel input').val()
				cache_userSelectParams.curPage = 1
				myPaginationInited = false
				this.search(cache_userSelectParams)
			})
			inited = true
		}
	}
	const open = function() {
		popWin.open('pop-searchResultsWrapper')
	}
	const close = function() {
		myPaginationInited = false
		$('#searchResultPanel input').val('')
		popWin.close('pop-searchResultsWrapper')
	}

	const search = function(userSelectParams) {
		this.open()
		cache_userSelectParams = userSelectParams
		$('.re-cont2').hide()
		$('#waiting').show()
		apiService
			.exhibition_searchResult(userSelectParams)
			.then(ajaxData => {
				let context = this
				let searchResultData = ajaxData.data
				let totalPageDataSize = searchResultData.total
				let pageSize = Number(userSelectParams.pageSize)
				let totalPage = parseInt((totalPageDataSize + pageSize - 1) / pageSize)
				//let curPage = searchResultData.offset + 1
				let pageData = searchResultData.results
				if (!myPaginationInited && pageData.length > 0) {
					new Page({
						id: 'pagination',
						curPage: 1, //初始页码
						pageTotal: totalPage, //总页数
						pageAmount: pageSize, //每页多少条
						dataTotal: totalPageDataSize, //总共多少条数据
						pageSize: 8, //可选,分页个数
						showPageTotalFlag: true, //是否显示数据统计
						showSkipInputFlag: true, //是否支持跳转
						getPage: function(page) {
							userSelectParams.curPage = page
							// userSelectParams.queryStr = $('#searchResultPanel input').val()
							context.search(userSelectParams)
						}
					})
					myPaginationInited = true
				} else if (pageData.length === 0) {
					$('#pagination').empty()
				}
				_renderData(pageData, totalPageDataSize)
				this.bindEvent()
				$('#waiting').hide()
				$('.re-cont2').show()
			})
			.catch(function(error) {
				$('#waiting').hide()
				$('.re-cont2').show()
				console.log('即搜数据结果查询' + error)
			})
	}

	const _renderData = function(pageData, totalPageDataSize) {
		let $searchResultPanel = $('#searchResultPanel')
		let $resultItems = $searchResultPanel.find('resultItems')
		$searchResultPanel.find('.tip>em').text(totalPageDataSize)
		let html = template(document.getElementById('tpl').innerHTML, {
			list: pageData
		})
		$('.resultItems')
			.children('.result-item')
			.remove()
		$('.resultItems').append(html)
	}

	return {
		bindEvent: bindEvent,
		close: close,
		open: open,
		search: search
	}
})(popWin)

const searchPopWin = (function(popWin) {
	let inited
	const init = function(searchTypeData) {
		_loadSearchOptions(searchTypeData)
		$('.dl-item span').on('click', function() {
			if ($(this).hasClass('all')) {
				$(this).toggleClass('active')
				if (!$(this).hasClass('active')) {
					$(this)
						.siblings('span')
						.removeClass('active')
				}
			} else {
				$(this).toggleClass('active')
				$(this)
					.parent()
					.find('.all')
					.removeClass('active')
			}
		})

		$('#popSearch').on('click', () => {
			let userSelectParams = {
				queryStr: '',
				industryType: '',
				exhibitionType: '',
				year: '',
				result: '',
				complaintType: '',
				curPage: '1',
				pageSize: '10'
			}

			Object.keys(searchTypeData).forEach(key => {
				let $type = $('.dl-item-box dd[data-type=\'' + key + '\']')
				const isSelectAll = $type.find('.all').hasClass('active')
				if (key === 'resultType') {
					key = 'result'
				}
				userSelectParams[key] = isSelectAll
					? ''
					: $type
						.find('.active')
						.toArray()
						.map(item => item.innerHTML)
						.join(',')
			})

			userSelectParams.exhibitionType = userSelectParams.exhibitionType
				.split(',')
				.map(item => {
					for (let i = 0; i < exhibitionTypeStr.length; i++) {
						if (exhibitionTypeStr[i] === item) {
							return i.toString()
						}
					}
				})
				.join(',')

			var queryStr = $('#searchPanel input').val()
			userSelectParams.queryStr = queryStr
			searchResultPopWin.search(userSelectParams)
		})
		$('.pop-searchWrapper .close').on('click', () => {
			this.close()
		})

		$('.more-time,.more-hyType').on('click', function() {
			$(this).hide()
			$(this)
				.nextAll()
				.show()
				.css('display', 'inline-block')
		})
	}
	const _loadSearchOptions = function(searchTypeData) {
		const $dl_item_box = $('.dl-item-box')

		Object.keys(searchTypeData).forEach(key => {
			let $type_dd = $dl_item_box.find('dd[data-type=\'' + key + '\']')
			$type_dd
				.find('.all')
				.siblings()
				.remove()
			searchTypeData[key].forEach((item, index) => {
				if (index === 10) {
					$type_dd.append('<i class="more more-hyType">更多</i>')
				}
				$type_dd.append('<span class=\'\'>' + item + '</span>')
			})
		})
	}
	const open = function(searchTypeData) {
		if (inited) {
			popWin.open('pop-searchWrapper')
		} else {
			this.init(searchTypeData)
			popWin.open('pop-searchWrapper')
			inited = true
		}
	}
	const close = function() {
		//清空查询值及重置选择项
		$('.dl-item')
			.toArray()
			.forEach(function(item) {
				$(item)
					.find('span:first')
					.addClass('active')
				$(item)
					.find('span')
					.not(':first')
					.removeClass('active')
			})
		$('#searchPanel input').val('')

		popWin.close('pop-searchWrapper')
	}
	return {
		init: init,
		close: close,
		open: open
	}
})(popWin)

function freshRelatedChart(key) {
	loadChart3('chart3', key)
	loadChart4('chart4', key)
	loadTable('table1Data', key)
}

function loadIndustryType(typeData) {
	const $swiper_warpper = $('.swiper-wrapper').empty()
	let $swiper_slide = null
	let $ul = null
	for (let i = 0; i < typeData.length; i++) {
		if (i % 16 === 0) {
			$swiper_slide = $(
				'<div class=\'swiper-slide\'><div class=\'slide-title\'>行业类型</div><ul class="type-list clearfix"></ul></div>'
			)
			$ul = $swiper_slide.find('ul')
			$swiper_warpper.append($swiper_slide)
		}
		$ul.append('<li class=\'item\'>' + typeData[i] + '</li>')
	}
}

function loadChart1(id) {
	apiService
		.exhibition_zlts_statistical()
		.then(ajaxData => {
			let mychart1_data = dataFormatUtils.format_exhibition_zlts_statistical(
				ajaxData.data
			)
			let mychart1_obj = _chartBar(id, mychart1_data)
			mychart1_obj.on('click', function(params) {
				let search_key = params.name
				freshRelatedChart(search_key)
			})
		})
		.catch(function(error) {
			console.log('获取历届会展专利投诉案件量' + error)
		})
}

function loadChart2(id) {
	$('.circleItem')
		.on('mouseover', function() {
			let type = $(this).data('type')
			$('.chart-content div[data-tip=' + type + ']').show()
		})
		.on('mouseout', function() {
			let type = $(this).data('type')
			$('.chart-content div[data-tip=' + type + ']').hide()
		})
	apiService
		.exhibition_searchStatisticResult()
		.then(ajaxData => {
			_chart2(id, ajaxData.data)
		})
		.catch(function(error) {
			console.log('获取即搜数据结果' + error)
		})
}

function loadChart3(id, key) {
	$('#chart3_title').text(key + '会展投诉案件处理结果')
	key = key.replace('届', '')
	apiService
		.exhibition_processResult(key)
		.then(ajaxData => {
			let mychart3_data = []
			ajaxData.data.forEach(element => {
				let dataArray = []
				dataArray.push(element.result)
				dataArray.push(element.count)
				mychart3_data.push(dataArray)
			})
			_chartPie(id, mychart3_data)
		})
		.catch(function(error) {
			console.log('获取会展投诉案件处理结果' + error)
		})
}

function loadChart4(id, key) {
	$('#chart4_title').text(key + '热门侵权行业')
	key = key.replace('届', '')
	let mychart4_data = {
		data: []
	}
	apiService
		.exhibition_hotInfringeIndustry(key)
		.then(ajaxData => {
			var dataArray = ajaxData.data
			mychart4_data.data = dataArray.map(data => {
				return {
					name: data.industry,
					value: data.count
				}
			})
			_chartForce(id, mychart4_data)
		})
		.catch(function(error) {
			console.log('获取热门侵权行业' + error)
		})
}

function loadTable(id, key) {
	$('#table1_title').text(key + '会展侵权黑名单企业')
	key = key.replace('届', '')
	const $table = $('#' + id)
	$table.empty()
	apiService
		.exhibition_blackList(key)
		.then(ajaxData => {
			ajaxData.data.forEach(element => {
				let tr_str =
					'<tr><td>' +
					element.companyName +
					'</td><td>' +
					element.infringeNum +
					'</td></tr>'
				$table.append(tr_str)
			})
			$table.addClass('table1Animation')
			setTimeout(function() {
				$table.removeClass('table1Animation')
			}, 1100)
		})
		.catch(function(error) {
			console.log('获取会展侵权黑名单企业' + error)
		})
}

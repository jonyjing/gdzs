$(
	(function() {
		loadMenuCharts()
		loadMenu1Chart()
		loadMenu4ChartTable()
		load_distinguishEngine()
	})()
)

function loadMenuCharts() {
	//menu1
	const menu1Charts = function() {
		apiService.patentRemain_countPatentNum().then(ajaxData => {
			let quotaValue = ajaxData.data.quotaValue
			chartTables.menuCharts('menu_count1', quotaValue)
		})
	}
	menu1Charts()
	setInterval(menu1Charts, 4000)
	//menu2
	const menu2Charts = function() {
		apiService.compare_countCollectPic().then(ajaxData => {
			let quotaValue = ajaxData.data.quotaValue
			chartTables.menuCharts('menu_count2', quotaValue)
		})
	}
	menu2Charts()
	setInterval(menu2Charts, 6000)
	//menu3
	const menu3Charts = function() {
		apiService.compare_countComparePatentNum().then(ajaxData => {
			let quotaValue = ajaxData.data.quotaValue
			chartTables.menuCharts('menu_count3', quotaValue)
		})
	}
	menu3Charts()
	setInterval(menu3Charts, 7000)
	//menu4
	const menu4Charts = function() {
		apiService.monitortktb_countClueNum().then(ajaxData => {
			let quotaValue = ajaxData.data.quotaValue
			chartTables.menuCharts('menu_count4', quotaValue)
		})
	}
	menu4Charts()
	setInterval(menu4Charts, 7000)
}

function loadMenu1Chart() {
	//leftChart
	const leftChart = function() {
		apiService.patentRemain_getProducts().then(ajaxData => {
			let chartDatas = ajaxData.data
			let format_chartDatas = chartDatas.map(item => {
				return {
					name: item.prodName.replace(/\"/g, ''),
					value: item.quotaValue
				}
			})
			var mychart1_data = {
				data: format_chartDatas,
				symbolSize: [35, 50]
			}
			chartTables.menu1_leftChart('mychart1', mychart1_data)
		})
	}

	//rightChart
	const rightChart = function() {
		apiService.patentRemain_patentRemainYears().then(ajaxData => {
			let chartDatas = ajaxData.data
			let format_chartDatas = dataFormatUtils.format_menu1_rightChart(
				chartDatas
			)
			chartTables.menu1_rightChart('mychart2', format_chartDatas)
		})
	}
	leftChart()
	rightChart()
	setInterval(() => {
		leftChart()
		rightChart()
	}, 6000)
}

function loadMenu4ChartTable() {
	const loadCircleCharts = function() {
		apiService.monitortktb_getCountData().then(ajaxData => {
			let data = ajaxData.data
			chartTables.menu4_circleChart(
				['circleNum1', 'circleNum2', 'circleNum3'],
				data
			)
		})
	}

	const loadMonitorTable = function() {
		apiService.monitortktb_getMonitortktb().then(ajaxData => {
			let data = ajaxData.data
			$('#jkTask').text(data.length)
			chartTables.menu4_monitorTable('tableData', data)
		})
	}

	loadCircleCharts()
	loadMonitorTable()
	setInterval(() => {
		loadCircleCharts()
		loadMonitorTable()
	}, 6000)
}

function load_distinguishEngine() {
	const distinguishEngine = (function() {
		let filterSemBlance =78
		let engine_returnDatas = null
		let uploadPicSrc = null
		let uploadPicName = ''
		const init = function() {
			$('#jianbie').on('click', () => {
				$('#popbg').show()
				$('#pop1').show()
				this.popFn()
				this.swiperFn()
			})
		}

		const swiperFn = function() {
			new Swiper('.popslide', {
				autoplay: true,
				allowTouchMove: false,
				pagination: {
					el: '.swiper-pagination',
					clickable: true
				}
			})
		}
		const popFn = function() {
			var _this = this
			var persent = 0
			function getObjectURL(file) {
				var url = null
				if (window.createObjcectURL != undefined) {
					url = window.createOjcectURL(file)
				} else if (window.URL != undefined) {
					url = window.URL.createObjectURL(file)
				} else if (window.webkitURL != undefined) {
					url = window.webkitURL.createObjectURL(file)
				}
				return url
			}
			$('#close1').on('click', function() {
				$('#popbg').hide()
				$('#pop1').hide()
				$('#popSearch').removeClass('cur')
				$('#popSerDet').removeClass('cur')
				$('#waiting').hide()
				$('#inptzlh').val('')
			})
			$('#imgInput').on('change', function() {
				let reg = /^(\s|\S)+(jpg|png|JPG|PNG)+$/
				let full_imgName = this.files[0].name
				if (reg.test(full_imgName)) {
					let imgName = full_imgName.substring(0, full_imgName.indexOf('.'))
					uploadPicName = imgName
					$('#popSerDet').removeClass('cur')
					$('#popscaning').show()
					uploadPicSrc = getObjectURL(this.files[0])
					$('#pop-scan-img').attr('src', uploadPicSrc)
					$('#progPer').css('width', '0')
					let promiseRequestList = []
					promiseRequestList.push(
						apiService.distinguish_getSemblancePic({ name: imgName })
					)
					promiseRequestList.push(
						apiService.distinguish_getCompPorNum({ name: imgName })
					)
					axios.all(promiseRequestList).then(axios.spread(function (compareDatas, compareNum) {
						engine_returnDatas = compareDatas.data
						//按相似度比例过滤数据
						engine_returnDatas = engine_returnDatas.filter(
							data => data.semBlance >= filterSemBlance
						)
						if(compareNum.data[0]){
							$('#compareNum').text(compareNum.data[0].compProNum)
						}
						progressFn()
					})).catch(function(error) {
						console.log('取相似度产品' + error)
					})
				} else {
					alert('请选择扩展名为png或jpg格式的图片！')
				}
			})
			function progressFn() {
				$('#upLoadPic').text(uploadPicName)
				setTimeout(function() {
					if (persent <= 100) {
						$('#progPer')
							.css('width', persent + '%')
							.html(persent + '%')
						persent++
						progressFn()
					} else {
						$('#popscaning').hide()
						$('#popSearch').addClass('cur')
						$('#popSerDet').addClass('cur')
						$('.filterSemBlance').text(filterSemBlance)
						$('#filterNum').text(engine_returnDatas.length)
						_loadSwipePic()
						_this.swiperFn()
						persent = 0
						$('#imgInput').val('')
					}
				}, 40)
			}
			$('#popserBth').on('click', function() {
				let searchValue = $('#inptzlh').val()
				if (searchValue != '') {
					/*$('#waiting').show()
					$('#popSerDet').removeClass('cur')
					apiService
						.distinguish_getSemblancePic({ name: searchValue })
						.then(ajaxData => {
							var dataArray = ajaxData.data

							$('#popSearch').addClass('cur')
							$('#popSerDet').addClass('cur')
							$('#waiting').hide()
							_loadSwipePic()
							_this.swiperFn()
							$('#imgInput').val('')
						})
						.catch(function(error) {
							console.log('取相似度产品' + error)
						})*/
				}
			})
			$('#pop1 .btn1').on('click', function() {
				$('#pop2').show()
			})
			$('#close2').on('click', function() {
				$('#pop2').hide()
			})
		}

		const _loadSwipePic = function() {
			let $swiperPic_warpper = $('#distinguishPics').empty()
			let $swiper_slide = null
			engine_returnDatas.forEach((item, index) => {
				if (index % 4 === 0) {
					$swiper_slide = $('<div class=\'swiper-slide\'></div>')
					$swiperPic_warpper.append($swiper_slide)
				}
				let itemPart = template(
					document.getElementById('distinguishPicItem').innerHTML,
					{
						item: item
					}
				)
				$swiper_slide.append(itemPart)
			})
			$swiperPic_warpper.find('.btn1').on('click', function() {
				let compProdId = $(this).data('prodid')
				let mainCompProdData
				for (let i = 0; i < engine_returnDatas.length; i++) {
					if (engine_returnDatas[i].compProdId == compProdId) {
						mainCompProdData = engine_returnDatas[i]
						break
					}
				}
				_loadCompareDetailByProdId(mainCompProdData)
			})
		}

		const _loadCompareDetailByProdId = function(mainCompProdData) {
			let $warpper = $('#pop2')
			let compPicList = mainCompProdData.picList
			let mainComparePicName = mainCompProdData.compProdName
			let promiseRequestList = []
			compPicList.forEach(comPic => {
				promiseRequestList.push(
					apiService.distinguish_distDetail({ picId: comPic.picId })
				)
			})
			axios.all(promiseRequestList).then(responseArray => {
				let compareResultList = []
				responseArray.forEach((response, index) => {
					var comPic = compPicList[index]
					compareResultList.push({
						detailInfo: response.data,
						comPicSrc: comPic.picUrl,
						comPicName: comPic.picName,
						upLoadPicSrc: uploadPicSrc
					})
				})
				let compareItemPart = template(
					document.getElementById('comparePartItem').innerHTML,
					{
						compareList: compareResultList
					}
				)
				$warpper
					.find('.compareShow')
					.empty()
					.append(compareItemPart)
				$warpper.find('#uploadPicName').text(uploadPicName)
				$warpper.find('#mainComparePicName').text(mainComparePicName)
				$warpper.show()
			})
		}

		return {
			init: init,
			popFn: popFn,
			swiperFn: swiperFn
		}
	})()
	distinguishEngine.init()
}

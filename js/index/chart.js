const chartTables = (function() {
	const menuCharts = function(id, data) {
		let $chart_warpper = $('#' + id)
		$chart_warpper.html(data).addClass('cur')
		setTimeout(function() {
			$chart_warpper.removeClass('cur')
		}, 1000)
	}

	const menu1_leftChart = function(id, data) {
		let chart = comm.force(id, data)
		return chart
	}

	const menu1_rightChart = function(id, obj) {
		if (document.getElementById(id)) {
			var imgDatUrl = [
				'./images/reverBar1-big.png',
				'./images/reverBar2.png',
				'./images/reverBar3.png'
			]
			var series = []
			var showData = obj.data
			series.push({
				name: obj.legend[0],
				type: 'pictorialBar',
				symbol: 'image://' + imgDatUrl[0],
				symbolSize: ['100%', '25'],
				data: showData,
				symbolClip: true,
				label: {
					show: true,
					position: 'right',
					color: '#A2AAFE'
				}
			})
			var option = {
				grid: {
					left: '3%',
					right: '3%',
					bottom: '10%',
					top: '15%',
					containLabel: true
				},
				tooltip: {
					trigger: 'axis',
					show: true,
					axisPointer: {
						type: 'line',
						lineStyle: {
							width: 0
						}
					},
					formatter: function(p) {
						var html = p[0].name + '<br>'
						for (var i = 0; i < p.length; i++) {
							html += p[i].seriesName + ': ' + p[i].value + '<br>'
						}
						return html
					}
				},
				xAxis: {
					max: function(value) {
						return value.max + 100
					},
					axisTick: {
						show: false,
						alignWithLabel: true
					},
					splitLine: {
						show: false,
						lineStyle: {
							type: 'dotted',
							width: 0.5,
							color: 'rgba(0,82,188,0.9)'
						}
					},
					axisLine: {
						show: true,
						lineStyle: {
							color: '#A2AAFE',
							width: 1
						}
					},
					axisLabel: {
						show: true,
						interval: 0,
						textStyle: {
							color: '#A2AAFE',
							fontSize: 10
						}
					}
				},
				yAxis: {
					data: obj.xAxis,
					name: obj.name,
					nameTextStyle: {
						color: '#A2AAFE',
						fontSize: 10
					},
					axisTick: {
						show: false,
						alignWithLabel: true
					},
					splitLine: {
						show: false,
						lineStyle: {
							type: 'dotted',
							width: 0.5,
							color: 'rgba(0,82,188,0.9)'
						}
					},
					axisLine: {
						lineStyle: {
							color: '#A2AAFE',
							width: 1
						}
					},
					axisLabel: {
						interval: 0,
						textStyle: {
							color: '#A2AAFE',
							fontSize: 10
						}
					}
				},
				series: series
			}
			let dom = document.getElementById(id)
			let myChart = echarts.init(dom)
			if (myChart.getOption()) {
				myChart.clear()
			}
			myChart.setOption(option)
			$(window).resize(myChart.resize)
			return myChart
		}
	}

	const menu4_circleChart = function(ids, datas) {
		ids.forEach((id, index) => {
			let $chart_warpper = $('#' + id)
			$chart_warpper
				.parent()
				.siblings('p')
				.text(datas[index].quotaName)
			$chart_warpper.html(datas[index].quotaValue).addClass('cur')
			setTimeout(function() {
				$chart_warpper.removeClass('cur')
			}, 1000)
		})
	}

	const menu4_monitorTable = function(id, datas) {
		let $tableData_warpper = $('#' + id).empty()
		datas.forEach(data => {
			let html =
				'<tr>\
              <td width="12%">' +
				data.taskNum +
				'</td>\
              <td width="12%">' +
				data.patentNum +
				'</td>\
              <td width="21%">' +
				data.patentName +
				'</td>\
              <td width="20%">' +
				data.patentHolder +
				'</td>\
              <td width="12.5%">' +
				data.declarDate.substr(0, 16) +
				'</td>\
              <td width="12.5%">' +
				data.taskCreateTime.substr(0, 16) +
				'</td>\
              <td width="10%">' +
				data.pendJudgeCount +
				'</td>\
            </tr>'
			$tableData_warpper.append(html)
		})
	}

	return {
		menuCharts: menuCharts,
		menu1_leftChart: menu1_leftChart,
		menu1_rightChart: menu1_rightChart,
		menu4_circleChart: menu4_circleChart,
		menu4_monitorTable: menu4_monitorTable
	}
})()

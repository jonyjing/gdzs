/* eslint-disable no-unused-vars */

function _chart2(id, data) {
	let $chart2 = $('.' + id)
	let caseNum = data.caseCount //案件总量
	let data1 = data.resultStatis //处理结果分
	let $data1_warpper = $chart2.find('div[data-tip=\'1\']').empty()
	let data2 = data.caseTypeStatis //按案件类型分
	let $data2_warpper = $chart2.find('div[data-tip=\'2\']').empty()
	let data3 = data.yearStatis //按时间分
	let $data3_warpper = $chart2.find('div[data-tip=\'3\']').empty()
	let data4 = data.foreignStatis //按是否涉外分
	let $data4_warpper = $chart2.find('div[data-tip=\'4\']').empty()
	$chart2.find('.caseNum>em').html(caseNum)
	data1.forEach(item => {
		$data1_warpper.append(
			'<p>' + item.itemName + ':<em>' + item.itemCount + '件</em></p>'
		)
	})
	data2.forEach(item => {
		$data2_warpper.append(
			'<p>' + item.itemName + ':<em>' + item.itemCount + '件</em></p>'
		)
	})
	data3.forEach(item => {
		$data3_warpper.append(
			'<p>' + item.itemName + ':<em>' + item.itemCount + '件</em></p>'
		)
	})
	data4.forEach(item => {
		$data4_warpper.append(
			'<p>' + item.itemName + ':<em>' + item.itemCount + '件</em></p>'
		)
	})
}

function _chartForce(id, obj) {
	if (document.getElementById(id)) {
		var option = {
			backgroundColor: 'none',
			// height:'80%',
			// width:'90%',
			color: ['#10B5D4'],
			tooltip: {
				show: true
			},
			series: [
				{
					type: 'force',
					ribbonType: false,
					symbol: 'image://../images/force.png',
					itemStyle: {
						normal: {
							label: {
								show: true, //显示字
								textStyle: {
									// 字体样式
									color: '#fff',
									fontSize: '12',
									fontWeight: '100',
									fontFamily: 'MicroSoft YaHei'
								}
							},
							nodeStyle: {
								brushType: 'both',
								borderColor: 'rgba(255,215,0,0.4)',
								borderWidth: 0
							},
							linkStyle: {
								type: 'curve',
								width: 0
							}
						},
						emphasis: {
							label: {
								show: false
								// textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
							},
							nodeStyle: {
								//r: 30
								borderColor: 'rgba(255,215,0,0.4)',
								borderWidth: 1
							},
							linkStyle: {}
						}
					},
					useWorker: false,
					minRadius: obj.symbolSize ? obj.symbolSize[0] : 25,
					maxRadius: obj.symbolSize ? obj.symbolSize[1] : 55,
					gravity: 3,
					scaling: 1,
					roam: true,
					size: '100%',
					nodes: obj.data,
					links: []
				}
			]
		}
		var dom = document.getElementById(id)
		var myChart = echarts2.init(dom)
		myChart.setOption(option)
		$(window).resize(myChart.resize)
		return myChart
	}
}

function _chartPie(id, data) {
	if (document.getElementById(id)) {
		var option = {
			chart: {
				type: 'pie',
				backgroundColor: 'transparent',
				options3d: {
					enabled: true,
					alpha: 55,
					beta: 0
				}
			},
			credits: {
				enabled: false
			},
			title: {
				text: ''
			},
			legend: {
				itemStyle: {
					color: '#A2AAFE',
					fontFamily: '微软雅黑',
					fontWeight: 'normal',
					fontSize: 12
				},
				itemHoverStyle: {
					color: '#A2AAFE'
				},
				padding: 0,
				symbolHeight: 9,
				symbolWidth: 9,
				symbolRadius: 0
				// margin: 0
			},
			tooltip: {
				pointFormat: '{point.percentage:.1f}%',
				borderColor: 'rgb(51, 51, 51);',
				backgroundColor: '#323232b5',
				formatter: function() {
					var s =
						this.point.name +
						': ' +
						Highcharts.numberFormat(this.percentage, 1) +
						'%'
					return s
				},
				style: {
					color: 'rgba(255, 255, 255, 0.95)',
					fontSize: '14'
				}
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					depth: 45,
					dataLabels: {
						enabled: true,
						distance: 10,
						inside: true,
						//format: '{y}%',
						formatter: function() {
							return (
								this.y +
								'<br>' +
								Highcharts.numberFormat(this.percentage, 1) +
								'%'
							)
						},
						color: 'rgba(255, 255, 255, 0.85)',
						//y: -10,
						//x: 10,
						style: {
							textOutline: 'none',
							fontSize: '14px'
						}
					},
					showInLegend: true
				}
			},
			series: [
				{
					type: 'pie',
					name: '占比',
					colors: ['#F4AC05', '#E66262', '#04B0AB', '#038DBC'],
					data: data
				}
			]
		}
		var myChart = Highcharts.chart(id, option)
		return myChart
	}
}

function _chartBar(id, obj) {
	if (document.getElementById(id)) {
		var imgDatUrl = [
			'../images/reverBar1.png',
			'../images/reverBar2.png',
			'../images/reverBar3.png'
		]
		var series = []
		var showData = []
		var len = obj.legend.length
		var lenIn = obj.xAxis.length
		//成就堆叠图，每项的数据等于相同项前n项数据之和
		for (var j = 0; j < len; j++) {
			var bufferData = []
			for (var k = 0; k < lenIn; k++) {
				if (j == 0) {
					bufferData.push(obj.data[j][k])
				} else {
					bufferData[k] = showData[j - 1][k] + obj.data[j][k]
				}
			}
			showData.push(bufferData)
		}
		for (var i = 0; i < len; i++) {
			series.push({
				name: obj.legend[i],
				type: 'pictorialBar',
				symbol: 'image://' + imgDatUrl[i],
				barGap: '-100%',
				barCategoryGap: '50%',
				symbolPosition: 'end',
				symbolSize: ['100%', '100%'],
				data: showData[i],
				z: -i,
				symbolClip: true
			})
		}
		var option = {
			grid: {
				left: '3%',
				right: '3%',
				bottom: '15%',
				top: '17%',
				containLabel: true
			},
			dataZoom: [
				{
					type: 'inside'
					//start: 85,
					//end: 100
				},
				{
					type: 'slider',
					bottom: 5,
					textStyle: {
						color: '#A2AAFE'
					},
					borderColor: '#434B9E',
					handleStyle: {
						color: '#00D0F4'
					},
					dataBackground: {
						areaStyle: {
							color: 'red'
						}
					}
				}
			],
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
						if (i == 0) {
							html += p[i].seriesName + ': ' + p[i].value + '<br>'
						} else {
							html +=
								p[i].seriesName + ': ' + (p[i].value - p[i - 1].value) + '<br>'
						}
					}
					return html
				}
			},
			legend: {
				data: obj.legend,
				textStyle: {
					color: '#A2AAFE',
					fontSize: 12
				},
				selectedMode: true,
				left: 'center',
				top: 20,
				bottom: 0,
				itemWidth: 12,
				itemHeight: 12
			},
			yAxis: {
				name: obj.yAxisName,
				nameTextStyle: {
					color: '#A2AAFE',
					fontSize: 12
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
					textStyle: {
						color: '#A2AAFE',
						fontSize: 12
					}
				}
			},
			xAxis: {
				data: obj.xAxis,
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
					//interval: 0,
					textStyle: {
						color: '#A2AAFE',
						fontSize: 12
					}
				}
			},
			series: series
		}
		var dom = document.getElementById(id)
		var myChart = echarts.init(dom)
		if (myChart.getOption()) {
			myChart.clear()
		}
		myChart.setOption(option)
		$(window).resize(myChart.resize)
		return myChart
	}
}

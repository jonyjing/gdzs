/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
function random(min, max) {
	return Math.floor(Math.random() * (max - min)) + min
}
var comm = {
	force: function(id, obj, size) {
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
						symbol: 'image://./images/force.png',
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
						maxRadius: obj.symbolSize ? obj.symbolSize[1] : 35,
						gravity: 2,
						scaling: 0.8,
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
	},

	scroll: function() {
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
	},
	init: function() {
		this.scroll()
	}
}
comm.init()

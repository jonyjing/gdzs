/* eslint-disable no-unused-vars */
const dataFormatUtils = (function() {
	//格式化获取历届会展专利投诉案件量到echarts
	const format_menu1_rightChart = function(dataArray) {
		let echartsFormatDatas = {
			legend: ['专利剩余保护期'],
			xAxis: _getValuesByKey(dataArray, 'patentRemainYears', '年'),
			name: '单位：件',
			data: []
		}
		//根据legend值的顺序把dataArray中的数据提取到不同的数组中保存
		let format_dataArray = []

		dataArray.forEach((data, index) => {
			let value = data.patentCount
			format_dataArray.push(value)
		})
		echartsFormatDatas.data = format_dataArray
		return echartsFormatDatas
	}
	//从对象数组中提取key所拥有的所有可能值
	const _getValuesByKey = (dataArray, key, suffix, prefix) => {
		let values = []
		suffix = suffix || ''
		prefix = prefix || ''
		dataArray.forEach(data => {
			var value = data[key]
			if (values.indexOf(value) == -1) {
				values.push(value)
			}
		})
		values = values.map(value => prefix + value + suffix)
		return values
	}

	return {
		format_menu1_rightChart: format_menu1_rightChart
	}
})()

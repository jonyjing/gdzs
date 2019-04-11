/* eslint-disable no-unused-vars */
const dataFormatUtils = (function() {
	//格式化获取历届会展专利投诉案件量到echarts
	const format_exhibition_zlts_statistical = function(dataArray) {
		let echartsFormatDatas = {
			legend: _getValuesByKey(dataArray, 'tsmxlx'),
			xAxis: _getValuesByKey(dataArray, 'hzjs', '届'),
			yAxisName: '单位：件',
			data: []
		}
		//根据legend值的顺序把dataArray中的数据提取到不同的数组中保存
		let format_dataArray = []
		for (let i = 0; i < echartsFormatDatas.legend.length; i++) {
			format_dataArray.push([])
		}
		dataArray.forEach((data, index) => {
			let value = data.count
			let name = data.tsmxlx
			let dataArrayIndex = index % 3
			format_dataArray[dataArrayIndex].push(value)
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
	//根据legend值的顺序把dataArray中的数据提取到不同的数组中保存
	// const _getDataArrayByLegendSort = (dataArray, legend) => {
	// 	let format_dataArray = new Array(legend.length)
	// 	dataArray.forEach((data, index) => {
	// 		let value = data.count
	// 		let name = data.tsmxlx
	// 		let dataArrayIndex = index % 3
	// 		format_dataArray[dataArrayIndex].push(value)
	// 	})
	// 	return format_dataArray
	// }

	return {
		format_exhibition_zlts_statistical: format_exhibition_zlts_statistical
	}
})()

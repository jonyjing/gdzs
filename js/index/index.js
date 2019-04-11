var swiper1, swiper2, swiper3
var zltxtArr = [], //对比预警-专利名称数组
	zlArr = [], //对比预警-专利数组
	sjyArr = [] //对比预警-数据源数组
var slide = {
	menu: function() {
		var _this = this
		$('#slide-menu .rect').on('click', function() {
			var i = $('#slide-menu .rect').index($(this))
			$('#slide-menu .rect')
				.removeClass('cur')
				.eq(i)
				.addClass('cur')
			$('.slide-panel .penel-in')
				.removeClass('cur')
				.eq(i)
				.addClass('cur')
		})
	},
	imgJump: function() {
		var index = 0
		function loop(id, img) {
			$('#platform').append('<li id="' + id + '"></li>')
			var idObj = $('#' + id)
			idObj.html('<img src="images/slide2/' + img + '.jpg">').addClass('zoomIn')
			setTimeout(function() {
				idObj.removeClass('zoomIn').addClass('jump2')
			}, 500)
			setTimeout(function() {
				idObj.removeClass('jump2').addClass('jump3')
			}, 1200)
			setTimeout(function() {
				idObj.addClass('zoomOut')
				for (var i = 0, len = $('#platformGal li').length; i < len; i++) {
					var liLeft = 15.812 + (i + 1) * 3.6
					$('#platformGal li')
						.eq(i)
						.css('left', liLeft + 'vw')
				}
			}, 2000)
			setTimeout(function() {
				idObj.removeClass('zoomOut')
				$('#platformGal').prepend(idObj)
				if (index > 7) {
					$('#platformImg' + (index - 8)).remove()
				}
			}, 2500)
		}
		setInterval(function() {
			loop('platformImg' + index, random(1, 37))
			index++
		}, 1200)
	},
	slideHtml: function() {
		//对比预警左边专利号和图片填充
		var zltxthtml = '',
			zlimghtml = ''
		apiService.compare_getComparePics().then(res => {
			zlArr = res.data
			for (var i = 0, len = zlArr.length; i < len; i++) {
				var zlArrData = zlArr[i]
				if (i % 2 == 0) {
					zltxthtml +=
						'<div class="swiper-slide">' + zlArrData.patentNum + '</div>'
					zlimghtml += '<div class="swiper-slide">'
				}
				zlimghtml +=
					'<img src="' +
					zlArrData.picUrl +
					'" data-id="' +
					zlArrData.patentId +
					'" data-type="' +
					zlArrData.picType +
					'">'
				if ((i + 1) % 2 == 0) {
					zlimghtml += '</div>'
				}
				if (zltxtArr.indexOf(zlArrData.patentNum) == -1) {
					zltxtArr.push(zlArrData.patentNum)
				}
			}
			$('#zltxt .swiper-wrapper').html(zltxthtml)
			$('#zlimg .swiper-wrapper').html(zlimghtml)
			this.slideHtmlSjy({
				patentId: zlArr[0].patentId,
				picType: zlArr[0].picType
			})
			this.slideimgtxt()
		})
	},
	slideHtmlSjy: function(params, callback) {
		//预警对比数据源html填充
		var sjyimghtml = ''
		apiService.compare_getCompareDataPics(params).then(res => {
			sjyArr = res.data
			for (var k = 0, len = sjyArr.length; k < len; k++) {
				var sjydata = sjyArr[k]
				if (k == 0) {
					sjyimghtml += '<div class="swiper-slide">'
				}
				if (k % 2 == 0 && k != 0) {
					var h = parseInt(k / 2)
					sjyimghtml += '</div><div class="swiper-slide">'
				}
				sjyimghtml +=
					'<img src="' +
					sjydata.comparePicUrl +
					'" data-semBlance="' +
					sjydata.semBlance +
					'">'
				if (k == len - 1) {
					sjyimghtml += '</div>'
				}
			}
			$('#sjyimg .swiper-wrapper').html(sjyimghtml)
			//对比预警右边数据源库图片滑动
			swiper3 = new Swiper('#sjyimg', {
				slidesPerView: 1,
				allowTouchMove: false
			})
			setTimeout(function() {
				callback && callback()
			}, 1000)
		})
	},
	slideimgtxt: function() {
		//对比预警左边专利图片滑动
		swiper1 = new Swiper('#zltxt', {
			slidesPerView: 1,
			allowTouchMove: false,
			loop: true,
			loopAdditionalSlides: 3
		})
		swiper2 = new Swiper('#zlimg', {
			slidesPerView: 1,
			allowTouchMove: false,
			loop: true,
			loopAdditionalSlides: 3
		})
	},
	scanAni: function() {
		var _this = this,
			curImgIndexL = 0,
			curImgIndexR = 0,
			ImgIndexL = 0,
			ImgIndexR = 0,
			flagL = true,
			flagR = true,
			slidCon3 = $('#slide-con3-left')
				.eq(0)
				.offset(),
			imgW = $('#zlimg .swiper-slide-active img')
				.eq(0)
				.width(),
			imgH = $('#zlimg .swiper-slide-active img')
				.eq(0)
				.height()
		function loopLeft() {
			var curImg = $('#zlimg .swiper-slide-active img').eq(curImgIndexL),
				flyImgLeft = 0,
				flyImgTop = 0,
				imgsrc = curImg.attr('src')
			$('#zlimg .swiper-slide-active img')
				.eq(curImgIndexL - 1)
				.removeClass('cur')
			curImg.addClass('cur')
			$('#flyimg')
				.attr('src', imgsrc)
				.css({
					width: imgW,
					height: imgH,
					left: '9.3vw',
					top: '7.765vh'
				})
				.animate(
					{
						width: '14.5vw',
						height: '16.276vh',
						left: '28vw',
						top: '35.7vh'
					},
					1000,
					function() {
						if (flagL) {
							$('#zl-scan-con').prepend(
								'<img src="' + imgsrc + '" class="scan-img">'
							)
							$('#scan-par').html(zltxtArr[0])
							flagL = false
						} else {
							$('#zl-scan-con .scan-img').attr('src', imgsrc)
						}
						setTimeout(function() {
							$('#flyimg').css({
								width: 0,
								height: 0
							})
							$('#scan-line').addClass('scanning')
							setTimeout(function() {
								loopRight()
							}, 500)
						}, 1000)
					}
				)
		}
		function loopRight() {
			var curImg = $('#sjyimg .swiper-slide-active img').eq(curImgIndexR),
				imgsrc = curImg.attr('src'),
				semBlance = curImg.attr('data-semBlance')
			$('#sjyimg .swiper-slide-active img')
				.eq(curImgIndexR - 1)
				.removeClass('cur')
			curImg.addClass('cur')
			if (flagR) {
				$('#sjy-scan-con').prepend(
					'<img src="' + imgsrc + '" class="scan-img">'
				)
				flagR = false
			} else {
				$('#sjy-scan-con .scan-img').attr('src', imgsrc)
			}
			var randomNum = (semBlance * 100).toFixed(0)
			if (randomNum >= 90) {
				$('#scan-xsd')
					.addClass('cur')
					.html(randomNum + '%')
			} else {
				$('#scan-xsd')
					.removeClass('cur')
					.html(randomNum + '%')
			}
			curImgIndexR++
			if (curImgIndexR == 2) {
				curImgIndexR = 0
				swiper3.slideNext()
			}
			ImgIndexR++
			setTimeout(function() {
				if (ImgIndexR < sjyArr.length) {
					loopRight()
				} else {
					ImgIndexR = 0
					curImgIndexR = 0
					$('#scan-line').removeClass('scanning')
					$('#sjyimg img.cur').removeClass('cur')
					curImgIndexL++
					ImgIndexL++
					if (curImgIndexL == 2) {
						curImgIndexL = 0
						$('#scan-par').html($('#zltxt .swiper-slide-next').html())
						swiper1.slideNext()
						swiper2.slideNext()
					}
					_this.slideHtmlSjy(
						{
							patentId: $('#zlimg .swiper-slide-active img')
								.eq(curImgIndexL)
								.attr('data-id'),
							picType: $('#zlimg .swiper-slide-active img')
								.eq(curImgIndexL)
								.attr('data-type')
						},
						loopLeft
					)
				}
			}, 200)
		}
		setTimeout(loopLeft, 1000)
	},
	init: function() {
		this.menu()
		this.imgJump()
		this.slideHtml()
		this.scanAni()
	}
}
slide.init()

<template>
  <div class="seller-ratings" v-el:seller-ratings>
		<div class="ratings-content">
			<div class="overview">
				<div class="overview-left">
					<h1 class="score">{{seller.score}}</h1>
					<div class="title">综合评分</div>
					<div class="rank">高于周边商家{{seller.rankRate}}</div>
				</div>
				<div class="overview-right">
					<div class="score-wrapper">
						<span class="title">服务态度</span>
						<Star :size="36" :score="seller.serviceScore"></Star>
						<span class="score">{{seller.serviceScore}}</span>
					</div>
					<div class="score-wrapper">
						<span class="title">商品评分</span>
						<Star :size="36" :score="seller.foodScore" class="star"></Star>
						<span class="score">{{seller.foodScore}}</span>
					</div>
					<div class="delivery-wrapper">
						<span class="title">送达时间</span>
						<span class="delivery">{{seller.deliveryTime}}分钟</span>
					</div>
				</div>
			</div>
			<Split></Split>
			<div class="ratings-wrapper">
				<rating-select :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="ratings"></rating-select>
				<ul class="ratings-list">
					<li v-for="rating in ratings">
						<div class="avatar">
							<img :src="rating.avatar" width="28" height="28">
						</div>
						<div class="rating-content">
							<div class="rating-info">
								<div class="user-wrapper">
									<span class="username">{{rating.username}}</span>
									<span class="ratetime">{{rating.rateTime}}</span>
								</div>
								<div class="delivery-wrapper">
									<Star :size="36" :score="rating.score"></Star>
									<span class="deliveryTime" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
								</div>
							</div>
							<div class="text" v-show="rating.text">{{rating.text}}</div>
							<div class="recommend-wrapper" v-show="rating.recommend.length > 0">
								<span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
								<span class="recommend-item" v-for="recommend in rating.recommend">{{recommend}}</span>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
  </div>
</template>

<script>
	import Star from 'components/star/Star'
	import Split from 'components/split/Split'
	import BScroll from 'better-scroll'
	import RatingSelect from 'components/ratingSelect/RatingSelect'

	const ALL = 2
	const ERR_OK = 0

	export default {
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				ratings: [],
				selectType: ALL,
				onlyContent: true,
				desc: {
					all: '全部',
					positive: '满意',
					negative: '不满意'
				}
			}
		},
		created() {
			this.$http.get('/api/ratings').then((response) => {
				response = response.body
				if (response.code === ERR_OK) {
					this.ratings = response.msg
				}
			})
			this.$nextTick(() => {
				this.scroll = new BScroll(this.$els.sellerRatings, {
					click: true
				})
			})
		},
		components: {
			Star,
			Split,
			'rating-select': RatingSelect
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus">
	@import '../../common/stylus/mixin.styl'
	.seller-ratings
		position: fixed
		top: 174px
		bottom: 0
		left: 0
		width: 100%
		overflow: hidden
		.overview
			display: flex
			padding: 18px 0
			.overview-left
				flex: 0 0 137px
				width: 137px
				border-right: 1px solid rgba(7,17,27,0.1)
				text-align: center
				padding: 6px 0
				@media only screen and (max-width: 320px)
					flex: 0 0 120px
					width: 120px
				.score
					font-size: 24px
					line-height: 14px
					color: rgb(255,153,0)
				.title
					font-size: 12px
					line-height: 12px
					color: rgb(7,17,27)
					margin: 6px 0 8px 0
				.rank
					font-size: 10px
					line-height: 10px
					color: rgb(147,153,159)
					margin-bottom: 6px
			.overview-right
				flex: 1
				padding-left: 24px
				@media only screen and (max-width: 320px)
					padding-left: 6px
				.score-wrapper
					display: flex
					margin-bottom: 8px
					.title
						font-size: 12px
						line-height: 18px
						color: rgb(7,17,27)
					.star
						display: inline-block
						vertical-align: top
						padding: 0 12px
					.score
						font-size: 12px
						line-height: 18px
						color: rgb(255,153,0)
				.delivery-wrapper
					flex: 1
					.title
						font-size: 12px
						line-height: 18px
						color: rgb(7,17,27)
						padding-right: 12px
					.delivery
						font-size: 12px
						line-height: 18px
						color: rgb(147,153,159)
</style>

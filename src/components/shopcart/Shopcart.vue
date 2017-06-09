<template>
	<div class="shopcart">
		<div class="content" @click="toggleList">
			<div class="content-left">
				<div class="logo-wrapper">
					<div class="logo" :class="{'highLight':totalCount>0}">
						<i class="icon-shopping_cart" :class="{'highLight':totalCount>0}"></i>
					</div>
					<div v-show="totalCount>0" class="totalCount">{{totalCount}}</div>
				</div>
				<div class="price" :class="{'highLight':totalPrice>0}">￥{{totalPrice}}</div>
				<div class="desc">另外配送需要￥{{deliveryPrice}}元</div>
			</div>
			<div class="content-right">
				<div class="pay" :class="payClass" @click.stop.prevent="pay">{{payDesc}}</div>
			</div>
		</div>
		<div class="ball-container">
			<div v-for="ball in balls" v-show="ball.show" transition="drop" class="ball">
				<div class="inner inner-hook"></div>
			</div>
		</div>
		<div class="shopcar-list" v-show="listShow" transition="fold">
			<div class="list-header">
				<h1 class="title">购物车</h1>
				<span class="empty" @click="empty">清空</span>
			</div>
			<div class="list-content" v-el:list-content>
				<ul>
					<li class="food" v-for="good in selectGoods">
						<span class="name">{{good.name}}</span>
						<div class="price">
							<span>￥{{good.price*good.count}}</span>
						</div>
						<div class="cartcontrol-wrapper">
							<Cartcontrol :good="good"></Cartcontrol>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<div class="list-mask" v-show="listShow" transition="fade" @click="hideList"></div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'
	import Cartcontrol from 'components/cartcontrol/Cartcontrol'
	export default {
		props: {
			selectGoods: {
				type: Array,
				default() {
					return []
				}
			},
			deliveryPrice: {
				type: Number,
				default: 0
			},
			minPrice: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				balls: [
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					}
				],
				dropBalls: [],
				fold: true
			}
		},
		computed: {
			totalPrice() {
				let total = 0
				this.selectGoods.forEach((good) => {
					total += good.price * good.count
				})
				return total
			},
			totalCount() {
				let count = 0
				this.selectGoods.forEach((good) => {
					count += good.count
				})
				return count
			},
			payDesc() {
				if (this.totalPrice === 0) {
					return `￥${this.minPrice}元起送`
				} else if (this.totalPrice < this.minPrice) {
					return `还差￥${this.minPrice - this.totalPrice}元起送`
				} else {
					return '去结算'
				}
			},
			payClass() {
				if (this.totalPrice < this.minPrice) {
					return 'not-enough'
				} else {
					return 'enough'
				}
			},
			listShow() {
				if (!this.totalCount) {
					this.fold = true
					return false
				} else {
					let show = !this.fold
					if (show) {
						this.$nextTick(() => {
							if (!this.scroll) {
								this.scroll = new BScroll(this.$els.listContent, {
									click: true
								})
							} else {
								this.scroll.refresh()
							}
						})
					}
					return show
				}
			}
		},
		methods: {
			drop(el) {
				for (let i = 0; i < this.balls.length; i++) {
					let ball = this.balls[i]
					if (!ball.show) {
						ball.show = true
						ball.el = el
						this.dropBalls.push(ball)
						return
					}
				}
			},
			toggleList() {
				if (!this.totalCount) {
					return
				}
				this.fold = !this.fold
			},
			empty() {
				this.selectGoods.forEach((good) => {
					good.count = 0
				})
			},
			hideList() {
				this.fold = true
			},
			pay() {
				if (this.totalPrice < this.minPrice) {
					return
				} else {
					window.alert(`一共支付${this.totalPrice}元`)
				}
			}
		},
		transitions: {
			drop: {
				beforeEnter(el) {
					let count = this.balls.length
					while (count--) {
						let ball = this.balls[count]
						if (ball.show) {
							let rect = ball.el.getBoundingClientRect()
							let x = rect.left - 32
							let y = -(window.innerHeight - rect.top - 22)
							el.style.display = ''
							el.style.webkitTransform = `translate3d(0,${y}px,0)`
							el.style.transform = `translate3d(0,${y}px,0)`
							let inner = el.getElementsByClassName('inner-hook')[0]
							inner.style.webkitTransform = `translate3d(${x}px,0,0)`
							inner.style.transform = `translate3d(${x}px,0,0)`
						}
					}
				},
				enter(el) {
					/* eslint-disable no-unused-vars */
					let rf = el.offsetHeight
					this.$nextTick(() => {
						el.style.webkitTransform = 'translate3d(0,0,0)'
						el.style.transform = 'translate3d(0,0,0)'
						let inner = el.getElementsByClassName('inner-hook')[0]
						inner.style.webkitTransform = 'translate3d(0,0,0)'
						inner.style.transform = 'translate3d(0,0,0)'
					})
				},
				afterEnter(el) {
					let ball = this.dropBalls.shift()
					if (ball) {
						ball.show = false
						el.style.display = 'none'
					}
				}
			}
		},
		components: {
			Cartcontrol
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import '../../common/stylus/mixin.styl'
	.shopcart
		position: fixed
		left: 0
		bottom: 0
		z-index: 50
		width: 100%
		height: 48px
		.content
			display: flex
			background: #141d27
			font-size: 0
			.content-left
				flex: 1
				.logo-wrapper
					display: inline-block
					position: relative
					top: -10px
					margin: 0 12px
					padding: 6px
					width: 56px
					height: 56px
					box-sizing: border-box
					vertical-align: top
					border-radius: 50%
					background: #141d27
					.logo
						width: 100%
						height: 100%
						border-radius: 50%
						background: #2b343c
						text-align: center
						&.highLight
							background: rgb(0,160,220)
						.icon-shopping_cart
							font-size: 24px
							color: #80858a
							line-height: 44px
							&.highLight
								color: #fff
					.totalCount
						position: absolute
						top: 0
						right: 0
						width: 24px
						height: 16px
						line-height: 16px
						font-size: 9px
						font-weight: 700
						color: #fff
						background-color: rgb(240,20,20)
						border-radius: 12px
						text-align: center
						box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4)
				.price
					display: inline-block
					vertical-align: top
					line-height: 24px
					margin-top: 12px
					color: rgba(255,255,255,0.4)
					box-sizing: border-box
					padding-right: 12px
					border-right: 1px solid rgba(255,255,255,0.1)
					font-size: 16px
					font-weight: 700
					&.highLight
						color: #fff
				.desc
					display: inline-block
					vertical-align: top
					margin: 12px 0 0 12px
					line-height: 24px
					color: rgba(255,255,255,0.4)
					font-size: 10px
			.content-right
				flex: 0 0 105px
				width: 105px
				text-align: center
				.pay
					width: 100%
					height: 100%
					color: rgba(255,255,255,0.4)
					font-size: 12px
					font-weight: 700
					line-height: 48px
					&.not-enough
						background: #2b343c
					&.enough
						background: #00b43c
						color: #fff
		.ball-container
			.ball
				position: fixed
				left: 32px
				bottom: 22px
				z-index: 200
				&.drop-transition
					transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
					.inner
						width: 16px
						height: 16px
						border-radius: 50%
						background: rgb(0,160,220)
						transition: all 0.4s linear
		.shopcar-list
			position: absolute
			top: 0
			left: 0
			z-index: -1
			width: 100%
			&.fold-transition
				transition: all 0.3s
				transform: translate3d(0,-100%,0)
			&.fold-enter,&.fold-leave
				transform: translate3d(0,0,0)
			.list-header
				height: 40px
				line-height: 40px
				padding: 0 18px
				background: #f3f5f7
				border-bottom: 1px solid rgba(7,17,27,0.1)
				.title
					float: left
					font-size: 14px
					color: rgb(7,17,27)
				.empty
					float: right
					font-size: 12px
					color: rgb(0,160,220)
			.list-content
				padding: 0 18px
				max-height: 217px
				background: #fff
				overflow: hidden
				.food
					position: relative
					padding: 12px 0
					box-sizing: border-box
					border-1px(rgba(7,17,27,0.1))
					.name
						line-height: 24px
						font-size: 14px
						color: rgb(7,17,27)
					.price
						position: absolute
						right: 90px
						bottom: 12px
						line-height: 24px
						font-size: 14px
						font-weight: 700
						color: rgb(240,20,20)
					.cartcontrol-wrapper
						position: absolute
						right: 0
						bottom: 16px
						top: 6px
	.list-mask
		position: fixed
		top: 0
		left: 0
		width: 100%
		height: 100%
		z-index: 40
		backdrop-filter: blur(10px)
		&.fade-transition
			transition: all 0.3s
			opacity: 1
			background: rgba(7,17,27,0.6)
		&.fade-enter,&.fade-leave
			opacity: 0
			background: rgba(7,17,27,0)
</style>

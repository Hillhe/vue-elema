<template>
  <div class="goods">
		<div class="menu-wrapper" v-el:menu-wrap>
			<ul>
				<li v-for="item in goods" class="menu-item" :class="{'currentIndex': currentIndex===$index}" @click="selectMenu($index, $event)">
					<span class="text">
						<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="goods-wrapper" v-el:goods-wrap>
			<ul>
				<li v-for="item in goods" class="good-list good-list-hook">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li v-for="food in item.foods" class="food-item" @click="selectFoods(food, $event)">
							<div class="icon">
								<img width="57" height="57" :src="food.icon" alt="">
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售{{food.sellCount}}份</span>
									<span>好评率{{food.rating}}%</span>
								</div>
								<div class="price">
									<span class="now">￥{{food.price}}</span>
									<span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
								</div>
								<div class="cart-wrapper">
									<Cartcontrol :good="food"></Cartcontrol>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<Shopcart v-ref:shopcart :select-goods="selectGoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></Shopcart>
  </div>
	<Food :food="selectedFoods" v-ref:food></Food>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'
	import Shopcart from 'components/shopcart/Shopcart'
	import Cartcontrol from 'components/cartcontrol/Cartcontrol'
	import Food from 'components/food/Food'
	const ERR_OK = 0
	export default {
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				goods: [],
				listHeight: [],
				scrollY: 0,
				selectedFoods: {}
			}
		},
		computed: {
			currentIndex() {
				for (let i = 0; i < this.listHeight.length; i++) {
					let height1 = this.listHeight[i]
					let height2 = this.listHeight[i + 1]
					if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
						return i
					}
				}
				return 0
			},
			selectGoods() {
				let goods = []
				this.goods.forEach((good) => {
					good.foods.forEach((food) => {
						if (food.count) {
							goods.push(food)
						}
					})
				})
				return goods
			}
		},
		created() {
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
			this.$http.get('/api/goods').then((response) => {
				response = response.body
				if (response.code === ERR_OK) {
					this.goods = response.msg
					this.$nextTick(() => {
						this._initScroll()
						this.calculateHeight()
					})
				}
			})
		},
		methods: {
			_initScroll() {
				this.menuScroll = new BScroll(this.$els.menuWrap, {
					click: true
				})
				this.goodsScroll = new BScroll(this.$els.goodsWrap, {
					click: true,
					probeType: 3
				})
				this.goodsScroll.on('scroll', (pos) => {
					this.scrollY = Math.abs(Math.round(pos.y))
				})
			},
			calculateHeight() {
				let goodList = this.$els.goodsWrap.getElementsByClassName('good-list-hook')
				let height = 0
				this.listHeight.push(height)
				for (let i = 0; i < goodList.length; i++) {
					let item = goodList[i]
					height += item.clientHeight
					this.listHeight.push(height)
				}
			},
			selectMenu(index, event) {
				if (!event._constructed) {
					return
				}
				let goodList = this.$els.goodsWrap.getElementsByClassName('good-list-hook')
				let el = goodList[index]
				this.goodsScroll.scrollToElement(el, 300)
			},
			_drop(target) {
				this.$nextTick(() => {
					this.$refs.shopcart.drop(target)
				})
			},
			selectFoods(food, event) {
				if (!event._constructed) {
					return
				}
				this.selectedFoods = food
				this.$refs.food.show()
			}
		},
		components: {
			Shopcart,
			Cartcontrol,
			Food
		},
		events: {
			'cart-add'(target) {
				this._drop(target)
			}
		}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl"
	.goods
		display: flex
		overflow: hidden
		position: absolute
		top: 174px
		bottom: 46px
		width: 100%
		.menu-wrapper
			flex: 0 0 80px
			width: 80px
			background: #f3f5f7
			.menu-item
				display: table
				height: 54px
				width: 56px
				padding: 0 12px
				line-height: 14px
				&.currentIndex
					position: relative
					margin-top: -1px
					z-index: 10
					background: #fff
					font-weight: 700
					.text
						border-none()
				.icon
					display: inline-block
					vertical-align: top
					width: 12px
					height: 12px
					margin-right: 2px
					background-size: 12px 12px
					background-repeat: no-repeat
					&.decrease
						bg-image('decrease_3')
					&.discount
						bg-image('discount_3')
					&.guarantee
						bg-image('guarantee_3')
					&.invoice
						bg-image('invoice_3')
					&.special
						bg-image('special_3')
				.text
					display: table-cell
					width: 56px
					vertical-align: middle
					font-size: 12px
					border-1px(rgba(7,17,27,0.1))
		.goods-wrapper
			flex: 1
			.title
				height: 26px
				padding-left: 14px
				font-size: 12px
				color: rgb(147,153,159)
				font-weight: 700
				line-height: 26px
				background: #f3f5f7
				border-left: 2px solid #d9dde1
			.food-item
				display: flex
				margin: 18px
				padding-bottom: 18px
				border-1px(rgba(7,17,27,0.1))
				&:last-child
					border-none()
					margin-bottom: 0
				.icon
					flex: 0 0 57px
					margin-right: 10px
				.content
					flex: 1
					position: relative
					.name
						margin: 2px 0 8px 0
						height: 14px
						line-height: 14px
						font-size: 14px
						color: rgb(7,17,27)
					.desc,.extra
						line-height: 14px
						font-size: 10px
						color: rgb(147,153,159)
					.desc
						margin-bottom: 8px
					.extra
						.count
							margin-right: 12px
					.price
						font-weight: 700
						line-height: 24px
						.now
							margin-right: 18px
							font-size: 14px
							color: rgb(240, 20, 20)
						.old
							text-decoration: line-through
							font-size: 10px
							color: rgb(147,153,159)
					.cart-wrapper
						position: absolute
						right: 0
						bottom: -15px
</style>

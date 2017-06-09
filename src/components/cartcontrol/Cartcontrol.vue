<template>
	<div class="cartcontrol">
		<div class="cart-decrease" v-show="good.count>0" @click="decrease" transition="move">
			<span class="inner icon-remove_circle_outline"></span>
		</div>
		<div class="cart-count" v-show="good.count">{{good.count}}</div>
		<div class="cart-add icon-add_circle" @click="addCart"></div>
	</div>
</template>

<script type="text/ecmascript-6">
	import Vue from 'vue'
	export default {
		props: {
			good: {
				type: Object
			}
		},
		methods: {
			addCart(event) {
				if (!event._constructed) {
					return
				}
				if (!this.good.count) {
					Vue.set(this.good, 'count', 1)
				} else {
					this.good.count++
					console.log(this.good.count)
				}
				this.$dispatch('cart-add', event.target)
			},
			decrease(event) {
				if (!event._constructed) {
					return
				}
				if (this.good.count) {
					this.good.count--
				}
			}
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	.cartcontrol
		font-size: 0
		.cart-decrease
			display: inline-block
			padding: 6px
			transition: all 0.4s linear
			&.move-transition
				opacity: 1
				transform: translate3d(0,0,0)
			.inner
				display: inline-block
				line-height: 24px
				font-size: 24px
				color: rgb(0,160,220)
				transition: all 0.4s linear
				transform: rotate(0)
			&.move-enter, &.move-leave
				opacity: 0
				transform: translate3d(24px,0,0)
				.inner
					transform: rotate(180deg)
		.cart-add
			display: inline-block
			padding: 6px
			line-height: 24px
			font-size: 24px
			color: rgb(0,160,220)
		.cart-count
			display: inline-block
			width: 12px
			vertical-align: top
			padding-top: 6px
			line-height: 24px
			text-align: center
			font-size: 10px
			color: rgb(147,153,159)
</style>

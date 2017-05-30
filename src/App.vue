<template>
  <div class="app">
  	<v-header :seller="seller"></v-header>
    <div class="navbar">
    	<div class="item"><a v-link="{path: '/goods'}">商品</a></div>
    	<div class="item"><a v-link="{path: '/seller'}">商家</a></div>
    	<div class="item"><a v-link="{path: '/ratings'}">评论</a></div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import Header from 'components/header/Header'

const ERR_OK = 0

export default {
	data() {
		return {
			seller: {}
		}
	},
	created() {
		this.$http.get('/api/seller').then((response) => {
			response = response.body
			if (response.code === ERR_OK) {
				this.seller = response.msg
			}
		})
	},
	components: {
		'v-header': Header
	}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
	@import './common/stylus/mixin.styl'
	.app
		.navbar
			display: flex
			width: 100%
			height: 40px
			line-height: 40px
			border-1px(rgb(7,17,27,0.1))
			.item
				flex: 1
				text-align: center
				& > a
					display: block
					font-size: 14px
					color: rgb(77,85,93)
					&.active
						color: rgb(240,20,20)
</style>

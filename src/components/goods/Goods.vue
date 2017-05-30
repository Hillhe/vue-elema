<template>
  <div class="goods">
		<div class="menu-wrapper"></div>
		<div class="goods-wrapper"></div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
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
		.goods-wrapper
			flex: auto
</style>

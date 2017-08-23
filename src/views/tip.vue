<template>
  	<div class="tip-wrapper">
  		<h1>{{type === '1' ? '请用电脑访问' : '您的浏览器版本过低，请升级您的浏览器'}}</h1>
  		<a class="btn" @click="refresh">刷新本页</a>
  	</div>
</template>

<script>

export default {
	data(){
	    return {
	      type: '1'
	    }
	},
	mounted() {
	    this.type = this.$route.query.type;
	},
  	methods: {
  		refresh() {
  			window.location.reload();
  		}
  	}
}
</script>
 
<style lang="less" scoped>
	.tip-wrapper{
		width: 100%;
		height: 100%;
		h1{
			text-align: center;
			margin-top: 20%;
		}
		.btn{
			display: block;
			width: 100px;
			height: 34px;
			line-height: 32px;
			text-align: center;
			color: #fff;
			background-color: #444;
			border-radius: 5px;
			margin: 10% auto;
			&:hover{
				background-color: #555;
			}
		}
	}
</style>
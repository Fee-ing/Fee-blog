<template>
  	<div class="editor-wrapper" @click="hideResult">  
  		<div class="edit-heading centerVertical">
  			<router-link class="iconfont icon-fanhui heading-button back-button" to="/">返回</router-link>
  			<div class="music-search-wrapper flexbox">
  				<input type="text" class="search-input flex1" placeholder="想听什么就搜一搜吧" v-model="keywords" @click.stop="showResult">
  				<a class="option-button search-btn" @click.stop="search">搜索</a>
  				<div class="result-wrapper" v-if="isShowResult">
  					<div class="result-tip">共{{searchTotalNum}}个搜索结果</div>
  					<div class="result-list result-list-header">
  						<div class="songname">歌曲</div>
  						<div class="singer">歌手</div>
  						<div class="album">专辑</div>
  						<div class="duration">时长</div>
  					</div>
  					<div class="result-list-wrapper">
  						<div class="result-list" v-for="item in songList">
	  						<div class="songname">{{item.songname}}</div>
	  						<div class="singer">{{item.singer | getSinger}}</div>
	  						<div class="album">{{item.albumname}}</div>
	  						<div class="duration">{{item.interval | getDuration}}</div>
	  					</div>
	  					<a class="more-song" v-if="searchTotalpage > 1 && searchPage < searchTotalpage" @click.stop="getMoreSongs">获取更多</a>
  					</div>
  				</div>
  			</div>
  		</div>
    	
  	</div>
</template>

<script>
import Func from '../assets/js/common.js'

export default {
	data(){
	    return {
	    	isShowResult: false,
	      	keywords: '你是我心中的一首歌',
	      	songList: [],
	      	searchPage: 1,
	      	searchTotalpage: 1,
	      	searchTotalNum: 0
	    }
	},
	mounted() {
	    this.$http.jsonp('https://c.y.qq.com/v8/fcg-bin/fcg_first_yqq.fcg', {
			params: {
				format: 'jsonp',
				page:'other'
			},
			jsonp: 'jsonpCallback'
		}).then((response) => {
            console.log(response.data);
            
        })
        .catch((response) => {
            Func.toast('加载失败');
        })
	},
	filters: {
		getSinger(singers) {
			if (singers.length === 0) {
				return '';
			}
			let arr = [];
			singers.map(function(item) { 
  				if (item.name) {
  					arr.push(item.name);
  				}
			});
			return arr.join(' / ');
		},
		getDuration(time) {
			let s = parseInt(time%60) > 10 ? parseInt(time%60) : '0' + parseInt(time%60);
			let m = parseInt(time/60) > 10 ? parseInt(time/60) : '0' + parseInt(time/60);
			return m + ' : ' + s;
		}
	},
	watch: {
	    'keywords': 'initResult'
	},
  	methods: {
  		initResult() {
  			this.songList = [];
            this.searchPage = 1;
            this.searchTotalpage = 1;
            this.searchTotalNum = 0;
            this.isShowResult = false;
  		},
  		hideResult() {
  			this.isShowResult = false;
  		},
  		showResult() {
  			if (this.isShowResult) {
  				return;
  			}
  			if (this.keywords.replace(/(^\s*)|(\s*$)/g, '') !== '' && this.songList.length > 0) {
  				this.isShowResult = true;
  			}
  		},
  		search() {
  			if (this.keywords.replace(/(^\s*)|(\s*$)/g, '') === '') {
  				Func.toast('请输入关键词');
  				return;
  			}
  			this.initResult();
  			this.$http.jsonp('https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp', {
  				params: {
  					format: 'jsonp',
  					n: 20,
  					w: this.keywords,
  					p: this.searchPage
  				},
  				jsonp: 'jsonpCallback'
  			}).then((response) => {
	            console.log(response.data.data);
	            this.isShowResult = true;
	            this.songList = response.data.data.song.list;
	            this.searchPage = response.data.data.song.curpage;
	            this.searchTotalpage = parseInt(response.data.data.song.totalnum/20) + (parseInt(response.data.data.song.totalnum%20) > 0 ? 1 : 0);
	            this.searchTotalNum = response.data.data.song.totalnum;
	        })
	        .catch((response) => {
	            Func.toast('搜索失败');
	        })
  		},
  		getMoreSongs() {
  			this.$http.jsonp('https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp', {
  				params: {
  					format: 'jsonp',
  					n: 20,
  					w: this.keywords,
  					p: this.searchPage + 1
  				},
  				jsonp: 'jsonpCallback'
  			}).then((response) => {
	            this.songList = this.songList.concat(response.data.data.song.list);
	            this.searchPage = response.data.data.song.curpage;
	            this.searchTotalpage = parseInt(response.data.data.song.totalnum/20) + (parseInt(response.data.data.song.totalnum%20) > 0 ? 1 : 0);
	            this.searchTotalNum = response.data.data.song.totalnum;
	        })
	        .catch((response) => {
	            Func.toast('获取失败');
	        })
  		}
  	}
}
</script>
 
<style lang="less" scoped>
	.music-search-wrapper{
		width: 800px;
		height: 40px;
		border: 1px solid #444;
		border-radius: 20px;
		position: relative;
		.search-input{
			border: none;
			outline: none;
			background-color: transparent;
			padding: 5px 30px;
		}
		.search-btn{
			width: 100px;
			border-top-right-radius: 20px;
			border-bottom-right-radius: 20px;
		}
		.result-wrapper{
			position: absolute;
			width: 680px;
			top: 38px;
			left: 18px;
			border: 1px solid #444;
			background-color: #fff;
			.result-tip{
				height: 30px;
				line-height: 30px;
				color: #999;
				font-size: 12px;
			}
			.more-song{
				display: block;
				height: 40px;
				line-height: 40px;
				color: #999;
				font-size: 12px;
				&:hover{
					color: #777;
				}
			}
			.result-list-wrapper{
				max-height: 650px;
				overflow-y: auto;
				padding-bottom: 5px;
				&::-webkit-scrollbar {
				    width: 8px;
				    height: 8px;
				}
				&::-webkit-scrollbar-button{
				    display: none;
				}
				&::-webkit-scrollbar-track{
				    background: #444;
				}
				&::-webkit-scrollbar-track-piece{
				    background: #fff;
				}
				&::-webkit-scrollbar-thumb{
				    background: #444;
				    border-radius: 4px;
				}
			}
			.result-list{
				display: -webkit-box; 
			    display: -moz-box; 
			    display: -ms-flexbox; 
			    display: -webkit-flex; 
			    display: flex; 
			    -webkit-box-align: center;
			    -moz-align-items: center;
			    -webkit-align-items: center;
			    align-items: center;
				height: 30px;
				line-height: 30px;
				font-size: 12px;
				cursor: pointer;
				&:hover{
					background-color: #444;
					color: #fff;
				}
				&.result-list-header{
					color: #999;
					font-size: 14px;
					cursor: inherit;
					background-color: #ececec;
					&:hover{
						background-color: #fff;
						color: #999;
					}
				}
				div{
					height: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					padding: 0 5px;
				}
				.songname{
					width: 40%;
				}
				.singer{
					width: 20%;
				}
				.album{
					width: 20%;
				}
				.duration{
					width: 20%;
				}
			}
		}
	}
	
</style>
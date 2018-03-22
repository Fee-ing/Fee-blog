<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style lang="less">
html, body{
  position: relative;
  height: 100%;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  min-width: 800px;
  color: #333;
  font-size: 15px;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #fff;
  .editor-wrapper{
    height: 100%;
    .edit-heading{
      position: fixed;
      width: 100%;
      min-width: 800px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      box-shadow: 0 2px 4px hsla(0,0%,8%,.15);
      background: #f0f0f0;
      z-index: 100;
      .edit-heading-container{
        display: inline-block;
        height: 100%;
      }
    }
    .editor-content{
      position: relative;
      width: 800px;
      min-height: 100%;
      margin: 0 auto;
      background-color: #fff;
      padding-top: 50px;
      box-shadow: 0 0 10px rgba(0,0,0,0.25);
      &.editor-content-user{
        overflow-y: auto;
        .content-wrapper{
          height: auto;
        }
      }
      .content-wrapper{
        padding: 50px 50px 0px;
        overflow: hidden;
        &.article-content{
          position: absolute;
          width: 100%;
          left: 0;
          top: 0;
          height: 100%;
          padding: 80px 50px 0px;
          overflow-y: auto;
          img{
            cursor: pointer;
          }
        }
        .link-blank{
          color: #3385ff;
          &:hover{
            text-decoration: underline;
          }
        }
        .content-list{
          width: 85%;
          padding: 20px 30px;
          margin: 0 auto 50px;
          border: 1px solid #c4c6ca;
          border-radius: 10px;
          &::before{
              webkit-transform: rotate(-2deg);
              -moz-transform: rotate(-2deg);
              -ms-transform: rotate(-2deg);
              -o-transform: rotate(-2deg);
              transform: rotate(-2deg);
              left: -4px;
          }
          &::after{
              webkit-transform: rotate(1.5deg);
              -moz-transform: rotate(1.5deg);
              -ms-transform: rotate(1.5deg);
              -o-transform: rotate(1.5deg);
              transform: rotate(1.5deg);
              left: 4px;
          }
          &.content-list-comment{
            .comment-wrapper{
              display: block;
            }
          }
          .info-wrapper{
            position: relative;
            height: 60px;
            padding-bottom: 10px;
            margin-bottom: 20px;
            .info-avatar{
              width: 50px;
              height: 50px;
              margin-right: 10px;
            }
            .info-content{
              .info-name{
                height: 30px;
                line-height: 30px;
                font-size: 12px;
                b{
                  font-size: 14px;
                }
              }
              .info-sign{
                height: 20px;
                line-height: 14px;
                font-size: 12px;
              }
            }
            .edit-btn{
              height: 100%;
              font-size: 13px;
                &:hover{
                  color: #666;
                }
                &::before{
                  position: relative;
                  top: 2px;
                  margin-right: 5px;
                }
            }
          }
          .list-wrapper{
            max-height: 100px;
            overflow: hidden;
            .first-img{
              width: 180px;
              height: 100px;
              background-color: #fff;
              background-repeat: no-repeat;
              background-position: center;
              background-size: cover;
              margin-right: 15px;
              border-radius: 3px;
              cursor: pointer;
            }
            .paragraph{
              height: 80px;
              display: -webkit-box;
              -webkit-box-flex: 1;
                -moz-box-flex: 1;             
                -webkit-flex: 1;    
                -ms-flex: 1;
                flex: 1;
              font-size: 15px;
              letter-spacing: 2px;
              text-overflow: -o-ellipsis-lastline;
                text-overflow: ellipsis;
                -webkit-line-clamp: 4;
                -webkit-box-orient: vertical;
                cursor: pointer;
              }
            .hold-up{
              display: none;
              overflow: hidden;
              direction: rtl;
              margin-top: 10px;
              .hold-up-btn{
                display: inline-block;
                padding: 5px 10px;
                color: #666;
                &:hover{
                  color: #333;
                }
              }
            }
            &.open{
              max-height: none;
              min-height: 80px;
              .first-img{
                display: none;
              }
              .paragraph{
                display: block;
                height: auto;
                text-overflow: clip;
                -webkit-line-clamp: unset;
              }
            }
            &.show-hold{
              .hold-up{
                display: block;
              }
            }
          }
          .option-wrapper{
            height: 20px;
            margin-top: 20px;
            .option-btn{
              font-size: 12px;
                margin-right: 15px;
                &:hover{
                  color: #666;
                }
                &::before{
                  font-size: 20px;
                  margin-right: 2px;
                }
            }
            .option-tip{
              float: left;
              font-size: 12px;
              color: #999;
            }
            .time{
              font-size: 12px;
              color: #999;
              text-align: right;
              }
          }
            .comment-wrapper{
              display: none;
              margin: 30px 0 10px;
              padding: 15px 10px;
              border: 1px solid #ccc;
              border-radius: 5px;
              .comment-list-wrapper{
                max-height: 400px;
                overflow-y: auto;
              }
              .noCommentTip{
                font-size: 13px;
                padding: 0 5px;
              }
              .comment-header{
                margin-bottom: 25px;
                span{
                  font-size: 15px;
                  font-weight: bold;
                  margin-left: 5px;
                }
              }
              .comment-list{
                margin-top: 10px;
                &:first-child{
                  margin-top: 0;
                }
                .comment-info{
                  height: 30px;
                  line-height: 30px;
                  overflow: hidden;
                  position: relative;
                  .comment-avatar{
                    width: 30px;
                  height: 30px;
                  display: inline-block;
                  margin-right: 5px;
                  }
                  .comment-name{
                  font-size: 13px;
                  font-weight: bold;
                  }
                  .comment-time{
                    width: 120px;
                  font-size: 12px;
                  color: #999;
                  text-align: right;
                  }
                }
                .comment-content{
                font-size: 13px;
                padding: 10px 20px 5px;
                }
              }
              .comment-input-wrapper{
                height: 50px;
                margin-top: 30px;
                .comment-input{
                margin-right: 10px;
                border: 1px solid #999;
                outline: none;
                border-radius: 5px;
                padding: 10px;
                }
                .comment-btn{
                width: 60px;
                height: 100%;
                }
              }
            }
        }
      }
    }
  }
}
</style>
<template>
  <div class="editor">
    <div id="editorElem" class="editorElem"></div>
    <div class="saveEdt">
      <!--<button @click="getContent">保存内容</button>-->
      <el-button plain @click="sendContent">保存内容</el-button>
      <span class="c-danger">请先点击保存编辑器内容避免数据丢失</span>
    </div>
  </div>
</template>

<script>
  import E from 'wangeditor'
  import Qiniu from '../../../static/js/qiniu';

  let editor = new E('#editorElem');
  // 前端生成七牛token代码
  /*  let CryptoJS = require('crypto-js');

    /!**
     * 上传凭证算法实现参考
     * 请注意External Resources项中引用的第三方CryptoJS库
     *!/
    function utf16to8(str) {
      var out, i, len, c;
      out = "";
      len = str.length;
      for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
          out += str.charAt(i);
        } else if (c > 0x07FF) {
          out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
          out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
          out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
          out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
          out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
      }
      return out;
    }

    function utf8to16(str) {
      var out, i, len, c;
      var char2, char3;
      out = "";
      len = str.length;
      i = 0;
      while (i < len) {
        c = str.charCodeAt(i++);
        switch (c >> 4) {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
            // 0xxxxxxx
            out += str.charAt(i - 1);
            break;
          case 12:
          case 13:
            // 110x xxxx 10xx xxxx
            char2 = str.charCodeAt(i++);
            out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
            break;
          case 14:
            // 1110 xxxx 10xx xxxx 10xx xxxx
            char2 = str.charCodeAt(i++);
            char3 = str.charCodeAt(i++);
            out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
            break;
        }
      }
      return out;
    }

    /!*
     * Interfaces:
     * b64 = base64encode(data);
     * data = base64decode(b64);
     *!/


    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
      52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
      15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
      41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

    function base64encode(str) {
      var out, i, len;
      var c1, c2, c3;
      len = str.length;
      i = 0;
      out = "";
      while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
          out += base64EncodeChars.charAt(c1 >> 2);
          out += base64EncodeChars.charAt((c1 & 0x3) << 4);
          out += "==";
          break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
          out += base64EncodeChars.charAt(c1 >> 2);
          out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
          out += base64EncodeChars.charAt((c2 & 0xF) << 2);
          out += "=";
          break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
      }
      return out;
    }

    function base64decode(str) {
      var c1, c2, c3, c4;
      var i, len, out;
      len = str.length;
      i = 0;
      out = "";
      while (i < len) {
        /!* c1 *!/
        do {
          c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);
        if (c1 == -1) break;
        /!* c2 *!/
        do {
          c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);
        if (c2 == -1) break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        /!* c3 *!/
        do {
          c3 = str.charCodeAt(i++) & 0xff;
          if (c3 == 61) return out;
          c3 = base64DecodeChars[c3];
        } while (i < len && c3 == -1);
        if (c3 == -1) break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        /!* c4 *!/
        do {
          c4 = str.charCodeAt(i++) & 0xff;
          if (c4 == 61) return out;
          c4 = base64DecodeChars[c4];
        } while (i < len && c4 == -1);
        if (c4 == -1) break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
      }
      return out;
    }

    function safe64(base64) {
      base64 = base64.replace(/\+/g, "-");
      base64 = base64.replace(/\//g, "_");
      return base64;
    }

    function genUpToken(accessKey, secretKey, putPolicy) {
      //SETP 2
      var put_policy = JSON.stringify(putPolicy);
      console && console.log("put_policy = ", put_policy);

      //SETP 3
      var encoded = base64encode(utf16to8(put_policy));
      console && console.log("encoded = ", encoded);

      //SETP 4
      var hash = CryptoJS.HmacSHA1(encoded, secretKey);
      var encoded_signed = hash.toString(CryptoJS.enc.Base64);
      console && console.log("encoded_signed=", encoded_signed)

      //SETP 5
      var upload_token = accessKey + ":" + safe64(encoded_signed) + ":" + encoded;
      console && console.log("upload_token=", upload_token)
      return upload_token;
    }*/
  /*var policy = {"scope": "weierying", "deadline": 1577808000};
  var ak = 'XVWbJXQbqWzFYxgvAVvPFuB34d9sfiaDxiRXeIPY';
  var sk = '_GzoPgLx6K9GOXaJOd0JHuqOPgrPn-ixai98rzfR';*/
  /*
  console.log("------------------->>>");

  let token = genUpToken(ak, sk, policy);

  console.log("------------------->>>");*/

  // 初始化七牛上传的方法
  function uploadInit(token_url, token, domain) {
    // 获取相关 DOM 节点的 ID
    var btnId = editor.imgMenuId;
    var containerId = editor.toolbarElemId;
    var textElemId = editor.textElemId;
    // 创建上传对象
    var uploader = Qiniu.uploader({
      runtimes: 'html5,flash,html4',    //上传模式,依次退化
      browse_button: btnId,       //上传选择的点选按钮，**必需**
      uptoken_url: token_url,
      // Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
      uptoken: token,
      //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
      unique_names: true,
      // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
      save_key: true,
      // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
      domain: domain,
      //bucket 域名，下载资源时用到，**必需**
      container: containerId,           //上传区域DOM ID，默认是browser_button的父元素，
      max_file_size: '100mb',           //最大文件体积限制
      flash_swf_url: '../js/plupload/Moxie.swf',  //引入flash,相对路径
      filters: {
        mime_types: [
          //只允许上传图片文件 （注意，extensions中，逗号后面不要加空格）
          {title: "图片文件", extensions: "jpg,gif,png,bmp"}
        ]
      },
      max_retries: 3,                   //上传失败最大重试次数
      dragdrop: true,                   //开启可拖曳上传
      drop_element: textElemId,        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
      chunk_size: '4mb',                //分块上传时，每片的体积
      auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
      init: {
        'FilesAdded': function (up, files) {
          plupload.each(files, function (file) {
            // 文件添加进队列后,处理相关的事情
            printLog('on FilesAdded');
          });
        },
        'BeforeUpload': function (up, file) {
          // 每个文件上传前,处理相关的事情
          printLog('on BeforeUpload');
        },
        'UploadProgress': function (up, file) {
          // 显示进度
          printLog('进度 ' + file.percent)
        },
        'FileUploaded': function (up, file, info) {
          // 每个文件上传成功后,处理相关的事情
          // 其中 info 是文件上传成功后，服务端返回的json，形式如
          // {
          //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
          //    "key": "gogopher.jpg"
          //  }
          printLog(info);
          // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

          var domain = up.getOption('domain');
          var res = JSON.parse(info.response);
          var sourceLink = domain + res.key; //获取上传成功后的文件的Url

          printLog(sourceLink);

          // 插入图片到editor
          editor.cmd.do('insertHtml', '<img src="' + sourceLink + '" style="max-width:100%;"/>')
        },
        'Error': function (up, err, errTip) {
          //上传出错时,处理相关的事情
          printLog('on Error');
        },
        'UploadComplete': function () {
          //队列文件处理完毕后,处理相关的事情
          printLog('on UploadComplete');
        }
        // Key 函数如果有需要自行配置，无特殊需要请注释
        //,
        // 'Key': function(up, file) {
        //     // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
        //     // 该配置必须要在 unique_names: false , save_key: false 时才生效
        //     var key = "";
        //     // do something with key here
        //     return key
        // }
      }
      // domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取
      // uploader 为一个plupload对象，继承了所有plupload的方法，参考http://plupload.com/docs
    });
  }

  // 封装 console.log 函数
  function printLog(title, info) {
    window.console && console.log(title, info);
  }

  export default {
    name: 'editor',
    data() {
      return {
        editorContent: '', // 内容
        edit_box: {}, // 编辑器实例盒子
        qiniu: {} // 七牛配置项
      }
    },
    props: {
      content: { // 父组件传内容尽量不要嵌套层级
        type: String,
        default: ''
      }
    },
    watch: {
      content(val) {
        this.editorContent = this.base().utf8to16(this.base().base64decode(val.replace(/\s/g, '+')));
        if (this.edit_box.txt) {
          this.edit_box.txt.html(this.editorContent);
        }
      }
    },
    methods: {
      // 返回编辑器组件内容给父组件
      sendContent() {
        let baseOUT = this.base().base64encode(this.base().utf16to8(this.editorContent));
        this.$emit('getEditor', baseOUT)
      },
      // 获取七牛配置参数
      /*getQiNiu() {
        return this.axios.post(this.getApi('web/config_info'),
          `title=${this.title}`
        )
      },*/
      // 获取服务端生成token
      getQiNiuToken() {
        axiox.post(this.getApi('coms/qiniu_token'),
          this.dafa({
            port: 0, // 0平台 1pc
            id: this.getobjS('user').id,
            name: this.getobjS('user').name
          })
        ).then(res => {
          if (res.data.code === 0) {
            this.qiniu = Object.assign(this.qiniu, {
              js_token: res.data.token,
              dead_time: res.data.dead_time,
              domain: res.data.domain,
              region: res.data.region
            });
            // 初始化七牛上传
            uploadInit(this.qiniu.token_url, res.data.token, res.data.domain);
            // 存储在本地
            this.setobjS('qiniu', this.qiniu);
          } else {
            this.$message(res.data.msg);
            this.delobjS('qiniu');
          }
        }).catch(err => {
          console.log(err);
        })
        // 前端生成token模式
        /* return this.axios.post(this.getApi('coms/qiniu_token')
         )*/
      },
      // 使用七牛云存储
      useQiNiu() {
        if (this.getobjS('qiniu')) {
          let data = this.getobjS('qiniu');
          // 如果七牛参数是在upload组件存储的，则没有计算token --- 重新生成token
          /*if (!data.js_token) {
            data.js_token = genUpToken(data.ACCESS_KEY, data.SECRET_KEY, {
              scope: data.Bucket_Name, deadline: data.deadline
            });
          }*/
          // 初始化七牛上传
          let new_time = Date.parse(new Date()) / 1000;
          if (new_time < parseInt(data.dead_time)) {
            uploadInit(data.token_url, data.js_token, data.domain);
          } else {
            this.getQiNiuToken();
          }
        } else {
          this.getQiNiuToken();
        }
      },
      // 使用七牛云存储 - 前端生成token模式
      /*useQiNiu() {
        let that = this;
        if (this.getobjS('qiniu')) {
          let data = this.getobjS('qiniu');
          // 如果七牛参数是在upload组件存储的，则没有计算token --- 重新生成token
          /!*if (!data.js_token) {
            data.js_token = genUpToken(data.ACCESS_KEY, data.SECRET_KEY, {
              scope: data.Bucket_Name, deadline: data.deadline
            });
          }*!/
          // 初始化七牛上传
          uploadInit(data.token_url, data.js_token, data.Domain);
        } else {
          this.axios.all([this.getQiNiuToken(), this.getQiNiu()])
            .then(this.axios.spread(function (acct, perms) {
              // 当这两个请求都完成的时候会触发这个函数，两个参数分别代表返回的结果
              that.qiniu = Object.assign(that.qiniu, perms.data.info, {token_url: acct.data.token});
              let token = genUpToken(that.qiniu.ACCESS_KEY, that.qiniu.SECRET_KEY, {
                scope: that.qiniu.Bucket_Name, deadline: that.qiniu.deadline
              });
              // 初始化七牛上传
              uploadInit(that.qiniu.token_url, token, that.qiniu.Domain);
              that.qiniu.js_token = token;
              that.setobjS('qiniu', that.qiniu)
            }))
        }
      },*/
      // 使用服务器存储
      useServer() {
        let that = this;
        editor.customConfig.uploadImgServer = this.getApi('coms/upload-img');
        editor.customConfig.uploadFileName = 'file';
        editor.customConfig.uploadImgParams = {
          type: 9  // 属性值会自动进行 encode ，此处无需 encode
        };
        editor.customConfig.uploadImgMaxLength = 1;
        editor.customConfig.uploadImgHooks = {
          before: function (xhr, editor, files) {
            // 图片上传之前触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

            // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
            // return {
            //     prevent: true,
            //     msg: '放弃上传'
            // }
          },
          success: function (xhr, editor, result) {
            // 图片上传并返回结果，图片插入成功之后触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
          },
          fail: function (xhr, editor, result) {
            this.$notify.error({
              title: '错误',
              message: '图片上传成功，但插入富文本编辑器失败'
            })
            // 图片上传并返回结果，但图片插入错误时触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
          },
          error: function (xhr, editor) {
            this.$notify.error({
              title: '错误',
              message: '图片上传错误，请重试'
            })
            // 图片上传出错时触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
          },
          timeout: function (xhr, editor) {
            this.$notify.error({
              title: '超时',
              message: '上传服务器超时请重试'
            })
            // 图片上传超时时触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
          },
          // 自定义图片上传并修改上传成功返回的图片路径
          // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
          // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
          customInsert: function (insertImg, result, editor) {
            // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
            // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
            // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
            let url = result.key;
            // insertImg(`http://api.lara-shop.cn/${url}`)
            insertImg(that.getApi(url))
            // result 必须是一个 JSON 格式字符串！！！否则报错
          }
        };
      },
      // 获取功能开关参数
      getSwitch() {
        return axiox.post(this.getApi('web/config_info'),
          `title=switch`
        )
      }
    },
    mounted() {
      editor.customConfig.onchange = html => {
        this.editorContent = html
      };
      editor.customConfig.uploadImgTimeout = 30000;
      editor.customConfig.withCredentials = true;
      editor.customConfig.menus = [
        'bold',  // 粗体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'quote',  // 引用
        'emoticon',  // 表情
        'image',  // 插入图片
        'table',  // 表格
        'video',  // 插入视频
        'code',  // 插入代码
        'undo',  // 撤销
        'redo'  // 重复
      ];

      axiox.all([this.getSwitch()])
        .then(axiox.spread((acct) => {
          //当这两个请求都完成的时候会触发这个函数，两个参数分别代表返回的结果
          // 是否开启七牛云
          console.log(this.qiniu);
          this.qiniu.open = !!Number(acct.data.info.qiniu);
          // 实例创建完成
          if (this.qiniu.open) {
            editor.create();
            // 是否开启七牛云存储
            editor.customConfig.qiniu = true;
            // 图片上传到七牛云存储
            this.useQiNiu();
            console.log('七牛云存储开启');
          } else {
            // 图片上传到服务器
            this.useServer();
            editor.create();
            console.log('服务器存储开启');
          }
          // 解码
          let txt = this.base().utf8to16(this.base().base64decode(this.content.replace(/\s/g, '+')));
          // 插入已有文本
          editor.txt.html(this.editorContent || txt);
          // 编辑器高度
          this.$nextTick(() => {
            document.getElementsByClassName('w-e-text-container')[0].style.minHeight = '350px';
            document.getElementsByClassName('w-e-text-container')[0].style.maxHeight = '800px';
          });
          // 盒子赋给vm
          this.edit_box = editor
        }));
    }
  }
</script>

<style scoped>
  .editorElem {
    text-align: left;
  }

  .saveEdt {
    margin-top: 10px;
  }

  .el-button {
    margin-right: 20px;
  }

</style>

import {Loading, Message} from 'element-ui'
// 公用方法
export default {
  install(Vue, options) {
    // 转换post提交数据格式
    Vue.prototype.dafa = (data) => {
      let dataStr = ''
      for (let i in data) {
        if (typeof data[i] === 'object') { // 若为对象转化为字符串
          data[i] = JSON.stringify(data[i])
        }
        dataStr += i + '=' + data[i] + '&'
      }
      dataStr = dataStr.replace(/(null)|(undefined)|(<script>)|(<\/script>)/gi, '""')
      return dataStr.substring(0, dataStr.length - 1)
    }

    // getapi
    Vue.prototype.getApi = function (str) {
      return 'https://api.lara-shop.cn/api/' + str   // 服务器
      // return `http://192.168.31.234/Laravel-Shop/trunk/public/api/${str}`  // 潘
    }

    // 防抖
    Vue.prototype.antiShake = {
      lock: false, // 是否锁定进程
      loading: '',
      antiShake: function (fn) {
        // 检查是否锁定进程
        if (this.lock) {
          Message({message: '为避免造成您的损失，请勿重复提交', duration: 1000});
          return
        }
        // 重置状态码
        this.ok = 99;
        // loading状态
        this.loading = Loading.service({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.3)'
        });
        // 防抖 - 上锁锁定进程方式
        this.lock = true;
        // 赋值this指针
        let self = this;
        // 防抖 - 超时调用处理方式
        /*if (this.timer) {
            clearTimeout(this.timer);
            self.ok = 2;
            self.callBack();
        }
        this.timer = setTimeout(function () {
            // fn && fn(item);

        }, 500);*/
        // 差网络环境处理
        setTimeout(function () {
          if (self.ok !== 0 && self.ok !== 1) {
            self.ok = 3;
            self.callBack();
          }
        }, 2500);
        // 异步状态回调
        const promise = new Promise(fn);
        promise.then(function (res) {
          self.ok = 0;
          self.callBack(res);
        }, function (err) {
          self.ok = 1;
          self.callBack(err);
        })
      },
      ok: 99, // 状态码 0成功 1失败 2防抖 3网络超时（2.5秒）
      callBack: function (res) {
        // 判断状态码
        switch (this.ok) {
          case 0:
            Message({message: res.data.msg, duration: 1000});
            break;
          case 1:
            Message({message: '请求失败' + res, duration: 1000});
            break;
          case 2:
            Message({message: '为避免造成您的损失，请勿重复提交', duration: 1000});
            break;
          case 3:
            Message({message: '网络环境较差，请耐心等候或重试', duration: 1000});
            break;
        }
        // 关闭loading
        this.loading.close();
        // 解开防抖锁定
        this.lock = false;
      },
      timer: ''
    }

    // 自定义验证
    Vue.prototype.va = {
      // 账号
      vaAct: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入账号'))
        } else {
          if (!/^[a-zA-Z0-9_-]{3,16}$/.test(value)) {
            callback(new Error('账号格式错误'))
          } else {
            callback()
          }
        }
      },
      // 账号
      vaPhone: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'))
        } else {
          if (!/^1[3-9]\d{9}$/.test(value)) {
            callback(new Error('手机号格式错误'))
          } else {
            callback()
          }
        }
      },
      // 密码
      vaPass: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (!/^(^(?![^a-zA-Z]+$)(?!\D+$)(?![a-zA-Z0-9]+$).{10,}$)/.test(value)) {
            callback(new Error('密码必须包含大小写字母、数字与特殊符号'))
          } else {
            callback()
          }
        }
      }
      ,
      // 用户名
      vaName: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'))
        } else {
          if (!/^\S{3,7}$/.test(value)) {
            callback(new Error('用户名必须输入3到7位字符'))
          } else {
            callback()
          }
        }
      }
      ,
      // 邮箱
      vaEmail: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入邮箱'))
        } else {
          if (!/^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})$/.test(value)) {
            callback(new Error('邮箱格式错误'))
          } else {
            callback()
          }
        }
      }
      ,
      // 别名
      vaAlias: (rule, value, callback) => {
        if (value === '' || value === undefined) {
          callback(new Error('请输入别名'))
        } else {
          if (!/^[a-zA-Z]\w*$/.test(value)) {
            callback(new Error('别名只能是以字母开头的字母数字下划线'))
          } else {
            callback()
          }
        }
      },
      // 非空数组
      vaArrey: (rule, value, callback) => {
        if (value.length <= 0) {
          callback(new Error('不能为空'))
        } else {
          callback()
        }
      }
    }

    // base64编码
    Vue.prototype.base = () => {
      let base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

      let base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1)

      // 编码的方法
      function base64encode(str) {

        var out, i, len

        var c1, c2, c3

        len = str.length

        i = 0

        out = ''

        while (i < len) {

          c1 = str.charCodeAt(i++) & 0xff

          if (i == len) {

            out += base64EncodeChars.charAt(c1 >> 2)

            out += base64EncodeChars.charAt((c1 & 0x3) << 4)

            out += '=='

            break

          }

          c2 = str.charCodeAt(i++)

          if (i == len) {

            out += base64EncodeChars.charAt(c1 >> 2)

            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))

            out += base64EncodeChars.charAt((c2 & 0xF) << 2)

            out += '='

            break

          }

          c3 = str.charCodeAt(i++)

          out += base64EncodeChars.charAt(c1 >> 2)

          out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))

          out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6))

          out += base64EncodeChars.charAt(c3 & 0x3F)

        }

        return out

      }

      // 解码的方法
      function base64decode(str) {

        var c1, c2, c3, c4

        var i, len, out

        len = str.length

        i = 0

        out = ''

        while (i < len) {

          do {

            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]

          } while (i < len && c1 == -1)

          if (c1 == -1)

            break

          do {

            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]

          } while (i < len && c2 == -1)

          if (c2 == -1)

            break

          out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4))

          do {

            c3 = str.charCodeAt(i++) & 0xff

            if (c3 == 61)

              return out

            c3 = base64DecodeChars[c3]

          } while (i < len && c3 == -1)

          if (c3 == -1)

            break

          out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2))

          do {

            c4 = str.charCodeAt(i++) & 0xff

            if (c4 == 61)

              return out

            c4 = base64DecodeChars[c4]

          } while (i < len && c4 == -1)

          if (c4 == -1)

            break

          out += String.fromCharCode(((c3 & 0x03) << 6) | c4)

        }

        return out

      }

      // 编码的方法
      function utf16to8(str) {

        var out, i, len, c

        out = ''

        len = str.length

        for (i = 0; i < len; i++) {

          c = str.charCodeAt(i)

          if ((c >= 0x0001) && (c <= 0x007F)) {

            out += str.charAt(i)

          } else if (c > 0x07FF) {

            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))

            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))

            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))

          } else {

            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))

            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))

          }

        }

        return out

      }

      // 解码的方法
      function utf8to16(str) {

        var out, i, len, c

        var char2, char3

        out = ''

        len = str.length

        i = 0

        while (i < len) {

          c = str.charCodeAt(i++)

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
              out += str.charAt(i - 1)
              break
            case 12:
            case 13:
              // 110x xxxx   10xx xxxx
              char2 = str.charCodeAt(i++)
              out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F))
              break
            case 14:
              // 1110 xxxx  10xx xxxx  10xx xxxx
              char2 = str.charCodeAt(i++)
              char3 = str.charCodeAt(i++)
              out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0))
              break

          }

        }
        return out
      }

      return {
        base64encode: base64encode,
        base64decode: base64decode,
        utf16to8: utf16to8,
        utf8to16: utf8to16
      }

      // 编码
      // value = base64encode(utf16to8(src))
      // 解码
      // value = utf8to16(base64decode(src))
    }

    // 本地缓存-存
    Vue.prototype.setobjS = function (key, val) {
      sessionStorage.setItem(key, JSON.stringify(val))
    }

    // 本地缓存-取
    Vue.prototype.getobjS = function (key) {
      return JSON.parse(sessionStorage.getItem(key))
    }

    // 本地缓存-删
    Vue.prototype.delobjS = function (key) {
      sessionStorage.removeItem(key)
    }
  }
}

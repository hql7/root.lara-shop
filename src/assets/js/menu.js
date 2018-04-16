export default {
  data () {
    return {
      logo: '为尔盈商城系统2.0',
      navs: [
        {
          title: '商城中心',
          id: '1',
          child: [
            {
              title: '产品管理',
              id: '1-1',
              child: [
                {title: '商品列表', id: '1-1-1'}
              ]
            },
            {
              title: '商品配置',
              id: '1-2',
              child: [
                {title: '商品分类', id: '1-2-1'},
                {title: '商品类型', id: '1-2-2'},
                {title: '商品规格', id: '1-2-3'},
                {title: '品牌列表', id: '1-2-4'}
              ]
            },
            {
              title: '店铺管理',
              id: '1-3',
              child: [
                {title: '店铺列表', id: '1-3-1'},
                {title: '开店申请', id: '1-3-2'},
                {title: '店铺等级', id: '1-3-3'},
                {title: '店铺分类', id: '1-3-4'},
                {title: '自营店铺', id: '1-3-5'},
                {title: '经营类目审核', id: '1-3-6'}
              ]
            }
          ]
        },
        {
          title: '订单中心',
          id: '2',
          child: [
            {
              title: '订单管理',
              id: '2-1',
              child: [
                {title: '订单列表', id: '2-1-1'}
              ]
            },
            {
              title: '单据管理',
              id: '2-2',
              child: [
                {title: '收款单', id: '2-2-1'},
                {title: '发货单', id: '2-2-2'},
                {title: '退款单', id: '2-2-3'},
                {title: '退货单', id: '2-2-4'},
                {title: '换货单', id: '2-2-5'}
              ]
            },
            {
              title: '快递单配置',
              id: '2-3',
              child: [
                {title: '暂定', id: '2-3-1'}
              ]
            }
          ]
        },
        {
          title: '客户中心',
          id: '3',
          child: [
            {
              title: '会员管理',
              id: '3-1',
              child: [
                {title: '会员列表', id: '3-1-1'},
                {title: '会员等级管理', id: '3-1-2'}
              ]
            },
            {
              title: '会员资金',
              id: '3-2',
              child: [
                {title: '提现申请', id: '3-2-1'},
                {title: '资金日志', id: '3-2-2'}
              ]
            },
            {
              title: '咨询与评价',
              id: '3-3',
              child: [
                {title: '商品评价', id: '3-3-1'},
                {title: '商品咨询', id: '3-3-2'},
                {title: '信息管理', id: '3-3-3'},
                {title: '到货通知', id: '3-3-4'}
              ]
            }
          ]
        },
        {
          title: '营销推广',
          id: '4',
          child: [
            {
              title: '促销活动',
              id: '4-1',
              child: [
                {title: '商品促销', id: '4-1-1'},
                {title: '订单促销', id: '4-1-2'},
                {title: '捆绑促销', id: '4-1-3'},
                {title: '团购管理', id: '4-1-4'},
                {title: '限时抢购', id: '4-1-5'}
              ]
            },
            {
              title: '代金券管理',
              id: '4-2',
              child: [
                {title: '代金券模板', id: '4-2-1'},
                {title: '代金券管理', id: '4-2-2'}
              ]
            }
          ]
        },
        {
          title: '统计报表',
          id: '5',
          child: [
            {
              title: '销售统计',
              id: '5-1',
              child: [
                {title: '订单统计', id: '5-1-1'},
                {title: '热销统计', id: '5-1-2'},
                {title: '地区统计', id: '5-1-3'}
              ]
            },
            {
              title: '客户统计',
              id: '5-2',
              child: [
                {title: '会员分布统计', id: '5-2-1'}
              ]
            }
          ]
        },
        {
          title: '内容管理',
          id: '6',
          child: [
            {
              title: '文章管理',
              id: '6-1',
              child: [
                {title: '全部文章', id: '6-1-1'},
                {title: '分类管理', id: '6-1-2'}
              ]
            },
            {
              title: '帮助中心',
              id: '6-2',
              child: [
                {title: '全部帮助', id: '6-2-1'},
                {title: '帮助分类管理', id: '6-2-2'}
              ]
            },
            {
              title: '内容管理',
              id: '6-3',
              child: [
                {title: '广告管理', id: '6-3-1'},
                {title: '标签管理', id: '6-3-2'},
                {title: '导航管理', id: '6-3-3'}
              ]
            }
          ]
        },
        {
          title: 'APP管理',
          id: '7',
          child: [
            {
              title: '版本更新',
              id: '7-1',
              child: [
                {title: '安卓App管理', id: '7-1-1'}
              ]
            }
          ]
        },
        {
          title: '系统设置',
          id: '8',
          child: [
            {
              title: '参数设定',
              id: '8-1',
              child: [
                {title: '管理首页', id: '8-1-1'},
                {title: '站点设置', id: '8-1-2'},
                {title: '参数设置', id: '8-1-3'},
                {title: '邮箱配置', id: '8-1-4'}
              ]
            },
            {
              title: '支付与配送',
              id: '8-2',
              child: [
                {title: '支付方式', id: '8-2-1'},
                {title: '区域划分', id: '8-2-2'},
                {title: '地区管理', id: '8-2-3'},
                {title: '快递公司', id: '8-2-4'}
              ]
            },
            {
              title: '安全管理',
              id: '8-3',
              child: [
                {title: '管理员', id: '8-3-1'},
                {title: '角色管理', id: '8-3-2'},
                {title: '权限列表', id: '8-3-3'},
                {title: '操作日志', id: '8-3-4'},
                {title: '清除缓存', id: '8-3-5'}
              ]
            },
            {
              title: '数据库管理',
              id: '8-4',
              child: [
                {title: '数据库备份', id: '8-4-1'},
                {title: '数据库还原', id: '8-4-2'}
              ]
            }
          ]
        }
      ],
      leave2: [],
      leave3: []
    }
  },
  mounted () {
    // 默认菜单
    this.to_leave2('1')
  },
  methods: {
//    点击一级菜单分配二、三级菜单
    to_leave2 (id) {
      this.navs.forEach(item => {
        if (item.id === id) {
          this.leave2 = item.child
          this.leave3 = item.child[0].child
        }
      })
    },
//      点击二级菜单分配三级菜单
    to_leave3 (id) {
      this.leave2.forEach(item => {
        if (item.id === id) {
          this.leave3 = item.child
        }
      })
    }
  }
}

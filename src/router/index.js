import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      component: resolve => require(['../components/common/home.vue'], resolve),
      children: [
        {
          path: '/',
          redirect: '/index'
        },
        {
          path: '/goods-list',
          name: '1-1-1',
          component: resolve => require(['../components/page/goods-list.vue'], resolve)
        },
        {
          path: '/goods-classification',
          name: '1-2-1',
          component: resolve => require(['../components/page/goods-classification.vue'], resolve)
        },
        {
          path: '/goods-type',
          name: '1-2-2',
          component: resolve => require(['../components/page/goods-type.vue'], resolve)
        },
        {
          path: '/goods-spec',
          name: '1-2-3',
          component: resolve => require(['../components/page/goods-spec.vue'], resolve)
        },
        {
          path: '/goods-brand',
          name: '1-2-4',
          component: resolve => require(['../components/page/goods-brand.vue'], resolve)
        },
        {
          path: '/order-list',
          name: '2-1-1',
          component: resolve => require(['../components/page/order-list.vue'], resolve)
        },
        {
          path: '/order-recycle-bin',
          name: '2-1-2',
          component: resolve => require(['../components/page/order-recycle-bin.vue'], resolve)
        },
        {
          path: '/order-receipt',
          name: '2-2-1',
          component: resolve => require(['../components/page/order-receipt.vue'], resolve)
        },
        {
          path: '/order-invoice',
          name: '2-2-2',
          component: resolve => require(['../components/page/order-invoice.vue'], resolve)
        },
        {
          path: '/order-refund',
          name: '2-2-3',
          component: resolve => require(['../components/page/order-refund.vue'], resolve)
        },
        {
          path: '/order-return',
          name: '2-2-4',
          component: resolve => require(['../components/page/order-return.vue'], resolve)
        },
        {
          path: '/member-list',
          name: '3-1-1',
          component: resolve => require(['../components/page/member-list.vue'], resolve)
        },
        {
          path: '/member-level',
          name: '3-1-2',
          component: resolve => require(['../components/page/member-level.vue'], resolve)
        },
        {
          path: '/member-return',
          name: '3-1-3',
          component: resolve => require(['../components/page/member-return.vue'], resolve)
        },
        {
          path: '/withdrawals',
          name: '3-2-1',
          component: resolve => require(['../components/page/withdrawals.vue'], resolve)
        },
        {
          path: '/balance-log',
          name: '3-2-2',
          component: resolve => require(['../components/page/balance-log.vue'], resolve)
        },
        {
          path: '/point-log',
          name: '3-2-3',
          component: resolve => require(['../components/page/point-log.vue'], resolve)
        },
        {
          path: '/goods-evaluate',
          name: '3-3-1',
          component: resolve => require(['../components/page/goods-evaluate.vue'], resolve)
        },
        {
          path: '/goods-consult',
          name: '3-3-2',
          component: resolve => require(['../components/page/goods-consult.vue'], resolve)
        },
        {
          path: '/message',
          name: '3-3-3',
          component: resolve => require(['../components/page/message.vue'], resolve)
        },
        {
          path: '/sales-promotion',
          name: '4-1-1',
          component: resolve => require(['../components/page/sales-promotion.vue'], resolve)
        },
        {
          path: '/sales-order',
          name: '4-1-2',
          component: resolve => require(['../components/page/sales-order.vue'], resolve)
        },
        {
          path: '/sales-bundles',
          name: '4-1-3',
          component: resolve => require(['../components/page/sales-bundles.vue'], resolve)
        },
        {
          path: '/sales-group',
          name: '4-1-4',
          component: resolve => require(['../components/page/sales-group.vue'], resolve)
        },
        {
          path: '/sales-flash',
          name: '4-1-5',
          component: resolve => require(['../components/page/sales-flash.vue'], resolve)
        },
        {
          path: '/voucher-template',
          name: '4-2-1',
          component: resolve => require(['../components/page/voucher-template.vue'], resolve)
        },
        {
          path: '/voucher-adm',
          name: '4-2-2',
          component: resolve => require(['../components/page/voucher-adm.vue'], resolve)
        },
        {
          path: '/report-forms-order',
          name: '5-1-1',
          component: resolve => require(['../components/page/report-forms-order.vue'], resolve)
        },
        {
          path: '/report-forms-selling',
          name: '5-1-2',
          component: resolve => require(['../components/page/report-forms-selling.vue'], resolve)
        },
        {
          path: '/report-forms-area',
          name: '5-1-3',
          component: resolve => require(['../components/page/report-forms-area.vue'], resolve)
        },
        {
          path: '/report-forms-member',
          name: '5-2-1',
          component: resolve => require(['../components/page/report-forms-member.vue'], resolve)
        },
        {
          path: '/report-forms-reg',
          name: '5-2-2',
          component: resolve => require(['../components/page/report-forms-reg.vue'], resolve)
        },
        {
          path: '/cms-article',
          name: '6-1-1',
          component: resolve => require(['../components/page/cms-article.vue'], resolve)
        },
        {
          path: '/cms-article-fl',
          name: '6-1-2',
          component: resolve => require(['../components/page/cms-article-fl.vue'], resolve)
        },
        {
          path: '/cms-ad-list',
          name: '6-3-1',
          component: resolve => require(['../components/page/cms-ad-list.vue'], resolve)
        },
        {
          path: '/cms-adsense',
          name: '6-3-2',
          component: resolve => require(['../components/page/cms-adsense.vue'], resolve)
        },
        {
          path: '/floor-ad',
            name: '6-3-5',
          component: resolve => require(['../components/page/floor-ad.vue'], resolve)
        },
        {
          path: '/cms-tag',
          name: '6-3-3',
          component: resolve => require(['../components/page/cms-tag.vue'], resolve)
        },
        {
          path: '/cms-nav',
          name: '6-3-4',
          component: resolve => require(['../components/page/cms-nav.vue'], resolve)
        },
        {
          path: '/app-edition',
          name: '7-1-1',
          component: resolve => require(['../components/page/app-edition.vue'], resolve)
        },
        {
          path: '/index',
          name: '8-1-1',
          component: resolve => require(['../components/page/index.vue'], resolve)
        },
        {
          path: '/system-site',
          name: '8-1-2',
          component: resolve => require(['../components/page/system-site.vue'], resolve)
        },
        {
          path: '/system-parameter',
          name: '8-1-3',
          component: resolve => require(['../components/page/system-parameter.vue'], resolve)
        },
        {
          path: '/system-smsAndEmail',
          name: '8-1-4',
          component: resolve => require(['../components/page/system-smsAndEmail.vue'], resolve)
        },
        {
          path: '/system-thirdLogin',
          name: '8-1-5',
          component: resolve => require(['../components/page/system-thirdLogin.vue'], resolve)
        },
        {
          path: '/system-alipay',
          name: '8-1-6',
          component: resolve => require(['../components/page/system-alipay.vue'], resolve)
        },
        {
          path: '/system-wechat',
          name: '8-1-7',
          component: resolve => require(['../components/page/system-wechat.vue'], resolve)
        },
        {
          path: '/system-switch',
          name: '8-1-8',
          component: resolve => require(['../components/page/system-switch.vue'], resolve)
        },
        {
          path: '/system-qiniu',
          name: '8-1-9',
          component: resolve => require(['../components/page/system-qiniu.vue'], resolve)
        },
        {
          path: '/system-payment',
          name: '8-2-1',
          component: resolve => require(['../components/page/system-payment.vue'], resolve)
        },
        {
          path: '/system-freight',
          name: '8-2-2',
          component: resolve => require(['../components/page/system-freight.vue'], resolve)
        },
        {
          path: '/system-region',
          name: '8-2-3',
          component: resolve => require(['../components/page/system-region.vue'], resolve)
        },
        {
          path: '/system-express',
          name: '8-2-4',
          component: resolve => require(['../components/page/system-express.vue'], resolve)
        },
        {
          path: '/admin',
          name: '8-3-1',
          component: resolve => require(['../components/page/admin.vue'], resolve)
        },
        {
          path: '/role-administrate',
          name: '8-3-2',
          component: resolve => require(['../components/page/role-administrate.vue'], resolve)
        },
        {
          path: '/power-list',
          name: '8-3-3',
          component: resolve => require(['../components/page/power-list.vue'], resolve)
        },
        {
          path: '/oplog',
          name: '8-3-4',
          component: resolve => require(['../components/page/oplog.vue'], resolve)
        },
        {
          path: '/system-sql-backups',
          name: '8-4-1',
          component: resolve => require(['../components/page/system-sql-backups.vue'], resolve)
        },
        {
          path: '/system-sql-restore',
          name: '8-4-2',
          component: resolve => require(['../components/page/system-sql-restore.vue'], resolve)
        }

      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    }
  ]
})

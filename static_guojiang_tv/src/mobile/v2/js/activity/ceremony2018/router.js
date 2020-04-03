import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [{
        // 预告
        path: '/preState',
        components: {
            mviewer: r => require.ensure([], () => r(require('./page/preState/index').mviewer), 'preState'),
            layer: r => require.ensure([], () => r(require('./page/preState/index').layer), 'preState'),
            floater: r => require.ensure([], () => r(require('./page/preState/index').floater), 'preState')
        }
    }, {
        // 预选赛
        path: '/qualifier',
        components: {
            mviewer: r => require.ensure([], () => r(require('./page/qualifier/index').mviewer), 'qualifier'),
            layer: r => require.ensure([], () => r(require('./page/qualifier/index').layer), 'qualifier'),
            floater: r => require.ensure([], () => r(require('./page/qualifier/index').floater), 'qualifier')
        }
    }, {
        // 单项赛报名
        path: '/singleSign',
        components: {
            mviewer: r => require.ensure([], () => r(require('./page/singleSign/index').mviewer), 'singleSign'),
            layer: r => require.ensure([], () => r(require('./page/singleSign/index').layer), 'singleSign')
            // floater: r => require.ensure([], () => r(require('./page/singleSign/index').floater), 'singleSign')
        }
    }, {
        // 单项赛
        path: '/single',
        components: {
            mviewer: r => require.ensure([], () => r(require('./page/single/index').mviewer), 'single'),
            layer: r => require.ensure([], () => r(require('./page/single/index').layer), 'single')
        }
    }, {
        // 冠军赛
        path: '/final',
        components: {
            mviewer: r => require.ensure([], () => r(require('./page/final/index').mviewer), 'final'),
            layer: r => require.ensure([], () => r(require('./page/final/index').layer), 'final')
        }
    }]
})

export default router

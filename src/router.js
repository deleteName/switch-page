import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const routes = [
    {
        path: "/",
        component: () => import('@/demo/page_1'),
        children: [
            {
                path: '/',
                name: 'page_1_1',
                component: () => import('@/demo/page_1/page_1_1'),
            },
            {
                path: '/page_1_2',
                name: 'page_1_2',
                component: () => import('@/demo/page_1/page_1_2'),
            }
        ]
    },
    {
        path: "/page_2",
        component: () => import('@/demo/page_2'),
        children: [
            {
                path: '/',
                name: 'page_2_1',
                component: () => import('@/demo/page_2/page_2_1'),
            },
            {
                path: '/page_2_2',
                name: 'page_2_2',
                component: () => import('@/demo/page_2/page_2_2'),
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router

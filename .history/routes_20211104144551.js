// /为根路由，@代表 pages目录

export default [
    {
        path: '/', component: '@/layouts/index', routes: [
            {path:"/login",component: '@/pages/login'}
        ]
    },
]
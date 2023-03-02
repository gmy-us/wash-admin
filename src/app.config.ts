export default defineAppConfig({
    pages: [
        'pages/index/index',
        'pages/me/index',
        'pages/login/index',
        'pages/agree/privacyPolicy/index',
        'pages/agree/serviceAgreement/index',
        'pages/carousel/index',
        'pages/shop/index',
        'pages/station/index',
        'pages/shop/admin/index'
    ],
    window: {
        backgroundTextStyle: 'light',
        navigationBarBackgroundColor: '#fff',
        navigationBarTitleText: '速点星',
        navigationBarTextStyle: 'black'
    },
    requiredPrivateInfos: ['chooseLocation'],
    permission: {},
    tabBar: {
        list: [
            {pagePath: 'pages/index/index', text: '门店'},
            {pagePath: 'pages/me/index', text: '我的'},
        ]
    }
})

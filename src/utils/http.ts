import Taro from "@tarojs/taro";
import {BaseRes} from "types/res";


let wxCloud: Taro.Cloud
const env = Taro.getEnv()

const resourceEnv = 'prod-6gmdcvioff287f59'
const resourceAppid = "wx75719b561e6d34e3"

async function call<T>(path: string, method: 'GET' | 'POST' | 'OPTIONS' | 'HEAD' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT' = 'GET', param?, retryCount: number = 1): Promise<T | undefined> {
    if (path !== 'auth') {
        const user = Taro.getStorageSync("user")
        if (!user) {
            Taro.hideLoading()
            Taro.showModal({
                title: '请先登录',
                showCancel: false,
                confirmText:'去登录'
            }).then(() => {
                Taro.navigateTo({url: '/pages/login/index'})
            })
            return
        }

    }
    if (env === Taro.ENV_TYPE.WEAPP) {
        if (!wxCloud) {

            wxCloud = new Taro.cloud.Cloud({
                resourceEnv,
                resourceAppid
            })
            await wxCloud.init()
        }


        try {
            const result = await wxCloud.callContainer<BaseRes<T>>({
                path: `/admin/${path}`,
                method,
                header: {
                    'X-WX-SERVICE': getServiceName(),
                    'APP-CLIENT': 'admin',
                    'CLIENT-TYPE': Taro.getEnv(),
                    'X-CLIENT-ENV': Taro.getAccountInfoSync().miniProgram.envVersion,
                    'USER-ID': Taro.getStorageSync('user').id
                },
                data: param
            })
            if (result.statusCode !== 200) {
                Taro.showToast({
                    title: '网络异常',
                    icon: 'error',
                    mask: true
                })
                Taro.hideLoading()
            }
            const {data} = result
            Taro.hideLoading()
            if (!data.success) {
                Taro.showToast({
                    title: data.tips || data.message || '网络异常',
                    icon: 'error',
                    mask: true
                })
                return
            }
            return data.result
        } catch (e) {
            const error = e.toString()
            Taro.showToast({
                title: '网络异常',
                icon: 'error',
                mask: true
            })
            if (error.indexOf("Cloud API isn't enabled") != -1 && retryCount < 3) {
                return new Promise((resolve) => {
                    setTimeout(function () {
                        resolve(call(path, method, param, retryCount + 1))
                    }, 300)
                })
            } else {
                throw new Error(`微信云托管调用失败${error}`)

            }
        }
    } else if (env === Taro.ENV_TYPE.ALIPAY) {
        try {
            const result = await Taro.request<BaseRes<T>>({
                url: `${getEnvDomain()}/admin/${path}`,
                method,
                header: {
                    'CLIENT-TYPE': Taro.getEnv(),
                    'APP-CLIENT': 'admin',
                    'USER-ID': Taro.getStorageSync('user').id
                },
                data: param
            })
            if (result.statusCode !== 200) {
                Taro.showToast({
                    title: '网络异常',
                    icon: 'error',
                    mask: true
                })
            }
            const {data} = result
            Taro.hideLoading()
            if (!data.success) {
                Taro.showToast({
                    title: data.tips || data.message || '网络异常',
                    icon: 'error',
                    mask: true
                })

            }
            return data.result
        } catch (e) {
            const error = e.toString()
            Taro.showToast({
                title: '网络异常',
                icon: 'error',
                mask: true
            })
            if (error.indexOf("Cloud API isn't enabled") != -1 && retryCount < 3) {
                return new Promise((resolve) => {
                    setTimeout(function () {
                        resolve(call(path, method, param, retryCount + 1))
                    }, 300)
                })
            } else {
                throw new Error(`服务端调用失败${error}`)

            }
        }
    }
}

function getServiceName() {
    switch (Taro.getAccountInfoSync().miniProgram.envVersion) {
        case 'develop':
            return 'wash'
        // return 'wash-dev'
        case 'trial':
            return 'wash-dev'
        case 'release':
            return 'wash'
    }
}

function getEnvDomain() {
    switch (Taro.getAccountInfoSync().miniProgram.envVersion) {
        case 'develop':
            return 'http://192.168.50.237'
        // return 'https://wash-dev-1765919-1310651218.ap-shanghai.run.tcloudbase.com'
        case 'trial':
            return 'https://wash-dev-1765919-1310651218.ap-shanghai.run.tcloudbase.com'
        case 'release':
            return 'https://wash-dev-1765919-1310651218.ap-shanghai.run.tcloudbase.com'
    }
}

async function uploadFile(cloudPath: string, filePath: string) {
    if (!wxCloud) {

        wxCloud = new Taro.cloud.Cloud({
            resourceEnv,
            resourceAppid
        })
        await wxCloud.init()
    }
    const res = await wxCloud.uploadFile({
        cloudPath: cloudPath,
        filePath: filePath,
    })
    if (res) {
        return res.fileID
    } else {
        Taro.showToast({
            title: '上传失败',
            icon: 'error',
            mask: true
        })
    }
}

async function deleteFile(cloudPath: string) {
    if (!wxCloud) {

        wxCloud = new Taro.cloud.Cloud({
            resourceEnv,
            resourceAppid
        })
        await wxCloud.init()
    }
    const res = await wxCloud.deleteFile({
        fileList: [cloudPath]
    })
    if (res) {
        return res.fileList
    } else {
        Taro.showToast({
            title: '删除失败',
            icon: 'error',
            mask: true
        })
    }
}

export {call, uploadFile, deleteFile}
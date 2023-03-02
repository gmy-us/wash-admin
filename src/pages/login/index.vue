<template>
  <div class="title">
    <div>欢迎使用</div>
    <div class="brand">速点星</div>
  </div>
  <div class="desc">立即登录，享受优质服务</div>
  <div class="bg1"></div>
  <div class="bg2"></div>
  <nut-button @click="showAgree" class="login" size="large" color="#32C56A" v-if="env === 'WEAPP'">微信用户一键登录

    <template #icon>
      <IconFont font-class-name="iconfont" class-prefix="icon" size="20" name="wechat-fill"/>
    </template>
  </nut-button>
  <nut-button @click="showAgree" class="login" size="large" color="#029FE9" v-if="env === 'ALIPAY'">支付宝用户一键登录
    <template #icon>
      <IconFont font-class-name="iconfont" class-prefix="icon" size="20" name="alipay"/>
    </template>
  </nut-button>
  <nut-popup v-model:visible='agreeShow' round position="bottom" safe-area-inset-bottom>
    <div class="agree">
      <div class="agree-title">服务条款及隐私政策</div>
      <div class="agree-one">
        在您注册成为速点星24h共享自助洗车会员的过程中，您需要以通过点击同意的形式在线签署
        <text style="font-weight: 500;">《速点星24h共享自助洗车服务条款》</text>
        、
        <text
            style="font-weight: 500;">《速点星24h共享自助洗车隐私政策》
        </text>
        ，请您务必仔细阅读、充分理解条款内容后再点击同意（尤其是以粗体并下划线标识的条款，因为这些条款可能会明确您应履行的义务或对您的权利有所限制）。
      </div>
      <div class="agree-one">
        请您注意：如果您不同意上述服务条款、隐私政策或其中任何约定，请您停止注册。如您阅读并点击同意即表示您已充分阅读、理解并接受其全部内容，并表明您也同意速点星24h共享自助洗车可以依据以上条款及政策来处理您的个人信息。如您对以上服务条款、隐私政策有任何疑问，您可联系速点星24h共享自助洗车客服。
      </div>
      <div class="agree-bottom">点击同意即表示您已阅读并同意
        <text class="agree-text"
              @tap="toServiceAgreement">速点星24h共享自助洗车服务条款
        </text>
        与
        <text @tap="toPrivacyPolicy"
              class="agree-text">速点星24h共享自助洗车隐私政策
        </text>
      </div>

      <div class="agree-btn">
        <nut-button type="info" block style="width: 45%;" plain @click="disagree">不同意</nut-button>
        <nut-button v-if="env === 'WEAPP'" type="info" block style="width: 45%;" open-type="getPhoneNumber"
                    @getphonenumber="login">同意
        </nut-button>
        <nut-button v-if="env === 'ALIPAY'" type="info" block style="width: 45%;" open-type="getAuthorize"
                    scope="phoneNumber" @error="onGetPhoneError" @getauthorize="login">同意
        </nut-button>
      </div>
    </div>
  </nut-popup>
</template>

<script lang="ts" setup>
import Taro from "@tarojs/taro";
import {IconFont} from "@nutui/icons-vue-taro";
import {ref} from "vue";
import {showLoading} from "../../utils/util";
import {loginApi} from "../../api/auth";
import User from "types/User";

const env = Taro.getEnv()
const agreeShow = ref(false)
const showAgree = () => {
  agreeShow.value = true
}
const user = ref<User>()

const toServiceAgreement = () => {
  Taro.navigateTo({
    url: '/pages/agree/serviceAgreement/index'
  })
}
const disagree = () => {
  agreeShow.value = false
}
const toPrivacyPolicy = () => {
  Taro.navigateTo({
    url: '/pages/agree/privacyPolicy/index'
  })
}
const login = async ({detail}) => {
  switch (env) {
    case Taro.ENV_TYPE.WEAPP:
      if (!detail.cloudID) {
        handleAuthError()
      }
      showLoading('登录中')
      const loginRes = await loginApi({cloudId: detail.cloudID})
      if (loginRes) {
        user.value = loginRes
        Taro.setStorageSync('user', loginRes)
        agreeShow.value = false
        Taro.navigateBack()
      }
      break
    case Taro.ENV_TYPE.ALIPAY:

      // @ts-ignore
      await my.getPhoneNumber({

        success: async res => {
          Taro.showLoading({title: '登录中'})
          const loginRes = await loginApi({response: JSON.parse(res.response).response})
          if (loginRes) {
            Taro.setStorageSync('user', loginRes)
            user.value = loginRes
            agreeShow.value = false
            Taro.reLaunch({url: '/pages/index/index'})
          }
        }
      })
  }
}
const handleAuthError = () => {
  agreeShow.value = false
  Taro.showModal({
    title: '温馨提示',
    content: '您拒绝授权手机号，只能使用我们为您提供的部分服务，为保证您的完整体验，请您授权手机号',
    showCancel: false
  })
  return
}
const onGetPhoneError = () => {
  handleAuthError()
}
</script>

<style lang="less">
page {
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

}

.brand {
  margin-left: 20rpx;
}

.bottom {
  position: fixed;
  bottom: 0rpx;
  left: 0rpx;
  z-index: 888;
  width: 100%;
  display: flex;
  flex-direction: row;
  padding-bottom: env(safe-area-inset-bottom);
  height: var(--nut-tabbar-height, 100rpx);

  .policy {
    display: flex;
    flex-direction: row;
  }
}

.agree {
  .agree-text {
    color: rgb(73, 101, 242);
    margin-left: 10rpx;
    margin-right: 10rpx;
  }

  width: 94%;
  margin: 20rpx auto;

  .agree-title {
    font-size: 40rpx;
    font-weight: 500;
  }

  .agree-one {
    margin-top: 40rpx;
  }

  .agree-bottom {
    width: 92%;
    margin: 60rpx auto 10rpx;
  }

  .agree-btn {
    display: flex;

    justify-content: space-around;
  }
}

.bg1 {
  background-image: url('../../assets/images/logo.png');
  background-repeat: no-repeat;
  background-position: center 35%;
  position: absolute;
  background-size: 520rpx auto;
  width: 500rpx;
  height: 600rpx;
  opacity: 0.25;
  left: -220rpx;
  bottom: 400rpx;
}

.bg2 {
  background-image: url('../../assets/images/logo.png');
  background-repeat: no-repeat;
  background-position: center 35%;
  position: absolute;
  background-size: 300rpx auto;
  width: 500rpx;
  height: 600rpx;
  opacity: 0.1;
  right: -269rpx;
  top: -10rpx;
}

.desc {
  font-size: 34rpx;
  color: #999999;
  margin-top: 30rpx;

}

.login {
  margin-top: 400rpx;
}

.title {
  font-size: 60rpx;
  display: flex;
  margin-top: 40rpx;
}

.nut-tabbar {
  border-top: 0rpx;
}

.transfer-popup {

  .nut-popup {
    width: 92%;

  }

  .title {
    font-size: 30rpx;
    margin: 20rpx auto;
    width: 90%;
  }
}
</style>

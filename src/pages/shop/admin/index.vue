<template>
  <nut-searchbar v-model="userPageParam.keywords" @search="reload" @clear="reload" input-align="center"
                 confirm-type="search" placeholder="输入电话、昵称、姓名查找"></nut-searchbar>
  <nut-cell @click="setAdmin(user)" center v-for="user in users" :desc="user.nickname||user.name||user.phone||user.id"
            is-link>
    <template v-if="user.avatar" #icon>
      <nut-avatar size="normal">
        <img :src="getCos(user.avatar)"/>
      </nut-avatar>
    </template>
    <template v-else #icon>
      <nut-avatar size="normal">
        <My/>
      </nut-avatar>
    </template>
  </nut-cell>
</template>

<script lang="ts" setup>
import {My} from '@nutui/icons-vue-taro';
import Taro, {useReachBottom} from "@tarojs/taro";
import {onMounted, ref} from "vue";
import User from "types/User";
import {merchantApi} from "../../../api/user";
import {showLoading, getCos} from "../../../utils/util";
import {setAdminApi} from "../../../api/shop";

const userShopType = ref('')
const userShopId = ref('')
const userShopForm = ref<{ userId?: string, shopId?: string, type?: string }>({})
const setAdmin = (user: User) => {
  if (userShopType.value === "STORE_MANAGER") {

    Taro.showModal({
      title: '温馨提示',
      content: '您正在设置店长，该操作会清除之前的店长，是否继续？',
      confirmText: '继续',
    }).then(async res => {
      if (res.confirm) {
        showLoading("设置中")
        userShopForm.value.shopId = userShopId.value
        userShopForm.value.userId = user.id
        userShopForm.value.type = userShopType.value
        const res = await setAdminApi(userShopForm.value)
        if (res) {
          Taro.eventCenter.trigger("updateAdmin")
          Taro.navigateBack()
        }
      }
    })
  } else if (userShopType.value === "ADMIN") {
    Taro.showModal({
      title: '温馨提示',
      content: '您正在设置管理员，该操作会清除之前的信息，是否继续？',
      confirmText: '继续',
    }).then(async res => {
      if (res.confirm) {
        showLoading("设置中")
        userShopForm.value.shopId = userShopId.value
        userShopForm.value.userId = user.id
        userShopForm.value.type = userShopType.value
        const res = await setAdminApi(userShopForm.value)
        if (res) {
          Taro.eventCenter.trigger("updateAdmin")
          Taro.navigateBack()
        }
      }
    })
  }

}
onMounted(async () => {
  const type = Taro.getCurrentInstance().router?.params.type
  userShopType.value = type
  const shopId = Taro.getCurrentInstance().router?.params.shopId
  userShopId.value = shopId
  await initUser()
})
const userPageParam = ref<User>({current: 1, size: 16})
const users = ref<User[]>([])
const hasNext = ref(false)
const initUser = async () => {
  showLoading()
  const res = await merchantApi(userShopId.value, userPageParam.value)
  if (res) {
    hasNext.value = res.hasNext
    users.value = users.value.concat(res.list)
  }
}
const reload = async () => {
  userPageParam.value.current = 1
  users.value = []
  await initUser()
}
useReachBottom(async () => {
  if (hasNext.value) {
    userPageParam.value.current += 1
    await initUser()
  }
})
</script>

<style lang="less">

</style>
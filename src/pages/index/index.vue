<template>
  <div class="condition">
    <div class="search">

      <nut-searchbar v-model="shopPageParam.keywords" @search="reloadShop" placeholder="输入门店名称查找门店"
                     @clear="reloadShop"
                     confirm-type="search">
        <template #leftin>
          <IconFont name="search"></IconFont>
        </template>
      </nut-searchbar>
      <nut-button @click="addShop" size="small" type="info">
        <template #icon>
          <IconFont name="uploader"></IconFont>
        </template>
        新增门店
      </nut-button>

    </div>
    <div>
      <nut-menu>
        <nut-menu-item v-model="shopPageParam.type" @change="reloadShop" :options="shopTypeOptions"/>
        <nut-menu-item v-model="shopPageParam.status" @change="reloadShop" :options="shopStatusOptions"/>
      </nut-menu>
    </div>
  </div>


  <div class="shop" v-for="shop in shops">
    <div class="logo" @click="toShop(shop.id)">
      <image
          :src="getCos(shop.logo||'cloud://prod-6gmdcvioff287f59.7072-prod-6gmdcvioff287f59-1310651218/shop/装修中.jpg')"></image>
    </div>
    <div class="info" @click="toShop(shop.id)">
      <div class="name">
        {{ shop.name }}
      </div>
      <div class="address">
        {{ shop.address }}
      </div>
      <div class="tag">
        <nut-tag style="font-weight: 500" v-if="shop.type==='STAR_STORE'" text-color="#B24000" color="#FCCDA2">明星门店
        </nut-tag>
        <nut-tag type="primary" v-for="tag in shop.tags">{{ tag.content }}</nut-tag>
      </div>
      <div class="price">
        <div class="start">
          <nut-price :price="shop.startingPrice" symbol="元" position="after" size="small"></nut-price>
          /{{ shop.startTime }}分钟
        </div>
        <div class="overtime">
          <nut-price :price="shop.overtimeUnitPrice" symbol="元" position="after" size="small"></nut-price>
          /分钟
        </div>
      </div>
    </div>
    <div class="right">

      <div class="station" @click="toShop(shop.id)">
        <nut-tag v-for="station in shop.stations" :type=getStationTagType(station)>
          {{ `${station.number}号工位` }}
        </nut-tag>
      </div>
      <div class="operating">
        <nut-button type="info" size="mini" @click="setStatus(shop)">{{
            getShopStatusName(shop.status)
          }}
        </nut-button>
        <!--        <nut-button type="danger" size="mini" @click="remove(shop.id)">删除</nut-button>-->
      </div>
    </div>
  </div>
  <nut-divider v-if="!hasNext">到底了～</nut-divider>

</template>

<script lang="ts" setup>
import {IconFont} from '@nutui/icons-vue-taro';
import Shop from 'types/Shop'
import {onMounted, ref} from "vue";
import Taro, {usePullDownRefresh, useDidShow, useReachBottom} from "@tarojs/taro";
import {MenuItemOption} from "@nutui/nutui-taro/dist/types/__VUE/menuitem/type";
import {removeShopApi, shopPageApi, updateShopStatusApi} from "../../api/shop";
import {getCos, showLoading} from "../../utils/util";
import Station from "types/Station";

const hasNext = ref(false)
useReachBottom(async () => {
  if (hasNext.value) {
    shopPageParam.value.current += 1
    await initShop()
  }
})
const setStatus = (shop: Shop) => {
  switch (shop.status) {
    case "DECORATION":
      Taro.showModal({
        title: '温馨提示',
        content: '店铺状态将更改为营业中，是否继续?',
        confirmText: '改为营业'
      }).then(async res => {
        if (res.confirm && shop.id) {
          showLoading()
          const res = await updateShopStatusApi(shop.id, "IN_OPERATION")
          if (res) {
            Taro.showToast({
              title: '修改成功', icon: 'success'
            }).then(() => {
              setTimeout(async () => {
                await reloadShop()
              }, 100)
            })
          }
        }
      })
      break
    case "IN_OPERATION":
      Taro.showModal({
        title: '温馨提示',
        content: '店铺状态将更改为装修中，是否继续?',
        confirmText: '改为装修'
      }).then(async res => {
        if (res.confirm && shop.id) {
          showLoading()
          const res = await updateShopStatusApi(shop.id, "DECORATION")
          if (res) {
            Taro.showToast({
              title: '修改成功', icon: 'success'
            }).then(() => {
              setTimeout(async () => {
                await reloadShop()
              }, 100)
            })
          }
        }
      })
      break
  }
}
useDidShow(async () => {
  const user = Taro.getStorageSync('user')
  if (user) {
    await reloadShop()
  }
})
const remove = (id: string) => {
  Taro.showModal({
    title: '温馨提示',
    content: '你正在进行删除门店操作，删除后将清空该门店的所有信息，是否删除',
    confirmText: '删除',
    confirmColor: '#FA2C19'
  }).then(async res => {
    if (res.confirm) {
      showLoading()
      const res = await removeShopApi(id)
      if (res) {
        Taro.showToast({
          title: '删除成功'
        })
        setTimeout(async () => {
          await reloadShop()
        }, 1000)
      }
    }
  })
}
const shopPageParam = ref<Shop>({type: 'STAR_STORE', status: "IN_OPERATION", current: 1, size: 5})
const shopTypeOptions = ref<MenuItemOption[]>([{text: '明星门店', value: "STAR_STORE"}, {
  text: '其他门店',
  value: "NON_STAR_STORES"
}])
const shopStatusOptions = ref<MenuItemOption[]>([{text: '营业中', value: "IN_OPERATION"}, {
  text: '装修中',
  value: "DECORATION"
},])
const shops = ref<Shop[]>([])
const addShop = () => {
  Taro.navigateTo({
    url: '/pages/shop/index'
  })
}
const toShop = (id: string) => {
  Taro.navigateTo({
    url: `/pages/shop/index?id=${id}`
  })
}
const getShopStatusName = (status: string) => {
  switch (status) {
    case "DECORATION":
      return "装修中"
    case "IN_OPERATION":
      return "营业中"
  }
}
const getStationTagType = (station: Station) => {
  switch (station.status) {
    case "IDLE":
      return "success"
    case "CAR_WASH":
    case "MANUAL_CAR_WASH":
      return "warning"
    case "MAINTAIN":
      return 'danger'
  }
}
onMounted(() => {
  const user = Taro.getStorageSync("user")
  if (!user) {
    Taro.hideLoading()
    Taro.showModal({
      title: '请先登录',
      showCancel: false,
      confirmText: '去登录'
    }).then(() => {
      Taro.navigateTo({url: '/pages/login/index'})
    })
    return
  }
})
const reloadShop = async () => {
  shops.value = []
  shopPageParam.value.current = 1
  await initShop()
}
const initShop = async () => {
  showLoading()
  const res = await shopPageApi(shopPageParam.value)
  if (res) {
    shops.value = shops.value.concat(res.list)
    hasNext.value = res.hasNext
  }

}
usePullDownRefresh(async () => {
  await reloadShop()
  Taro.stopPullDownRefresh()
})
</script>

<style lang="less">
.condition {
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF;

  .nut-menu__bar {
    box-shadow: none;

  }

  .search {
    //width: 80%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 0 auto 20rpx;

    .nut-searchbar {
      width: 65%;
      padding: 0;
      margin-right: 14rpx;
    }
  }

  box-shadow: 0 4rpx 24rpx rgba(89, 89, 89, 0.12);
}

page {
  background-color: rgba(246, 247, 250, 0.12);
}

.shop {
  background-color: #FFFFFF;
  box-shadow: 0 4rpx 24rpx rgba(69, 93, 93, 0.12);
  width: 95%;
  margin: 20rpx auto;
  border-radius: 20rpx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-top: 35rpx;
  padding-bottom: 35rpx;
  //padding-left: 30rpx;
  .logo {
    flex-shrink: 0;

    width: 176rpx;
    height: 176rpx;
    margin-left: 30rpx;

    image {
      border-radius: 20rpx;
      width: 100%;
      height: 100%;
    }
  }

  .info {
    width: 320rpx;
    margin-left: 30rpx;

    .name {
      color: #000000;
      font-size: 32rpx;
      font-weight: 500;
    }

    .address {
      color: #84858C;
      font-size: 25rpx;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .tag {
      margin-top: 7rpx;

      .nut-tag {
        margin-right: 10rpx;
      }
    }

    .price {
      margin-top: 10rpx;
      display: flex;

      //align-items: center;
      flex-direction: column;
      font-size: 24rpx;
      color: #fa2c19;
    }


  }


  .right {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding-left: 10rpx;

    .operating {
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      .nut-button {
        margin-top: 10rpx;
      }

    }

    .station {
      display: flex;
      flex-direction: column;


      .nut-tag {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        //width: 100rpx;
        margin-top: 10rpx;
      }
    }
  }
}

.nut-divider::after {
  border: none
}

.nut-divider::before {
  border: none
}

</style>

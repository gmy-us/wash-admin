<template>
  <nut-action-sheet
      v-model:visible="typeSelectShow"
      :menu-items="shopTypeOptions"
      @choose="selectShopType"
  >
  </nut-action-sheet>
  <nut-tabs @change="tabChange" v-model="tabIndex">
    <nut-tab-pane title="基本信息">
      <nut-form :model-value="shopForm" ref="shopFormRef">
        <nut-form-item label="门店logo">

          <nut-uploader v-model:file-list="shopLogoFileList" :multiple="false" :maximum="1" :size-type="['compressed']"
                        :before-xhr-upload="uploadLogo" @delete="removeLogo"></nut-uploader>
        </nut-form-item>
        <nut-form-item label="门店图片">
          <nut-uploader class="pic" v-model:file-list="shopPicFileList" :multiple="false" :maximum="5"
                        :size-type="['compressed']"
                        :before-xhr-upload="uploadPic" @delete="removePic"></nut-uploader>
        </nut-form-item>
        <nut-form-item label="门店名称" prop="name" required :rules="[{ required: true, message: '请填写门店名称' }]">
          <nut-input class="nut-input-text" v-model="shopForm.name" placeholder="请输入门店名称" type="text"/>
        </nut-form-item>
        <nut-form-item label="门店地址" prop="address" required
                       :rules="[{required:true,message:'请点击选择门店地址'}]">
          <nut-textarea @click="openMap" v-model="shopForm.address"
                        placeholder="请点击选择门店地址"/>
        </nut-form-item>
        <nut-form-item label="门店电话" prop="phone" required :rules="[{required:true,message:'请输入门店联系电话'}]">
          <nut-input class="nut-input-text" type="number" v-model="shopForm.phone" placeholder="请输入门店联系电话"/>
        </nut-form-item>
        <nut-form-item label="服务费率" prop="cashWithdrawalServiceFee" required
                       :rules="[{required:true,message:'请输入门店服务费率'}]">
          <div class="withdraw">

            <input type="number" placeholder="请输入门店服务费率" @input="setCashWithdrawalFee"
                   v-model="shopForm.cashWithdrawalServiceFeeLabel"
                   class="nut-input-text"/>
            <nut-radio-group v-model="isPercentage" @change="unitChange">
              <nut-radio shape="button" label="%">%</nut-radio>
              <nut-radio shape="button" label="‰">‰</nut-radio>
            </nut-radio-group>

          </div>
        </nut-form-item>

        <nut-form-item label="门店类型" prop="type" required :rules="[{required:true,message:'请设置门店类型'}]">

          <nut-cell style="padding: 0" is-link @click="showTypeSelect" :desc="getShopType()"></nut-cell>
        </nut-form-item>
        <nut-form-item label="门店押金" prop="deposit">
          <nut-input class="nut-input-text" type="number" placeholder="请输入门店押金,提现时押金无法提出"
                     v-model="shopForm.deposit"></nut-input>
        </nut-form-item>
        <nut-cell>
          <nut-button block type="info" @click="save">保存</nut-button>
        </nut-cell>
      </nut-form>
    </nut-tab-pane>
    <nut-tab-pane class="station-tab" :disabled="!shopForm.id" title="工位">
      <nut-cell class="add" is-link title="添加新工位" @click="toStationAdd(shopForm.id)"></nut-cell>
      <nut-cell-group v-for="station in stations" :title="`${station.number}号工位`">
        <nut-cell title="工位状态" :desc="getStationStatus(station.status)"/>
        <nut-cell title="智能控制盒" :desc="station.boxSerial||'无'"></nut-cell>
        <nut-cell title="入场识别器" :desc="station.inSerial||'无'"/>
        <nut-cell title="出场识别器" :desc="station.outSerial||'无'"/>
        <nut-cell title="水电接口" :desc="station.powerPort?`OUT${station.powerPort}`:'无'"/>
        <nut-cell title="门接口" :desc="station.doorPort?`OUT${station.doorPort}`:'无'"/>
        <nut-cell class="station-opr">
          <nut-button type="info" @click="toStationEdit(station.id)" size="mini">编辑</nut-button>
          <nut-button type="danger" @click="removeStation(station.id)" size="mini">删除</nut-button>
        </nut-cell>
      </nut-cell-group>
    </nut-tab-pane>
    <nut-tab-pane class="station-tab" :disabled="!shopForm.id" title="店长及管理员">
      <nut-cell-group title="店长">
        <nut-cell center v-if="!shopUser.storeManager" is-link desc="添加店长"
                  @click="addShopAdmin('STORE_MANAGER')"></nut-cell>
        <nut-cell @click="addShopAdmin('STORE_MANAGER')"
                  :desc="shopUser.storeManager.nickname||shopUser.storeManager.name||shopUser.storeManager.phone||shopUser.storeManager.id"
                  v-else center is-link>
          <template v-if="shopUser.storeManager.avatar" #icon>
            <nut-avatar size="normal">
              <img :src="getCos(shopUser.storeManager.avatar)"/>
            </nut-avatar>
          </template>
          <template v-else #icon>
            <nut-avatar size="normal">
              <My/>
            </nut-avatar>
          </template>

        </nut-cell>
      </nut-cell-group>
      <nut-cell-group title="管理员">
        <nut-cell center desc="添加管理员" @click="addShopAdmin('ADMIN')" is-link></nut-cell>
        <nut-cell center v-for="user in shopUser.admins" :desc="user.nickname||user.name||user.phone||user.id">
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
          <template #link>
            <nut-button type="danger" style="margin-left: 20rpx" size="mini" @click="removeAdmin(user.id)">删除
            </nut-button>
          </template>
        </nut-cell>
      </nut-cell-group>
    </nut-tab-pane>
    <nut-tab-pane class="station-tab" :disabled="!shopForm.id" title="标签">
      <nut-cell-group class="tag-group" title="已有标签">
        <div>
          <nut-tag v-for=" tag in shopTags.has" closeable @close="removeTag(tag)" type="primary">{{
              tag
            }}
          </nut-tag>
        </div>
      </nut-cell-group>
      <nut-cell-group class="tag-group" title="可选标签">
        <div>
          <nut-tag v-for="tag in shopTags.canUse" @click="addTag(tag)" type="primary">{{ tag }}</nut-tag>
        </div>
        <nut-searchbar v-model="tagValue" @search="addTag" placeholder="自定义标签"></nut-searchbar>
      </nut-cell-group>
    </nut-tab-pane>
    <nut-tab-pane :disabled="!shopForm.id" title="物料下载">
      <nut-cell title="微信小程序出入场码" is-link @click="showWxStationPic"></nut-cell>
      <nut-cell title="支付宝小程序出入场码" is-link @click="showAliPayStationPic"></nut-cell>
    </nut-tab-pane>
  </nut-tabs>
</template>

<script lang="ts" setup>
import Shop from "types/Shop";
import {onMounted, ref, watch} from "vue";
import Taro from "@tarojs/taro";
import {removeAdminApi, removeShopLogoAPi, saveShopApi, shopDetailApi, updateShopLogoApi} from "../../api/shop";
import {getCloudFilePath, showLoading} from "../../utils/util";
import {deleteFile, uploadFile} from "../../utils/http";
import {addStorageApi, removeStorageApi} from "../../api/storage";
import {getCos} from '../../utils/util'
import {multiply} from 'mathjs'
import {removeStationApi, stationPicApi, stationsByShopIdApi} from "../../api/station";
import Station from "types/Station";
import {shopUserApi} from "../../api/user";
import ShopUser from "types/ShopUser";
import {addTagApi, removeTagApi, shopTagApi} from "../../api/shopTag";
import {TagRes} from "types/res";

const tagValue = ref()
const showWxStationPic = () => {
  Taro.showModal({
    content: '请自行保存图片，出入场码的顺序为从小到大排列，从进到出排列（1号工位进1号工位出2号工位进2号工位出，以此类推）',
    confirmText: '知道了'
  }).then(res => {
    if (res.confirm) {

      let urls = [] as string[]
      stationPics.value.forEach(x => {
        urls.push(getCos(x.inPic))
        urls.push(getCos(x.outPic))
      })
      Taro.previewImage({
        urls
      })
    }

  })
}
const showAliPayStationPic = () => {
  Taro.showModal({
    content: '请自行保存图片，出入场码的顺序为从小到大排列，从进到出排列（1号工位进1号工位出2号工位进2号工位出，以此类推）',
    confirmText: '知道了'
  }).then(res => {
    if (res.confirm) {

      let urls = [] as string[]
      stationPics.value.forEach(x => {
        urls.push(getCos(x.aliInPic))
        urls.push(getCos(x.aliOutPic))
      })
      Taro.previewImage({
        urls
      })
    }

  })
}
const removeTag = async (tag: string) => {
  showLoading("删除中")
  const res = await removeTagApi(shopForm.value.id, tag)
  if (res) {
    await initShopTag()
  }
}
const addTag = async (tag: string) => {
  showLoading()
  const res = await addTagApi({shopId: shopForm.value.id, content: tag})
  if (res) {
    await initShopTag()
  }
}
const shopTags = ref<TagRes>({})
const shopUser = ref<ShopUser>({storeManager: {}, admins: []})
const stations = ref<Station[]>([])
const shopLogoFileList = ref<any[]>([])
const shopPicFileList = ref<any[]>([])
const tabIndex = ref('0')
const stationPics = ref<Station[]>([])
Taro.eventCenter.on("updateStationSuccess", async () => {
  await initStation()
})
Taro.eventCenter.on("updateAdmin", async () => {
  await initShopUser()
})
const initShopTag = async () => {
  showLoading("加载中")
  const res = await shopTagApi(shopForm.value.id)
  if (res) {
    shopTags.value = res
  }
}
const toStationEdit = (id: string) => {
  Taro.navigateTo({
    url: `/pages/station/index?id=${id}`
  })
}
const removeAdmin = (id) => {
  Taro.showModal({
    title: '温馨提示',
    content: '即将删除该管理员，是否继续',
    confirmText: '继续删除',
    confirmColor: '#FA2C19',
  }).then(async res => {
    if (res.confirm) {
      showLoading("删除中")
      const res = await removeAdminApi(shopForm.value.id, id)
      if (res) {
        await initShopUser()
      }
    }
  })
}
const addShopAdmin = (type: string | 'STORE_MANAGER' | 'ADMIN') => {
  Taro.navigateTo({
    url: `/pages/shop/admin/index?type=${type}&shopId=${shopForm.value.id}`
  })
}
const toStationAdd = (shopId: string) => {
  Taro.navigateTo({
    url: `/pages/station/index?shopId=${shopId}`
  })

}
const removeStation = async (id: string) => {
  Taro.showModal({
    title: '温馨提示',
    content: '删除工位将清除工位所有配置！',
    confirmColor: '#FA2C19',
    confirmText: '删除'
  }).then(async res => {
    if (res.confirm) {
      showLoading("删除中")
      const res = await removeStationApi(id)
      if (res) {
        await initStation()
      }
    }
  })

}
const getStationStatus = (status: string | 'IDLE' | 'CAR_WASH' | 'MAINTAIN' | 'MANUAL_CAR_WASH' | undefined) => {
  switch (status) {
    case "IDLE":
      return "空闲中"
    case "CAR_WASH":
      return "洗车中"
    case "MANUAL_CAR_WASH":
      return "人工洗车中"
    case "MAINTAIN":
      return "维护中"
  }
}
const tabChange = async (event) => {
  console.log(tabIndex.value)
  console.log(event)
  switch (tabIndex.value) {
    case '0':
      if (shopForm.value.id) {
        showLoading()
        const res = await shopDetailApi(shopForm.value.id)
        if (res) {
          resSetShop(res)
        }
      }
      break
    case '1':

      await initStation()
      break
    case '2':
      await initShopUser()
      break
    case '3':
      await initShopTag()
      break
    case '4':
      await initStationPic()
      break

  }
}
const initStationPic = async () => {
  showLoading("正在为您加载图片")
  const res = await stationPicApi(shopForm.value.id)
  if (res) {
    stationPics.value = res
  }
}
const initShopUser = async () => {
  showLoading("加载中")
  const shopUserRes = await shopUserApi(shopForm.value.id)
  if (shopUserRes) {
    shopUser.value = shopUserRes
  }

}
const initStation = async () => {
  if (shopForm.value.id) {
    showLoading()
    const res = await stationsByShopIdApi(shopForm.value.id)
    if (res) {
      stations.value = res
    }
  }
}
const save = () => {
  shopFormRef.value.validate().then(async ({valid}) => {
    if (valid) {

      showLoading('保存中')
      const res = await saveShopApi(shopForm.value)
      if (res) {
        Taro.showToast({
          title: '保存成功',
          icon: 'success'
        })
        resSetShop(res)
      }

    }
  })
}
const resSetShop = (shop: Shop) => {
  shopForm.value = shop
  if (isPercentage.value === '%') {
    shopForm.value.cashWithdrawalServiceFeeLabel = multiply(shopForm.value.cashWithdrawalServiceFee, 10)
  } else {
    shopForm.value.cashWithdrawalServiceFeeLabel = multiply(shopForm.value.cashWithdrawalServiceFee, 0.1)
  }
  shopPicFileList.value.splice(0, shopPicFileList.value.length)
  shopPicFileList.value.push(...shopForm.value.pics)
  shopLogoFileList.value.splice(0, shopLogoFileList.value.length)
  shopLogoFileList.value.push(...shopForm.value.logoFile)

}
const unitChange = (event) => {
  if (event === '%') {
    shopForm.value.cashWithdrawalServiceFeeLabel = multiply(shopForm.value.cashWithdrawalServiceFeeLabel, 0.1)
    shopForm.value.cashWithdrawalServiceFee = multiply(shopForm.value.cashWithdrawalServiceFee, 0.1)
  } else {
    shopForm.value.cashWithdrawalServiceFeeLabel = multiply(shopForm.value.cashWithdrawalServiceFeeLabel, 10)
    shopForm.value.cashWithdrawalServiceFee = multiply(shopForm.value.cashWithdrawalServiceFee, 10)
  }

}
const getShopType = () => {
  switch (shopForm.value.type) {
    case "STAR_STORE":
      return '明星门店'
    case "NON_STAR_STORES":
      return "非明星门店"
    default:
      return '请选择门店类型'
  }
}
const showTypeSelect = () => {
  typeSelectShow.value = true
}
const setCashWithdrawalFee = ({detail}) => {
  if (isPercentage.value === '%') {
    shopForm.value.cashWithdrawalServiceFee = multiply(detail.value, 0.01)
  } else {
    shopForm.value.cashWithdrawalServiceFee = multiply(detail.value, 0.001)
  }

}
const shopTypeOptions = ref<any[]>([{name: '明星门店', value: "STAR_STORE"}, {
  name: '其他门店',
  value: "NON_STAR_STORES"
}])
const selectShopType = (event) => {
  shopForm.value.type = event.value
}
const typeSelectShow = ref(false)
const isPercentage = ref('%')
const shopForm = ref<Shop>({})
const shopFormRef = ref()
onMounted(async () => {
  const id = Taro.getCurrentInstance().router?.params.id
  if (id) {
    showLoading()
    const res = await shopDetailApi(id)
    if (res) {
      resSetShop(res)
    }
  }
})
const openMap = () => {
  Taro.showModal({
    title: '温馨提示',
    content: '门店地址不支持手动填写,请在地图上选取位置',
    confirmColor: '去选择',
  }).then(res => {
    if (res.confirm) {
      Taro.chooseLocation({}).then(res => {
        shopForm.value.address = res.address
        shopForm.value.latitude = res.latitude
        shopForm.value.longitude = res.longitude
      })
    }
  })
}
const removeLogo = async () => {
  const res = await deleteFile(shopForm.value.logo)
  if (res) {
    if (shopForm.value.id) {
      showLoading('删除中')
      await removeShopLogoAPi(shopForm.value.id)
    }
    shopForm.value.logo = undefined
    Taro.showToast({
      title: '删除成功'
    })
  }
}
const uploadPic = async () => {
  const fileId = await uploadFile(`shop/${getCloudFilePath(shopPicFileList.value[shopPicFileList.value.length - 1].path)}`, shopPicFileList.value[shopPicFileList.value.length - 1].path)
  if (fileId) {
    if (shopForm.value.id) {
      const addRes = await addStorageApi({url: fileId, fileType: 'PIC', foreignId: shopForm.value.id})
      if (addRes) {
        shopPicFileList.value[shopPicFileList.value.length - 1] = addRes
        Taro.showToast({
          title: '上传成功',
          icon: 'success'
        })
      }
    } else {
      shopPicFileList.value[shopPicFileList.value.length - 1].status = 'success'
      shopPicFileList.value[shopPicFileList.value.length - 1].uid = fileId
      shopForm.value.pics = shopPicFileList.value
      Taro.showToast({
        title: '上传成功',
        icon: 'success'
      })
    }
  }
}
const removePic = async (files) => {
  showLoading("删除中")
  const deleteRes = await deleteFile(files.file.uid)
  if (deleteRes) {
    if (files.file.id) {
      showLoading('删除中')
      const removeRes = await removeStorageApi(files.file.id)
      if (removeRes) {
        Taro.showToast({
          title: '删除成功',
          icon: 'success'
        })
      }
    } else {
      shopForm.value.pics = shopPicFileList.value
      Taro.showToast({
        title: '删除成功',
        icon: 'success'
      })
    }

  }
}
const uploadLogo = async () => {
  const fileId = await uploadFile(`shop/${getCloudFilePath(shopLogoFileList.value[shopLogoFileList.value.length - 1].path)}`, shopLogoFileList.value[shopLogoFileList.value.length - 1].path)
  if (fileId) {
    if (shopForm.value.id) {
      const addRes = await updateShopLogoApi(shopForm.value.id, fileId)
      if (addRes) {
        Taro.showToast({
          title: '上传成功',
          icon: 'success'
        })
        shopLogoFileList.value[shopLogoFileList.value.length - 1].status = 'success'
      }
    } else {
      shopForm.value.logo = fileId
      shopLogoFileList.value[shopLogoFileList.value.length - 1].status = 'success'
      Taro.showToast({
        title: '上传成功',
        icon: 'success'
      })
    }
  }
}
watch(shopForm, () => {

})
</script>

<style lang="less">
.station-tab {
  .nut-tag {
    margin: 20rpx;
  }

  .station-opr {
    display: flex;
    justify-content: space-around;
  }

  .add {
    margin: 10rpx auto;
    width: 95%
  }

  .nut-cell-group__warp {
    width: 95%;
    margin: 0 auto 50rpx;
    box-shadow: 0 4rpx 24rpx rgba(89, 89, 89, 0.12);
  }

}

.nut-textarea {
  //min-height: 40rpx;
  height: 70rpx;
  //min-height: 70rpx;
  max-height: 120rpx;

  textarea {
    height: 70rpx;
  }
}

.nut-tab-pane {
  padding: 0;
}

.withdraw {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 480rpx;

  .nut-radio-group {
    display: flex;
    justify-content: center;
    align-items: flex-start;

    .nut-radio__button {
      border-radius: 0;
      padding: 0 20rpx 0 20rpx;
    }
  }
}

.addressColor {
  color: black;
}

.pic {
  .nut-uploader__preview {
    margin: 20rpx auto;
    height: 215rpx;
    width: 430rpx;
    //width: 60%;
  }

  .nut-uploader__upload {
    margin: 20rpx auto;
    width: 80%;
  }

  .nut-uploader__preview-img {
    width: 100%;
    height: 100%;
  }
}
</style>
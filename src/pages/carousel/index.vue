<template>
  <nut-uploader v-model:file-list="banners" :size-type="['compressed']"
                :before-xhr-upload="uploadBanner" @delete="removeBanner"></nut-uploader>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import Storage from "types/Storage";
import {addStorageApi, bannerApi, removeStorageApi} from "../../api/storage";
import {FileItem} from "@nutui/nutui-taro/dist/types/__VUE/uploader/type";
import {getCloudFilePath, showLoading} from "../../utils/util";
import {deleteFile, uploadFile} from "../../utils/http";
import Taro from "@tarojs/taro";

const banners = ref<Storage[]>([])
const a = ref < FileItem >

    onMounted(async () => {
      showLoading()
      const res = await bannerApi()
      if (res) {
        banners.value.push(...res)
      }
    })
const uploadBanner = async () => {
  const fileId = await uploadFile(`banner/${getCloudFilePath(banners.value[banners.value.length - 1].path)}`, banners.value[banners.value.length - 1].path)
  if (fileId) {
    const addRes = await addStorageApi({url: fileId, fileType: 'BANNER'})
    if (addRes) {
      banners.value[banners.value.length - 1] = addRes
    }
  }
}
const removeBanner = async (files) => {
  showLoading("删除中")
  const deleteRes = await deleteFile(files.file.uid)
  if (deleteRes) {
    const removeRes = await removeStorageApi(files.file.id)
    if (removeRes) {
      Taro.showToast({
        title: '删除成功',
        icon: 'success'
      })
    }
  }
}

</script>

<style lang="less">
.nut-uploader__preview {
  margin: 20rpx auto;
  height: 320rpx;
  width: 90%;
}

.nut-uploader__upload {
  margin: 20rpx auto;
  width: 80%;
}

.nut-uploader__preview-img {
  width: 100%;
  height: 100%;
}
</style>
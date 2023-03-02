<template>
  <nut-form :model-value="stationForm" ref="stationFromRef">
    <nut-form-item label="智能控制盒" prop="boxSerial">

      <nut-input v-model="stationForm.boxSerial" class="nut-input-text"
                 placeholder="请扫描或输入智能控制盒序列号">
        <template #right>
          <IconFont name="scan2" @click="scanBoxSerial"></IconFont>
        </template>
      </nut-input>
    </nut-form-item>
    <nut-form-item label="入场识别器" prop="inSerial">
      <nut-input v-model="stationForm.inSerial" class="nut-input-text"
                 placeholder="请扫描或输入入场识别器序列号">
        <template #right>
          <IconFont name="scan2" @click="scanInSerial"></IconFont>
        </template>
      </nut-input>
    </nut-form-item>
    <nut-form-item label="出场识别器" prop="outSerial">
      <nut-input v-model="stationForm.outSerial" class="nut-input-text"
                 placeholder="请扫描或输入出场识别器序列号">
        <template #right>
          <IconFont name="scan2" @click="scanOutSerial"></IconFont>
        </template>
      </nut-input>
    </nut-form-item>
    <nut-form-item v-if="stationForm.boxSerial" label="水电接口" prop="powerPort">
      <nut-cell is-link @click="showPortSelect('power')"
                :desc="stationForm.powerPort?`OUT${stationForm.powerPort}`:'请选择水电接口'"></nut-cell>
    </nut-form-item>
    <nut-form-item v-if="stationForm.boxSerial&&stationForm.supportDoor" label="门接口" prop="doorPort">
      <nut-cell is-link @click="showPortSelect('door')"
                :desc="stationForm.doorPort?`OUT${stationForm.doorPort}`:'请选择门接口'"></nut-cell>
    </nut-form-item>
    <nut-form-item body-align="right" v-if="stationForm.boxSerial||stationForm.inSerial" label="门" prop="supportDoor">
      <nut-checkbox v-model="stationForm.supportDoor"></nut-checkbox>
    </nut-form-item>
    <nut-cell>
      <nut-button type="info" block @click="save">保存</nut-button>
    </nut-cell>
  </nut-form>

  <nut-action-sheet
      v-model:visible="portSelectShow"
      :menu-items="portOptions"
      @choose="selectPort"
  ></nut-action-sheet>
</template>

<script lang="ts" setup>

import {onMounted, ref, watch} from "vue";
import Taro from "@tarojs/taro";
import Station from "../../../types/Station";
import {getStationApi, saveStationApi} from "../../api/station";
import {showLoading} from "../../utils/util";
import {IconFont} from '@nutui/icons-vue-taro';

const save = async () => {
  showLoading("保存中")
  const res = await saveStationApi(stationForm.value)
  if (res){
    Taro.eventCenter.trigger("updateStationSuccess")
    Taro.navigateBack()
  }
}
const portType = ref('power')
const portSelectShow = ref(false)
const showPortSelect = (type: string) => {
  portType.value = type
  if (stationForm.value.powerPort) {

    portOptions.value = portOptions.value.filter(x => x.value !== stationForm.value.powerPort)
  }
  if (stationForm.value.doorPort) {
    portOptions.value = portOptions.value.filter(x => x.value !== stationForm.value.doorPort)
  }
  portSelectShow.value = true
}
const portOptions = ref<any[]>([{name: 'OUT1', value: 1}, {
  name: 'OUT2',
  value: 2
}, {name: 'OUT3', value: 3}, {name: 'OUT4', value: 4}, {name: '清除', value: undefined}
])
const selectPort = (event) => {
  if (portType.value === 'power') {

    stationForm.value.powerPort = event.value
  } else if (portType.value === 'door') {
    stationForm.value.doorPort = event.value
  }
  portOptions.value = [{name: 'OUT1', value: 1}, {
    name: 'OUT2',
    value: 2
  }, {name: 'OUT3', value: 3}, {name: 'OUT4', value: 4}, {name: '清除', value: undefined}]
}
const id = ref('')
const scanBoxSerial = () => {
  Taro.scanCode({}).then(res => {
    if (res.result.split(',').length !== 3) {
      Taro.showToast({
        title: '二维码错误',
        icon: 'error'
      })
      return
    }
    stationForm.value.boxSerial = res.result.split(',')[2]
  })
}
const scanInSerial = () => {
  Taro.scanCode({}).then(res => {
    stationForm.value.inSerial = res.result
  })
}
const scanOutSerial = () => {
  Taro.scanCode({}).then(res => {
    stationForm.value.outSerial = res.result
  })
}

const stationForm = ref<Station>({})
const stationFromRef = ref()
onMounted(() => {
  const paramId = Taro.getCurrentInstance().router?.params.id
  const paramShopId = Taro.getCurrentInstance().router?.params.shopId
  if (paramId) {
    id.value = paramId

  }
  if (paramShopId) {
    stationForm.value.shopId = paramShopId
  }

})
watch(id, async () => {
  showLoading()
  const res = await getStationApi(id.value)
  if (res) {
    stationForm.value = res
  }
})
</script>

<style lang="less">

</style>
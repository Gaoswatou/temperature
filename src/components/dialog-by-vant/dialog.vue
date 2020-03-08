<van-dialog
  v-model="confirmBeforeSumbit"
  show-cancel-button
  :before-close="beforeClose"
>
        <div class="my-choosed-temper">
          当前选择的体温为：<span
            :class="Number(this.temperatureToReport) < 37.3 ? 'blue' : 'red'"
            >{{ this.temperatureToReport }}°C</span
          >
        </div>
        <div class="form-dialog">
          <div class="form-dialog-item">
            <div class="form-dialog-item_title">
              * 本人及所在家庭是否有出现新冠肺炎病例？
            </div>
            <div class="form-dialog-item_choose">
              <van-radio-group v-model="inCase" direction="horizontal">
                <van-radio name="1">是</van-radio>
                <van-radio name="0">否</van-radio>
              </van-radio-group>
            </div>
          </div>
          <div class="form-dialog-item" v-show="inCase == '1'">
            <div class="form-dialog-item_title">
              * 是否已治愈出院？
            </div>
            <div class="form-dialog-item_choose">
              <van-radio-group v-model="isCure" direction="horizontal">
                <van-radio name="1">是</van-radio>
                <van-radio name="0">否</van-radio>
              </van-radio-group>
            </div>
          </div>
          <div class="form-dialog-item">
            <div class="form-dialog-item_title">
              * 本人及所在家庭成员近14天内是否有接触新冠肺炎病人？
            </div>
            <div class="form-dialog-item_choose">
              <van-radio-group v-model="isTouchCase" direction="horizontal">
                <van-radio name="1">是</van-radio>
                <van-radio name="0">否</van-radio>
              </van-radio-group>
            </div>
          </div>
          <div class="form-dialog-item">
            <div class="form-dialog-item_title">
              * 本人所在小区（村）近14天内是否有新冠肺炎病例？
            </div>
            <div class="form-dialog-item_choose">
              <van-radio-group v-model="homeHasCase" direction="horizontal">
                <van-radio name="1">是</van-radio>
                <van-radio name="0">否</van-radio>
              </van-radio-group>
            </div>
          </div>
        </div>
        <div class="checkPromise">
          <van-checkbox v-model="checkPromise" shape="square"
            >勾选【<span>承诺书</span>】</van-checkbox
          >
        </div>
      </van-dialog>

<template>
  <div class="home">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-cell-group>
        <van-cell>
          <span slot="title">学号：{{ userInfo.stuNo || "" }}</span>
          <span slot="" class="cell-content" @click="selectCalendar">{{
            search_date
          }}</span>
        </van-cell>
        <van-cell>
          <span slot="title">姓名：{{ userInfo.stuName || "" }}</span>
        </van-cell>
        <van-cell>
          <div class="report-area">
            <div class="report-time-range">
              上报时间
              <span class="time-range"
                >{{ morning.reportStartTime | formatDate }}-{{
                  morning.reportEndTime | formatDate
                }}</span
              >
            </div>
            <div class="report-btn">
              <span
                v-show="morning.reportTemperature"
                :class="
                  Number(morning.reportTemperature) < 37.3 ? 'blue' : 'red'
                "
                >{{ morning.reportTemperature }}°C</span
              >
              <span
                v-show="!morning.reportTemperature"
                :class="morning._disableReport ? 'btn-disable' : ''"
                @click="handleReport('morning', morning._disableReport)"
                >未上报</span
              >
            </div>
            <div class="report-status">
              <p class="report-time">
                体温上报：
                <span>{{
                  morning.reportStatus == 2 ? "已上报" : "待上报"
                }}</span>
              </p>
              <p class="report-time">
                流行病史调查：
                <span>{{
                  morning.reportStatus == 2 ? "已上报" : "待上报"
                }}</span>
              </p>
            </div>
          </div>
        </van-cell>
        <van-cell>
          <div class="report-area">
            <div class="report-time-range">
              上报时间
              <span class="time-range"
                >{{ afternoon.reportStartTime | formatDate }}-{{
                  afternoon.reportEndTime | formatDate
                }}</span
              >
            </div>
            <div class="report-btn">
              <span
                v-if="afternoon.reportTemperature"
                :class="
                  Number(afternoon.reportTemperature) < 37.3 ? 'blue' : 'red'
                "
                >{{ afternoon.reportTemperature }}°C</span
              >
              <span
                v-else
                :class="afternoon._disableReport ? 'btn-disable' : ''"
                @click="handleReport('afternoon', afternoon._disableReport)"
                >未上报</span
              >
            </div>
            <div class="report-status">
              <p class="report-time">
                体温上报：
                <span>{{
                  afternoon.reportStatus == 2 ? "已上报" : "待上报"
                }}</span>
              </p>
              <p class="report-time">
                流行病史调查：
                <span>{{
                  afternoon.reportStatus == 2 ? "已上报" : "待上报"
                }}</span>
              </p>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
      <van-popup
        v-model="showTemperaturePicker"
        closeable
        close-icon-position="top-left"
        position="bottom"
        :style="{ height: '30%' }"
      >
        <div class="temperaturePicker">
          <div class="temperaturePicker-title">体温</div>
          <div class="temperaturePicker-picker">
            <van-picker
              ref="temperaturePicker"
              :columns="temperatureList"
              :visible-item-count="4"
              :default-index="8"
            />
          </div>
          <div class="temperaturePicker-confirm_btn">
            <span @click="confirmTemperature">确定</span>
          </div>
        </div>
      </van-popup>
      <van-popup
        v-model="showCalendar"
        closeable
        close-icon-position="top-left"
        position="bottom"
        :style="{ height: '30%' }"
      >
        <div class="temperaturePicker">
          <div class="temperaturePicker-title">日期</div>
          <div class="temperaturePicker-picker">
            <van-picker
              ref="calendarPicker"
              :columns="calendarList"
              :visible-item-count="4"
              :default-index="13"
            />
          </div>
          <div class="temperaturePicker-confirm_btn">
            <span @click="confirmCalendar">确定</span>
          </div>
        </div>
      </van-popup>
      <van-popup v-model="sucReport" round :close-on-click-overlay="false">
        <div class="info-dialog">
          <div style="display:flex;justify-content: center;">
            <van-icon name="checked" size="34" color="#52C7CA" />
            <div class="info-dialog_text">上报成功</div>
          </div>
          <div class="info-dialog_btn suc_btn">
            <span>({{ second }}秒)自动返回</span>
          </div>
        </div>
      </van-popup>
      <van-popup v-model="errReport" round :close-on-click-overlay="false">
        <div class="info-dialog">
          <div style="display:flex;justify-content: center;">
            <van-icon name="clear" size="34" color="#FF4D4D" />
            <div class="info-dialog_text">上报失败，稍后重试</div>
          </div>
          <div class="info-dialog_btn error_btn">
            <span>({{ second }}秒)自动返回</span>
          </div>
        </div>
      </van-popup>
    </van-pull-refresh>
    <ieach-dialog
      title="流行病史调查"
      v-model="confirmBeforeSumbit"
      @before-close="beforeClose"
      confirmText="提交"
    >
      <ieach-cell-group slot="content">
        <ieach-cell title="本人及所在家庭是否有出现新冠肺炎病例？">
          <div slot="content" class="radio-item">
            <div
              :class="{ radioBtn: true, yes: true, checked: isIll === 1 }"
              @click="changeRadio('isIll', 1)"
            >
              是
            </div>
            <div
              :class="{ radioBtn: true, no: true, checked: isIll === 2 }"
              @click="changeRadio('isIll', 2)"
            >
              否
            </div>
          </div>
        </ieach-cell>
        <ieach-cell title="是否已治愈出院？">
          <div slot="content" class="radio-item">
            <div
              :class="{
                radioBtn: true,
                yes: true,
                checked: isHeal === 2,
                raidoDisable: isIll === 2 || !isIll
              }"
              @click="changeRadio('isHeal', 2)"
            >
              否
            </div>
            <div
              :class="{
                radioBtn: true,
                no: true,
                checked: isHeal === 1,
                raidoDisable: isIll === 2 || !isIll
              }"
              @click="changeRadio('isHeal', 1)"
            >
              是
            </div>
          </div>
        </ieach-cell>
        <ieach-cell title="本人及所在家庭成员近14天内是否有接触新冠肺炎病人？">
          <div slot="content" class="radio-item">
            <div
              :class="{
                radioBtn: true,
                yes: true,
                checked: isTouch === 1
              }"
              @click="changeRadio('isTouch', 1)"
            >
              是
            </div>
            <div
              :class="{
                radioBtn: true,
                no: true,
                checked: isTouch === 2
              }"
              @click="changeRadio('isTouch', 2)"
            >
              否
            </div>
          </div></ieach-cell
        >
        <ieach-cell title="本人所在小区（村）近14天内是否有新冠肺炎病例？">
          <div slot="content" class="radio-item">
            <div
              :class="{
                radioBtn: true,
                yes: true,
                checked: isCommunityIll === 1
              }"
              @click="changeRadio('isCommunityIll', 1)"
            >
              是
            </div>
            <div
              :class="{
                radioBtn: true,
                no: true,
                checked: isCommunityIll === 2
              }"
              @click="changeRadio('isCommunityIll', 2)"
            >
              否
            </div>
          </div>
        </ieach-cell>
        <ieach-cell title="近14天家人是否有国外旅居史（含辗转）？">
          <div slot="content" class="radio-item">
            <div
              :class="{
                radioBtn: true,
                yes: true,
                checked: isSojourn === 1
              }"
              @click="changeRadio('isSojourn', 1)"
            >
              是
            </div>
            <div
              :class="{
                radioBtn: true,
                no: true,
                checked: isSojourn === 2
              }"
              @click="changeRadio('isSojourn', 2)"
            >
              否
            </div>
            <van-field
              v-if="isSojourn === 1"
              v-model="sojourn"
              :maxlength="50"
              placeholder="请输入途径国家"
              style="padding:0 !important;text-align:center !important"
            />
          </div>
          <!-- <div slot="content" class="check-item">
            <div
              :class="{
                checkBtn: true,
                no: true,
                checked: sojourn_0000 === 1
              }"
              @click="changeCheck('sojourn_0000')"
            >
              无
            </div>
          </div>
          <div slot="content" class="check-item">
            <div
              :class="{
                checkBtn: true,
                yes: true,
                checked: sojourn_0081 === 1,
                checkDisable: sojourn_0000 === 1
              }"
              @click="changeCheck('sojourn_0081')"
            >
              日本
            </div>
          </div>
          <div slot="content" class="check-item">
            <div
              :class="{
                checkBtn: true,
                yes: true,
                checked: sojourn_0082 === 1,
                checkDisable: sojourn_0000 === 1
              }"
              @click="changeCheck('sojourn_0082')"
            >
              韩国
            </div>
          </div>
          <div slot="content" class="check-item">
            <div
              :class="{
                checkBtn: true,
                yes: true,
                checked: sojourn_65 === 1,
                checkDisable: sojourn_0000 === 1
              }"
              @click="changeCheck('sojourn_65')"
            >
              新加坡
            </div>
          </div>
          <div slot="content" class="check-item">
            <div
              :class="{
                checkBtn: true,
                yes: true,
                checked: sojourn_39 === 1,
                checkDisable: sojourn_0000 === 1
              }"
              @click="changeCheck('sojourn_39')"
            >
              意大利
            </div>
          </div>
          <div slot="content" class="check-item">
            <div
              :class="{
                checkBtn: true,
                yes: true,
                checked: sojourn_98 === 1,
                checkDisable: sojourn_0000 === 1
              }"
              @click="changeCheck('sojourn_98')"
            >
              伊朗
            </div>
          </div> -->
        </ieach-cell>
        <ieach-cell title="当前体温">
          <div slot="content">
            <div class="radio-item">
              <div
                class="tempVal"
                :class="[
                  'tempVal',
                  Number(temperatureToReport) < 37.3 ? 'blue' : 'red'
                ]"
              >
                {{ temperatureToReport }}
              </div>
            </div>
          </div>
        </ieach-cell>
        <ieach-cell>
          <div slot="container">
            <div class="promise-check">
              <van-checkbox
                class="promise-check_handle"
                v-model="isPromise"
                icon-size="24px"
              ></van-checkbox>
              <div class="promise-check__text">
                我郑重承诺，本人对所报信息的真实性完整性负责。
              </div>
            </div>
          </div>
        </ieach-cell>
      </ieach-cell-group>
    </ieach-dialog>
  </div>
</template>

<script>
import md5 from "js-md5";
import ieachDialog from "components/ieach-dialog/ieach-dialog";
import ieachCellGroup from "components/ieach-cell-group/ieach-cell-group";
import ieachCell from "components/ieach-cell/ieach-cell";
export default {
  name: "Home",
  components: {
    ieachDialog,
    ieachCellGroup,
    ieachCell
  },
  data() {
    return {
      second: 5,
      secondInterval: null,
      dateHaveData: "",
      sucReport: false,
      errReport: false,
      isLoading: false,
      search_date: "",
      morning: {
        reportStartTime: "",
        reportEndTime: "",
        reportTemperature: "",
        reportTime: "",
        _disableReport: true
      },
      afternoon: {
        reportStartTime: "",
        reportEndTime: "",
        reportTemperature: "",
        reportTime: "",
        _disableReport: true
      },
      temperatureList: [
        "36.0",
        "36.1",
        "36.2",
        "36.3",
        "36.4",
        "36.5",
        "36.6",
        "36.7",
        "36.8",
        "36.9",
        "37.0",
        "37.1",
        "37.2",
        "37.3",
        "37.4",
        "37.5",
        "37.6",
        "37.7",
        "37.8",
        "37.9",
        "38.0",
        "38.1",
        "38.2",
        "38.3",
        "38.4",
        "38.5",
        "38.6",
        "38.7",
        "38.8",
        "38.9",
        "39.0",
        "39.1",
        "39.2",
        "39.3",
        "39.4",
        "39.5",
        "39.6",
        "39.7",
        "39.8",
        "39.9",
        "40.0"
      ],
      calendarList: [],
      userInfo: {
        stuNo: "",
        stuName: ""
      },
      showTemperaturePicker: false,
      showCalendar: false,
      report_type: "morning",
      stuNo: "",
      temperatureToReport: "36.8",
      confirmBeforeSumbit: false,
      isIll: null,
      isHeal: null,
      isTouch: null,
      isCommunityIll: null,
      isPromise: false,
      isSojourn: null,
      sojourn: "",
      sojourn_0000: 2,
      sojourn_0081: 2,
      sojourn_0082: 2,
      sojourn_65: 2,
      sojourn_39: 2,
      sojourn_98: 2,
      nullResult: null
    };
  },
  mounted() {
    this.stuNo = this.$route.query.uid;
    localStorage.setItem("token", this.$route.query.token);
    this.getUserInfo();
    this.getCalendarList();
  },
  filters: {
    formatDate(val) {
      return val ? val.split(" ")[1] : "";
    }
  },
  methods: {
    /**
     * 获取上次上报的对应选项
     */
    getIsInfo() {
      let { random_str, hash, current_time } = this.getHashParams();
      this.$axios({
        url: "report/get_is_info",
        method: "post",
        data: {
          id: this.handleId,
          stu_no: this.stuNo,
          current_time: current_time,
          random_str: random_str,
          hash: hash
        },
        showLoad: false
      })
        .then(res => {
          localStorage.setItem("is_info", res);
          this.setIsInfo(res);
        })
        .catch(() => {});
    },
    /**
     * 将缓存里面表单的默认选项读出来
     */
    setIsInfo(info) {
      this.isIll = info.isIll;
      this.isHeal = info.isHeal;
      this.isTouch = info.isTouch;
      this.isCommunityIll = info.isCommunityIll;
      this.isPromise = info.isPromise;
      this.isSojourn = info.sojourn ? (info.sojourn === "0000" ? 2 : 1) : null;
      this.sojourn = info.sojourn === "0000" ? "" : info.sojourn;
      // let sojournArr = info.sojourn.split("#");
      // sojournArr.forEach(el => {
      //   this["sojourn_" + el] = 1;
      // });
    },
    /**
     * 获取上报信息
     */
    getReportData() {
      let { random_str, hash, current_time } = this.getHashParams();
      this.$axios
        .post("report/info", {
          stu_no: this.stuNo,
          search_date: this.search_date,
          current_time: current_time,
          random_str: random_str,
          hash: hash
        })
        .then(res => {
          if (res) {
            res.forEach(element => {
              if (
                this.isBeforeTime(new Date(), element.reportStartTime) ||
                this.isBeforeTime(element.reportEndTime, new Date())
              ) {
                element._disableReport = true;
              } else {
                element._disableReport = false;
              }
            });
            this.$set(this, "morning", res[0] || { _disableReport: true });
            this.$set(this, "afternoon", res[1] || { _disableReport: true });
            this.isLoading = false;
            this.dateHaveData = this.search_date;
          } else {
            this.$set(this, "morning", res[0] || { _disableReport: true });
            this.$set(this, "afternoon", res[1] || { _disableReport: true });
            this.search_date = this.dateHaveData;
            this.isLoading = false;
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    /**
     * 获取上报信息
     */
    getReportDataClearCache() {
      let { random_str, hash, current_time } = this.getHashParams();
      this.$axios
        .post("report/info/clean", {
          stu_no: this.stuNo,
          search_date: this.search_date,
          current_time: current_time,
          random_str: random_str,
          hash: hash
        })
        .then(res => {
          res.forEach(element => {
            if (
              this.isBeforeTime(new Date(), element.reportStartTime) ||
              this.isBeforeTime(element.reportEndTime, new Date())
            ) {
              element._disableReport = true;
            } else {
              element._disableReport = false;
            }
          });
          this.$set(this, "morning", res[0] || { _disableReport: true });
          this.$set(this, "afternoon", res[1] || { _disableReport: true });
        });
    },
    /**
     * 获取学生信息
     */
    getUserInfo() {
      let { random_str, hash, current_time } = this.getHashParams();
      this.$axios
        .post("student/info", {
          stu_no: this.stuNo,
          current_time: current_time,
          random_str: random_str,
          hash: hash
        })
        .then(res => {
          this.$set(this, "userInfo", res);
        });
    },
    /**
     * 获取JWT认证体系中的token值
     */
    handleAuth() {
      this.$axios
        .post("sys/mLogin", {
          username: "app",
          password: "Admin123@"
        })
        .then(res => {
          localStorage.setItem("token", res.token);
          this.getUserInfo();
          this.getReportData();
        });
    },
    /**
     * 确认日期
     */
    confirmCalendar() {
      this.search_date = this.$moment(
        this.$refs.calendarPicker.getValues()[0]
      ).format("YYYY-MM-DD");
      this.showCalendar = false;
      this.getReportData();
    },
    /**
     * 打开日期选择
     */
    selectCalendar() {
      this.showCalendar = true;
    },
    /**
     * 确认上报温度
     */
    confirmTemperature() {
      this.temperatureToReport = this.$refs.temperaturePicker.getValues()[0];
      // 上报前确认体温同时填确认表单
      this.confirmBeforeSumbit = true;
      // // 超过37.3进行体温上报确认
      // let noticeStr = "当前选择体温为" + this.reportTemperature + "°C,确认上报?";
      // if (this.reportTemperature >= 37.3) {
      //   this.$dialog
      //     .confirm({
      //       title: "提示",
      //       message: noticeStr
      //     })
      //     .then(() => {
      //       this.showTemperaturePicker = false;
      //       this.saveTemperature(this.reportTemperature);
      //     })
      //     .catch(() => {});
      // } else {
      //   this.showTemperaturePicker = false;
      //   this.saveTemperature(this.reportTemperature);
      // }
    },
    /**
     * 在关闭弹窗前进行确认再保存
     */
    beforeClose(action, done) {
      if (action === "confirm") {
        if (
          !this.isIll ||
          (this.isIll === 1 && !this.isHeal) ||
          !this.isTouch ||
          !this.isCommunityIll ||
          !this.isSojourn
        ) {
          this.$toast({
            duration: 1000,
            message: "有未完成的选项，请继续选择"
          });
          return false;
        }
        if (this.isSojourn === 1 && !this.sojourn) {
          this.$toast({
            duration: 1000,
            message: "请填写途径国家"
          });
          return false;
        }
        // if (
        //   !(
        //     this.sojourn_0000 === 1 ||
        //     (this.sojourn_0000 === 2 &&
        //       (this.sojourn_0081 === 1 ||
        //         this.sojourn_0082 === 1 ||
        //         this.sojourn_65 === 1 ||
        //         this.sojourn_39 === 1 ||
        //         this.sojourn_98 === 1))
        //   )
        // ) {
        //   this.$toast({
        //     duration: 1000,
        //     message: "有未完成的选项，请继续选择"
        //   });
        //   return false;
        // }
        if (!this.isPromise) {
          this.$toast({ duration: 1000, message: "请勾选承诺" });
          done(false);
        } else {
          this.saveTemperature(this.temperatureToReport);
          this.showTemperaturePicker = false;
          done();
        }
      } else {
        done();
      }
    },
    /**
     * 获取有旅居的国家
     */
    getSojourn() {
      let tempStr = "";
      let dataSet = [
        "sojourn_0000",
        "sojourn_0081",
        "sojourn_0082",
        "sojourn_65",
        "sojourn_39",
        "sojourn_98"
      ];
      dataSet.forEach(el => {
        if (this[el] === 1) {
          tempStr += el.split("_")[1] + "#";
        }
      });
      return tempStr.substring(0, tempStr.lastIndexOf("#"));
    },
    /**
     * 上传温度
     */
    saveTemperature(temperature) {
      let { random_str, hash, current_time } = this.getHashParams();
      // let sojourn = this.getSojourn();
      this.$axios
        .post("report/update", {
          id:
            this.report_type === "morning"
              ? this.morning.id
              : this.afternoon.id,
          version:
            this.report_type === "morning"
              ? this.morning.version
              : this.afternoon.version,
          stu_no: this.stuNo,
          search_date: this.search_date,
          report_temperature: Number(temperature),
          isIll: this.isIll,
          isHeal: this.isHeal,
          isTouch: this.isTouch,
          isCommunityIll: this.isCommunityIll,
          isPromise: this.isPromise ? 1 : 2,
          sojourn: this.isSojourn === 1 ? this.sojourn : "0000",
          current_time: current_time,
          random_str: random_str,
          hash: hash
        })
        .then(res => {
          this.nullResult = res;
          this.startCountdown("suc");
        })
        .catch(err => {
          this.startCountdown(err);
        });
    },
    /**
     * 获取请求参数中的时间戳、salt、hash
     */
    getHashParams() {
      let current_time = this.getUnixTime(
        this.$moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
      );
      let random_str = this.getRandomStr(12);
      let salt = "luqixiuzijiayougan";
      let hash = md5(current_time + random_str + salt);
      return {
        current_time,
        random_str,
        hash
      };
    },
    /**
     * 获取指定长度的随机字符串
     */
    getRandomStr(len) {
      len = len || 32;
      var $chars =
        "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
      var maxPos = $chars.length;
      var str = "";
      for (let i = 0; i < len; i++) {
        str += $chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return str;
    },
    /**
     * 选择温度
     */
    handleReport(type, disableReport) {
      this.handleId = type == "morning" ? this.morning.id : this.afternoon.id;
      let isInfo = localStorage.getItem("isInfo", this.$route.query.token);
      if (isInfo) {
        this.setIsInfo(isInfo);
      } else {
        this.getIsInfo();
      }
      this.report_type = type;
      // console.log("disableReport: ", disableReport);
      if (disableReport) {
        this.$toast("非上报时间，不可上报");
        return false;
      }
      this.showTemperaturePicker = true;
    },
    /**
     * 获取前14天的日期
     */
    getCalendarList() {
      const temp = [];

      for (let i = 0; i < 14; i++) {
        const time = new Date(
          new Date().setDate(new Date().getDate() + i - 13)
        );
        const year = time.getFullYear();
        const month = `0${time.getMonth() + 1}`.slice(-2);
        const strDate = `0${time.getDate()}`.slice(-2);
        temp.push(`${year}-${month}-${strDate}`);
      }
      this.calendarList = temp;
      this.search_date = this.$moment(new Date()).format("YYYY-MM-DD");
      this.getReportData();
    },
    /**
     * 日期格式转化为时间戳
     */
    getUnixTime(dateStr) {
      var newstr = dateStr.replace(/-/g, "/");
      var date = new Date(newstr);
      var time_str = date.getTime().toString();
      return time_str.substr(0, 10);
    },
    /**
     * 比较时间大小 aTime是否bTime：如果是，返回true，否则返回false
     */
    isBeforeTime(aTime, bTime) {
      let flag = this.$moment(
        this.$moment(aTime).format("YYYY-MM-DD HH:mm:ss")
      ).isBefore(this.$moment(bTime).format("YYYY-MM-DD HH:mm:ss"));
      return flag;
    },
    /**
     * 倒计时
     */
    startCountdown(type) {
      type == "suc" ? (this.sucReport = true) : (this.errReport = true);
      this.secondInterval = setInterval(() => {
        if (this.second === 0) {
          clearInterval(this.secondInterval);
          this.second = 5;
          type == "suc" ? (this.sucReport = false) : (this.errReport = false);
          this.getReportDataClearCache();
        } else {
          this.second = this.second - 1;
        }
      }, 1000);
    },
    /**
     * 下拉刷新
     */
    onRefresh() {
      this.getReportData();
    },
    /**
     * 改变单选选项的值
     */
    changeRadio(target, val) {
      if (target === "isIll") {
        this.isHeal = null;
      }
      if (target === "isHeal" && (this.isIll === 2 || !this.isIll)) {
        return false;
      }
      this[target] = val;
    },
    /**
     * 改变多选选项的值
     */
    changeCheck(target) {
      this[target] = this[target] === 1 ? 2 : 1;
      if (this.sojourn_0000 === 1) {
        this.sojourn_0081 = 2;
        this.sojourn_0082 = 2;
        this.sojourn_65 = 2;
        this.sojourn_39 = 2;
        this.sojourn_98 = 2;
      }
    }
  }
};
</script>
<style lang="scss" scope>
.home {
  padding-top: 20px;
  height: 100%;
  background-color: rgba(249, 249, 249, 1);
}
.cell-content {
  color: rgba(30, 35, 41, 1);
}
.report-area {
  height: 240px;
  font-size: 14px;
}
.report-time-range {
  color: rgba(146, 150, 156, 1);
}
.time-range {
  color: rgba(30, 35, 41, 1);
  margin-left: 17px;
}
.report-btn {
  height: 140px;
  line-height: 160px;
  text-align: center;
}
.report-btn span {
  display: inline-block;
  width: 150px;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  background: #ffb200;
  border-radius: 50px;
  text-align: center;
  color: #fff;
}
.report-btn span.blue {
  background: rgba(82, 199, 202, 1);
}
.report-btn span.red {
  background: #ff4d4d;
}
.report-btn span.btn-disable {
  background: #92969c;
}
.report-status {
  display: flex;
  justify-content: space-around;
}
.report-time {
  color: rgba(146, 150, 156, 1);
  text-align: center;
}
.report-time span {
  color: #1e2329;
}
.temperaturePicker {
  height: 300px;
  position: relative;
}
.temperaturePicker-title {
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 18px;
}
.temperaturePicker-picker {
  height: 186px;
}
.temperaturePicker-confirm_btn {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  padding: 10px;
  z-index: 2;
}
.temperaturePicker-confirm_btn span {
  display: inline-block;
  width: 345px;
  height: 44px;
  line-height: 44px;
  background: rgba(82, 199, 202, 1);
  border-radius: 5px;
  border: 1px solid rgba(82, 199, 202, 1);
  color: #fff;
}
.info-dialog {
  width: 270px;
  height: 150px;
  padding-top: 35px;
  text-align: center;
}
.info-dialog_text {
  margin-left: 5px;
  font-size: 18px;
  height: 34px;
  line-height: 34px;
  color: #1e2329;
}
.info-dialog_btn {
  text-align: center;
}
.info-dialog_btn span {
  display: inline-block;
  width: 230px;
  height: 44px;
  line-height: 44px;
  color: #fff;
  border-radius: 5px;
}
.suc_btn span {
  background-color: rgba(82, 199, 202, 1);
  margin-top: 20px;
}
.error_btn span {
  background-color: #ff4d4d;
  margin-top: 20px;
}
.form-dialog {
  height: 300px;
  padding: 0 17px 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.my-choosed-temper {
  border-bottom: 1px solid #ccc;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.my-choosed-temper span.red {
  color: #ff4d4d;
}
.my-choosed-temper span.blue {
  color: rgba(82, 199, 202, 1);
}
.form-dialog-item {
  margin-bottom: 20px;
}
.form-dialog-item_title {
}
.form-dialog-item_choose {
  margin-top: 10px;
}
.isPromise {
  height: 40px;
  padding: 10px 17px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
.mint-toast {
  z-index: 9999 !important;
}
.van-popup {
  height: auto !important;
}
.van-cell {
  min-height: 40px !important;
  line-height: 40px !important;
}

.radio-item {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  right: 0;
  margin: 0 auto;
  .tempVal {
    width: 105px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    color: #fff;

    border-radius: 50px;
    &.red {
      background: #ff4d4d;
    }
    &.blue {
      background: rgba(82, 199, 202, 1);
    }
  }
}
.check-item {
  width: 46%;
  margin-right: 2%;
  margin-top: 4px;
}
.radioBtn,
.checkBtn {
  width: 46%;
  margin-right: 4%;
  line-height: 28px;
  background: rgba(255, 255, 255, 1);
  border-radius: 28px;
  text-align: center;
  &.yes {
    color: rgba(255, 77, 77, 1);
    border: 1px solid rgba(255, 77, 77, 1);
    &.checked {
      color: #fff;
      background-color: rgba(255, 77, 77, 1);
    }
  }
  &.no {
    color: #52c7ca;
    border: 1px solid #52c7ca;
    &.checked {
      color: #fff;
      background-color: #52c7ca;
    }
  }
}
.checkBtn {
  width: 100%;
  height: 24px;
  line-height: 22px;
}
.raidoDisable,
.checkDisable {
  color: #fff !important;
  background-color: #bfc0c6 !important;
  border: 1px solid #bfc0c6 !important;
}
.promise-check {
  display: flex;
}
.promise-check_handle {
  flex: 1;
  padding-left: 15px;
}
.promise-check__text {
  flex: 6;
  height: 40px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 77, 77, 1);
  line-height: 20px;
}

.van-popup .van-popup--top .van-notify {
  z-index: 9999 !important;
}
.van-cell .van-field input {
  text-align: center !important;
}
</style>

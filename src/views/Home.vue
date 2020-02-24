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
            <p class="report-time" v-if="morning.reportTime">
              提交时间 <span>{{ morning.reportTime | formatDate }}</span>
            </p>
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
            <p class="report-time" v-if="afternoon.reportTime">
              提交时间 <span>{{ afternoon.reportTime | formatDate }}</span>
            </p>
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
              :default-index="13"
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
            <div class="info-dialog_text">上报失败</div>
          </div>
          <span
            style="color:#92969C;font-size: 12px;
"
            >请重新上报</span
          >
          <div class="info-dialog_btn error_btn">
            <span>({{ second }}秒)自动返回</span>
          </div>
        </div>
      </van-popup>
    </van-pull-refresh>
  </div>
</template>

<script>
import md5 from "js-md5";
export default {
  name: "Home",
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
        reportTime: ""
      },
      afternoon: {
        reportStartTime: "",
        reportEndTime: "",
        reportTemperature: "",
        reportTime: ""
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
      nullResult: null
    };
  },
  mounted() {
    this.stuNo = this.$route.query.uid;
    // this.stu_no = 1;
    this.handleAuth();
    this.getCalendarList();
  },
  filters: {
    formatDate(val) {
      return val ? val.split(" ")[1] : "";
    }
  },
  methods: {
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
                this.$moment(new Date()).isBefore(element.reportStartTime) ||
                this.$moment(element.reportStartTime).isAfter(new Date())
              ) {
                element._disableReport = true;
              } else {
                element._disableReport = false;
              }
            });
            this.$set(this, "morning", res[0] || {});
            this.$set(this, "afternoon", res[1] || {});
            this.isLoading = false;
            this.dateHaveData = this.search_date;
          } else {
            this.search_date = this.dateHaveData;
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
          this.$set(this, "morning", res[0] || {});
          this.$set(this, "afternoon", res[1] || {});
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
          window.localStorage.setItem("token", res.token);
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
      let tempTemper = this.$refs.temperaturePicker.getValues()[0];
      this.showTemperaturePicker = false;
      this.saveTemperature(tempTemper);
    },
    /**
     * 上传温度
     */
    saveTemperature(temperature) {
      let { random_str, hash, current_time } = this.getHashParams();
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
          report_temperature: Number(temperature),
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
      let current_time = this.$moment().unix();
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
      this.report_type = type;
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
    }
  }
};
</script>
<style scope>
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
  margin-top: 2px;
}
.van-popup {
  height: auto !important;
}
.van-cell {
  min-height: 40px !important;
  line-height: 40px !important;
}
</style>

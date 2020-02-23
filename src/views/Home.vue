<template>
  <div class="home">
    <van-cell-group>
      <van-cell>
        <span slot="title">学号：{{ userInfo.stuNo || "" }}</span>
        <span slot="" class="cell-content" @click="selectCalendar">{{
          searchDate
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
              >{{ morning.report_start_time }}-{{
                morning.report_end_time
              }}</span
            >
          </div>
          <div class="report-btn">
            <span
              v-show="morning.report_temperature"
              :class="
                Number(morning.report_temperature) < 37.3 ? 'blue' : 'red'
              "
              >{{ morning.report_temperature }}°C</span
            >
            <span
              v-show="!morning.report_temperature"
              @click="handleReport('morning')"
              >未上报</span
            >
          </div>
          <p class="report-time" v-if="morning.report_time">
            提交时间 <span>{{ morning.report_time }}</span>
          </p>
        </div>
      </van-cell>
      <van-cell>
        <div class="report-area">
          <div class="report-time-range">
            上报时间
            <span class="time-range"
              >{{ afternoon.report_start_time }}-{{
                afternoon.report_end_time
              }}</span
            >
          </div>
          <div class="report-btn">
            <span
              v-if="afternoon.report_temperature"
              :class="
                Number(afternoon.report_temperature) < 37.3 ? 'blue' : 'red'
              "
              >{{ afternoon.report_temperature }}°C</span
            >
            <span v-else @click="handleReport('afternoon')">未上报</span>
          </div>
          <p class="report-time" v-if="afternoon.report_time">
            提交时间 <span>{{ afternoon.report_time }}</span>
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
  </div>
</template>

<script>
import md5 from "js-md5";
export default {
  name: "Home",
  data() {
    return {
      searchDate: "",
      morning: {
        report_start_time: "07:00",
        report_end_time: "07:00",
        report_temperature: "",
        report_time: "07:32:32"
      },
      afternoon: {
        report_start_time: "07:00",
        report_end_time: "07:00",
        report_temperature: "",
        report_time: ""
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
        stuNo: "2015000200384",
        stuName: "黄婷婷"
      },
      showTemperaturePicker: false,
      showCalendar: false,
      report_type: "morning",
      stu_no: ""
    };
  },
  mounted() {
    // this.stu_no = this.$route.query.uid;
    this.stu_no = 1;
    this.handleAuth();
    this.getCalendarList();
  },
  methods: {
    /**
     * 获取学生信息
     */
    getUserInfo() {
      let { random_str, hash, current_time } = this.getHashParams();
      this.$axios
        .post("student/info", {
          stu_no: this.stu_no,
          current_time: current_time,
          random_str: random_str,
          hash: hash
        })
        .then(function(res) {
          console.log("userInfo-res: ", res);
          this.$set(this, "userInfo", res);
        })
        .catch(function(error) {
          console.log(error);
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
        .then(function(res) {
          console.log("Home-res: ", res);
          window.localStorage.setItem("token", res.token);
          this.getUserInfo();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    /**
     * 确认日期
     */
    confirmCalendar() {
      this.searchDate = this.$moment(
        this.$refs.calendarPicker.getValues()[0]
      ).format("YYYY-MM-DD");
      this.showCalendar = false;
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
      this.saveTemperature(tempTemper);
    },
    /**
     * 上传温度
     */
    saveTemperature(temperature) {
      let { random_str, hash, current_time } = this.getHashParams();
      this.$axios
        .post("report/update", {
          report_temperature: Number(temperature),
          current_time: current_time,
          random_str: random_str,
          hash: hash
        })
        .then(function(res) {
          console.log("res: ", res);
          // if (this.report_type == "morning") {
          //   this.$set(this.morning, "report_temperature", tempTemper);
          // } else {
          //   this.$set(this.afternoon, "report_temperature", tempTemper);
          // }
          // this.showTemperaturePicker = false;
        })
        .catch(function(error) {
          console.log(error);
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
    handleReport(type) {
      this.report_type = type;
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
      this.searchDate = this.$moment(new Date()).format("YYYY-MM-DD");
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
  height: 220px;
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
  height: 110px;
  line-height: 110px;
  text-align: center;
}
.report-btn span {
  display: inline-block;
  width: 115px;
  height: 28px;
  line-height: 28px;
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
.van-popup {
  height: auto !important;
}
</style>

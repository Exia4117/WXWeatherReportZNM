// pages/hour/index.js
var app = getApp();
var chart = null;
var wxCharts = require('../../utils/wxcharts.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log('onLoad')
    var that = this
    that.getLocation();
    wx.setNavigationBarTitle({
      title: '天气',
    })
  },

  /**
   * 用户点击右上角分享
   */


  getLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        console.log("lat:" + latitude + "lon:" + longitude);
        that.getCity(latitude, longitude);
      }
    })
  },

  getCity: function (latitude, longitude) {
    var that = this;
    var url = "https://api.map.baidu.com/geocoder/v2/";
    var params = {
      ak: "2xiGkjRs9NQd8RRlsGEW2NXfN5i6Rp0v",
      output: "json",
      location: latitude + "," + longitude
    }
    wx.request({
      url: url,
      data: params,
      success: function (res) {
        var city = res.data.result.addressComponent.city;
        var district = res.data.result.addressComponent.district;
        var street = res.data.result.addressComponent.street;
        that.setData({
          city: city,
          district: district,
          street: street,
        })

        var descCity = city.substring(0, city.length - 1);
        that.getWeather(descCity);
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  getWeather: function (city) {
    var that = this;
    var url = "https://free-api.heweather.com/s6/weather";
    var parameters = {
      location: city,
      key: "2405fac4dd7446f7a4cddc339ea1d17f"
    }
    wx.request({
      url: url,
      data: parameters,
      success: function (res) {
        var hour = res.data.HeWeather6[0].hourly;
        var tmp = res.data.HeWeather6[0].now.tmp;
        console.log(hour);
        console.log(hour[0].time);
        for (var i = 0; i < 8; i++) {
          var n = hour[i].time.split(" ");
          hour[i].time = n[1];
        }
        that.setData({
          hour: hour,
          tmp: tmp,
        })
        that.getChart(hour);
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  getChart: function (hour) {
    var windowWidth = '', windowHeight = '';    //定义宽高
    try {
      var res = wx.getSystemInfoSync();    //获取屏幕宽高数据
      windowWidth = res.windowWidth;   //以设计图750为主进行比例算换
      windowHeight = res.windowWidth;   //以设计图750为主进行比例算换
    } catch (e) {
      console.error('getSystemInfoSync failed!');   //如果获取失败
    }
    console.log(hour);
    chart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: [hour[0].time, hour[1].time, hour[2].time, hour[3].time, hour[4].time, hour[5].time, hour[6].time, hour[7].time],
      series: [{
        name: '温度',
        fontColor: "#666",
        data: [hour[0].tmp, hour[1].tmp, hour[2].tmp, hour[3].tmp, hour[4].tmp, hour[5].tmp, hour[6].tmp, hour[7].tmp],
        format: function (val) {
          return val + "°";
        }
      }],
      xAxis: {
        title: "时间",
        fontColor: "#666",
        titleFontColor: "#666",
        disableGrid: true
      },
      yAxis: {
        fontColor: "#666",
        titleFontColor: "#666",
        disableGrid: true,
        format: function (val) {
          return val.toFixed(0);
        }
      },
      width: windowWidth,
      height: 300,
      dataLable: false,
      dataPointShape: true,
      extra: {
        legendTextColor: "#666"
      }
    });

  }
})
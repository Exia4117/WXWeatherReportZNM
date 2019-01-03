var app = getApp()
var day = ["今天", "明天", "后天"];
var util = require('../../utils/util.js');
Page({
  data: {
    day: day,
  },
  onLoad: function() {
    console.log('onLoad')
    var that = this
    that.getLocation();
  },
  //获取经纬度方法
  getLocation: function() {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        console.log("lat:" + latitude + " lon:" + longitude);
        console.info(res);
        that.locationCorrect(latitude, longitude);
      }
    })
  },
  locationCorrect:function(latitude,longtitude){
    var that = this
    var url = "https://api.map.baidu.com/geoconv/v1/";
    var params = {
      from:1,
      to:5,
      coords:longtitude + "," + latitude,
      ak:"wITvbGMEOmAUTsBNkKILLx4jACLissmL"
    }
    wx.request({
      url: url,
      data:params,
      success:function(res){
        var baidulat = res.data.result[0].y;
        var baidulon = res.data.result[0].x;
        console.info(res);
        that.getCity(baidulat,baidulon);
      },
      fail:function(res){},
      complete:function(res){},
    })
  },
  //获取城市信息
  getCity: function(latitude, longitude) {
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
      success: function(res) {
        var city = res.data.result.addressComponent.city;
        var district = res.data.result.addressComponent.district;
        //        var street = res.data.result.addressComponent.street;
        that.setData({
          city: city,
          district: district,
          // street: street,
        })
        var descCity = city.substring(0, city.length - 1);
        that.getWeahter(descCity);
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //获取天气信息
  getWeahter: function(city) {
    var that = this
    var url = "https://free-api.heweather.com/s6/weather"
    var parameters = {
      location: city,
      key: "2405fac4dd7446f7a4cddc339ea1d17f"
    }
    wx.request({
      url: url,
      data: parameters,
      success: function(res) {
        var tmp = res.data.HeWeather6[0].now.tmp;
        var txt = res.data.HeWeather6[0].now.cond_txt;
        var code = res.data.HeWeather6[0].now.cond_code;
        var dir = res.data.HeWeather6[0].now.wind_dir;
        var sc = res.data.HeWeather6[0].now.wind_sc;
        var hum = res.data.HeWeather6[0].now.hum;
        var fl = res.data.HeWeather6[0].now.fl;
        var daily_forecast = res.data.HeWeather6[0].daily_forecast;
        var today = res.data;
        let time = util.formatDate(new Date());
        let date = util.getDates(7,time);
        for(let i=0;i<7;i++){
          daily_forecast[i].dayofweek = date[i].week;
        };
        that.setData({
          tmp: tmp,
          txt: txt,
          code: code,
          dir: dir,
          sc: sc,
          hum: hum,
          fl: fl,
          daily_forecast: daily_forecast
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})
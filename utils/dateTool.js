/**
 * 判断润年
 * @param {string} year 年份
 * @return {Boolean}
 */

const isLeap = function (year) {
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    return true;
  }
  return false;
};
/**
 * 获取星期
 * @param {string} date 日期
 * @return {string} 星期
 */
const getWeek = function (date = new Date()) {
  let Stamp = new Date(date);
  // return weeks[Stamp.getDay()];
  let weeks = ["日", "一", "二", "三", "四", "五", "六"];
  return weeks[Stamp.getDay()];
};
/**
 * 获取月份天数
 * @param {string} year  年份
 * @param {string} month 月份
 * @return {number} 月份天数
 */
const getMonthDays = function (year, month) {
  month = parseInt(month) - 1;
  if (month < 0 || month > 11) return "";
  let months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (isLeap(year)) {
    months[1] = 29;
  }
  return months[month];
};
/**
 * 数字补零
 * @param {string} str
 * @return {string}
 */
const zero = function (str) {
  str = parseInt(str);
  return str > 9 ? str : "0" + str;
};
/**
 * 获取今天日期
 * @param {string} str  日期格式
 * @return {string} 格式化日期
 */
const getToday = function (str = "yyyy-mm-dd") {
  const date = new Date();
  const year = date.getFullYear(),
    month = zero(date.getMonth() + 1),
    day = zero(date.getDate()),
    hour = zero(date.getHours()),
    minute = zero(date.getMinutes()),
    second = zero(date.getSeconds());
  let res = str;
  res = res.replace("yyyy", year);
  res = res.replace("mm", month);
  res = res.replace("dd", day);
  res = res.replace("hh", hour);
  res = res.replace("MM", minute);
  res = res.replace("ss", second);
  return res;
};
/**
 * 将时间按照所传入的时间格式进行转换
 * @param {string} value  日期
 * @param {string} formatStr  日期格式
 * @return {string} 格式化日期
 */
const dateFormat = function (value, formatStr = "yyyy-mm-dd") {
  const date = new Date(value);
  const year = date.getFullYear(),
    month = zero(date.getMonth() + 1),
    day = zero(date.getDate()),
    hour = zero(date.getHours()),
    minute = zero(date.getMinutes()),
    second = zero(date.getSeconds());
  let res = formatStr;
  res = res.replace("yyyy", year);
  res = res.replace("mm", month);
  res = res.replace("dd", day);
  res = res.replace("hh", hour);
  res = res.replace("MM", minute);
  res = res.replace("ss", second);
  return res;
};
/**
 * 获取前n天日期
 * @param {string} n  当前日期
 * @return {string} 前n天日期
 */
const beforeDay = function (date, n) {
  const originDateTime = new Date(date).getTime();
  const changeDateTime = 3600 * 24 * 1000 * n;
  return dateFormat(originDateTime - changeDateTime);
};
/**
 * 获取后n天日期
 * @param {string} n  当前日期
 * @return {string} 后n天日期
 */
const afterDay = function (date, n) {
  const originDateTime = new Date(date).getTime();
  const changeDateTime = 3600 * 24 * 1000 * n;
  return dateFormat(originDateTime + changeDateTime);
};
/**
 * 获取上一天日期
 * @param {string} str  当前日期
 * @return {string} 上一天日期
 */
const getYesterday = function (str) {
  return beforeDay(str, 1);
};
/**
 * 获取下一天日期
 * @param {string} str  当前日期
 * @return {string} 下一天日期
 */
const getTomorrow = function (str) {
  return afterDay(str, 1);
};

module.exports = {
  dateFormat,
  getMonthDays,
  isLeap,
  getToday,
  getWeek,
  beforeDay,
  afterDay,
  getYesterday,
  getTomorrow,
};

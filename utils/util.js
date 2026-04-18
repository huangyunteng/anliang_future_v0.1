/**
 * 工具函数
 */

// 格式化日期
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 格式化时间
const formatTime = (date) => {
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${hour}:${minute}`;
};

// 格式化日期时间
const formatDateTime = (date) => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

// 格式化数字（千分位）
const formatNumber = (num) => {
  if (num === null || num === undefined) return '-';
  return Number(num).toLocaleString();
};

// 格式化涨跌幅
const formatChange = (change) => {
  if (change === null || change === undefined) return '-';
  const num = Number(change);
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
};

// 显示加载提示
const showLoading = (title = '加载中') => {
  wx.showLoading({
    title,
    mask: true
  });
};

// 隐藏加载提示
const hideLoading = () => {
  wx.hideLoading();
};

// 显示成功提示
const showSuccess = (title) => {
  wx.showToast({
    title,
    icon: 'success',
    duration: 2000
  });
};

// 显示错误提示
const showError = (title) => {
  wx.showToast({
    title,
    icon: 'none',
    duration: 2000
  });
};

// 复制到剪贴板
const copyToClipboard = (data) => {
  wx.setClipboardData({
    data,
    success: () => {
      showSuccess('已复制');
    }
  });
};

// 页面跳转
const navigateTo = (url) => {
  wx.navigateTo({ url });
};

// 返回上一页
const navigateBack = () => {
  wx.navigateBack();
};

// 跳转到 tabBar 页面
const switchTab = (url) => {
  wx.switchTab({ url });
};

// 重新加载页面
const redirectTo = (url) => {
  wx.redirectTo({ url });
};

module.exports = {
  formatDate,
  formatTime,
  formatDateTime,
  formatNumber,
  formatChange,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  copyToClipboard,
  navigateTo,
  navigateBack,
  switchTab,
  redirectTo
};

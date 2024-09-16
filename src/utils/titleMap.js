export function initTitle(item, count) {
  console.log(item)
  if (item.meta.title === '未处理') {
    return `${item.meta.title} ${count.notViewedCount}`
  } else if (item.meta.title === '已查看') {
    return `${item.meta.title} ${count.viewedCount}`
  } else if (item.meta.title === '感兴趣') {
    return `${item.meta.title} ${count.interestedCount}`
  } else if (item.meta.title === '邀约面试') {
    return `${item.meta.title} ${count.interviewCount}`
  } else {
    return item.meta.title
  }
}

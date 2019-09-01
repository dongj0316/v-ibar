# v-ibar
vue通讯录组件

[online demo](https://dongj0316.github.io/v-ibar/demo/)

## Installation

## Use

```bash
$ npm install v-ibar -S
```

```js
import Vue from 'vue'
import VIbar from 'v-ibar'

Vue.use(VIbar)
```

```html
<v-ibar :data="data"/>
<!-- 插槽 -->
<v-ibar :data="data">
  <template v-slot="slotProps">
    {{ slotProps.item.name }}
  </template>
</v-ibar>
```

## API

#### component attributes:
| Attr. Name | Type | Description | Required | Default Value |
|-----|-----|-----|-----|-----|
| scrollElement | String | 滚动容器 | N | window |
| data | Array | 数据列表(json数组) | Y | - |
| anchor-key | String | 字母的键名 | N | letter |
| anchor-nav | Boolean | 是否显示右侧导航 | N | true |
| touch-state | Boolean | 右侧导航触摸态 | N | true |
| touch-direct | Boolean | 滚动位置是否随导航触摸位置立即生效 | N | true |
| highlight-color | String | 高亮颜色值 | N | #07c160 |
| fixed-top | Number | 吸顶top值 | N | 0 |

#### instance methods:
| 方法名 | 说明 | 参数 |
|-----|-----|-----|
| doLayout | 重新计算布局 | - |

## Slot
| Slot. Name | Description |
|-----|-----|
| - | 默认作用域插槽，slotProps.item访问 |

## Local setup

```
npm install
npm run serve
```

## License

[MIT](https://opensource.org/licenses/MIT)
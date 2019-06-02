# v-address-book
vue通讯录组件

[online demo](https://dongj0316.github.io/vue-address-book/demo/)

## Installation

## Use

```bash
$ npm install v-address-book -S
```

```js
import Vue from 'vue'
import VAddressBook from 'v-address-book'

Vue.use(VAddressBook)
```

``` html
<v-address-book :data="addressBookData"/>
<!-- 插槽 -->
<v-address-book :data="addressBookData">
  <slot v-slot="item">{{item.name}}</slot>
</v-address-book>
```

## API

#### component attributes:
| Attr. Name | Type | Description | Required | Default Value |
|-----|-----|-----|-----|-----|
| limitHigh | Boolean | 固定高度(依赖固定高度容器) | N | - |
| data | Array | 数据列表(json数组) | Y | - |
| letter-key | String | 字母的键名 | N | letter |
| name-key | String | 名称的键名 | N | name |
| letter-nav | Boolean | 是否显示右侧导航 | N | true |
| touch-state | Boolean | 右侧导航触摸态 | N | true |
| touch-direct | Boolean | 滚动位置是否随导航触摸位置立即生效 | N | true |
| highlight-color | String | 高亮颜色值 | N | #07c160 |
| fixed-top | Number | 吸顶top值 | N | 0 |

#### instance methods:
- `scrollTo()` 滚动到指定位置
- `doLayout()` 重新计算布局

## Slot
| Slot. Name | Description |
|-----|-----|
| - | 默认作用域插槽，自定义每行的内容，参数为当前行的json对象 |

## Local setup

```
npm install
npm run serve
```

## License

[MIT](https://opensource.org/licenses/MIT)
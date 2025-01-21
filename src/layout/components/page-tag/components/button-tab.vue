<template>
  <!-- 标签页，共两部分：1、标签 ；2、标签操作区 -->
  <a-row style="border-bottom: 1px solid #eeeeee; position: relative" v-show="pageTagFlag">
    <a-dropdown :trigger="['contextmenu']">
      <div class="smart-page-tag button-tab-class">
        <a-tabs style="width: 100%" :tab-position="mode" v-model:activeKey="selectedKey" size="small" class="tabs-class"
                @tabClick="selectTab">
          <a-tab-pane v-for="item in tagNav" :key="item.menuName">
            <template #tab>
              <a-dropdown :trigger="['contextmenu']">
              <span>
                <home-outlined v-if="item.menuName === HOME_PAGE_NAME" class="icon-tab-class"/>
                <component v-else :is="$antIcons[item.menuIcon]" class="icon-tab-class"/>
                {{ item.menuTitle }}
                <close-outlined @click.stop="closeTag(item, false)" v-if="item.menuName !== HOME_PAGE_NAME"
                                class="smart-page-tag-close"/>
              </span>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="1" @click="closeTag(item, false)">关闭</a-menu-item>
                    <a-menu-item key="2" @click="closeOther(item)">关闭其他</a-menu-item>
                    <a-menu-item key="3" @click="closeLeft(item)">关闭左侧</a-menu-item>
                    <a-menu-item key="4" @click="closeRight(item)">关闭右侧</a-menu-item>
                    <a-menu-item key="5" @click="closeByMenu(true)">关闭所有</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>

            </template>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-dropdown>

    <a-dropdown>
      <!--标签页操作区-->
      <div class="smart-page-tag-operate">
        <div class="smart-page-tag-operate-icon">
          <AppstoreOutlined/>
        </div>
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item @click="closeByMenu(false)">关闭其他</a-menu-item>
          <a-menu-item @click="closeByMenu(true)">关闭所有</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </a-row>
</template>

<script setup>
import {AppstoreOutlined, CloseOutlined} from '@ant-design/icons-vue';
import {computed, ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {HOME_PAGE_NAME} from '/@/constants/system/home-const';
import {useAppConfigStore} from '/@/store/modules/system/app-config';
import {useUserStore} from '/@/store/modules/system/user';
import {theme} from 'ant-design-vue';

//标签页 是否显示
const pageTagFlag = computed(() => useAppConfigStore().$state.pageTagFlag);

const router = useRouter();
const route = useRoute();
const mode = ref('top');
const tagNav = computed(() => useUserStore().getTagNav || []);
const selectedKey = ref(route.name);

watch(
    () => route.name,
    (newValue, oldValue) => {
      selectedKey.value = newValue;
    },
    {immediate: true}
);

//选择某个标签页
function selectTab(name) {
  if (selectedKey.value === name) {
    return;
  }
  // 寻找tag
  let tag = tagNav.value.find((e) => e.menuName === name);
  if (!tag) {
    router.push({name: HOME_PAGE_NAME});
    return;
  }
  // router.push({ name, query: Object.assign({ _keepAlive: 1 }, tag.menuQuery) });
  router.push({name, query: tag.menuQuery});
}

//通过菜单关闭
function closeByMenu(closeAll) {
  let find = tagNav.value.find((e) => e.menuName === selectedKey.value);
  if (!find || closeAll) {
    closeTag(null, true);
  } else {
    closeTag(find, true);
  }
}

//关闭其他
function closeOther(item) {
  const other = tagNav.value.filter((e) => e.menuName !== item.menuName);
  closeTags(other);
}

//关闭左侧
function closeLeft(item) {
  let find = tagNav.value.findIndex((e) => e.menuName === item.menuName);
  const left = tagNav.value.filter((x,index) => index < find)
  closeTags(left);
}

//关闭右侧
function closeRight(item) {
  let find = tagNav.value.findIndex((e) => e.menuName === item.menuName);
  const right = tagNav.value.filter((x,index) => index > find)
  closeTags(right);
}

//直接关闭
function closeTag(item, closeAll) {
  // 关闭单个tag
  if (item && !closeAll) {
    let goName = HOME_PAGE_NAME;
    let goQuery = undefined;
    if (item.fromMenuName && item.fromMenuName !== item.menuName && tagNav.value.some((e) => e.menuName === item.fromMenuName)) {
      goName = item.fromMenuName;
      goQuery = item.fromMenuQuery;
    } else {
      // 查询左侧tag
      let index = tagNav.value.findIndex((e) => e.menuName === item.menuName);
      if (index > 0) {
        // 查询左侧tag
        let leftTagNav = tagNav.value[index - 1];
        goName = leftTagNav.menuName;
        goQuery = leftTagNav.menuQuery;
      }
    }
    // router.push({ name: goName, query: Object.assign({ _keepAlive: 1 }, goQuery) });
    if (selectedKey.value === item.menuName) {
      router.push({name: goName, query: goQuery});
    }
  } else if (!item && closeAll) {
    // 关闭所有tag
    router.push({name: HOME_PAGE_NAME});
  }
  // 关闭其他tag不做处理 直接调用closeTagNav
  useUserStore().closeTagNav(item ? item.menuName : null, closeAll);
}
//关闭多个
function closeTags(items) {
  // 关闭单个tag
  if (items) {
    const menuNames = items.map(x=>x.menuName)
    items = items.filter(x => x.menuName !== 'home');
    let goName = HOME_PAGE_NAME;
    let goQuery = undefined;
    const arr = items.filter(x=> x.menuName === selectedKey.value)
    if(arr.length > 0) {
      // 被关闭的存在当前激活的
      const arr = tagNav.value.filter( x => menuNames.indexOf(x.menuName) === -1)
      if(arr.length > 0) {
        goName = arr[arr.length - 1].menuName
        goQuery = arr[arr.length - 1].menuQuery
      }
      router.push({name: goName, query: goQuery});
    }
    // 关闭其他tag不做处理 直接调用closeTagNav
    items.forEach( item =>
        useUserStore().closeTagNav(item ? item.menuName : null, false)
    )
  }
}
const {useToken} = theme;
const {token} = useToken();
const borderRadius = computed(() => token.value.borderRadius + 'px');
</script>

<style scoped lang="less">
@smart-page-tag-operate-width: 50px;
@color-primary: v-bind('token.colorPrimary');
@backgroundColor-primary: v-bind('token.backgroundColorPrimary');
@backgroundHoverColor-primary: v-bind('token.backgroundHoverColorPrimary');

.smart-page-tag-operate {
  width: @smart-page-tag-operate-width;
  height: @smart-page-tag-operate-width;
  background-color: #ffffff;
  font-size: 17px;
  text-align: center;
  vertical-align: middle;
  line-height: @smart-page-tag-operate-width;
  padding-right: 10px;
  cursor: pointer;
  color: #606266;

  .smart-page-tag-operate-icon {
    width: 20px;
    height: 20px;
    transition: all 1s;
    transform-origin: 10px 20px;
  }

  .smart-page-tag-operate-icon:hover {
    width: 20px;
    height: 20px;
    transform: rotate(360deg);
  }
}

.smart-page-tag-operate:hover {
  color: @color-primary;
}

.smart-page-tag {
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: space-between;
  min-height: @page-tag-height;
  padding-right: 20px;
  padding-left: 20px;
  user-select: none;
  background: #fff;
  width: calc(100% - @smart-page-tag-operate-width);

  .smart-page-tag-close {
    font-size: 12px;
    color: #666666;
    margin: 0 !important;
  }

  /**  覆盖 ant design vue的 tabs 样式，变小一点 **/

  :deep(.ant-tabs-nav) {
    margin: 0;
    padding: 0 0 2px 0;
    max-height: 32px;
  }

  :deep(.ant-tabs-nav::before) {
    border-bottom: 1px solid #ffffff;
  }

  :deep(.ant-tabs-small > .ant-tabs-nav .ant-tabs-tab) {
    padding: 5px 8px 5px 20px;
    border-radius: v-bind(borderRadius);
    margin: 0 0 0 5px !important;
    border: 1px solid #eaeaea;
    --bg: @color-primary;
    --dfbg: #eeeeee;
  }
}

:deep(.smart-page-tag) {
  .ant-tabs-ink-bar {
    display: none;
  }
}
:deep(.button-tab-class) {
  .ant-tabs-tab-active{
    background: @backgroundColor-primary !important;
    &:hover {
      background: @backgroundHoverColor-primary !important;
    }
  }
}

</style>
<style>
.tabs-class .ant-tabs-tab{
  padding: 5px 15px 5px 15px !important;
}

.button-tab-class .ant-tabs-tab-active {
/*  background: hsl(from var(--bg) h calc(s * 0.8) calc(l * 1.78)) !important;*/
  border: 1px solid var(--bg) !important;
  .ant-tabs-tab-btn {
    color: hsl(from var(--bg) h calc(s * 0.6) calc(l * 1)) !important;
  }

  .smart-page-tag-close {
    color: hsl(from var(--bg) h calc(s * 0.6) calc(l * 1)) !important;
  }
}
.button-tab-class .ant-tabs-tab-active:hover {
/*  background: hsl(from var(--bg) h calc(s * 0.8) calc(l * 1.7)) !important;*/

  .ant-tabs-tab-btn {
    color: hsl(from var(--bg) h calc(s * 0.6) calc(l * 1)) !important;
  }

  .smart-page-tag-close {
    color: hsl(from var(--bg) h calc(s * 0.6) calc(l * 1)) !important;
  }
}

.button-tab-class .ant-tabs-tab:hover {
  background: hsl(from var(--dfbg) h s calc(l * 1.03));

  .ant-tabs-tab-btn {
    color: var(--bg);
  }

  .smart-page-tag-close {
    color: var(--bg);
  }
}
</style>

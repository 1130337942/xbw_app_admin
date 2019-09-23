<template>
      <el-cascader 
            :options="options" 
            change-on-select 
            v-model="bindValue" 
            clearable
        >
      </el-cascader>
</template>
<script>
export default {
    model:{
        prop:'bindValue',
        event:'change'
    },
    props:{
        //绑定的值  
        // bindValue:{
        //     type:Array,
        //     default:[],
        // }
    },
    data() {
        return {
        bindValue:[],
        options1: [
            {
            value: "zhinan",
            label: "指南",
            children: [
                {
                value: "shejiyuanze",
                label: "设计原则",
                children: [
                    {
                    value: "yizhi",
                    label: "一致"
                    },
                    {
                    value: "fankui",
                    label: "反馈"
                    },
                    {
                    value: "xiaolv",
                    label: "效率"
                    },
                    {
                    value: "kekong",
                    label: "可控"
                    }
                ]
                },
                {
                value: "daohang",
                label: "导航",
                children: [
                    {
                    value: "cexiangdaohang",
                    label: "侧向导航"
                    },
                    {
                    value: "dingbudaohang",
                    label: "顶部导航"
                    }
                ]
                }
            ]
            },
            {
            value: "zujian",
            label: "组件",
            children: [
                {
                value: "basic",
                label: "Basic",
                children: [
                    {
                    value: "layout",
                    label: "Layout 布局"
                    },
                    {
                    value: "color",
                    label: "Color 色彩"
                    },
                    {
                    value: "typography",
                    label: "Typography 字体"
                    },
                    {
                    value: "icon",
                    label: "Icon 图标"
                    },
                    {
                    value: "button",
                    label: "Button 按钮"
                    }
                ]
                },
                {
                value: "form",
                label: "Form",
                children: [
                    {
                    value: "radio",
                    label: "Radio 单选框"
                    },
                    {
                    value: "checkbox",
                    label: "Checkbox 多选框"
                    },
                    {
                    value: "input",
                    label: "Input 输入框"
                    }
                ]
                },
                {
                value: "data",
                label: "Data",
                children: [
                    {
                    value: "table",
                    label: "Table 表格"
                    },
                    {
                    value: "tag",
                    label: "Tag 标签"
                    },
                    {
                    value: "progress",
                    label: "Progress 进度条"
                    },
                    {
                    value: "tree",
                    label: "Tree 树形控件"
                    },
                    {
                    value: "pagination",
                    label: "Pagination 分页"
                    },
                    {
                    value: "badge",
                    label: "Badge 标记"
                    }
                ]
                },
                {
                value: "notice",
                label: "Notice",
                children: [
                    {
                    value: "alert",
                    label: "Alert 警告"
                    },
                    {
                    value: "loading",
                    label: "Loading 加载"
                    },
                    {
                    value: "message",
                    label: "Message 消息提示"
                    },
                    {
                    value: "message-box",
                    label: "MessageBox 弹框"
                    },
                    {
                    value: "notification",
                    label: "Notification 通知"
                    }
                ]
                },
                {
                value: "navigation",
                label: "Navigation",
                children: [
                    {
                    value: "menu",
                    label: "NavMenu 导航菜单"
                    },
                    {
                    value: "tabs",
                    label: "Tabs 标签页"
                    },
                    {
                    value: "breadcrumb",
                    label: "Breadcrumb 面包屑"
                    },
                    {
                    value: "dropdown",
                    label: "Dropdown 下拉菜单"
                    },
                    {
                    value: "steps",
                    label: "Steps 步骤条"
                    }
                ]
                },
                {
                value: "others",
                label: "Others",
                children: [
                    {
                    value: "dialog",
                    label: "Dialog 对话框"
                    },
                    {
                    value: "tooltip",
                    label: "Tooltip 文字提示"
                    },
                    {
                    value: "popover",
                    label: "Popover 弹出框"
                    },
                    {
                    value: "card",
                    label: "Card 卡片"
                    },
                    {
                    value: "carousel",
                    label: "Carousel 走马灯"
                    },
                    {
                    value: "collapse",
                    label: "Collapse 折叠面板"
                    }
                ]
                }
            ]
            }
        ],
        options:[],
        data: ['zujian','basic','layout']
        }
    },
    mounted(){
        setTimeout(() => {
            this.options = this.options1;
        }, 3000);
    },
    methods:{
        onChange(val){
            console.log('in component',val)
            this.$emit('onChange',val)
            if(val.length===1){

            }
        }
    }
};
</script>
<style lang="less" scoped>
</style>
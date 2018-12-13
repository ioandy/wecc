import Home from "../container/Home";
import ApptList from "../container/appt/ApptList";
import MdtAppsList from "../container/mdtapps/MdtAppsList";
import ExpertList from "../container/expert/ExpertList";
import KnowledgeList from "../container/knowledge/KnowledgeList";
import QnaList from "../container/qna/QnaList";
import NewsList from "../container/news/NewsList";
import Duty from "../container/duty/Duty";
import ExpertEdit from "../container/expert/ExpertEdit";
import NewsEdit from "../container/news/NewsEdit";
import KnowledgeEdit from "../container/knowledge/KnowledgeEdit";

export const routesConfig = {
    menus: [ // 菜单相关路由
        {key: '/app/index', title: '首页', icon: 'home', component: Home},
        {key: '/app/appt/list', title: '患者会诊预约', icon: 'file-add', component: ApptList},
        {key: '/app/mdtapps/list', title: '医生会诊申请', icon: 'book', component: MdtAppsList},
        {key: '/app/expert/list', title: '会诊专家', icon: 'solution', component: ExpertList},
        {key: '/app/knowledge/list', title: '肿瘤课堂', icon: 'laptop', component: KnowledgeList},
        {key: '/app/qna/list', title: '疑问解答', icon: 'question-circle', component: QnaList},
        {key: '/app/news/list', title: '最新资讯', icon: 'file-text', component: NewsList},
        {key: '/app/duty', title: '值班设置', icon: 'schedule', component: Duty},
    ],
    others: [
        {key: '/app/expert/edit', component: ExpertEdit,},
        {key: '/app/news/edit', component: NewsEdit},
        {key: '/app/knowledge/edit', component: KnowledgeEdit},
    ], // 非菜单相关路由
};

export const groupMenuKey = routesConfig.menus.map(item => item.key);
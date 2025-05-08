import { LuLayoutDashboard,
    LuPackage,
    LuUserRound, 
    LuShoppingCart,
    LuGitPullRequest 
} from "react-icons/lu";
import { BiCategoryAlt } from "react-icons/bi";
import { MdOutlineCategory } from "react-icons/md";
import { MdMergeType } from "react-icons/md";
import { IoBusinessOutline } from "react-icons/io5";

export const adminNav = [
    // {
    //     title: 'dashboard',
    //     path: '/dashboard',
    //     icon: <LuLayoutDashboard size={25}/>
    // },

    {
        title: 'request analytics',
        path: '/admin/request-analytics',
        icon: <LuGitPullRequest size={25}/>
    },

    {
        title: 'data categories',
        path: '/analytics-categories',
        icon: <MdOutlineCategory size={25}/>
    },

    {
        title: 'analytics types',
        path: '/analytics-types',
        icon: <MdMergeType size={25}/>
    },

    {
        title: 'companies',
        path: '/admin/companies',
        icon: <  IoBusinessOutline size={25}/>
    },

    // {
    //     title: 'settings',
    //     path: '/settings',
    //     icon: <BiCategoryAlt size={25}/>
    // },
]

export const businessNav = [
    // {
    //     title: 'dashboard',
    //     path: '/dashboard',
    //     icon: <LuLayoutDashboard size={25}/>
    // },

    {
        title: 'request analytics',
        path: '/business/request-analytics',
        icon: <LuGitPullRequest size={25}/>
    },

    {
        title: 'users',
        path: '/business/user',
        icon: <  LuUserRound size={25}/>
    },

    // {
    //     title: 'settings',
    //     path: '/settings',
    //     icon: <BiCategoryAlt size={25}/>
    // },
]


export const userNav = [
    // {
    //     title: 'dashboard',
    //     path: '/dashboard',
    //     icon: <LuLayoutDashboard size={25}/>
    // },

    {
        title: 'request analytics',
        path: '/user/request-analytics',
        icon: <LuGitPullRequest size={25}/>
    },


    // {
    //     title: 'settings',
    //     path: '/settings',
    //     icon: <BiCategoryAlt size={25}/>
    // },
]
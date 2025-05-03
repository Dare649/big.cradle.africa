import { nav } from "@/data/dummy";

export const PageTitle = ( path: string): string => {
    for ( const item of nav ) {
        if (item.path === path) {
            return `StonePay Admin - ${item.title}`;
        }
    };

    return 'StonePay Admin'
}
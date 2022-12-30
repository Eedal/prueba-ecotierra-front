

export interface Menu {
    id: number;
    name: string;
    url: string;
    menu_id: number;
    description: string;
    icon: string;
    submenu: Menu[];
}

export interface MenuRequest {
    id?: number;
    name: string;
    url: string;
    description: string;
    icon: string;
    menu_id?: number;
}
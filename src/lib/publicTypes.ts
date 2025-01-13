export interface Project {
    name: string;
    logo: any;
    id: string;
    createdAt: Date | number;
    plan: string;
    idx?: string;

}

export interface Message {
    title: string;
    url: string;
    icon: any;
}
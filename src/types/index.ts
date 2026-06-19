export interface Story {
  id: string;
  title: string;
  author: string;
  region: string;
  tags: string[];
  coverImage: string;
  coverColor: string;
  summary: string;
  content: string[];
  isHot?: boolean;
  createdAt: string;
}

export type Region = '全部' | '丹麦' | '德国' | '中国' | '阿拉伯' | '古希腊';

export const REGIONS: Region[] = ['全部', '丹麦', '德国', '中国', '阿拉伯', '古希腊'];

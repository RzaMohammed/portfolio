import 'server-only';
import type { Locale } from './i18n';
import type enDict from '@/dictionaries/en.json';
import type enContent from '@/contents/en.json';
import type sharedContent from '@/contents/shared.json';

export type DictionaryType = typeof enDict;
export type ContentLanguageType = typeof enContent;
export type SharedDataType = typeof sharedContent;

type Loader<T> = () => Promise<T>;

const dictionaries: Record<Locale, Loader<DictionaryType>> = {
    en: () => import('@/dictionaries/en.json').then((m) => m.default),
    ur: () => import('@/dictionaries/ur.json').then((m) => m.default),
};

const contents: Record<Locale, Loader<ContentLanguageType>> = {
    en: () => import('@/contents/en.json').then((m) => m.default),
    ur: () => import('@/contents/ur.json').then((m) => m.default),
};

export const getDictionary = (locale: Locale): Promise<DictionaryType> => dictionaries[locale]();
export const getContents = (locale: Locale): Promise<ContentLanguageType> => contents[locale]();
export const getSharedData = (): Promise<SharedDataType> => import('@/contents/shared.json').then((m) => m.default);

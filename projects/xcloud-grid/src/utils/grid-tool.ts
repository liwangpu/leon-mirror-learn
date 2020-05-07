import { filter, map } from 'rxjs/operators';

export function topicFilter(topic: string) {
    return filter((x: { topic: string;[key: string]: any }) => x.topic === topic);
}

export const dataMap = map((ms: { data?: any;[key: string]: any }) => ms.data);
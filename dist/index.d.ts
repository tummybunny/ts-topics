export type Topic = string | symbol | number;
export type Message<T extends object = any> = T | string | number;
export type Subscriber<Message> = (m: Message) => void;
export type UnsubscribeHandler = () => void;
export type ListenerHandler<T extends Message> = {
    publish: (m: T) => void;
    subscribe: (s: Subscriber<T>) => UnsubscribeHandler;
};
export default function useListener<Message>(topic: Topic): ListenerHandler<Message>;

type Topic = string | symbol | number;
type Message<T extends object = any> = T | string | number;
type Subscriber<Message> = (m: Message) => void;
type UnsubscribeHandler = () => void;
type ListenerHandler<T extends Message> = {
    publish: (m: T) => void;
    subscribe: (s: Subscriber<T>) => UnsubscribeHandler;
};
declare function useListener<Message>(topic: Topic): ListenerHandler<Message>;
export default useListener;

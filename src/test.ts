import useListener from ".";

type M1 = {
    num: number,
    text: string
};

type M2 = string;

const handler = useListener<M1>("myTopic");
const handler2 = useListener<M2>("myTopic2");
const unsub1 = handler.subscribe((m) => console.log("[SUB #1]", m));
const unsub2 = handler.subscribe((m) => console.log("[SUB #2]", m));
const unsub3 = handler2.subscribe((m) => console.log("[SUB #3]", m));

handler.publish({ num: 1, text: "Hello this is message 1"});
handler.publish({ num: 2, text: "Hello this is message 2"});

unsub2();
handler.publish({ num: 3, text: "Hello this is message 3"});
handler2.publish("Hello this is message 4");
unsub3();
handler.publish({ num: 3, text: "Hello this is message 5"});
handler2.publish("Hello this is message 6");
unsub1();
handler.publish({ num: 3, text: "Hello this is message 7"});
handler2.publish("Hello this is message 8");



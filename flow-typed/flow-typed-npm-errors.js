// @flow
declare class Event {
    // TODO add stuff in it
}


// DOM Event types
declare class KeyboardEvent extends Event {
    +key: string;
    +code: string;
    +ctrlKey: boolean;
    +shiftKey: boolean;
    +altKey: boolean;
    +metaKey: boolean;
}

// DOM Node types
declare class Node {}
declare class Element extends Node {}
declare class Document extends Node {}
declare class DocumentFragment extends Node {}
declare class Comment extends Node {}
declare class Text extends Node {}

// React types
declare class React$Component<Props, State = void> {};
declare type React$ComponentType<Props> = any;
declare type stream$Readable = any;
// declare type $ObjMap<> = any;
declare type $ObjMap<O: {}, F: (any) => any> = any;
declare type $Call<P> = any;
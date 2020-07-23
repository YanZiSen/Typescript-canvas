export interface IEnumerator < T > {
    reset ( ) : void ;   
    moveNext ( ) : boolean ; 
    readonly current : T | undefined ;
}

export interface IEnumerable < T > {
    getEnumerator () : IEnumerator < T > ;
}
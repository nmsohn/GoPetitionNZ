import NodeCache from 'node-cache';

class Cache{

    private cache : NodeCache;

    constructor(ttl : number)
    {
        this.cache = new NodeCache({stdTTL: ttl, checkperiod: ttl * 0.2, useClones: false});
    }

    public get(key: NodeCache.Key, func: Function, params: any) : any {
        const value = this.cache.get(key);
        console.log("myStringCache:", value);
        //if cached data
        if(value)
        {
            return Promise.resolve(value);
        }
        
        //if not cached, store data
        return func(params).then((result: any) => {
            let success = this.cache.set(key, result);
            console.log(success);
            return result;
        });
    }

    public del(keys: string | number | NodeCache.Key[]): void
    {
        this.cache.del(keys);
    }

    public flush(): void {
        this.cache.flushAll();
    }
}

export default Cache;
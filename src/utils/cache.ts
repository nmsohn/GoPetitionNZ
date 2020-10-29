import NodeCache from 'node-cache';

class Cache{

    private cache : NodeCache;

    constructor(ttl : number)
    {
        this.cache = new NodeCache({stdTTL: ttl, checkperiod: ttl * 0.2, useClones = false});
    }

    public get(key: NodeCache.Key, func: Function, param: any) : any {
        const value = this.cache.get(key);
        //if cached data
        if(value)
        {
            return Promise.resolve(value);
        }
        
        //if not cached, store data
        //this.cache.set(key, data);
        return func(param || undefined).then((result: any) => {
            this.cache.set(key, result);
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
import NodeCache from 'node-cache';

class Cache{

    private cache : NodeCache;

    constructor(ttl : number)
    {
        this.cache = new NodeCache({stdTTL: ttl, checkperiod: ttl * 0.2, useClones: false});
    }

    public async get(key: NodeCache.Key, func: Function, params: any) : Promise<any> {
        const value = this.cache.get(key);
        //if cached data
        if(value)
        {
            console.log("cache");
            return Promise.resolve(value);
        }
        
        //if not cached, store data
        let result = await func(params);
        this.cache.set(key, result);
        return result;
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
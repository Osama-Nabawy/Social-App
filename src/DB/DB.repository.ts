import { Model, ProjectionType, QueryFilter, QueryOptions, UpdateQuery } from "mongoose";
export abstract class AbstractRepository<T>{
    constructor(private _model: Model<T>) { }
    /**
     * 
     * @param item ia a generic data which based on DB 
     */

    public async create(item :T) {
        const doc = new this._model(item)
        return doc.save()
    }

    public async findOne(filter: QueryFilter<T>, projection?: ProjectionType<T>,options?: QueryOptions) {
        return this._model.findOne(filter, projection, options )
    }
    public async findAll(filter: QueryFilter<T>, projection?: ProjectionType<T>,options?: QueryOptions) {
        return this._model.find(filter, projection, options )
    }
    public async updateOne(filter: QueryFilter<T>, update: UpdateQuery<T>, options: QueryOptions<T> = {}) {
        options.returnDocument = "after"
        return this._model.findOneAndUpdate(filter, update, options)
    }
    public async deleteOne(filter: QueryFilter<T>, options?: QueryOptions) {
        return this._model.findOneAndDelete(filter, options)
    }


}
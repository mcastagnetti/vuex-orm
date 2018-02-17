import { Record } from '../../data/Data'
import Model from '../../model/Model'
import { Collection } from '../../repo/Query'
import { Fields } from '../Attribute'
import Repo, { Relation as Load } from '../../repo/Repo'
import Relation from './Relation'

export default class HasMany extends Relation {
  /**
   * The related model.
   */
  related: typeof Model

  /**
   * The foregin key of the related model.
   */
  foreignKey: string

  /**
   * The local key of the model.
   */
  localKey: string

  /**
   * The related record.
   */
  records: Collection

  /**
   * Create a new has many instance.
   */
  constructor (related: typeof Model | string, foreignKey: string, localKey: string, records: Collection, connection?: string) {
    super(connection)

    this.related = this.model(related)
    this.foreignKey = foreignKey
    this.localKey = localKey
    this.records = records
  }

  /**
   * Load the has many relationship for the record.
   */
  load (repo: Repo, record: Record, relation: Load): Record[] | null {
    const query = new Repo(repo.state, this.related.entity, false)

    query.where(this.foreignKey, record[this.localKey])

    this.addConstraint(query, relation)

    return query.get()
  }

  /**
   * Make model instances of the relation.
   */
  make (_parent: Fields): Model[] {
    if (this.records.length === 0) {
      return []
    }

    if (typeof (this.records[0] as any) !== 'object') {
      return []
    }

    return this.records.map(record => new this.related(record))
  }
}

import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column, hasMany, beforeSave } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import Organization from './organization.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Role from './role.js'
import Event from './event.js'
import LocationAccountRule from './location_account_rule.js'
import VersionActivity from './version_activity.js'
import VersionFeedback from './version_feedback.js'
import VersionStaffing from './version_staffing.js'
import Department from './department.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column()
  declare phone: string | null

  @column()
  declare name: string

  @column({ serializeAs: null })
  declare password: string

  @column({ columnName: 'needs_password_reset' })
  declare needsPasswordReset: boolean 
  
  @beforeSave()
  static async hashPassword(user: any) {
    if (user.$dirty.password && !user.password.startsWith('$')) {
      user.password = await hash.make(user.password)
    }
  }

  @column()
  declare isInternal: boolean

  @column()
  declare roleId: number

  @column()
  declare organizationId: number

  @column()
  declare departmentId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>

  @belongsTo(() => Department)
  declare department: BelongsTo<typeof Department>

  @hasMany(() => LocationAccountRule)
  declare locationAccountRules: HasMany<typeof LocationAccountRule>

  @hasMany(() => Event)
  declare events: HasMany<typeof Event>

  @hasMany(() => VersionActivity)
  declare versionActivities: HasMany<typeof VersionActivity>

  @hasMany(() => VersionStaffing)
  declare versionStaffings: HasMany<typeof VersionStaffing>

  @hasMany(() => VersionFeedback)
  declare versionFeedbacks: HasMany<typeof VersionFeedback>
}

import { validateOrReject } from 'class-validator';
import { BeforeInsert, BeforeUpdate } from 'typeorm';

export class DbEntityValidator {
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    try {
      await validateOrReject(this, { forbidUnknownValues: true });
    } catch (error) {
      throw new Error(`DbEntityValidator: Validation error: ${error.message}`);
    }
  }
}

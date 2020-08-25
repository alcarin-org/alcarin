import { AccountsService } from './application/accounts.service';

export type AccountModuleApi = ReturnType<typeof AccountsService>;

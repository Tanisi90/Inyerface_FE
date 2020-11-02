import { User } from './user';
import { Injectable } from '@angular/core';

@Injectable()
export class LoggedUser {
    user: User = null;
}

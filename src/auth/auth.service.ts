import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signIn() {
    return { msg: 'Hey, You are signed in' };
  }

  signUp() {
    return { msg: 'Hey, You are signed up' };
  }
}

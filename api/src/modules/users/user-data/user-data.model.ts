export type UserData = {
  email: string;
};

export function create(email: string): UserData {
  return { email };
}

export function changeEmail(userData: UserData, email: string) {
  return { ...userData, email };
}

export type PersonalInformation = {
  name: string;
  age: number;
};

export function create(name: string, age: number): PersonalInformation {
  return {
    name,
    age,
  };
}

export function makeOlder(personalInfo: PersonalInformation, byAmount = 1) {
  return {
    ...personalInfo,
    age: personalInfo.age + byAmount,
  };
}

export function introduceYourself(personalInfo: PersonalInformation) {
  return `Hello my name is ${personalInfo.name}. I'm ${personalInfo.age} years old`;
}

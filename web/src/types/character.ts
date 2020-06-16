// races should be probably moved to the API later
export enum Race {
  Human = 'human',
}

export interface Character {
  name: string;
  race: Race;
}

export {};

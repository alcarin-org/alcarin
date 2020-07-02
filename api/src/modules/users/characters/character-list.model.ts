export type CharacterList = {
  characters: string[];
};

export function create(): CharacterList {
  return { characters: [] };
}

export function addCharacter(model: CharacterList, character: string) {
  if (!model.characters.find(char => char === character)) {
    return {
      ...model,
      characters: [...model.characters, character],
    };
  }
  return model;
}
export function removeCharacter(model: CharacterList, character: string) {
  const newCharacters = model.characters.filter(char => char === character);
  return {
    ...model,
    newCharacters,
  };
}

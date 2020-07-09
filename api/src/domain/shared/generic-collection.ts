export type GenericCollectionBehaviour<ElementType> = {
  addItem: (collection: ElementType[], character: ElementType) => ElementType[];
  removeItem: (
    collection: ElementType[],
    character: ElementType
  ) => ElementType[];
};

export const createGenericCollectionBehaviour = <
  ElementType
>(): GenericCollectionBehaviour<ElementType> => {
  const addItem = (collection: ElementType[], character: ElementType) => {
    if (!collection.find(_character => _character === character)) {
      return [...collection, character];
    }
    return collection;
  };

  const removeItem = (collection: ElementType[], character: ElementType) => {
    return collection.filter(_character => _character !== character);
  };

  return {
    addItem,
    removeItem,
  };
};

export const resolveAmbiguousPath = (object: any, fieldName: string): any => {
    // a moving reference to internal objects within obj
    var ambiguousObject = object;
    const path = fieldName.split(".");
    for (var i = 0; i < path.length; i++) {
        // throw error if object path dne
        if (!ambiguousObject[`${path[i]}`]) throw `object not found @ path '${fieldName}'`;
        ambiguousObject = ambiguousObject[`${path[i]}`];
    }

    return ambiguousObject;
};

export const setObjectField = (object: any, fieldName: string, value: any): any => {
    var i;
    // a moving reference to internal objects within obj
    var ambiguousObject = object;
    const path = fieldName.split(".");
    for (i = 0; i < path.length - 1; i++) {
        // throw error if object path dne
        if (!ambiguousObject[`${path[i]}`]) throw `object not found @ path '${fieldName}'`;
        ambiguousObject = ambiguousObject[`${path[i]}`];
    }

    ambiguousObject[path[path.length - 1]] = value;
    return object;
};

export const addToObjectArray = (object: any, fieldName: string, value: any): any => {
    var i;
    // a moving reference to internal objects within obj
    var ambiguousObject = object;
    const path = fieldName.split(".");
    for (i = 0; i < path.length - 1; i++) {
        // throw error if object path dne
        if (!ambiguousObject[path[i]]) throw `object not found @ path '${fieldName}'`;
        ambiguousObject = ambiguousObject[path[i]];
    }
    ambiguousObject[path[path.length - 1]] = [...ambiguousObject[path[path.length - 1]], value];

    return object;
};

export const setObjectArrayField = (
    object: any,
    groupFieldName: string,
    index: number,
    fieldName: string,
    value: any
): any => {
    let ambiguousArray = resolveAmbiguousPath(object, groupFieldName);
    // throw an error if element at path is not an array or doesnt have the index
    if (!Array.isArray(ambiguousArray)) {
        throw `object @ path '${groupFieldName}' is not an array`;
    } else if (!ambiguousArray[index]) {
        throw `object @ index ${index} was not found @ path '${groupFieldName}'`;
    }
    ambiguousArray[index][fieldName] = value;
    return object;
};

export const removeFromObjectArrayByID = (
    object: any,
    fieldName: string,
    IDFieldName: string,
    IDValue: any
): any => {
    let ambiguousArray = resolveAmbiguousPath(object, fieldName);
    // throw an error if element at path is not an array or doesnt have the index
    if (!Array.isArray(ambiguousArray)) {
        throw `object @ path '${fieldName}' is not an array`;
    }

    const indexToRemove = ambiguousArray.findIndex(
        (someObject: any) => someObject[IDFieldName] === IDValue
    );

    if (!ambiguousArray[indexToRemove]) {
        throw `object @ index ${indexToRemove} was not found @ path '${fieldName}'`;
    }

    ambiguousArray.splice(indexToRemove, 1);
    return object;
};

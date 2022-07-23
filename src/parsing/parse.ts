

const get_lines_from_string = (str: string): string[] => {
  return str.split(/\r?\n/);
}

const split_on_whitespace = (str: string): string[] => {
  return str.trim().split(/\s+/);
}


type PrismaSchemaModelProperty = {
  name: string;
  type: string;
  custom_type?: string;
  optional: boolean;
};

export type PrismaSchemaModel = {
  type: "model";
  name: string;
  properties: PrismaSchemaModelProperty[];
};

type PrismaSchemaEnumValue = {
  name: string;
};

export type PrismaSchemaEnum = {
  type: "enum";
  name: string;
  values: PrismaSchemaEnumValue[];
};

export type PrismaSchemaObject = PrismaSchemaModel | PrismaSchemaEnum;


const is_valid_line = (line: string): boolean => {
  const empty = line.trim() === "" || line.trim().length === 0;
  const starts_with_char = !empty && line.trim()[0].match(/[a-zA-Z]/) !== null;

  return !empty && starts_with_char;
}

export const parse_prisma_schema = (schema: string): PrismaSchemaObject[] => {

  const lines = get_lines_from_string(schema);
  let object: PrismaSchemaObject | null = null;
  let custom_type: string | null = null;
  const objects: PrismaSchemaObject[] = [];

  let parsing_object = false;

  for (const line of lines) {
    if (!parsing_object && line.startsWith("model")) {
      parsing_object = true;

      const [_, model_name] = split_on_whitespace(line);

      object = {
        type: "model",
        name: model_name,
        properties: [],
      }

      continue;
    }

    if (!parsing_object && line.startsWith("enum")) {
      parsing_object = true;

      const [_, enum_name] = split_on_whitespace(line);

      object = {
        type: "enum",
        name: enum_name,
        values: [],
      }

      continue;
    }

    if (parsing_object && line.trim() === "}") {
      objects.push(object!);
      parsing_object = false;
      continue;
    }

    if (parsing_object && object?.type === "model" && is_valid_line(line)) {
        const [name, type] = split_on_whitespace(line);

        const optional = type.endsWith("?");
        const clean_type = optional ? type.slice(0, type.length - 1) : type;

        const property: PrismaSchemaModelProperty = {
          name: name,
          type: clean_type,
          optional: optional,
        };

        if (custom_type !== null) {
          property.custom_type = custom_type;
          custom_type = null;
        }

        object.properties.push(property);
    }

    if (parsing_object && object?.type === "enum" && is_valid_line(line)) {
      const [name] = split_on_whitespace(line);

      object.values.push({
        name: name,
      });
    }

    if (parsing_object && object?.type === "model" && line.trim().startsWith("//")) {
      const clean_line = line.trim().slice(2).trim();

      if (clean_line.startsWith("@use(") && clean_line.endsWith(")")) {
        custom_type = clean_line.slice("@use(".length, clean_line.length - 1);
      }
    }

    if (parsing_object && !is_valid_line(line) && line.trim().length > 0) {
      // console.log("ignore: ", line);
    }
  }

  return objects;
}

export const prisma_type_map = new Map<string, string>([
  ["String", "string"],
  ["Boolean", "boolean"],
  ["Int", "number"],
  ["BigInt", "bigint"],
  ["Float", "number"],
  ["Decimal", "number"],
  ["DateTime", "Date"],
  ["Json", "any"],
  ["Bytes", "Buffer"],
  ["Unsupported", "any"],
]);

export const get_valid_types = (objects: PrismaSchemaObject[]): string[] => {
  const default_types: string[] = Array.from(prisma_type_map.keys());
  const user_types: string[] = objects.map(object => object.name);

  return [...default_types, ...user_types];
}

export const validate_schema = (objects: PrismaSchemaObject[]): boolean => {
  const valid_types = get_valid_types(objects);
  let valid = true;

  for (const object of objects) {
    if (object.type === "model") {
      for (const property of object.properties) {
          if (!valid_types.includes(property.type)) {
            valid = false;

            const mn = object.name;
            const pn = property.name;
            const pt = property.type;
            console.error(`model '${mn}' has invalid type '${pt}' on property '${pn}'`);
          }
      }
    }
  }

  return valid;
}

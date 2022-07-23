import { PrismaSchemaModel, PrismaSchemaEnum, PrismaSchemaObject, prisma_type_map } from "../parsing/parse";


const generate_model = (model: PrismaSchemaModel) => {

  let out = "";

  out += `export type ${model.name} = {\n`;

  for (const property of model.properties) {
    const ts_type = prisma_type_map.get(property.type) ?? (property.custom_type ?? property.type);
    out += `  ${property.name}${(property.optional ? "?" : "")}: ${ts_type}\n`;
  }

  out += `}\n`;
  out += "\n";

  return out;
}

const generate_enum = (p_enum: PrismaSchemaEnum) => {
  let out = "";

  out += `export const ${p_enum.name}: {\n`;

  for (const value of p_enum.values) {
    out += `  ${value.name}: '${value.name}',\n`;
  }

  out += `};\n`;
  out += "\n";
  out += `export type ${p_enum.name} = (typeof ${p_enum.name})[keyof typeof ${p_enum.name}]\n`;
  out += "\n";

  return out;
}

export const generate_types = (object: PrismaSchemaObject[]): string => {

  let file = "";


  // Modles
  const models = object.filter(object => object.type === "model") as PrismaSchemaModel[];

  file += "\n";
  file += "/* models */\n";
  
  for (const model of models) {
    file += generate_model(model);
  }

  // Enums
  const enums = object.filter(object => object.type === "enum") as PrismaSchemaEnum[];

  file += "/* enums */\n";

  for (const p_enum of enums) {
    file += generate_enum(p_enum);
  }

  return file;
}


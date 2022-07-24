import { PrismaSchemaModel, PrismaSchemaEnum, PrismaSchemaObject, prisma_type_map } from "../parsing/parse";
import { get_combinations } from "../utils/combinations";


const generate_model = (model: PrismaSchemaModel) => {

  let out = "";

  out += `export type ${model.name} = {\n`;

  for (const property of model.properties) {
    const ts_type = prisma_type_map.get(property.type) ?? (property.custom_type ?? property.type);

    // Get type
    const is_default_type = prisma_type_map.has(property.type);

    if (is_default_type && property.type === "Json" && !!property.custom_type) {
      property.type = property.custom_type;
    }

    out += `  ${property.name}: ${ts_type}${(property.optional ? " | null" : "")}\n`;
    // out += `  ${property.name}${(property.optional ? "?" : "")}: ${ts_type}\n`;
  }

  out += `}\n`;
  out += "\n";

  return out;
}

const generate_all_models = (model: PrismaSchemaModel, model_types: string[]): PrismaSchemaModel[] => {

  // Get all relation props
  const relation_models: string[] = [];

  for (const property of model.properties) {
    if (!property.optional && model_types.includes(property.type)) {
      relation_models.push(property.name);
    }
  }

  const combinations = get_combinations(relation_models);
  
  // Generate models
  const updated_models: PrismaSchemaModel[] = [];

  for (const combination of combinations) {
    // Updated model
    const updated_model: PrismaSchemaModel = JSON.parse(JSON.stringify(model));

    // Type name
    let type_name = model.name;
    let empty = true;

    for (const name of combination) {
      if (empty) {
        type_name += "With";
        empty = false;
      }
      else {
        type_name += "And";
      }

      const capitalized_name = name[0].toUpperCase() + name.slice(1);
      type_name += capitalized_name;

    }

    // Update model name
    updated_model.name = type_name;
    // console.log(combination);

    const resulting = relation_models.filter(x => !combination.includes(x));

    updated_model.properties = updated_model.properties.filter(property => !resulting.includes(property.name));
    updated_models.push(updated_model);
  }

  return updated_models;
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
  const model_types: string[] = models.map(model => model.name);

  file += "\n";
  file += "/* models */\n";
  
  for (const model of models) {
    const updated_models = generate_all_models(model, model_types);
    
    for (const updated_model of updated_models) {
      file += generate_model(updated_model);
    }
  }

  // Enums
  const enums = object.filter(object => object.type === "enum") as PrismaSchemaEnum[];

  file += "/* enums */\n";

  for (const p_enum of enums) {
    file += generate_enum(p_enum);
  }

  return file;
}


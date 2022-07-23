import fs from 'fs';


// Path
const get_prisma_client_file_path = (filename: string): string => {
  return `node_modules/.prisma/client/${filename}`;
}

const get_local_prisma_file_path = (filename: string): string => {
  return `prisma/${filename}`;
}

// Exists
const does_path_exist = (path: string): boolean => {
  return fs.existsSync(path);
}

// Read Helpers
const read_prisma_client_file = (name: string, filename: string): string => {
  const path = get_prisma_client_file_path(filename);
  const types_file_exists = does_path_exist(path);

  if (!types_file_exists) {
    console.error(`'${name}' not found`);
    return "";
  }

  try {
    return fs.readFileSync(path, {encoding: 'utf-8'});
  }
  catch (error) {
    console.error(`An error occured reading '${name}'`);
    return "";
  }
}

const read_local_prisma_file = (name: string, filename: string): string => {
  const path = get_local_prisma_file_path(filename);
  const types_file_exists = does_path_exist(path);

  if (!types_file_exists) {
    console.error(`'${name}' not found`);
    return "";
  }

  try {
    return fs.readFileSync(path, {encoding: 'utf-8'});
  }
  catch (error) {
    console.error(`An error occured reading '${name}'`);
    return "";
  }
}

// Reading (node_modules)
export const read_prisma_types_file = (): string => {
  const name = "Prisma Types";
  const filename = "index.d.ts";

  return read_prisma_client_file(name, filename);
}

export const read_prisma_schema_file = (): string => {
  const name = "Prisma Schema";
  const filename = "schema.prisma";

  return read_prisma_client_file(name, filename);
}

// Reading (local)
export const does_local_json_types_exist = (): boolean => {
  const filename = "json.types.ts";
  const path = get_local_prisma_file_path(filename);

  return does_path_exist(path);
}

export const read_local_json_types_file = () => {
  const filename = "json.types.ts";
  const name = "Json Types";

  return read_local_prisma_file(name, filename);
}

export const read_local_prisma_schema_file = () => {
  const filename = "schema.prisma";
  const name = "Prisma Schema";

  return read_local_prisma_file(name, filename);
}

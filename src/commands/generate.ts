import fs from "fs";
import path from "path";
import { does_local_json_types_exist, read_local_json_types_file, read_local_prisma_schema_file } from "../files/read";
import { generate_types } from "../generate/generate";
import { parse_prisma_schema, PrismaSchemaObject } from "../parsing/parse";


const remove_custom_json_types = (parsed_prisma_schema: PrismaSchemaObject[]) => {
  return parsed_prisma_schema.map(o => {
    if (o.type === "model") {
      return {
        ...o,
        properties: o.properties.map(p => {
          delete p.custom_type;

          return {
            ...p,
          };
        })
      };
    }

    return o;
  });
}

const remove_undefined_json_types = (parsed_prisma_schema: PrismaSchemaObject[], json_file: string) => {
  return parsed_prisma_schema.map(o => {
    if (o.type === "model") {
      return {
        ...o,
        properties: o.properties.map(p => {
          if (p.custom_type && json_file.includes(`type ${p.custom_type}`)) {
            return {
              ...p,
            };
          }

          delete p.custom_type;

          return {
            ...p,
          };
        })
      };
    }

    return o;
  });
}

export const generate = (outfile: string) => {

  const prisma_schema = read_local_prisma_schema_file();

  const parsed_prisma_schema = parse_prisma_schema(prisma_schema);

  const has_custom_json_types = does_local_json_types_exist();

  let output = "";
  if (has_custom_json_types) {
    const json_types = read_local_json_types_file();
    const updated = remove_undefined_json_types(parsed_prisma_schema, json_types);
    const out = generate_types(updated);
    output = "/* Json Types */\n" + json_types.trim() + "\n\n" + out.trim();
  }
  else {
    const updated = remove_custom_json_types(parsed_prisma_schema);
    output = generate_types(updated);
  }

  // Make directory
  const outdir = path.dirname(outfile);

  if (!fs.existsSync(outdir)) {
    fs.mkdirSync(outdir, {recursive: true});
  }

  // Write to file
  fs.writeFileSync(outfile, output.trim(), { encoding: "utf-8", });
}

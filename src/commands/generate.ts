import {does_local_json_types_exist, read_local_json_types_file, read_local_prisma_schema_file} from "../files/read";
import { generate_types } from "../generate/generate";
import {parse_prisma_schema} from "../parsing/parse";
import fs from "fs";


export const generate = (outfile: string) => {

  const prisma_schema = read_local_prisma_schema_file();

  const parsed_prisma_schema = parse_prisma_schema(prisma_schema);

  const has_custom_json_types = does_local_json_types_exist();

  if (has_custom_json_types) {    
    const json_types = read_local_json_types_file();

    const updated = parsed_prisma_schema.map(o => {
      if (o.type === "model") {
        return {
          ...o,
          properties: o.properties.map(p => {
            if (p.custom_type && json_types.includes(`type ${p.custom_type}`)) {
              return {
                name: p.name,
                optional: p.optional,
                type: "custom",
                custom_type: p.custom_type,
              };
            }

            return {
              name: p.name,
              optional: p.optional,
              type: p.type,
            };
          })
        };
      }

      return o;
    });

    const out = generate_types(updated);

    const res = "/* Json Types */\n" + json_types.trim() + "\n\n" + out.trim();

    fs.writeFileSync(outfile, res, {encoding: "utf-8"});
  }
  else {
    const updated = parsed_prisma_schema.map(o => {
      if (o.type === "model") {
        return {
          ...o,
          properties: o.properties.map(p => {
            return {
              name: p.name,
              optional: p.optional,
              type: p.type,
            };
          })
        };
      }

      return o;
    });

    const res = generate_types(updated);
    fs.writeFileSync(outfile, res.trim(), {encoding: "utf-8"});
  }
}

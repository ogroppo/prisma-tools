import {version as v} from "../../package.json";

export const config = {
  // bin_name: Object.keys(bin)[0],
  bin_name: "prisma-tools",
  version: v,
};

export const version = () => {
  return `${config.bin_name} v${config.version}`;
}
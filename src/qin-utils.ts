import { SHA1 } from "crypto-js";

const sha1 = (text: string) => SHA1(text).toString()

const crypto = {
  sha1,
};

export const QinUtils = {
  crypto,
};

import { SHA1 } from "crypto-js";
import { QinSoul } from "qinpel-res";

const sha1 = (text: string) => SHA1(text).toString();

const crypto = {
  sha1,
};

export const QinUtils = {
  soul: { ...QinSoul },
  crypto,
};

import { SHA1 } from "crypto-js";
import { QinSoul, tr } from "qinpel-res";
import { QinNames } from "./qin-names";

const sha1 = (text: string) => SHA1(text).toString();

const crypto = {
  sha1,
};

export const QinOurs = {
  soul: { ...QinSoul },
  names: QinNames,
  crypto,
  tr,
};

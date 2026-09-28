import { asset } from "../asset";

export function IbmMark() {
  return (
    <img
      className="ibm-logo"
      src={asset("/ibm.svg")}
      alt="IBM"
      width="59"
      height="22"
    />
  );
}

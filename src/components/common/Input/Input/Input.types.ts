import { TextFieldBaseProps } from "../TextField/TextField.types";
import { TextAreaProps } from "../TextArea/TextArea.types";
import { HelperTextStatus } from "../HelperText/HelperText.types";

export interface InputProps {
  label?: string;
  showEssential?: boolean;
  inputType?: "textfield" | "textarea";
  layout?: "default" | "horizontal";
  textFieldProps?: TextFieldBaseProps;
  textAreaProps?: TextAreaProps;
  helperMessage?: string;
  helperStatus?: HelperTextStatus;
  currentCount?: number;
  maxCount?: number;
  button?: React.ReactNode;
  id?: string;
  className?: string;
}

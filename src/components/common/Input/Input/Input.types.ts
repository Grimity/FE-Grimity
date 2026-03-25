import { TextFieldProps } from "../TextField/TextField.types";
import { TextAreaProps } from "../TextArea/TextArea.types";
import { MentionTextFieldProps } from "../MentionTextField/MentionTextField.types";
import { HelperTextStatus } from "../HelperText/HelperText.types";

export interface InputProps {
  label?: string;
  showEssential?: boolean;
  inputType?: "textfield" | "textarea" | "mention";
  layout?: "default" | "horizontal";
  textFieldProps?: TextFieldProps;
  textAreaProps?: TextAreaProps;
  mentionTextFieldProps?: MentionTextFieldProps;
  helperMessage?: string;
  helperStatus?: HelperTextStatus;
  maxCount?: number;
  replyTo?: { id: string; nickname: string };
  button?: React.ReactNode;
  id?: string;
  className?: string;
}

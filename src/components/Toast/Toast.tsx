import IconComponent from "../Asset/Icon";
import styles from "./Toast.module.scss";
import { useToast } from "@/hooks/useToast";

export default function Toast() {
  const { toast } = useToast();

  if (!toast.isShow) return null;

  return (
    <div className={`${styles.toast} `}>
      <IconComponent name={toast.type} size={30} />
      {toast.message}
    </div>
  );
}

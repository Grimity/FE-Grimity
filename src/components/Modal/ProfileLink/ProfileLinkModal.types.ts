export interface ProfileLinkModalProps {
  links: { linkName: string; link: string }[];
  onClose: () => void;
}

import { EMessageComponentType, type ButtonComponent } from "mezon-sdk";

export function createButton(
  id: string,
  label: string,
  style: number
): ButtonComponent {
  const button: ButtonComponent = {
    type: EMessageComponentType.BUTTON,
    id: id,
    component: {
      label: label,
      style: style,
    },
  };
  return button;
}
